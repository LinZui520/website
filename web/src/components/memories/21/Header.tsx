import {motion, useMotionValueEvent, useScroll} from "framer-motion";
import React, {useRef, useState} from "react";

const Header = React.memo(() => {

  const ref = useRef(null)
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end end"]
  })

  const windowWidth = window.innerWidth;
  const windowHeight = window.innerHeight;

  const [value, setValue] = useState(0)

  useMotionValueEvent(scrollYProgress, "change", (latest) => setValue(latest))

  return (
    <div ref={ref} className={"h-[200vh] w-screen flex flex-col items-center overflow-clip"}>
      <div className={"h-[47vh] w-screen"}/>
      <div
        className={
          "h-[50vh] w-[90vw] max-w-[1024px] text-[16px] lg:text-[32px] " +
          "sticky top-[47vh] select-none flex flex-row justify-evenly"
        }
      >
        <div>
          <motion.div
            animate={{scale: 1 + 3 * value, x: -windowWidth * value}}
            transition={{ease: "easeOut", duration: 0.618}}
          >高三21班
          </motion.div>
        </div>

        <div>
          <motion.div
            animate={{scale: 1 + 3 * value, y: -windowHeight * value}}
            transition={{ease: "easeOut", duration: 0.618}}
          >六十七
          </motion.div>
        </div>

        <div>
          <motion.div
            animate={{scale: 1 + 3 * value, x: windowWidth * value}}
            transition={{ease: "easeOut", duration: 0.618}}
          >独家记忆
          </motion.div>
        </div>
      </div>
      <div className={"h-[3vh] w-screen"}/>
      <div className={"h-screen w-screen flex flex-col justify-center items-center sticky top-0 bottom-0"}>
        <motion.span
          animate={{
            scale: 3 / 2,
            y: (1 - value) * 128 + 'px',
            opacity: value
          }}
          transition={{ease: "easeOut", duration: 0.618}}
          className={"select-none text-[16px] lg:text-[32px]"}
        >
          海内存知己，天涯若比邻
        </motion.span>
      </div>
    </div>
  );
})

export default Header;