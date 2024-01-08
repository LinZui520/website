import {useRef, useState} from "react";
import {motion, useMotionValueEvent, useScroll} from "framer-motion";
import FirstImage from "../../../assets/image/memories/21/Screenshot_20240106_184201.png";
import SecondImage from "../../../assets/image/memories/21/Screenshot_20240106_184233.png"


const Third = () => {

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
        <motion.div
          className={"h-screen w-screen text-[16px] lg:text-[32px] select-none flex justify-center items-center"}
          initial={{opacity: 0, scale: 0.5}}
          whileInView={{opacity: 1, scale: 1}}
        >
          那么多天的奋斗，我们有了质的飞跃
        </motion.div>

        <motion.div
          className={"h-screen w-screen flex justify-center items-center"}
          initial={{scale: 0, opacity: 0}}
          whileInView={{scale: 1, opacity: 1}}
          viewport={{once: true}}
        >
          <img
            className={"h-[60vw] w-[60vw] max-h-[512px] max-w-[512px] rounded-[16px] overflow-hidden"}
            src={FirstImage}
            alt={""}
          />
        </motion.div>

        <motion.div
          className={"h-screen w-screen text-[16px] lg:text-[32px] select-none flex justify-center items-center"}
          initial={{opacity: 0, scale: 0.5}}
          whileInView={{opacity: 1, scale: 1}}
        >
          我们可不是为了成为别人的陪衬而来到这里
        </motion.div>
        <motion.div
          className={"h-screen w-screen flex justify-center items-center"}
          initial={{scale: 0, opacity: 0}}
          whileInView={{scale: 1, opacity: 1}}
          viewport={{once: true}}
        >
          <img
            className={"h-[60vw] w-[60vw] max-h-[512px] max-w-[512px] rounded-[16px] overflow-hidden"}
            src={SecondImage}
            alt={""}
          />
        </motion.div>
      </motion.div>
    </div>
  );
}

export default Third;