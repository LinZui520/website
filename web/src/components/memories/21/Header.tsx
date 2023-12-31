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
  const windowHeight = window.innerHeight;


  useMotionValueEvent(scrollYProgress, "change", (latest) => {
    setScale(1 + 3 * latest)
  })

  return (
    <div ref={ref} className={"h-[200vh] w-screen flex flex-col items-center overflow-clip"}>
      <div className={"h-[47vh] w-screen"}/>
      <div
        className={
          "h-[50vh] w-[90vw] max-w-[1024px] text-[16px] lg:text-[32px] " +
          "sticky top-[47vh] select-none flex flex-row justify-evenly"
        }
      >
        <div>
          <motion.div
            initial={{scale: 1, x: 0}}
            animate={{scale: scale, x: (1 - scale) * windowWidth / 3}}
          >高三21班
          </motion.div>
        </div>

        <div>
          <motion.div
            initial={{scale: 1, y: 0}}
            animate={{scale: scale, y: (1 - scale) * windowHeight / 3}}
          >SixtySeven
          </motion.div>
        </div>

        <div>
          <motion.div
            initial={{scale: 1, x: 0}}
            animate={{scale: scale, x: (scale - 1) * windowWidth / 3}}
          >独家记忆
          </motion.div>
        </div>
      </div>
      <div className={"h-[3vh] w-screen"}/>
      <motion.div
        className={
          "h-screen w-screen select-none text-[16px] lg:text-[32px] " +
          "flex flex-col justify-center items-center"
        }
        initial={{scale: 0.5}}
        whileInView={{scale: scale / 7 * 2}}
      >
        海内存知己 天涯若比邻
      </motion.div>
    </div>
  );
}

export default Header;