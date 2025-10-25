import { RefObject, useEffect, useRef } from 'react';
import {
  SCROLLBAR_THUMB_HOVER_WIDTH,
  SCROLLBAR_THUMB_WIDTH,
  CURSOR_GRABBING,
  CURSOR_GRAB,
  CURSOR_AUTO
} from './constant';

const useHandleGrab = (
  container: HTMLElement,
  thumbRef: RefObject<HTMLButtonElement | null>,
  scrollTo: (position: number) => void,
  getClientHeight: () => number,
  getScrollHeight: () => number,
  clearHideScrollbarTimer: () => void,
  delayHiddenScrollbar: () => void
) => {
  const isThumbGrabbed = useRef(false);
  // 记录拖拽开始时的鼠标Y轴坐标和容器滚动位置
  const dragStartMouseY = useRef<number>(0);
  const dragStartScrollTop = useRef<number>(0);

  useEffect(() => {
    if (!thumbRef.current) { return; }
    const scrollbarThumb = thumbRef.current;

    const handleThumbMouseDown = (event: MouseEvent) => {
      dragStartScrollTop.current = container.scrollTop;
      dragStartMouseY.current = event.clientY;
      isThumbGrabbed.current = true;
      document.body.style.cursor = CURSOR_GRABBING;
      scrollbarThumb.style.cursor = CURSOR_GRABBING;
      // 点击滚动条的时候清除隐藏滚动条定时器
      clearHideScrollbarTimer();
    };

    const handleThumbMouseMove = (event: MouseEvent) => {
      if (!isThumbGrabbed.current) { return; }
      const change = event.clientY - dragStartMouseY.current;
      const currentScrollHeight = getScrollHeight();
      const currentClientHeight = getClientHeight();

      scrollTo(Math.max(0, Math.min(currentScrollHeight - currentClientHeight, dragStartScrollTop.current + currentScrollHeight * change / currentClientHeight)));
    };

    const handleThumbMouseUp = () => {
      isThumbGrabbed.current = false;
      document.body.style.cursor = CURSOR_AUTO;
      scrollbarThumb.style.cursor = CURSOR_GRAB;
      // 拖拽结束且没有hover，则1秒后隐藏滚动条
      if (scrollbarThumb.style.width !== SCROLLBAR_THUMB_HOVER_WIDTH) {
        delayHiddenScrollbar();
      }
    };

    const handleThumbMouseEnter = () => {
      scrollbarThumb.style.width = SCROLLBAR_THUMB_HOVER_WIDTH;
      // 鼠标悬停时显示滚动条并清除隐藏定时器
      clearHideScrollbarTimer();
    };

    const handleThumbMouseLeave = () => {
      scrollbarThumb.style.width = SCROLLBAR_THUMB_WIDTH;
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
  }, [clearHideScrollbarTimer, container, delayHiddenScrollbar, getClientHeight, getScrollHeight, scrollTo, thumbRef]);

  return {};
};

export default useHandleGrab;
