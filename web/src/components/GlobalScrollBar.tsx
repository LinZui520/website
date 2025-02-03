'use client'
import { useRef } from "react";
import { motion } from "motion/react";
import useScroll from "@/hooks/useScroll";
import useSimulateScrollBarBehavior from "@/hooks/useSimulateScrollBarBehavior";

export default function ScrollBar() {

  const scrollBarRef = useRef<HTMLButtonElement>(null);

  const { scrollTo } = useScroll(
    typeof window === "undefined" ? null : document.documentElement,
    1000
  );

  const { display, thumbBar,scrollBar } = useSimulateScrollBarBehavior(
    typeof window === "undefined" ? null : document.documentElement,
    scrollBarRef,
    scrollTo
  )

  if (!display) return null

  return (
    <motion.div
      {...thumbBar}
      className="fixed right-[2px] top-0 bottom-0 h-full w-[8px] z-10"
    >
      <motion.button 
        {...scrollBar}
        ref={scrollBarRef}
        title="scrollbar" type="button"
        className="absolute right-0 w-full bg-[#7f7f7f] rounded-full opacity-80"
      />
    </motion.div>
  );
}