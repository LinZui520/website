import {useRef, useState} from "react";
import {motion, useMotionValueEvent, useScroll} from "framer-motion";
import FirstImage from "../../../assets/image/memories/21/2024-01-06-18-42-01.png";
import SecondImage from "../../../assets/image/memories/21/2024-01-06-18-42-33.png"
import React from "react";


const Third = React.memo(() => {

  const ref = useRef(null)
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end end"]
  })

  const [value, setValue] = useState(0)

  useMotionValueEvent(scrollYProgress, "change", (latest) => {
    setValue(latest * window.innerWidth * 3)
  })

  return (
    <div ref={ref} className={"h-[400vh] w-screen overflow-clip"}>
      <motion.div
        className={"h-screen w-[400vw] sticky top-0 flex flex-row"}
        animate={{
          x: -value + "px",
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
            那么多天的奋斗，我们有了质的飞跃
          </motion.span>
        </div>

        <div className={"h-screen w-screen flex justify-center items-center"}>
          <motion.img
            className={"h-[60vw] w-[60vw] max-h-[512px] max-w-[512px] rounded-[16px] overflow-hidden"}
            src={FirstImage} alt={""}
            initial={{scale: 0, opacity: 0}}
            whileInView={{scale: 1, opacity: 1}}
            viewport={{once: true}}
            transition={{ease: "easeOut", duration: 0.618}}
          />
        </div>

        <div className={"h-screen w-screen flex justify-center items-center"}>
          <motion.span
            initial={{opacity: 0, scale: 0.3}}
            whileInView={{opacity: 1, scale: 1}}
            viewport={{once: true}}
            transition={{ease: "easeOut", duration: 0.618}}
            className={"text-[16px] lg:text-[32px] select-none"}
          >
            我们可不是为了成为别人的陪衬而来到这里
          </motion.span>
        </div>
        <div className={"h-screen w-screen flex justify-center items-center"}>
          <motion.img
            className={"h-[60vw] w-[60vw] max-h-[512px] max-w-[512px] rounded-[16px] overflow-hidden"}
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

export default Third;