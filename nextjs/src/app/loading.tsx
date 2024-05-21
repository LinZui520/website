'use client'

import { motion } from "framer-motion";

const Loading = () => {

  return (
    <div className={"h-screen max-h-full w-full bg-[#fbfbfd] flex flex-col justify-center items-center"}>
      <motion.div
        initial={{ scale: 0, opacity: 1 }}
        animate={{
          scale: [0, 1],
          opacity: [1, 0]
        }}
        transition={{
          duration: 1,
          repeat: Infinity,
          repeatDelay: 0.125,
          ease: "easeInOut"
        }}
        className={
          "h-[72px] w-[72px] md:h-[100px] md:w-[100px] lg:h-[128px] lg:w-[128px] " +
          "rounded-full bg-[#1d1d1f]"
        }
      />
    </div>
  );
}

export default Loading;
