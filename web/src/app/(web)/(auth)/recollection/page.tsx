'use client'

import { motion, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";

const Page = () => {

  const ref = useRef(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end end"],
  });

  const x = useTransform(scrollYProgress, [0, 1], ["-0vw", "-100vw"])

  return (
    <div ref={ref} className={"h-[200vh] w-screen relative top-0 bottom-0 overflow-x-clip"}>
      <motion.div style={{ x }} className={"sticky top-0 bottom-0 h-screen w-[200vw] flex flex-row"}>
        <div className={"h-screen w-screen bg-red-500"}></div>
        <div className={"h-screen w-screen bg-blue-500"}></div>
      </motion.div>
    </div>
  );
}

export default Page;
