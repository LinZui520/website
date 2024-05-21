'use client'

import { motion } from "framer-motion";

const NotFound = () => {
  return (
    <div className={"h-screen max-h-full w-full flex flex-col justify-center items-center overflow-hidden"}>
      <motion.span
        className={"select-none font-bold text-[#1d1d1f] sm:text-[18px] md:text-[22px] lg:text-[27px]"}
        initial={{ scale: 1, opacity: 1 }}
        animate={{
          scale: [1, 2, 1],
          opacity: [1, 0.5, 1]
        }}
        transition={{
          duration: 2,
          repeat: Infinity,
          ease: "easeInOut"
        }}
      >
        Not Found
      </motion.span>
    </div>
  );
}

export default NotFound;
