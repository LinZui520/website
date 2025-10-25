import { JSX, ReactNode, useCallback, useEffect, useRef } from 'react';
import useScrollMetrics from './useScrollMetrics';
import useScroll from './useScroll';
import useHandleGrab from './useHandleGrab';

const useGlobalScrollbar = (
  ease: (x: number) => number,
  duration: number
): {
  scrollTo: (position: number) => void;
  scrollToNoAnimation: (position: number) => void;
  refresh: () => void;
  ScrollbarWrapper: ({ children }: { children: ReactNode }) => JSX.Element,
  Scrollbar: () => JSX.Element | null
} => {
  const target = useRef<number>(0);
  const containerRef = useRef<HTMLElement>(document.documentElement);
  const thumbRef = useRef<HTMLButtonElement>(null);

  const { scrollTo, scrollToNoAnimation } = useScroll(containerRef.current, target, ease, duration);
  const { getClientHeight, getScrollHeight, clampScrollTarget, delayHiddenScrollbar, showScrollbar, clearHideScrollbarTimer, refreshMetrics } = useScrollMetrics(containerRef.current, thumbRef);

  useHandleGrab(
    containerRef.current,
    thumbRef,
    scrollTo,
    getClientHeight,
    getScrollHeight,
    clearHideScrollbarTimer,
    delayHiddenScrollbar
  );

  useEffect(() => {
    const element = containerRef.current;

    target.current = element.scrollTop;
    const handleWheel = (event: WheelEvent) => {
      event.preventDefault();
      event.stopPropagation();
      showScrollbar()?.then(() => delayHiddenScrollbar());
      scrollTo(clampScrollTarget(target.current + event.deltaY));
    };
    element.addEventListener('wheel', handleWheel, { passive: false });

    return () => {
      element.removeEventListener('wheel', handleWheel);
    };
  }, [clampScrollTarget, containerRef, delayHiddenScrollbar, scrollTo, showScrollbar]);

  const Scrollbar = useCallback(() => {
    return (
      <div className={'group z-20 w-2 h-screen fixed top-0 bottom-0 right-0'}>
        <button
          aria-label="scrollbar"
          className={
            'w-0 absolute right-0 rounded-sm duration-300 transition-[height,width,transform] ' +
            'bg-[#7f7f7f] opacity-50 hover:cursor-grab'
          }
          ref={thumbRef}
          tabIndex={-1}
        >
        </button>
      </div>
    );
  }, []);

  return {
    scrollTo,
    scrollToNoAnimation,
    refresh: refreshMetrics,
    ScrollbarWrapper:  ({ children }: { children: ReactNode }) => <div className="relative h-full">{children}</div>,
    Scrollbar
  };
};

export default useGlobalScrollbar;
