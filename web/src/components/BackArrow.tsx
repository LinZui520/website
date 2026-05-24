import { useRef, useEffect } from 'react';
import { useGSAP } from '@gsap/react';
import gsap from 'gsap';
import { useAnimatedNavigateBack } from '../contexts/TransitionProvider';

type Props = {
  onClick?: () => void;
  className?: string;
};

const BackArrow = ({ onClick, className }: Props) => {
  const navigateBack = useAnimatedNavigateBack();
  const svgRef = useRef<SVGSVGElement>(null);
  const idleTimeline = useRef<GSAPTimeline | undefined>(undefined);
  const idleResume = useRef<GSAPTween | undefined>(undefined);

  // C: 闲置周期性左移提示
  useGSAP(() => {
    idleTimeline.current = gsap.timeline({ repeat: -1, repeatDelay: 3, delay: 2 })
      .to(svgRef.current, { x: -8, duration: 0.3, ease: 'power2.out' })
      .to(svgRef.current, { x: 0, duration: 0.5, ease: 'back.out(2.5)' });
  }, { scope: svgRef });

  useEffect(() => () => { idleResume.current?.kill(); }, []);

  const handleMouseEnter = () => {
    idleResume.current?.kill();
    idleTimeline.current?.seek(0).pause();
    // A: 整体左移
    gsap.to(svgRef.current, { x: -6, duration: 0.25, ease: 'power2.out', overwrite: false });
  };

  const handleMouseLeave = () => {
    // A: 弹回
    gsap.to(svgRef.current, { x: 0, duration: 0.5, ease: 'back.out(2.5)', overwrite: false });
    // 重新开始倒计时
    idleTimeline.current?.seek(0).pause();
    idleResume.current = gsap.delayedCall(3, () => idleTimeline.current?.play());
  };

  const handleClick = () => {
    idleResume.current?.kill();
    idleTimeline.current?.pause();
    if (onClick) onClick();
    else navigateBack();
  };

  return (
    <svg
      className={className ?? 'fixed left-12 bottom-8 h-16 w-16 fill-none stroke-3 stroke-mint-950 dark:stroke-mint-50 cursor-pointer'}
      onClick={handleClick}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      ref={svgRef}
      viewBox="0 0 32 32"
    >
      <path d="M 28 16 L 8 16" />
      <path d="M 16 8 L 8 16 L 16 24" />
    </svg>
  );
};

export default BackArrow;
