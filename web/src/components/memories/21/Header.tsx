import {motion, useMotionValueEvent, useScroll} from "framer-motion";
import {useRef, useState} from "react";


const Header = () => {

  const ref = useRef(null)
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end end"]
  })

  const [scale, setScale] = useState(1)


  useMotionValueEvent(scrollYProgress, "change", (latest) => {
    setScale(1 + 3 * latest)
  })

  return (
    <div ref={ref} className={"h-[200vh] w-screen flex flex-col items-center overflow-clip"}>
      <div
        className={"h-screen w-[90vw] max-w-[1024px] text-[32px] mb-[20vh] sticky top-[30vh] select-none flex flex-col"}
      >
        <motion.div
          className={"self-start"}
          initial={{scale: 1, x: 0}}
          animate={{scale: scale, x: (1-scale) * 256}}
        >高三21班</motion.div>
        <motion.div
          className={"self-end"}
          initial={{scale: 1}}
          animate={{scale: scale}}
        >独家记忆</motion.div>
      </div>
    </div>
  );
}

export default Header;