import {motion, useMotionValueEvent, useScroll} from "framer-motion";
import FirstImage from "../../../assets/image/memories/21/2024-01-25-18-49-42.png"
import SecondImage from "../../../assets/image/memories/21/2024-01-27 15-14-34.png";
import ThirdImage from "../../../assets/image/memories/21/2024-01-27 15-15-25.png"
import React, {useRef, useState} from "react";

const Fourth = () => {

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
    <div ref={ref} className="h-[500vh] w-[100vw] flex flex-col justify-center items-center overflow-clip">
      <div className={"h-screen w-screen flex justify-center items-center sticky top-0 bottom-0"}>
        <motion.span
          animate={{
            y: -128 * 4 * value + 'px',
            opacity: 4 * (0.25 - value)
          }}
          transition={{ease: "easeOut", duration: 0.618}}
          className={"text-[16px] lg:text-[32px] select-none"}
        >
          我们听过的午觉唤醒曲
        </motion.span>
      </div>
      <div className={"h-screen w-screen flex justify-center items-center sticky top-0 bottom-0"}>
        <motion.img
          className={"h-[71vw] w-[59vw] max-h-[568px] max-w-[470px] rounded-[16px] overflow-hidden"}
          src={FirstImage} alt={""}
          animate={{
            opacity: value > 0.25 ? 4 * (0.5 - value) : 4 * value,
            scale: value > 0.25 ? 4 * (0.5 - value) : 4 * value
          }}
          transition={{ease: "easeOut", duration: 0.618}}
        />
      </div>

      <div className={"h-screen w-screen flex justify-center items-center sticky top-0 bottom-0"}>
        <motion.span
          animate={{
            y: -128 * 4 * (value - 0.5) + 'px',
            opacity: value > 0.5 ? 4 * (0.75 - value) : 4 * (value - 0.25)
          }}
          transition={{ease: "easeOut", duration: 0.618}}
          className={"text-[16px] lg:text-[32px] select-none"}
        >
          阴云密布，抑或晴空万里
        </motion.span>
      </div>

      <div className={"h-screen w-screen flex justify-center items-center select-none overflow-clip sticky top-0 bottom-0"}>
        <motion.img
          className={"h-[60vw] w-[60vw] max-h-[500px] max-w-[500px] rounded-[16px] overflow-hidden"}
          src={SecondImage} alt={""}
          animate={{
            scale: value > 0.75 ? 2 * (2 - 2 * value) : 2 * (2 * value - 1),
            opacity: 2 * (2 * value - 1)
          }}
          transition={{ease: "easeOut", duration: 0.618}}
        />
      </div>

      <div className={"h-screen w-screen flex justify-center items-center select-none overflow-clip sticky top-0 bottom-0"}>
        <motion.img
          className={"h-[60vw] w-[60vw] max-h-[500px] max-w-[500px] rounded-[16px] overflow-hidden"}
          src={ThirdImage} alt={""}
          animate={{
            scale: value > 0.75 ? 2 * (2 * value - 1.5) : 0,
            opacity: 2 * (2 * value - 1.5)
          }}
          viewport={{once: true}}
          transition={{ease: "easeOut", duration: 0.618}}
        />
      </div>

    </div>
  );
}

export default React.memo(Fourth);