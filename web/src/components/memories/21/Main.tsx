import {motion, useMotionValueEvent, useScroll} from "framer-motion";
import {useRef, useState} from "react";
import Image from '../../../assets/image/Screenshot_20231230_213346.png'

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
        transition={{type: 'tween'}}
      >
        <motion.div
          className={"h-screen w-screen text-[32px] flex justify-center items-center"}
          initial={{opacity: 0, scale: 0.5}}
          whileInView={{opacity: 1, scale: 1}}
        >
          一切从这张座位表说起
        </motion.div>

        <div className={"h-screen w-screen flex justify-center items-center"}>
          <img
            className={"h-[40vw] w-[80vw] max-h-[356px] max-w-[712px] rounded-[16px] overflow-hidden"}
            src={Image}
            alt={""}
          />
        </div>

        <div className={"h-screen w-screen"}>

          <img src={""} alt={""}/>
        </div>
      </motion.div>
    </div>
  );
}

export default Main;