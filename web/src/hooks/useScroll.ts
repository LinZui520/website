import { RefObject, useCallback, useEffect, useRef } from 'react';

const useScroll = (
  container: RefObject<HTMLElement | null>,
  easing: (x: number) => number,
  duration: number
) => {

  const target = useRef<number>(0);
  const animation = useRef<number>(0);

  const createAnimation = useCallback((element: HTMLElement, end: number) => {
    const start = element.scrollTop;
    const startTime = performance.now();

    const frame = (currentTime: number) => {
      const elapsed = currentTime - startTime;
      const progress = easing(Math.min(elapsed / duration, 1));
      element.scrollTop = start + (end - start) * progress;

      if (elapsed < duration) {
        requestAnimationFrame(frame);
      }
    };

    return frame;
  }, [duration, easing]);

  const scrollTo = useCallback((end: number) => {
    if (!container.current) { return; }
    const element = container.current;

    const animationFrame = createAnimation(element, end);
    requestAnimationFrame(animationFrame);
  }, [createAnimation, container]);

  useEffect(() => {
    if (!container.current) { return; }
    const element = container.current;

    target.current = element.scrollTop;
    const handleWheel = (event: WheelEvent) => {
      event.preventDefault();
      target.current = Math.max(0, Math.min(element.scrollHeight - element.clientHeight, target.current + event.deltaY));
      animation.current = requestAnimationFrame(() => scrollTo(target.current));
    };
    element.addEventListener('wheel', handleWheel, { passive: false });

    return () => {
      element.removeEventListener('wheel', handleWheel);
      cancelAnimationFrame(animation.current);
    };
  }, [container, scrollTo]);

  return {
    scrollTo
  };
};

export default useScroll;
