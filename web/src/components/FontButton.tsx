import { useRef } from 'react';
import { useGSAP } from '@gsap/react';
import gsap from 'gsap';

type Props = {
  label: string;
  onClick?: () => void;
  className?: string;
};

const FontButton = (props: Props) => {
  const container = useRef<HTMLDivElement | null>(null);
  const line = useRef<HTMLDivElement | null>(null);
  const timeline = useRef<GSAPTimeline | undefined>(undefined);

  useGSAP(() => {
    if (!line.current) return;

    timeline.current = gsap.timeline({ paused: true });

    timeline.current
      .to(line.current, {
        width: '100%',
        duration: 0.3
      }, 0);

    return () => timeline.current?.kill();
  }, { scope: container });

  return (
    <div
      className={'cursor-pointer text-mint-950 dark:text-mint-50 select-none ' + props.className}
      onClick={props.onClick}
      onMouseEnter={() => timeline.current?.play()}
      onMouseLeave={() => timeline.current?.reverse()}
      ref={container}
    >
      <span>{props.label}</span>
      <div
        className={'w-0 relative after:absolute after:left-0 after:bottom-0 after:right-0 after:w-full after:h-px after:bg-mint-950 dark:after:bg-mint-50'}
        ref={line}
      />
    </div>
  );
};

export default FontButton;
