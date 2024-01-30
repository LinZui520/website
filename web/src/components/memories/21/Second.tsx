import {motion, useMotionValueEvent, useScroll} from "framer-motion";
import React, {useRef, useState} from "react";
import FirstImage from "../../../assets/image/memories/21/Screenshot_20240105_233337.png";

const Second = React.memo(() => {

  const ref = useRef(null)
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end end"]
  })

  const [scale, setScale] = useState(1)

  const windowWidth = window.innerWidth;

  useMotionValueEvent(scrollYProgress, "change", (latest) => {
    setScale(1 + 3 * latest)
  })

  return (
    <div ref={ref} className={"h-[200vh] w-screen flex flex-col items-center overflow-clip"}>
      <div className={"h-[50vh] w-screen"}/>
      <div
        className={
          "h-[50vh] w-[90vw] max-w-[1024px] text-[16px] lg:text-[32px] " +
          "sticky top-[50vh] select-none flex flex-row justify-evenly"
        }
      >
        <div>
          <motion.div
            initial={{scale: 1, x: 0}}
            animate={{scale: scale, x: (1 - scale) * windowWidth / 2}}
            transition={{ease: "easeOut", duration: 0.618}}
          >
            我们离高考越来越近
          </motion.div>
        </div>

        <div>
          <motion.div
            initial={{scale: 1, x: 0}}
            animate={{scale: scale, x: (scale - 1) * windowWidth / 2}}
            transition={{ease: "easeOut", duration: 0.618}}
          >
            近到可以听到他的心跳
          </motion.div>
        </div>

      </div>

      <div className={"h-screen w-screen flex justify-center items-center"}>
        <motion.img
          className={"h-[60vw] w-[60vw] max-h-[516px] max-w-[516px] rounded-[16px] overflow-hidden"}
          src={FirstImage} alt={""}
          initial={{scale: 0, opacity: 0}}
          whileInView={{scale: 1, opacity: 1}}
          viewport={{once: true}}
          transition={{ease: "easeOut", duration: 0.618}}
        />
      </div>
    </div>
  );
})

export default Second;