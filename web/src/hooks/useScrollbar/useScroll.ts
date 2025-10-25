import { RefObject, useCallback } from 'react';

const useScroll = (
  container: HTMLElement,
  target: RefObject<number>,
  ease: (x: number) => number,
  duration: number
) => {
  const createAnimation = useCallback((container: HTMLElement, end: number) => {
    const start = container.scrollTop;
    const startTime = performance.now();

    const frame = (currentTime: number) => {
      const elapsed = currentTime - startTime;
      const progress = ease(Math.min(elapsed / duration, 1));
      container.scrollTop = start + (end - start) * progress;

      if (elapsed < duration) {
        requestAnimationFrame(frame);
      }
    };

    return frame;
  }, [duration, ease]);

  const scrollTo = useCallback((position: number) => requestAnimationFrame(() => {
    target.current = position;
    requestAnimationFrame(createAnimation(container, position));
  }), [container, createAnimation, target]);

  const scrollToNoAnimation = useCallback((position: number) => {
    container.scrollTop = position;
  }, [container]);

  return {
    scrollTo,
    scrollToNoAnimation
  };
};

export default useScroll;
