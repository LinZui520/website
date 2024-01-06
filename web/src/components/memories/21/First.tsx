import {motion, useMotionValueEvent, useScroll} from "framer-motion";
import {useRef, useState} from "react";

const First = () => {

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
          className={"h-screen w-screen text-[32px] select-none flex justify-center items-center"}
          initial={{opacity: 0, scale: 0.5}}
          whileInView={{opacity: 1, scale: 1}}
        >
          一切从这张座位表说起
        </motion.div>

        <motion.div
          className={"h-screen w-screen flex justify-center items-center"}
          initial={{scale: 0, opacity: 0}}
          whileInView={{scale: 1, opacity: 1}}
          viewport={{once: true}}
        >
          <img
            className={"h-[40vw] w-[80vw] max-h-[356px] max-w-[712px] rounded-[16px] overflow-hidden"}
            src={process.env.PUBLIC_URL + "/memories/21/Screenshot_20231230_213346.png"}
            alt={""}
          />
        </motion.div>

        <motion.div
          className={"h-screen w-screen text-[32px] select-none flex justify-center items-center"}
          initial={{opacity: 0, scale: 0.5}}
          whileInView={{opacity: 1, scale: 1}}
        >
          或从曾经的倒计时说起
        </motion.div>
        <motion.div
          className={"h-screen w-screen flex justify-center items-center"}
          initial={{scale: 0, opacity: 0}}
          whileInView={{scale: 1, opacity: 1}}
          viewport={{once: true}}
        >
          <img
            className={"h-[80vw] w-[50vw] max-h-[712px] max-w-[440px] rounded-[16px] overflow-hidden"}
            src={process.env.PUBLIC_URL + "/memories/21/Screenshot_20240105_201236.png"}
            alt={""}
          />
        </motion.div>
      </motion.div>
    </div>
  );
}

export default First;