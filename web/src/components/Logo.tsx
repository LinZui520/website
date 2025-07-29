// 灵感来源 https://www.makemepulse.com/
import { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';

type Props = {
  className?: string;
};

const Logo = (props: Props) => {
  const [isHover, setIsHover] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const timeline = useRef<GSAPTimeline | undefined>(undefined);
  const grayCircleRef = useRef<HTMLDivElement>(null);
  const blackCircle1Ref = useRef<HTMLDivElement>(null);
  const blackCircle2Ref = useRef<HTMLDivElement>(null);

  useGSAP(() => {
    const container = containerRef.current;
    if (!container) return;
    timeline.current = gsap.timeline();

    timeline.current
      .to(grayCircleRef.current, {
        duration: 0.5,
        x: 30,
        ease: 'back.out'
      }, 0)
      .to(grayCircleRef.current, {
        duration: 0.5,
        x: -60,
        ease: 'back.out'
      }, 0.5)
      .to(blackCircle2Ref.current, {
        duration: 0,
        opacity: 0,
        ease: 'none'
      }, 0.55)
      .to(blackCircle1Ref.current, {
        duration: 0,
        opacity: 0,
        ease: 'none'
      }, 0.65)
      // 灰色球变成黑色球（根据主题变色）
      .to(grayCircleRef.current, {
        duration: 0,
        backgroundColor: window.matchMedia('(prefers-color-scheme: dark)').matches ? '#FAFAFC' : '#1D1D1F',
        ease: 'none'
      }, 0.55)
      .to(grayCircleRef.current, {
        duration: 0.4,
        x: 25,
        ease: 'back.out'
      }, 1)
      // 球回归时，文字逐渐显示
      .to('#char-0', { duration: 0, opacity: 1, ease: 'power2.inOut' }, 1.0)
      .to('#char-1', { duration: 0, opacity: 1, ease: 'power2.inOut' }, 1.05)
      .to('#char-2', { duration: 0, opacity: 1, ease: 'power2.inOut' }, 1.1)
      .to('#char-3', { duration: 0, opacity: 1, ease: 'power2.inOut' }, 1.15)
      .to('#char-4', { duration: 0, opacity: 1, ease: 'power2.inOut' }, 1.2)
      .to('#char-5', { duration: 0, opacity: 1, ease: 'power2.inOut' }, 1.25);

  }, { scope: containerRef });

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;
    const play = () => setIsHover(true);
    const reverse = () => setIsHover(false);
    container.addEventListener('mouseenter', play);
    container.addEventListener('mouseleave', reverse);

    return () => {
      container.removeEventListener('mouseenter', play);
      container.removeEventListener('mouseleave', reverse);
    };
  }, []);

  useGSAP(() => isHover ? timeline.current?.play() : timeline.current?.reverse(), { scope: containerRef, dependencies: [isHover] });

  return (
    <div
      className={`${props.className || ''} flex flex-col items-center justify-center font-serif cursor-default`}
      ref={containerRef}
    >
      {/* 圆圈动画区域 */}
      <div className="flex items-center space-x-2 relative">
        <div
          className="w-3 h-3 bg-mint-950 dark:bg-mint-50 rounded-full"
          ref={blackCircle1Ref}
        >
        </div>
        <div
          className="w-3 h-3 bg-mint-950 dark:bg-mint-50 rounded-full"
          ref={blackCircle2Ref}
        >
        </div>
        <div
          className="w-3 h-3 bg-mint-500 rounded-full"
          ref={grayCircleRef}
        >
        </div>
        <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2">
          {/* 文字 */}
          <div className="flex">
            {'ZHUGUI'.split('').map((char, index) => (
              <span
                className="text-char text-mint-950 dark:text-mint-50 font-serif tracking-tight opacity-0"
                id={`char-${index}`}
                key={index}
              >
                {char}
              </span>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Logo;
