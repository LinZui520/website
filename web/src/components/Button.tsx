import { MouseEvent, useRef } from 'react';
import { useGSAP } from '@gsap/react';
import gsap from 'gsap';

type Props = {
  label?: string;
  type?: 'submit' | 'reset' | 'button';
  isLoading?: boolean;
  onClick?: (event: MouseEvent<HTMLButtonElement>) => void;
};

const Button = (props: Props) => {
  const button = useRef<HTMLButtonElement | null>(null);
  const path = useRef<SVGPathElement | null>(null);

  const timeline = useRef<GSAPTimeline | undefined>(undefined);

  const pathState = {
    initial: 'M 0 16 L 20 16 M 12 8 L 20 16 M 12 24 L 20 16',
    expanded: 'M 0 16 L 32 16 M 24 8 L 32 16 M 24 24 L 32 16'
  };

  useGSAP(() => {
    if (!button.current || !path.current) return;

    timeline.current = gsap.timeline({ paused: true });

    timeline.current
      .to(button.current, { paddingRight: 24, ease: 'power2.out', duration: 0.5 }, 0)
      .to(path.current, { attr: { d: pathState.expanded }, ease: 'power2.out', duration: 0.5 }, 0);

    return () => timeline.current?.kill();
  }, { scope: button });

  return (
    <button
      className={
        'bg-mint-50 dark:bg-mint-950 hover:bg-mint-100 dark:hover:bg-mint-900 ' +
        'border rounded-full border-mint-950 dark:border-mint-50 ' +
        'h-10 pr-3 cursor-pointer flex flex-row items-center justify-center'
      }
      disabled={props.isLoading}
      onClick={props.onClick}
      onMouseEnter={() => timeline.current?.play()}
      onMouseLeave={() => timeline.current?.reverse()}
      ref={button}
      type={props.type}
    >
      {props.label ? <span className={'ml-6 text-base text-mint-950 dark:text-mint-50 select-none'}>{props.label}</span> : null}
      <svg
        className={'stroke-1 w-8 h-8 ml-6 duration-700 ease-in-out stroke-mint-950 dark:stroke-mint-50'}
        viewBox="0 0 32 32"
      >
        <path d={pathState.initial} ref={path} />
      </svg>
    </button>
  );
};

export default Button;
