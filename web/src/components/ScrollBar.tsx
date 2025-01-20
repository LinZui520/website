'use client'

import { motion } from "motion/react";
import { useCallback, useEffect, useRef, useState } from "react";

const ScrollBar = () => {

  const scrollBarRef = useRef<HTMLButtonElement>(null)
  const [scrollHeight, setScrollHeight] = useState(0);
  const [isScrollBarSelect, setIsScrollBarSelect] = useState(false);
  const [isScrollBarHover, setIsScrollBarHover] = useState(false);
  const oldWindowY = useRef(0);
  const oldMouseY = useRef(0);

  useEffect(() => {
    setScrollHeight(document.body.clientHeight);
    if (scrollBarRef.current === null) return;
    scrollBarRef.current.style.height = (window.innerHeight / scrollHeight * 100) + "%";
    scrollBarRef.current.style.top = (window.scrollY / scrollHeight * 100) + "%";
  }, [scrollHeight])

  const handleScroll = useCallback(() => {
    if (scrollBarRef.current === null) return;
    scrollBarRef.current.style.height = (window.innerHeight / scrollHeight * 100) + "%";
    scrollBarRef.current.style.top = (window.scrollY / scrollHeight * 100) + "%";
  }, [scrollHeight]);

  const handleResize = useCallback(() => setScrollHeight(document.body.clientHeight), []);

  const handleDragScrollBar = useCallback((event: MouseEvent) => {
    if (isScrollBarSelect) {
      // window.scroll(
      //   0, oldWindowY.current + (event.clientY - oldMouseY.current) / window.innerHeight * document.body.clientHeight
      // );
      setScrollTarget(oldWindowY.current + (event.clientY - oldMouseY.current) / window.innerHeight * document.body.clientHeight)
    }
  }, [isScrollBarSelect]);

  const cancelSelect = useCallback(() => setIsScrollBarSelect(false), []);

  useEffect(() => {
    window.addEventListener("scroll", handleScroll);
    window.addEventListener("resize", handleResize);
    window.addEventListener("mousemove", handleDragScrollBar);
    window.addEventListener("mouseup", cancelSelect);

    return () => {
      window.removeEventListener("scroll", handleScroll);
      window.removeEventListener("resize", handleResize);
      window.removeEventListener("mousemove", handleDragScrollBar);
      window.removeEventListener("mouseup", cancelSelect);
    };
  }, [handleScroll, handleDragScrollBar, handleResize, cancelSelect]);

  const [scrollTarget, setScrollTarget] = useState(0);

  useEffect(() => {
    setScrollTarget(window.scrollY);
  }, [])

  useEffect(() => {
    if (isScrollBarSelect) {
      window.scroll(0, scrollTarget);
      return;
    }
    const startY = window.scrollY;
    const startTimestamp = performance.now();
    const duration = 1000;
    const easeOutCubic = (t: number) => 1 - (1 - t) ** 3;
    const scrollAnimation = (current: number) => {
      const elapsed = current - startTimestamp;
      window.scroll(0, startY + (scrollTarget - startY) * easeOutCubic(elapsed / duration));

      if (elapsed < duration) {
        requestAnimationFrame(scrollAnimation);
      }
    }

    requestAnimationFrame(scrollAnimation);
  }, [isScrollBarSelect, scrollTarget]);

  useEffect(() => {
    const handleWheel = (event: WheelEvent) => {
      event.preventDefault();
      if (scrollTarget + event.deltaY / 2 < 0) {
        setScrollTarget(0);
      } else if (scrollTarget + event.deltaY / 2 > scrollHeight - window.innerHeight) {
        setScrollTarget(scrollHeight - window.innerHeight);
      } else {
        setScrollTarget(scrollTarget + event.deltaY / 2);
      }
    };

    window.addEventListener('wheel', handleWheel, { passive: false });

    return () => {
      window.removeEventListener('wheel', handleWheel);
    };
  }, [scrollTarget, scrollHeight]);

  // const scrollY = (y: number) => setScrollTarget(y);

  return (
    <motion.div
      onHoverStart={() => setIsScrollBarHover(true)}
      onHoverEnd={() => setIsScrollBarHover(false)}
      className={"fixed right-[2px] top-0 h-screen w-[8px] z-10"}
    >
      <motion.button
        ref={scrollBarRef}
        onMouseDown={(event) => {
          setIsScrollBarSelect(true);
          oldWindowY.current = window.scrollY;
          oldMouseY.current = event.clientY;
        }}
        animate={{ width: isScrollBarHover || isScrollBarSelect ? 12 : 8 }}
        className={"absolute right-0 w-full bg-[#7f7f7f] rounded-full"}
        // style={{
        //   height: (window.innerHeight/ scrollHeight * 100) + "%",
        //   top: (window.scrollY/ scrollHeight * 100) + "%",
        // }}
      >
      </motion.button>
    </motion.div>
  );
}

export default ScrollBar;
