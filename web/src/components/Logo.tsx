import { useGSAP } from '@gsap/react';
import gsap from 'gsap';
import { useRef } from 'react';

type Props = {
  className?: string;
};

const Logo = (props: Props) => {
  const container = useRef<SVGSVGElement | null>(null);
  const timeline = useRef<GSAPTimeline | undefined>(undefined);

  useGSAP(() => {
    timeline.current = gsap.timeline({ paused: true, repeat: -1, yoyo: true });
    timeline.current
      .to('.path', {
        attr: {
          d: 'M 18.5 17.5 L 15 15 L 15 10.2'
        },
        ease: 'none',
        duration: 0.35
      }, 0)
      .to('.path', {
        attr: {
          d: 'M 18.5 17.5 L 15 15 L 16.5 10.5'
        },
        ease: 'none',
        duration: 0.35
      }, 0.35);

    return () => timeline.current?.kill();
  }, { scope: container });

  useGSAP(() => timeline.current?.play(), [timeline]);

  return (
    <svg className={'stroke-1 stroke-mint-950 dark:stroke-mint-50 ' + props.className} ref={container} viewBox="0 0 32 32">
      <circle cx="24" cy="13" fill="none" r="4" strokeLinecap="round" />
      <path d="M 21 16 L 15 20 L 4 22" fill="none" strokeLinecap="round" />

      <path d="M 15 20 L 9 16" fill="none" strokeLinecap="round" />
      <path d="M 9 16 L 7 21.5" fill="none" strokeLinecap="round" />

      <path d="M 18 18 L 21 21" fill="none" strokeLinecap="round" />
      <path d="M 21 21 L 24 17" fill="none" strokeLinecap="round" />

      <path className="path" d="M 18.5 17.5 L 15 15 L 13.5 10.5" fill="none" strokeLinecap="round" />
    </svg>
  );
};

export default Logo;
