import {motion, useMotionValueEvent, useScroll} from "framer-motion";
import React, {useRef, useState} from "react";
import FirstImage from "../../../assets/image/memories/21/2023-12-30-21-33-46.png";
import SecondImage from "../../../assets/image/memories/21/2024-01-05-20-12-36.png"

const First = React.memo(() => {

  const ref = useRef(null)
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end end"]
  })
  const [value, setValue] = useState(0)

  useMotionValueEvent(scrollYProgress, "change", (latest) => setValue(latest))

  return (
    <div ref={ref} className={"h-[400vh] w-screen overflow-clip"}>
      <motion.div
        className={"h-screen w-[400vw] sticky top-0 flex flex-row"}
        animate={{
          x: -value * window.innerWidth * 3 + "px",
        }}
        transition={{type: 'tween'}}
      >
        <div className={"h-screen w-screen flex justify-center items-center"}>
          <motion.span
            initial={{opacity: 0, scale: 0.3}}
            whileInView={{opacity: 1, scale: 1}}
            viewport={{once: true}}
            transition={{ease: "easeOut", duration: 0.618}}
            className={"text-[16px] lg:text-[32px] select-none"}
          >
            一切从这张座位表说起
          </motion.span>
        </div>

        <div className={"h-screen w-screen flex justify-center items-center"}>
          <motion.img
            className={"h-[30vw] w-[60vw] max-h-[356px] max-w-[712px] rounded-[16px] overflow-hidden"}
            src={FirstImage} alt={""}
            initial={{scale: 0, opacity: 0}}
            whileInView={{scale: 1, opacity: 1}}
            viewport={{once: true}}
            transition={{ease: "easeOut", duration: 0.618}}
          />
        </div>

        <div className={"h-screen w-screen text-[16px flex justify-center items-center"}>
          <motion.span
            initial={{opacity: 0, scale: 0.3}}
            whileInView={{opacity: 1, scale: 1}}
            viewport={{once: true}}
            transition={{ease: "easeOut", duration: 0.618}}
            className={"text-[16px] lg:text-[32px] select-none"}
          >
            或从曾经的倒计时说起
          </motion.span>
        </div>
        <div className={"h-screen w-screen flex justify-center items-center"}>
          <motion.img
            className={"h-[75vw] w-[50vw] max-h-[660px] max-w-[440px] rounded-[16px] overflow-hidden"}
            src={SecondImage} alt={""}
            initial={{scale: 0, opacity: 0}}
            whileInView={{scale: 1, opacity: 1}}
            viewport={{once: true}}
            transition={{ease: "easeOut", duration: 0.618}}
          />
        </div>
      </motion.div>
    </div>
  );
})

export default First;