import React, {useRef, useState} from "react";
import {motion, useMotionValueEvent, useScroll} from "framer-motion";
import FirstImage from "../../../assets/image/memories/21/2024-02-13-16-15-16.jpg";
import SecondImage from "../../../assets/image/memories/21/2024-02-13-16-16-16.jpg";
import ThirdImage from "../../../assets/image/memories/21/2024-02-13-16-17-16.jpg";
import FourthImage from "../../../assets/image/memories/21/2024-02-13-16-18-16.jpg";

const SixthNext = () => {

  const ref = useRef(null)
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end end"]
  })
  const windowWidth = window.innerWidth;
  const [value, setValue] = useState(0)

  useMotionValueEvent(scrollYProgress, "change", (latest) => setValue(latest))

  return (
    <div ref={ref} className={"h-[300vh] w-screen"}>
      <div className={"h-screen w-screen flex flex-row justify-evenly items-center sticky top-0 bottom-0 overflow-hidden"}>
        <motion.img
          className={"h-[50vw] w-[31vw] max-h-[500px] max-w-[309px] rounded-[16px] overflow-hidden"}
          src={FirstImage} alt={""}
          animate={{
            x: -windowWidth * 2 * value + 'px',
            opacity: 2 * (0.5 - value)
          }}
          transition={{ease: "easeOut", duration: 0.618}}
        />
        <motion.img
          className={"h-[50vw] w-[31vw] max-h-[500px] max-w-[309px] rounded-[16px] overflow-hidden"}
          src={SecondImage} alt={""}
          animate={{
            x: windowWidth * 2 * value + 'px',
            opacity: 2 * (0.5 - value)
          }}
          transition={{ease: "easeOut", duration: 0.618}}
        />
      </div>

      <div className={"h-screen w-screen flex flex-row justify-evenly items-center sticky top-0 bottom-0 overflow-hidden"}>
        <motion.img
          className={"h-[50vw] w-[31vw] max-h-[500px] max-w-[309px] rounded-[16px] overflow-hidden"}
          src={ThirdImage} alt={""}
          animate={{
            scale: value > 0.5 ? 1 : 2 * value,
            opacity: value > 0.5 ? 1 : 2 * value,
            x: value > 0.5 ? -windowWidth * 2 * (value - 0.5) : 0
          }}
          transition={{ease: "easeOut", duration: 0.618}}
        />

        <motion.span
          animate={{
            scale: value > 0.5 ? 1 : 2 * value,
            opacity: value > 0.5 ? 1 : 2 * value,
            x: value > 0.5 ? windowWidth * 2 * (value - 0.5) : 0
          }}
          transition={{ease: "easeOut", duration: 0.618}}
          className={"text-[16px] lg:text-[32px] w-[10vw] select-none mb-[5vw] overflow-hidden"}
        >
          酷酷的、帅帅的刘峰高同学。
        </motion.span>
      </div>

      <div className={"h-screen w-screen flex flex-row justify-evenly items-center sticky top-0 bottom-0 overflow-hidden"}>
        <motion.img
          className={"h-[50vw] w-[31vw] max-h-[500px] max-w-[309px] rounded-[16px] overflow-hidden"}
          src={FourthImage} alt={""}
          animate={{
            scale: 2 * (value - 0.5),
            opacity: 2 * (value - 0.5)
          }}
          transition={{ease: "easeOut", duration: 0.618}}
        />

        <motion.span
          animate={{
            scale: 2 * (value - 0.5),
            opacity: 2 * (value - 0.5)
          }}
          transition={{ease: "easeOut", duration: 0.618}}
          className={"text-[16px] lg:text-[32px] w-[10vw] select-none mb-[5vw] overflow-hidden"}
        >
          此时，很安静的贺清同学。
        </motion.span>
      </div>
    </div>
  );
}

export default React.memo(SixthNext);