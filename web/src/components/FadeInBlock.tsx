import { useRef } from 'react';
import type { ReactNode } from 'react';
import { useGSAP } from '@gsap/react';
import { useFadeInSequence } from './FadeInSequence';

export interface FadeInBlockAnimation {
  /** 该块在队列里占用的时长（秒） */
  duration: number;
  play: () => void;
}

interface FadeInBlockProps {
  children: ReactNode;
  /** 挂载时构建动画；选择器会被限定在本块容器内 */
  build: () => FadeInBlockAnimation;
  className?: string;
}

/**
 * 把一个自定义 GSAP 动画块接入 FadeInSequence。
 * build 在挂载时的 layout effect 里执行，返回队列所需的时长和播放函数；
 * 没有 provider 时直接播放，减弱动态效果时保持元素自然状态。
 */
const FadeInBlock = ({ children, build, className = '' }: FadeInBlockProps) => {
  const ref = useRef<HTMLDivElement>(null);
  const sequence = useFadeInSequence();
  const buildRef = useRef(build);
  buildRef.current = build;
  // 已播放的块不应因为路由切换重建会话而重新隐藏/重播
  const playedRef = useRef(false);

  useGSAP(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    if (!ref.current || playedRef.current) return;

    const animation = buildRef.current();

    if (!sequence) {
      playedRef.current = true;
      animation.play();
      return;
    }

    return sequence.register({
      container: ref.current,
      duration: animation.duration,
      play: () => {
        playedRef.current = true;
        animation.play();
      }
    });
  }, { scope: ref, dependencies: [sequence], revertOnUpdate: true });

  return (
    <div className={className} ref={ref}>
      {children}
    </div>
  );
};

export default FadeInBlock;
