import { useRef, useEffect } from 'react';
import { useGSAP } from '@gsap/react';
import gsap from 'gsap';
import { useScrollContext } from '../contexts/ScrollProvider';

type Props = {
  className?: string;
};

const UpArrow = ({ className }: Props) => {
  const { scrollTo } = useScrollContext();
  const svgRef = useRef<SVGSVGElement>(null);
  const idleTimeline = useRef<GSAPTimeline | undefined>(undefined);
  const idleResume = useRef<GSAPTween | undefined>(undefined);

  useGSAP(() => {
    idleTimeline.current = gsap.timeline({ repeat: -1, repeatDelay: 3, delay: 2 })
      .to(svgRef.current, { y: -8, duration: 0.3, ease: 'power2.out' })
      .to(svgRef.current, { y: 0, duration: 0.5, ease: 'back.out(2.5)' });
  }, { scope: svgRef });

  useEffect(() => () => { idleResume.current?.kill(); }, []);

  const handleMouseEnter = () => {
    idleResume.current?.kill();
    idleTimeline.current?.seek(0).pause();
    gsap.to(svgRef.current, { y: -6, duration: 0.25, ease: 'power2.out', overwrite: false });
  };

  const handleMouseLeave = () => {
    gsap.to(svgRef.current, { y: 0, duration: 0.5, ease: 'back.out(2.5)', overwrite: false });
    idleTimeline.current?.seek(0).pause();
    idleResume.current = gsap.delayedCall(3, () => idleTimeline.current?.play());
  };

  return (
    <div
      className={'h-16 w-16 cursor-pointer ' + (className ?? '')}
      onClick={() => scrollTo(0)}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      <svg
        className="h-16 w-16 fill-none stroke-3 stroke-mint-950 dark:stroke-mint-50"
        ref={svgRef}
        viewBox="0 0 32 32"
      >
        <path d="M 16 28 L 16 8" />
        <path d="M 8 16 L 16 8 L 24 16" />
      </svg>
    </div>
  );
};

export default UpArrow;
