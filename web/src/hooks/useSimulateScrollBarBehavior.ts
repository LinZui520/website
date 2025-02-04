import { RefObject, useCallback, useEffect, useRef, useState } from "react";

export default function useSimulateScrollBarBehavior(
  element: HTMLElement | null,
  scrollBarRef: RefObject<HTMLButtonElement | null>,
  scrollTo: (to: number) => void
) {
  const [scrollHeight, setScrollHeight] = useState(0);
  const [clientHeight, setClientHeight] = useState(0);
  const [isThumbBarHover, setIsThumbBarHover] = useState(false);
  const [isScrollBarDrag, setIsScrollBarDrag] = useState(false);
  const oldScrollTop = useRef(0);
  const oldMouseY = useRef(0);

  useEffect(() => {
    if (element === null || typeof window === "undefined") {
      return;
    }
    requestAnimationFrame(() => {
      setClientHeight(element === document.documentElement ? window.innerHeight : element.clientHeight);
      setScrollHeight(element === document.documentElement ? element.scrollHeight : element.scrollHeight);
    }); 
  }, [element]);

  useEffect(() => {
    if (element === null) {
      return;
    }
    const target = document.body

    const observer = new MutationObserver(() => {
      requestAnimationFrame(() => {
        setClientHeight(element === document.documentElement ? window.innerHeight : element.clientHeight);
        setScrollHeight(element === document.documentElement ? element.scrollHeight : element.scrollHeight);
      }); 
    });
    const config = {
      // childList: true, // 子节点的变动（新增、删除或者更改）
      attributes: true, // 属性的变动
      // characterData: true, // 节点内容或节点文本的变动
      subtree: true// 是否将观察器应用于该节点的所有后代节点
    };

    observer.observe(target, config);

    return () => {
      observer.disconnect();
    }
  }, [element]);

  const handleDragScrollBar = useCallback((event: MouseEvent) => {
    if (isScrollBarDrag && element) {
      const change = event.clientY - oldMouseY.current;
      scrollTo(
        oldScrollTop.current + change * scrollHeight / clientHeight
      );
    }
  }, [isScrollBarDrag, element, scrollTo, scrollHeight, clientHeight]);

  const handleScrollBarDragEnd = () => setIsScrollBarDrag(false);

  useEffect(() => {
    if (element === null) {
      return;
    }
    window.addEventListener("mousemove", handleDragScrollBar);
    window.addEventListener("mouseup", handleScrollBarDragEnd);

    return () => {
      if (element === null) {
        return;
      }
      window.removeEventListener("mousemove", handleDragScrollBar);
      window.removeEventListener("mouseup", handleScrollBarDragEnd);
    };
  }, [element, handleDragScrollBar]);

  const handleScroll = useCallback(() => {
    if (scrollBarRef.current === null || element === null) {
      return;
    }
    scrollBarRef.current.style.height = (clientHeight / scrollHeight * 100) + "%";
    scrollBarRef.current.style.top = (element.scrollTop / scrollHeight * 100) + "%";
  }, [clientHeight, element, scrollBarRef, scrollHeight]);

  useEffect(() => {
    if (element === null) {
      return;
    }
    handleScroll();
    if (element === document.documentElement) {
      window.addEventListener("scroll", handleScroll);
    } else {
      element.addEventListener("scroll", handleScroll);
    }
    
    return () => {
      if (element === null) {
        return;
      }
      if (element === document.documentElement) {
        window.removeEventListener("scroll", handleScroll);
      } else {
        element.removeEventListener("scroll", handleScroll);
      }
    }
  }, [element, handleScroll]);

  return {
    display: scrollHeight > clientHeight,
    thumbBar: {
      onHoverStart: () => setIsThumbBarHover(true),
      onHoverEnd: () => setIsThumbBarHover(false),
    },
    scrollBar: {
      onMouseDown: (event: { clientY: number; }) => {
        if (element === null) {
          return;
        }
        oldScrollTop.current = element.scrollTop;
        oldMouseY.current = event.clientY;
        setIsScrollBarDrag(true)
      },
      animate: {
        width: isThumbBarHover || isScrollBarDrag ? "12px" : "8px",
      }
    }
  }
}