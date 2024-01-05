import {motion, useMotionValueEvent, useScroll} from "framer-motion";
import {useRef, useState} from "react";


const Header = () => {

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
      <div
        className={
          "h-[50vh] w-[90vw] max-w-[1024px] text-[32px] " +
          "sticky top-[40vh] select-none flex flex-col"
        }
      >
        <motion.div
          className={"self-start ml-[10vw]"}
          initial={{scale: 1, x: 0}}
          animate={{scale: scale, x: (1 - scale) * windowWidth / 3}}
        >高三21班</motion.div>
        <motion.div
          className={"self-end mr-[10vw]"}
          initial={{scale: 1, x: 0}}
          animate={{scale: scale, x: (scale - 1) * windowWidth / 3}}
        >独家记忆</motion.div>
      </div>
      <div className={"h-[50vh] w-screen"} />
      <motion.div
        className={"h-screen w-screen flex flex-col justify-center items-center text-[32px]"}
        initial={{scale: 1}}
        whileInView={{scale: scale / 4}}
      >
        海内存知己 天涯若比邻
      </motion.div>
    </div>
  );
}

export default Header;