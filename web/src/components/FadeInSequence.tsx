import { createContext, useCallback, useContext, useLayoutEffect, useMemo, useRef } from 'react';
import type { ReactNode } from 'react';
import { useLocation } from 'react-router-dom';
import gsap from 'gsap';

interface SequenceItem {
  container: Element;
  /** 该块在队列里占用的时长（秒） */
  duration: number;
  play: () => void;
}

interface QueueItem extends SequenceItem {
  queued: boolean;
}

interface Session {
  key: string;
  delay: number;
  gap: number;
  items: Map<Element, QueueItem>;
  observer: IntersectionObserver | null;
  pending: QueueItem[];
  timer: gsap.core.Tween | null;
  nextStartAt: number;
  started: boolean;
}

interface FadeInSequenceValue {
  register: (item: SequenceItem) => () => void;
}

const FadeInSequenceContext = createContext<FadeInSequenceValue | null>(null);

export const useFadeInSequence = () => useContext(FadeInSequenceContext);

interface FadeInSequenceProps {
  children: ReactNode;
  delay?: number;
  gap?: number;
}

/** expo.out 在约 60% 时长时已视觉到位，队列按这个比例计算“看起来结束”的时间 */
export const VISUAL_END_RATIO = 0.6;

/**
 * 计算时间线里最后一个动画的视觉到位时间。
 * 带 stagger 的 tween，duration() 包含 stagger*(n-1)，要减去每个目标自身的尾部。
 */
export const timelineVisualEnd = (timeline: gsap.core.Timeline) => {
  return timeline.getChildren(false, true, false).reduce((end, child) => {
    const tween = child as gsap.core.Tween;
    const baseDuration = typeof tween.vars?.duration === 'number' ? tween.vars.duration : child.duration();
    return Math.max(end, child.startTime() + child.duration() - baseDuration * (1 - VISUAL_END_RATIO));
  }, 0);
};

// 与 gsap.delayedCall 共用 ticker 时钟，避免后台标签页/主线程卡顿时两个时钟漂移
const now = () => gsap.ticker.time;

const byDomOrder = (a: IntersectionObserverEntry, b: IntersectionObserverEntry) => {
  return a.target.compareDocumentPosition(b.target) & Node.DOCUMENT_POSITION_FOLLOWING ? -1 : 1;
};

/**
 * 同一次页面渲染里注册的动画块按进入视口的先后排成一条队列：
 * 首屏可见的按 DOM 顺序排队播放，下方内容滚动进可视区域后接在队尾继续。
 * provider 挂在 layout 层不随路由卸载，因此用 location.pathname 重置当前页的队列。
 * 文本块由 FadeInText 注册，自定义时间线（如首页名字）可以通过 register 直接注册。
 */
const FadeInSequence = ({ children, delay = 0.4, gap = 0.2 }: FadeInSequenceProps) => {
  const location = useLocation();
  const sessionRef = useRef<Session | null>(null);

  /*
   * 用 pathname 而不是 location.key：点击当前页面的链接会生成新 key 但内容不变，
   * 用 key 会导致已经播完的文字重新隐藏再播一遍。
   */
  if (!sessionRef.current || sessionRef.current.key !== location.pathname) {
    sessionRef.current = {
      key: location.pathname,
      delay,
      gap,
      items: new Map(),
      observer: null,
      pending: [],
      timer: null,
      nextStartAt: 0,
      started: false
    };
  }
  const session = sessionRef.current;

  const scheduleRef = useRef<() => void>(() => {});

  /*
   * 同一时刻只给队首排一个 delayedCall。
   * 队首到点时如果已经不在视口里，就跳过并立刻轮到下一个，不占用它的时长槽位。
   */
  const schedule = useCallback(() => {
    if (session.timer || session.pending.length === 0) return;

    session.timer = gsap.delayedCall(Math.max(0, session.nextStartAt - now()), () => {
      session.timer = null;

      const item = session.pending.shift();
      if (!item) return;

      const container = item.container;
      const rect = container.getBoundingClientRect();
      const inView =
        container.isConnected &&
        rect.bottom > 0 &&
        rect.top < window.innerHeight &&
        rect.right > 0 &&
        rect.left < window.innerWidth;

      if (!inView) {
        /*
         * 排队期间被异步内容挤出视口（例如博客列表加载后把页脚推下去）：
         * 跳过它并立刻轮到下一个，不占用它的时长槽位；等它重新进入视口再入队。
         */
        item.queued = false;
        if (container.isConnected) session.observer?.observe(container);
        session.nextStartAt = now();
      } else {
        item.play();
        session.nextStartAt = now() + item.duration + session.gap;
      }

      scheduleRef.current();
    });
  }, [session]);

  scheduleRef.current = schedule;

  const enqueue = useCallback((item: QueueItem) => {
    if (!session.started) {
      session.started = true;
      session.nextStartAt = now() + session.delay;
    }

    session.pending.push(item);
    schedule();
  }, [schedule, session]);

  const register = useCallback((item: SequenceItem) => {
    const queueItem: QueueItem = { ...item, queued: false };
    session.items.set(item.container, queueItem);

    session.observer ??= new IntersectionObserver((entries) => {
      entries
        .filter((entry) => entry.isIntersecting)
        .sort(byDomOrder)
        .forEach((entry) => {
          const queued = session.items.get(entry.target);
          if (!queued || queued.queued) return;
          queued.queued = true;
          session.observer?.unobserve(entry.target);
          enqueue(queued);
        });
    }, { threshold: 0.1 });

    session.observer.observe(item.container);

    return () => {
      session.observer?.unobserve(item.container);
      session.items.delete(item.container);

      const index = session.pending.indexOf(queueItem);
      if (index === -1) return;

      session.pending.splice(index, 1);
      if (session.pending.length === 0) {
        session.timer?.kill();
        session.timer = null;
        session.nextStartAt = now();
      }
    };
  }, [enqueue, session]);

  useLayoutEffect(() => {
    return () => {
      session.observer?.disconnect();
      session.observer = null;
      session.timer?.kill();
      session.timer = null;
      session.pending = [];
      session.items.clear();
      session.started = false;
      session.nextStartAt = 0;
    };
  }, [session]);

  const value = useMemo(() => ({ register }), [register]);

  return <FadeInSequenceContext.Provider value={value}>{children}</FadeInSequenceContext.Provider>;
};

export default FadeInSequence;
