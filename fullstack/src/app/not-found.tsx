'use client'

import { motion } from "framer-motion";

const NotFound = () => {
  return (
    <div className={"h-screen w-full flex justify-center items-center"}>
      <motion.span
        className={"select-none font-bold text-[#1d1d1f] text-[18px] md:text-[22px] lg:text-[26px]"}
        initial={{ scale: 1, opacity: 0.6 }}
        animate={{
          scale: [1, 1.5, 1],
          opacity: [0.6, 1, 0.6],
        }}
        transition={{
          duration: 3,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      >
        Not Found
      </motion.span>
    </div>
  );
}

export default NotFound;
