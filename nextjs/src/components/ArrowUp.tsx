'use client'

import { motion } from "framer-motion";
import { useEffect, useState } from "react";

const ArrowUp = () => {

  const [isHovered, setIsHovered] = useState(false)
  const [show, setShow] = useState(false)

  useEffect(() => {
    const check = () => setShow(window.scrollY > 100)

    window.addEventListener("scroll", check)

    return () => window.removeEventListener("scroll", check)
  }, [])

  return (
    <motion.svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 384 512"
      width="32" height="32"
      animate={show ? "show" : "hide"}
      initial={{ opacity: 0, scale: 0 }}
      variants={{
        show: { opacity: 1, scale: 1 },
        hide: { opacity: 0, scale: 0 }
      }}
      whileHover={{ scale: 1.1 }}
      onHoverStart={() => setIsHovered(true)}
      onHoverEnd={() => setIsHovered(false)}
      className={"z-50 fixed right-[25px] bottom-[25px] cursor-pointer"}
      onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
    >
      <motion.path
        animate={isHovered ? "hover" : "none"}
        variants={{
          hover: { fill: "#11efef" }, none: { fill: "#1d1d1f" }
        }}
        transition={{
          duration: 0.618, type: "spring", stiffness: 100, damping: 10
        }}
        d="M214.6 41.4c-12.5-12.5-32.8-12.5-45.3 0l-160 160c-12.5 12.5-12.5 32.8 0 45.3s32.8 12.5 45.3 0L160 141.2V448c0 17.7 14.3 32 32 32s32-14.3 32-32V141.2L329.4 246.6c12.5 12.5 32.8 12.5 45.3 0s12.5-32.8 0-45.3l-160-160z"
      />
    </motion.svg>
  );
}

export default ArrowUp;
