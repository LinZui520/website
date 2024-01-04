import {motion, useMotionValueEvent, useScroll} from "framer-motion";
import {useRef, useState} from "react";

const Main = () => {

  const ref = useRef(null)
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end end"]
  })
  const [value, setValue] = useState(0)

  useMotionValueEvent(scrollYProgress, "change", (latest) => {
    setValue(latest * window.innerWidth * 2)
  })


  return (
    <div ref={ref} className={"h-[300vh] w-screen overflow-clip"}>
      <motion.div
        className={"h-screen w-[300vw] sticky top-0 flex flex-row"}
        animate={{
          x: -value + "px",
        }}
        transition={{ type: 'tween' }}
      >
        <motion.div
          className={"bg-amber-600 h-screen w-screen text-[32px] flex justify-center items-center"}
          initial={{opacity: 0}}
          whileInView={{opacity: 1}}
          transition={{duration: 1,type: 'tween'}}
        >
          这里记录了67个人故事
        </motion.div>

        <motion.div
          className={"bg-amber-200 h-screen w-screen text-[32px] flex justify-center items-center"}
          initial={{opacity: 0}}
          whileInView={{opacity: 1}}
          transition={{duration: 1,type: 'tween'}}
        >
          一切从这张座位表说起
        </motion.div>

        <div className={"bg-amber-400 h-screen w-screen"} >

          <img src={""} alt={""} />
        </div>
      </motion.div>
    </div>
  );
}

export default Main;