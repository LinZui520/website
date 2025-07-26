import { useRef } from 'react';
import { useScrollContext } from '../contexts/ScrollProvider';
import gsap from 'gsap';

const UpArrow = () => {

  const isUpAnimating = useRef(false);
  const svgRef = useRef<SVGSVGElement>(null);
  const { scrollTo } = useScrollContext();

  const animateUpArrow = () => {
    if (isUpAnimating.current || !svgRef.current) return;
    isUpAnimating.current = true;
    // 清理之前的动画，避免内存泄漏
    gsap.killTweensOf(svgRef.current);

    const animate = gsap.timeline({
      onComplete: () => {
        isUpAnimating.current = false;
      }
    });

    animate
      .fromTo(svgRef.current,
        { y: 0 },
        { y: -64, duration: 0.15, ease: 'power2.inOut' }
      )
      .fromTo(svgRef.current,
        { y: 64 },
        { y: 0, duration: 0.15, ease: 'power2.inOut' }
      );
  };

  return (
    <div
      className={'fixed right-12 bottom-8 h-16 w-16 overflow-hidden cursor-pointer'}
      onClick={() => {
        scrollTo(0);
        animateUpArrow();
      }}
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
