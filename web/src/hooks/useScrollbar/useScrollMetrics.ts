import { RefObject, useCallback, useEffect, useRef } from 'react';
import {
  SCROLLBAR_THUMB_WIDTH,
  SCROLLBAR_THUMB_HIDDEN_WIDTH,
  SCROLLBAR_HIDE_DELAY,
  DISPLAY_NONE,
  DISPLAY_BLOCK
} from './constant';

const useScrollMetrics = (
  container: HTMLElement,
  thumbRef: RefObject<HTMLButtonElement | null>
) => {
  const isGlobalScrollbar = container === document.documentElement;
  const clientHeight = useRef(0);
  const scrollHeight = useRef(0);
  const hideScrollbarTimer = useRef<NodeJS.Timeout | string | number | undefined>(undefined);

  const clearHideScrollbarTimer = useCallback(() => {
    if (hideScrollbarTimer.current) {
      clearTimeout(hideScrollbarTimer.current);
    }
  }, [hideScrollbarTimer]);

  // 延迟隐藏滚动条
  const delayHiddenScrollbar = useCallback(() => {
    hideScrollbarTimer.current = setTimeout(() => {
      if (!thumbRef.current) { return; }
      thumbRef.current.style.width = SCROLLBAR_THUMB_HIDDEN_WIDTH;
    }, SCROLLBAR_HIDE_DELAY);
  }, [thumbRef]);

  // 显示滚动条
  const showScrollbar = useCallback(() => {
    if (!thumbRef.current) { return; }
    thumbRef.current.style.width = SCROLLBAR_THUMB_WIDTH;
    clearHideScrollbarTimer();
    // delayHiddenScrollbar();
    return Promise.resolve();
  }, [clearHideScrollbarTimer, thumbRef]);

  const clampScrollTarget = useCallback((target: number) => Math.max(0, Math.min(scrollHeight.current - clientHeight.current, target)), []);

  const refreshThumbMetrics = useCallback(() => {
    if (!thumbRef.current) { return; }
    thumbRef.current.style.height = (clientHeight.current / scrollHeight.current * 100) + '%';
    thumbRef.current.style.top = (container.scrollTop / scrollHeight.current * 100) + '%';

    if (clientHeight.current >= scrollHeight.current) {
      thumbRef.current.style.display = DISPLAY_NONE;
    } else {
      thumbRef.current.style.display = DISPLAY_BLOCK;
    }
  }, [container, thumbRef]);

  const refreshTrackMetrics = useCallback(() => {
    clientHeight.current = isGlobalScrollbar ? window.innerHeight : container.clientHeight;
    scrollHeight.current = container.scrollHeight - (isGlobalScrollbar ? 0 : clientHeight.current);
    /**
     * 对于全局滚动条，scrollHeight 就是 document.documentElement.scrollHeight
     * 对于普通容器，scrollHeight 需要减去 clientHeight（因为 sticky 定位的影响）
     */
  }, [container.clientHeight, container.scrollHeight, isGlobalScrollbar]);

  const refreshMetrics = useCallback(() => {
    refreshTrackMetrics();
    refreshThumbMetrics();
  }, [refreshTrackMetrics, refreshThumbMetrics]);

  useEffect(() => {
    refreshMetrics();

    if (isGlobalScrollbar) {
      // 如果容器是document.documentElement，监听窗口大小变化
      window.addEventListener('resize', refreshMetrics);
    }
    // 使用 ResizeObserver 监听普通容器大小变化
    const resizeObserver = new ResizeObserver(refreshMetrics);
    resizeObserver.observe(container);

    return () => {
      if (isGlobalScrollbar) {
        window.removeEventListener('resize', refreshMetrics);
      }
      resizeObserver.unobserve(container);
      resizeObserver.disconnect();
    };
  }, [container, isGlobalScrollbar, refreshMetrics]);

  useEffect(() => {
    const target = isGlobalScrollbar ? window : container;

    target.addEventListener('scroll', refreshThumbMetrics);

    return () => {
      target.removeEventListener('scroll', refreshThumbMetrics);
    };
  }, [container, isGlobalScrollbar, refreshThumbMetrics]);

  return {
    getClientHeight: () => clientHeight.current,
    getScrollHeight: () => scrollHeight.current,
    clampScrollTarget,
    delayHiddenScrollbar,
    showScrollbar,
    clearHideScrollbarTimer,
    refreshMetrics
  };
};

export default useScrollMetrics;
