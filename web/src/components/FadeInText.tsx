import { useRef } from 'react';
import { useGSAP } from '@gsap/react';
import gsap from 'gsap';
import { FADE_IN_FROM, FADE_IN_TO } from './fadeIn';
import { useFadeInSequence, VISUAL_END_RATIO } from './FadeInSequence';

interface FadeInTextProps {
  text: string;
  className?: string;
  charClassName?: string;
}

/**
 * 与主页名字一致的逐字渐入：透明 + 下移 + 纵向拉伸 + 模糊，expo.out 收尾。
 * 空格用不换行空格渲染，保证逐字拆分后宽度不变。
 * 放在 FadeInSequence 内时由外层按进入视口的顺序排队播放；独立使用时退化为挂载即播。
 */
const FadeInText = ({ text, className = '', charClassName = '' }: FadeInTextProps) => {
  const ref = useRef<HTMLSpanElement>(null);
  const sequence = useFadeInSequence();
  // 已播放的实例（例如菜单文字）不应因为路由切换重建会话而重新隐藏/重播
  const playedRef = useRef(false);

  useGSAP(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    const container = ref.current;
    const chars = container?.querySelectorAll('.fade-in-char');
    if (!container || !chars?.length) return;

    if (sequence) {
      if (playedRef.current) return;

      // 先隐藏，进入视口后由外层队列播放
      gsap.set(chars, { opacity: 0 });
      const charList = Array.from(chars);
      const duration = typeof FADE_IN_TO.duration === 'number' ? FADE_IN_TO.duration : 0;
      const stagger = typeof FADE_IN_TO.stagger === 'number' ? FADE_IN_TO.stagger : 0;

      return sequence.register({
        container,
        // 最后一个字的视觉到位时间，而不是名义结束时间
        duration: stagger * Math.max(0, charList.length - 1) + duration * VISUAL_END_RATIO,
        play: () => {
          playedRef.current = true;
          gsap.fromTo(charList, { ...FADE_IN_FROM }, { ...FADE_IN_TO });
        }
      });
    }

    // 脱离 provider 时退化为挂载即播
    playedRef.current = true;
    gsap.fromTo(chars, { ...FADE_IN_FROM }, { ...FADE_IN_TO });
  }, { scope: ref, dependencies: [sequence, text], revertOnUpdate: true });

  return (
    <span className={className} ref={ref}>
      {Array.from(text).map((char, index) => (
        <span className={`fade-in-char inline-block ${charClassName}`} key={`${char}-${index}`}>
          {char === ' ' ? ' ' : char}
        </span>
      ))}
    </span>
  );
};

export default FadeInText;
