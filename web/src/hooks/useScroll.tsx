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
): {
  scrollTo: (position: number) => void;
  scrollToNoAnimation: (position: number) => void;
  refresh: () => void;
  ScrollbarWrapper: ({ children }: { children: ReactNode }) => JSX.Element,
  Scrollbar: () => JSX.Element | null
} => {
  /**
   * 以下是处理container滚动的代码
   */
  const target = useRef<number>(0);
  const [scrollHeight, setScrollHeight] = useState(0);
  const [clientHeight, setClientHeight] = useState(0);
  const hideScrollbarTimer = useRef<NodeJS.Timeout | string | number | undefined>(undefined);
  const isThumbGrabbed = useRef(false);
  const thumb = useRef<HTMLButtonElement | null>(null);
  // mouseY scrollTop 分别记录当鼠标点击滚动条时的鼠标Y轴坐标和已经滚动的位置
  const mouseY = useRef<number>(0);
  const scrollTop = useRef<number>(0);

  const clearHideScrollbarTimer = useCallback(() => {
    if (hideScrollbarTimer.current) {
      clearTimeout(hideScrollbarTimer.current);
    }
  }, [hideScrollbarTimer]);

  // 延迟隐藏滚动条
  const delayHiddenScrollbar = useCallback(() => {
    hideScrollbarTimer.current = setTimeout(() => {
      if (!thumb.current) { return; }
      thumb.current.style.width = '0px';
    }, 1000);
  }, [hideScrollbarTimer]);

  // 显示滚动条
  const showScrollbar = useCallback(() => {
    if (!thumb.current) { return; }
    thumb.current.style.width = '8px';
    clearHideScrollbarTimer();
  }, [clearHideScrollbarTimer]);

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

  const scrollToNoAnimation = useCallback((position: number) => {
    if (!container.current) { return; }
    const element = container.current;
    target.current = position;
    element.scrollTop = position;
  }, [container]);

  useEffect(() => {
    if (!container.current) { return; }
    const element = container.current;

    target.current = element.scrollTop;
    const handleWheel = (event: WheelEvent) => {
      event.preventDefault();
      event.stopPropagation();
      showScrollbar();
      delayHiddenScrollbar();
      scrollTo(Math.max(0, Math.min(scrollHeight - clientHeight, target.current + event.deltaY)));
    };
    element.addEventListener('wheel', handleWheel, { passive: false });

    return () => {
      element.removeEventListener('wheel', handleWheel);
    };
  }, [clientHeight, container, delayHiddenScrollbar, scrollHeight, scrollTo, showScrollbar]);

  useEffect(() => {
    return () => clearHideScrollbarTimer();
  }, [clearHideScrollbarTimer]);

  // 刷新滚动条
  const refresh = useCallback(() => {
    if (!container.current) { return; }
    const element = container.current;
    const isDocumentElement = element === document.documentElement;
    const value = isDocumentElement ? window.innerHeight : element.clientHeight;
    setClientHeight(value);
    /**
     * 因为当非 document.documentElement 使用这个 hook 时
     * Scrollbar 组件使用 sticky 定位。 sticky 定位不会脱离文档流
     * 所以这个时候元素的长度就会增加一个 clientHeight 的长度
     * 所以需要减去
     */
    setScrollHeight(element.scrollHeight - (isDocumentElement ? 0 : value));
  }, [container]);

  /**
   * 以下是处理滚动条行为的代码
   */
  useLayoutEffect(() => {
    if (!container.current) { return; }
    const element = container.current;
    refresh();

    if (element === document.documentElement) {
      // 如果容器是document.documentElement，监听窗口大小变化
      window.addEventListener('resize', refresh);
    }
    // 使用 ResizeObserver 监听普通容器大小变化
    const resizeObserver = new ResizeObserver(refresh);
    resizeObserver.observe(element);

    return () => {
      if (element === document.documentElement) {
        window.removeEventListener('resize', refresh);
      }
      resizeObserver.unobserve(element);
      resizeObserver.disconnect();
    };
  }, [container, refresh]);

  useLayoutEffect(() => {
    if (!thumb.current) { return; }
    if (clientHeight >= scrollHeight) {
      thumb.current.style.display = 'none';
    } else {
      thumb.current.style.display = 'block';
    }
  }, [clientHeight, scrollHeight]);

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
      // 点击滚动条的时候清除隐藏滚动条定时器
      clearHideScrollbarTimer();
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
      // 拖拽结束且没有hover，则1秒后隐藏滚动条
      if (scrollbarThumb.style.width !== '10px') {
        delayHiddenScrollbar();
      }
    };
    const handleThumbMouseEnter = () => {
      scrollbarThumb.style.width = '10px';
      // 鼠标悬停时显示滚动条并清除隐藏定时器
      clearHideScrollbarTimer();
    };
    const handleThumbMouseLeave = () => {
      scrollbarThumb.style.width = '8px';
      // 鼠标离开时如果没有在拖拽，则1秒后隐藏滚动条
      if (!isThumbGrabbed.current) {
        delayHiddenScrollbar();
      }
    };

    scrollbarThumb.addEventListener('mousedown', handleThumbMouseDown);
    scrollbarThumb.addEventListener('mouseenter', handleThumbMouseEnter);
    scrollbarThumb.addEventListener('mouseleave', handleThumbMouseLeave);
    window.addEventListener('mousemove', handleThumbMouseMove);
    window.addEventListener('mouseup', handleThumbMouseUp);

    return () => {
      scrollbarThumb.removeEventListener('mousedown', handleThumbMouseDown);
      scrollbarThumb.removeEventListener('mouseenter', handleThumbMouseEnter);
      scrollbarThumb.removeEventListener('mouseleave', handleThumbMouseLeave);
      window.removeEventListener('mousemove', handleThumbMouseMove);
      window.removeEventListener('mouseup', handleThumbMouseUp);
    };
  }, [clearHideScrollbarTimer, clientHeight, container, delayHiddenScrollbar, isThumbGrabbed, scrollHeight, scrollTo]);

  const Scrollbar = useCallback(() => {

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
          aria-label="scrollbar"
          className={
            'w-0 absolute right-0 rounded-sm duration-300 transition-[height,width,transform] ' +
            'bg-[#7f7f7f] opacity-50 hover:cursor-grab'
          }
          ref={thumb}
          tabIndex={-1}
        >
        </button>
      </div>
    );
  }, [container]);

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
    scrollToNoAnimation,
    refresh,
    ScrollbarWrapper,
    Scrollbar
  };
};

export default useScroll;
