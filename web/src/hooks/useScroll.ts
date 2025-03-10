import { useCallback, useEffect } from 'react';

const useScroll = (
  element: HTMLElement,
  duration: number
) => {
  console.log('useScroll', element);

  const scrollTo = useCallback((end: number) => {
    const start = element.scrollTop;
    const startTimestamp = performance.now();
    const easeOutCubic = (t: number) => 1 - (1 - t) ** 3;
    const animateScroll = (current: number) => {
      const elapsed = current - startTimestamp;
      element.scrollTop = (end - start) * easeOutCubic(elapsed / duration) + start;
      if (elapsed < duration) {
        requestAnimationFrame(animateScroll);
      }
    };
    requestAnimationFrame(animateScroll);
  }, [duration, element]);

  useEffect(() => {
    let target = element.scrollTop;
    const handleWheel = (event: WheelEvent) => {
      event.preventDefault();
      target = Math.max(0, Math.min(element.scrollHeight - window.innerHeight, target + event.deltaY / 2));
      console.log(target);
      requestAnimationFrame(() => scrollTo(target));
    };
    element.addEventListener('wheel', handleWheel, { passive: false });

    return () => {
      element.removeEventListener('wheel', handleWheel);
    };
  }, [element, scrollTo]);

  return {
    scrollTo
  };
};

export default useScroll;
