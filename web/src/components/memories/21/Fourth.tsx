import {motion, useMotionValueEvent, useScroll} from "framer-motion";
import FirstImage from "../../../assets/image/memories/21/Screenshot_20240125_184942.png"
import SecondImage from "../../../assets/image/memories/21/2024-01-27 15-14-34.png";
import ThirdImage from "../../../assets/image/memories/21/2024-01-27 15-15-25.png"
import React, {useRef, useState} from "react";

const Fourth = React.memo(() => {

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
      <div className={"h-screen w-screen flex justify-center items-center"}>
        <motion.span
          initial={{opacity: 0, scale: 0.3}}
          whileInView={{opacity: 1, scale: 1}}
          viewport={{once: true}}
          transition={{ease: "easeOut", duration: 0.618}}
          className={"text-[16px] lg:text-[32px] select-none"}
        >
          我们听过的午觉唤醒曲
        </motion.span>
      </div>
      <div className={"h-screen w-screen flex justify-center items-center"}>
        <motion.img
          className={"h-[71vw] w-[59vw] max-h-[568px] max-w-[470px] rounded-[16px] overflow-hidden"}
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
          阴云密布，抑或晴空万里
        </motion.span>
      </div>

      <div className={"h-screen w-screen flex justify-center items-center select-none overflow-clip sticky top-0"}>
        <motion.img
          className={"h-[60vw] w-[60vw] max-h-[500px] max-w-[500px] rounded-[16px] overflow-hidden"}
          src={SecondImage} alt={""}
          // initial={{scale: 0, opacity: 0, x: -128}}
          // whileInView={{scale: 1, opacity: 1, x: 0}}
          // viewport={{once: true}}
          animate={{
            opacity: 2 * (2 * value - 1)
          }}
          transition={{ease: "easeOut", duration: 0.618}}
        />
      </div>

      <div className={"h-screen w-screen flex justify-center items-center select-none overflow-clip sticky top-0 bottom-0"}>
        <motion.img
          className={"h-[60vw] w-[60vw] max-h-[500px] max-w-[500px] rounded-[16px] overflow-hidden"}
          src={ThirdImage} alt={""}
          // initial={{scale: 0, opacity: 0, x: 128}}
          // whileInView={{scale: 1, opacity: 1, x: 0}}
          animate={{
            opacity: 2 * (2 * value - 1.5)
          }}
          viewport={{once: true}}
          transition={{ease: "easeOut", duration: 0.618}}
        />
      </div>

    </div>
  );
})

export default Fourth;