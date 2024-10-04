'use client'

import { motion, spring } from "framer-motion";

const Page = () => {
  return (
    <div className="w-full h-auto" style={{ backgroundImage: 'linear-gradient(to right top, #1d1d1f, #1d1d1f, #1e1e1f, #1e1e1f, #1e1e1f, #2d2d2e, #3d3d3e, #4e4e4f, #767677, #a0a0a2, #cdcdce, #fbfbfd)' }}>
      <Front />
    </div>
  );
};

export default Page;

const Front = () => {
  return (
    <div className="w-full h-screen ">
      <motion.h1
        className="text-8xl font-thin text-[#fbfbfd] font-mono "
        initial={{ y: -100, opacity: 0 }}
        animate={{ x: 200, y: 150, opacity: 1 }}
        transition={{ duration: 1, type: "spring", stiffness: 100, damping: 10 }}
      >
        林醉
        <motion.a
          className="text-5xl font-thin italic text-[#fbfbfd] font-serif"
        >
          Lin_zui
        </motion.a>
      </motion.h1>

      <motion.h6
        className="font-thin text-[#fbfbfd] font-mono "
        initial={{ y: -100, opacity: 0 }}
        animate={{ x: 220, y: 150, opacity: 1 }}
        transition={{ duration: 1, type: "spring", stiffness: 100, damping: 10 }}
      >
        Web Developer | Designer
      </motion.h6>

      <motion.h6
        className="font-thin text-[#fbfbfd] font-mono "
        initial={{ y: -100, opacity: 0 }}
        animate={{ x: 220, y: 150, opacity: 1 }}
        transition={{ duration: 1, type: "spring", stiffness: 100, damping: 10 }}
      >
        长路漫漫终无故人游
      </motion.h6>
    </div>
  )
}
