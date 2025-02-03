import { useCallback, useEffect, useState } from "react";

const useScroll = (
  element: HTMLElement | null,
  duration: number
) => {

  const [target, setTarget] = useState(0);

  useEffect(() => {
    if (element) {
      requestAnimationFrame(() => setTarget(element.scrollTop));
    }
  }, [element]);
  
  useEffect(() => {
    if (element === null) {
      return;
    }
    const start = element.scrollTop;
    const change = target - start;
    const startTimestamp = performance.now();
    const easeOutCubic = (t: number) => 1 - (1 - t) ** 3;

    const animateScroll = (current: number) => {
      const elapsed = current - startTimestamp;
      element.scrollTop = change * easeOutCubic(elapsed / duration) + start;
      if (elapsed < duration) {
        requestAnimationFrame(animateScroll);
      }
    }

    requestAnimationFrame(animateScroll);
  }, [duration, element, target]);

  useEffect(() => {
    if (element === null) {
      return;
    }
    const handleWheel = (event: WheelEvent) => {
      event.preventDefault();
      const clientHeight = element === document.documentElement ? window.innerHeight : element.clientHeight;
      requestAnimationFrame(
        () => setTarget(
          (preTarget) => Math.max(0, Math.min(element.scrollHeight - clientHeight, preTarget + event.deltaY / 2))
        )
      );
    }
    element.addEventListener('wheel', handleWheel, { passive: false });

    return () => {
      element.removeEventListener('wheel', handleWheel);
    }
  }, [element]);

  const scrollTo = useCallback((to: number) => requestAnimationFrame(() => setTarget(to)), []);

  return {
    scrollTo
  }
}

export default useScroll;
