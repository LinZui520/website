import {motion, useMotionValueEvent, useScroll} from "framer-motion";
import {useRef, useState} from "react";


const Second = () => {

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
          "h-[50vh] w-[90vw] max-w-[1024px] text-[32px] " +
          "sticky top-[50vh] select-none flex flex-row justify-between"
        }
      >
        <div>
          <motion.div
            initial={{scale: 1, x: 0}}
            animate={{scale: scale, x: (1 - scale) * windowWidth / 2}}
          >我们离高考越来越近，
          </motion.div>
        </div>

        <div>
          <motion.div
            initial={{scale: 1, x: 0}}
            animate={{scale: scale, x: (scale - 1) * windowWidth / 2}}
          >近到可以听到他的心跳。
          </motion.div>
        </div>

      </div>

      <motion.div
        className={"h-screen w-screen flex justify-center items-center"}
        initial={{scale: 0, opacity: 0}}
        whileInView={{scale: 1, opacity: 1}}
        viewport={{once: true}}
      >
        <img
          className={"h-[80vw] w-[80vw] max-h-[516px] max-w-[516px] rounded-[16px] overflow-hidden"}
          src={process.env.PUBLIC_URL + "/memories/21/Screenshot_20240105_233337.png"}
          alt={""}
        />
      </motion.div>
    </div>
  );
}

export default Second;