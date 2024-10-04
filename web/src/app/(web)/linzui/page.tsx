'use client'
import React from "react";
import { motion } from "framer-motion";

const Page = () => {
  return (
    <div 
      className="w-full h-full flex flex-col justify-center items-center" 
    >
      <motion.div
        className="font-thin text-[#fbfbfd] font-mono text-4xl"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1, type: "spring", stiffness: 100, damping: 10 }}
      >
        长街漫漫终无故人游
      </motion.div>
    </div>
  );
};

export default Page;