'use client'

import { motion } from "motion/react";
import { useCallback, useEffect, useRef, useState } from "react";

export default function ScrollBar() {

  const easeOutScrollBarRef = useRef<HTMLButtonElement>(null);
  const [scrollHeight, setScrollHeight] = useState(0);

  const [target, setTarget] = useState(0);

  useEffect(() => {
    if (typeof window !== "undefined") {
      setScrollHeight(document.documentElement.scrollHeight);
      setTarget(document.documentElement.scrollTop);
    }
  }, []);

  const duration = 1000;
  const easeOutCubic = (t: number) => 1 - (1 - t) ** 3;

  useEffect(() => {
    if (typeof window === "undefined") {
      return;
    }
    const start = document.documentElement.scrollTop;
    const change = target - start;
    const startTimestamp = performance.now();
    
    const animateScroll = (current: number) => {
      const elapsed = current - startTimestamp;
      window.scroll(0, change * easeOutCubic(elapsed / duration) + start);
      if (elapsed < duration) {
        requestAnimationFrame(animateScroll);
      }
    }

    requestAnimationFrame(animateScroll);
  }, [target]);

  useEffect(() => {
    if (typeof window === "undefined") {
      return;
    }
    const handleWheel = (event: WheelEvent) => {
      event.preventDefault();
      const offsetHeight = window.innerHeight;
      setTarget(
        (preTarget) => Math.max(0, Math.min(scrollHeight - offsetHeight, preTarget + event.deltaY))
      );
    }
    window.addEventListener('wheel', handleWheel, { passive: false });

    return () => {
      window.removeEventListener('wheel', handleWheel);
    }
  }, [scrollHeight]);

  const easeOutScrollTo = useCallback((to: number) => setTarget(to), []);

  const [isThumbBarHover, setIsThumbBarHover] = useState(false);
  const [isScrollBarDrag, setIsScrollBarDrag] = useState(false);
  const oldScrollTop = useRef(0);
  const oldMouseY = useRef(0);

  useEffect(() => {
    const target = document.documentElement;

    const observer = new MutationObserver(() => {
      setScrollHeight(document.documentElement.scrollHeight);
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
  }, []);

  const handleDragScrollBar = useCallback((event: MouseEvent) => {
    if (isScrollBarDrag && typeof window !== "undefined") {
      const change = event.clientY - oldMouseY.current
      easeOutScrollTo(
        oldScrollTop.current + change * scrollHeight / window.innerHeight
      );
    }
  }, [easeOutScrollTo, isScrollBarDrag, scrollHeight]);

  const handleScrollBarDragEnd = () => setIsScrollBarDrag(false);

  useEffect(() => {
    window.addEventListener("mousemove", handleDragScrollBar);
    window.addEventListener("mouseup", handleScrollBarDragEnd);

    return () => {
      window.removeEventListener("mousemove", handleDragScrollBar);
      window.removeEventListener("mouseup", handleScrollBarDragEnd);
    };
  }, [handleDragScrollBar]);

  const handleUpdateScrollBarStyle = useCallback(() => {
    if (easeOutScrollBarRef.current === null || document.documentElement === null) return;
    const offsetHeight = window.innerHeight;

    easeOutScrollBarRef.current.style.height = (offsetHeight / scrollHeight * 100) + "%";
    easeOutScrollBarRef.current.style.top = (document.documentElement.scrollTop / scrollHeight * 100) + "%";
  }, [scrollHeight]);

  const handleResize = () => setScrollHeight(document.documentElement.scrollHeight);

  useEffect(() => {
    if (typeof window === "undefined") return;

    handleUpdateScrollBarStyle();

    window.addEventListener("scroll", handleUpdateScrollBarStyle);
    window.addEventListener("resize", handleResize);
    
    return () => {
      window.removeEventListener("scroll", handleUpdateScrollBarStyle);
      window.removeEventListener("resize", handleResize);
    }
  }, [handleUpdateScrollBarStyle, scrollHeight]);

  return (
    <motion.div 
      onHoverStart={() => setIsThumbBarHover(true)}
      onHoverEnd={() => setIsThumbBarHover(false)}
      className="fixed right-[2px] top-0 bottom-0 h-full w-[8px] z-10"
    >
      <motion.button 
        ref={easeOutScrollBarRef}
        onMouseDown={(event) => {
          oldScrollTop.current = window.scrollY;
          oldMouseY.current = event.clientY;
          setIsScrollBarDrag(true)
        }}
        title="scrollbar" type="button"
        animate={{
          width: isThumbBarHover || isScrollBarDrag ? "12px" : "8px"
        }}
        className="absolute right-0 w-full bg-[#7f7f7f] rounded-full opacity-80"
      />
    </motion.div>
  );
}
