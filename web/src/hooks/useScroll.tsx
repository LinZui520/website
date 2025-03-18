import { RefObject, useCallback, useEffect, useLayoutEffect, useRef, useState } from 'react';

const useScroll = (
  container: RefObject<HTMLElement | null>,
  ease: (x: number) => number,
  duration: number
) => {
  /**
   * 以下是处理container滚动的代码
   */
  const target = useRef<number>(0);

  const createAnimation = useCallback((element: HTMLElement, end: number) => {
    const start = element.scrollTop;
    const startTime = performance.now();

    const frame = (currentTime: number) => {
      const elapsed = currentTime - startTime;
      const progress = ease(Math.min(elapsed / duration, 1));
      element.scrollTop = start + (end - start) * progress;

      if (elapsed < duration) {
        requestAnimationFrame(frame);
      }
    };

    return frame;
  }, [duration, ease]);

  const scrollTo = useCallback((end: number) => {
    if (!container.current) { return; }
    const element = container.current;
    target.current = end;

    const animationFrame = createAnimation(element, end);
    requestAnimationFrame(animationFrame);
  }, [createAnimation, container]);

  useEffect(() => {
    if (!container.current) { return; }
    const element = container.current;

    target.current = element.scrollTop;
    const handleWheel = (event: WheelEvent) => {
      event.preventDefault();
      event.stopPropagation();

      requestAnimationFrame(
        () => scrollTo(
          Math.max(0, Math.min(element.scrollHeight - element.clientHeight, target.current + event.deltaY))
        )
      );
    };
    element.addEventListener('wheel', handleWheel, { passive: false });

    return () => {
      element.removeEventListener('wheel', handleWheel);
    };
  }, [container, scrollTo]);

  /**
   * 以下是处理滚动条行为的代码
   */
  const [scrollHeight, setScrollHeight] = useState(0);
  const [clientHeight, setClientHeight] = useState(0);
  const isThumbGrabbed = useRef(false);
  const thumb = useRef<HTMLButtonElement | null>(null);
  const mouseY = useRef<number>(0);
  const scrollTop = useRef<number>(0);

  useLayoutEffect(() => {
    if (!container.current) { return; }
    setScrollHeight(container.current.scrollHeight);
    setClientHeight(container.current === document.documentElement ? window.innerHeight : container.current.clientHeight);
  }, [container]);

  useEffect(() => {
    if (!container.current) { return; }
    const handleScroll = () => {
      if (!thumb.current || !container.current) { return; }
      thumb.current.style.height = (clientHeight / scrollHeight * 100) + '%';
      thumb.current.style.top = (container.current.scrollTop / scrollHeight * 100) + '%';
    };
    const target = container.current === document.documentElement
      ? window
      : container.current;

    target.addEventListener('scroll', handleScroll);

    return () => {
      target.removeEventListener('scroll', handleScroll);
    };
  }, [clientHeight, container, scrollHeight]);

  useEffect(() => {
    if (!container.current || !thumb.current) { return; }
    const target = thumb.current;
    const handleThumbMouseDown = (event: MouseEvent) => {
      if (!container.current || !thumb.current) { return; }
      scrollTop.current = container.current.scrollTop;
      mouseY.current = event.clientY;
      isThumbGrabbed.current = true;
      document.body.style.cursor = 'grabbing';
      thumb.current.style.cursor = 'grabbing';
    };
    const handleThumbMouseMove = (event: MouseEvent) => {
      if (!container.current || !isThumbGrabbed.current) { return; }
      const change = event.clientY - mouseY.current;
      scrollTo(scrollTop.current + scrollHeight * change / clientHeight);
    };
    const handleThumbMouseUp = () => {
      if (!thumb.current) { return; }
      isThumbGrabbed.current = false;
      document.body.style.cursor = 'auto';
      thumb.current.style.cursor = 'grab';
    };
    target.addEventListener('mousedown', handleThumbMouseDown);
    window.addEventListener('mousemove', handleThumbMouseMove);
    window.addEventListener('mouseup', handleThumbMouseUp);

    return () => {
      target.removeEventListener('mousedown', handleThumbMouseDown);
      window.removeEventListener('mousemove', handleThumbMouseMove);
      window.removeEventListener('mouseup', handleThumbMouseUp);
    };
  }, [clientHeight, container, isThumbGrabbed, scrollHeight, scrollTo]);
  const Scrollbar = useCallback(() => (
    <div
      className={'group sticky z-20 w-2 top-0 bottom-0 right-0 left-full -translate-x-[2px] ' + (container.current === document.documentElement ? 'h-screen' : 'h-full')}
    >
      <button
        className={
          'w-full group-hover:w-[10px] absolute right-0 top-1/2 rounded-sm duration-300 transition-[width,transform] ' +
          'bg-[#7f7f7f] opacity-50 hover:cursor-grab'
        }
        ref={thumb}
        style={{
          height: (clientHeight / scrollHeight * 100) + '%',
          top: container.current ? (container.current?.scrollTop / scrollHeight * 100) + '%' : undefined
        }}
      >
      </button>
    </div>
  ), [clientHeight, container, scrollHeight]);

  return {
    scrollTo,
    Scrollbar
  };
};

export default useScroll;
