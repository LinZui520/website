import {
  JSX,
  ReactNode,
  RefObject,
  useCallback,
  useEffect,
  useLayoutEffect,
  useRef,
  useState
} from 'react';

/**
 * useScroll - 自定义滚动钩子函数
 *
 * @param container - 需要自定义滚动行为的容器引用
 * @param ease - 缓动函数，接收0-1之间的进度值并返回转换后的进度值
 * @param duration - 滚动动画持续时间（毫秒）
 *
 * @returns {
 *   scrollTo: (position: number) => void - 滚动到指定位置的函数
 *   Scrollbar: () => JSX.Element | null - 自定义滚动条组件
 * }
 *
 * @example
 * const { scrollTo, ScrollbarWrapper, Scrollbar } = useScroll(
 *   containerRef,
 *   (x) => x, // 线性缓动
 *   300
 * );
 */
const useScroll = (
  container: RefObject<HTMLElement | null>,
  ease: (x: number) => number,
  duration: number
): { scrollTo: (position: number) => void; ScrollbarWrapper: ({ children }: { children: ReactNode }) => JSX.Element, Scrollbar: () => JSX.Element | null } => {
  /**
   * 以下是处理container滚动的代码
   */
  const target = useRef<number>(0);
  const [scrollHeight, setScrollHeight] = useState(0);
  const [clientHeight, setClientHeight] = useState(0);
  const isThumbGrabbed = useRef(false);
  const thumb = useRef<HTMLButtonElement | null>(null);
  // mouseY scrollTop 分别记录当鼠标点击滚动条时的鼠标Y轴坐标和已经滚动的位置
  const mouseY = useRef<number>(0);
  const scrollTop = useRef<number>(0);

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

  const scrollTo = useCallback((position: number) => requestAnimationFrame(() => {
    if (!container.current) { return; }
    const element = container.current;
    target.current = position;

    requestAnimationFrame(createAnimation(element, position));
  }), [createAnimation, container]);

  useEffect(() => {
    if (!container.current) { return; }
    const element = container.current;

    target.current = element.scrollTop;
    const handleWheel = (event: WheelEvent) => {
      event.preventDefault();
      event.stopPropagation();

      scrollTo(Math.max(0, Math.min(scrollHeight - clientHeight, target.current + event.deltaY)));
    };
    element.addEventListener('wheel', handleWheel, { passive: false });

    return () => {
      element.removeEventListener('wheel', handleWheel);
    };
  }, [clientHeight, container, scrollHeight, scrollTo]);

  /**
   * 以下是处理滚动条行为的代码
   */
  useLayoutEffect(() => {
    if (!container.current) { return; }
    const element = container.current;
    const updateDimensions = () => {
      setClientHeight(element === document.documentElement ?
        window.innerHeight : element.clientHeight);
      /**
       * 因为当非 document.documentElement 使用这个 hook 时
       * Scrollbar 组件使用 sticky 定位。 sticky 定位不会脱离文档流
       * 所以这个时候元素的长度就会增加一个 clientHeight 的长度
       * 所以需要减去
       */
      setScrollHeight(element.scrollHeight - (element === document.documentElement ? 0 : clientHeight));
    };

    updateDimensions();

    // 使用 ResizeObserver 监听容器大小变化
    const resizeObserver = new ResizeObserver(updateDimensions);
    resizeObserver.observe(container.current);

    return () => {
      resizeObserver.unobserve(element);
      resizeObserver.disconnect();
    };
  }, [clientHeight, container]);

  useEffect(() => {
    if (!container.current || !thumb.current) { return; }
    const element = container.current;
    const scrollbarThumb = thumb.current;
    const handleScroll = () => {
      scrollbarThumb.style.height = (clientHeight / scrollHeight * 100) + '%';
      scrollbarThumb.style.top = (element.scrollTop / scrollHeight * 100) + '%';
    };
    const target = element === document.documentElement
      ? window
      : element;

    target.addEventListener('scroll', handleScroll);

    return () => {
      target.removeEventListener('scroll', handleScroll);
    };
  }, [clientHeight, container, scrollHeight]);

  useEffect(() => {
    if (!container.current || !thumb.current) { return; }
    const element = container.current;
    const scrollbarThumb = thumb.current;
    const handleThumbMouseDown = (event: MouseEvent) => {
      scrollTop.current = element.scrollTop;
      mouseY.current = event.clientY;
      isThumbGrabbed.current = true;
      document.body.style.cursor = 'grabbing';
      scrollbarThumb.style.cursor = 'grabbing';
    };
    const handleThumbMouseMove = (event: MouseEvent) => {
      if (!isThumbGrabbed.current) { return; }
      const change = event.clientY - mouseY.current;
      scrollTo(Math.max(0, Math.min(scrollHeight - clientHeight, scrollTop.current + scrollHeight * change / clientHeight)));
    };
    const handleThumbMouseUp = () => {
      isThumbGrabbed.current = false;
      document.body.style.cursor = 'auto';
      scrollbarThumb.style.cursor = 'grab';
    };
    scrollbarThumb.addEventListener('mousedown', handleThumbMouseDown);
    window.addEventListener('mousemove', handleThumbMouseMove);
    window.addEventListener('mouseup', handleThumbMouseUp);

    return () => {
      scrollbarThumb.removeEventListener('mousedown', handleThumbMouseDown);
      window.removeEventListener('mousemove', handleThumbMouseMove);
      window.removeEventListener('mouseup', handleThumbMouseUp);
    };
  }, [clientHeight, container, isThumbGrabbed, scrollHeight, scrollTo]);

  const Scrollbar = useCallback(() => {

    const needsScrollbar = scrollHeight > clientHeight;

    if (!needsScrollbar) return null;
    return (
      <div
        className={'group z-20 w-2 top-0 bottom-0 right-0 -translate-x-[2px]'}
        style={{
          position: container.current === document.documentElement ? 'fixed' : 'sticky',
          left: container.current === document.documentElement ? undefined : '100%',
          height: container.current === document.documentElement ? '100vh' : '100%'
        }}
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
          tabIndex={-1}
        >
        </button>
      </div>
    );
  }, [clientHeight, container, scrollHeight]);

  /**
   * ToDo
   */
  const ScrollbarWrapper = ({ children }: { children: ReactNode }) => {
    return (
      <>
        {children}
      </>
    );
  };

  return {
    scrollTo,
    ScrollbarWrapper,
    Scrollbar
  };
};

export default useScroll;
