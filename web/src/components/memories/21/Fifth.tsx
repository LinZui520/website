import React, {useRef, useState} from "react";
import {motion, useMotionValueEvent, useScroll} from "framer-motion";
import FirstImage from "../../../assets/image/memories/21/2024-01-30-16-04-38.png"
import SecondImage from "../../../assets/image/memories/21/2024-01-30-16-05-38.png";
import ThirdImage from "../../../assets/image/memories/21/2024-01-30-16-06-38.png"

const Fifth = () => {

  const ref = useRef(null)
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end end"]
  })

  const [value, setValue] = useState(0)

  useMotionValueEvent(scrollYProgress, "change", (latest) => {
    setValue(latest)
  })

  return (
    <div ref={ref} className={"h-[300vh] w-screen"}>
      <div className={"h-screen w-screen flex flex-col justify-center items-center sticky top-0 bottom-0"}>
        <motion.span
          animate={{
            y: -48 * 2 * value + 'px',
            opacity: 1 - 2 * value
          }}
          transition={{ease: "easeOut", duration: 0.618}}
          className={"text-[16px] lg:text-[32px] select-none mb-[5vw]"}
        >
          我们认真地（抱怨着）跑操
        </motion.span>
        <motion.img
          className={"h-[37vw] w-[60vw] max-h-[309px] max-w-[500px] rounded-[16px] overflow-hidden"}
          src={FirstImage} alt={""}
          animate={{
            scale: 1 - 2 * value,
            opacity: 1 - 2 * value
          }}
          transition={{ease: "easeOut", duration: 0.618}}
        />
      </div>

      <div className={"h-screen w-screen flex flex-col justify-center items-center sticky top-0 bottom-0"}>
        <motion.span
          animate={{
            y: 48 * 2 * (0.5 - value) + 'px',
            opacity: value > 0.5 ? 2 - 2 * value : 2 * value
          }}
          transition={{ease: "easeOut", duration: 0.618}}
          className={"text-[16px] lg:text-[32px] select-none mb-[5vw]"}
        >
          透过这窗户，我们憧憬着外面的世界
        </motion.span>
        <motion.img
          className={"h-[37vw] w-[60vw] max-h-[309px] max-w-[500px] rounded-[16px] overflow-hidden"}
          src={SecondImage} alt={""}
          animate={{
            scale: value > 0.5 ? 2 - 2 * value : 2 * value,
            opacity: value > 0.5 ? 2 - 2 * value : 2 * value
          }}
          transition={{ease: "easeOut", duration: 0.618}}
        />
      </div>

      <div className={"h-screen w-screen flex flex-col justify-center items-center sticky top-0 bottom-0"}>
        <motion.span
          animate={{
            y: 48 * 2 * (1 - value) + 'px',
            opacity: 2 * value - 1
          }}
          transition={{ease: "easeOut", duration: 0.618}}
          className={"text-[16px] lg:text-[32px] select-none mb-[5vw]"}
        >
          心中有信念，眼里有方向，脚下有力量
        </motion.span>
        <motion.img
          className={"h-[37vw] w-[60vw] max-h-[309px] max-w-[500px] rounded-[16px] overflow-hidden"}
          src={ThirdImage} alt={""}
          animate={{
            scale: 2 * value - 1,
            opacity: 2 * value - 1
          }}
          transition={{ease: "easeOut", duration: 0.618}}
        />
      </div>
    </div>
  );
}

export default React.memo(Fifth);