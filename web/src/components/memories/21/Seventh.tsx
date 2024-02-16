import React, {useRef, useState} from "react";
import {motion, useMotionValueEvent, useScroll} from "framer-motion";
import FirstImage from "../../../assets/image/memories/21/2024-02-15-16-12-55.png";
import SecondImage from "../../../assets/image/memories/21/2024-02-15-16-13-55.png";
import ThirdImage from "../../../assets/image/memories/21/2024-02-15-16-14-55.png";
import FourthImage from "../../../assets/image/memories/21/2024-02-15-16-15-55.png";
import FifthImage from "../../../assets/image/memories/21/2024-02-15-16-16-55.png";
import SixthImage from "../../../assets/image/memories/21/2024-02-15-16-17-55.png";
import SeventhImage from "../../../assets/image/memories/21/2024-02-15-18-12-55.png";
import EighthImage from "../../../assets/image/memories/21/2024-02-15-16-19-55.png";
import NinthImage from "../../../assets/image/memories/21/2024-02-15-16-20-55.png"

const Seventh = () => {

  const ref = useRef(null)
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end end"]
  })

  const windowWidth = window.innerWidth;
  const windowHeight = window.innerHeight;
  const [value, setValue] = useState(0)

  useMotionValueEvent(scrollYProgress, "change", (latest) => {
    setValue(latest)
  })

  return (
    <div ref={ref} className={"w-screen h-[1000vh]"} >
      <div className={"h-screen w-screen flex flex-row justify-evenly items-center sticky top-0 bottom-0 overflow-hidden"}>
        <motion.img
          className={"h-[30vw] w-[30vw] max-h-[600px] max-w-[600px] rounded-[16px] overflow-hidden"}
          src={FirstImage} alt={""}
          animate={{
            opacity: 9 * (1 / 9 - value),
            scale: 9 * (1 / 9 - value),
            y: windowHeight * 9 * value + 'px'
          }}
          transition={{ease: "easeOut", duration: 0.618}}
        />

        <motion.span 
          animate={{
            opacity: 9 * (1 / 9 - value),
            scale: 9 * (1 / 9 - value),
            y: -9 * value * windowHeight + 'px'
          }}
          transition={{ease: "easeOut", duration: 0.618}}
          className={"text-[16px] lg:text-[32px] max-w-[30vw] select-none overflow-hidden"}>
        有时候，挺无奈的，挺惆怅的……这图片是不是可以代表我们的心情？
        </motion.span>
      </div>

      <div className="h-screen w-screen flex flex-row justify-evenly items-center sticky top-0 bottom-0 overflow-hidden">
        <motion.img 
          className={"h-[30vw] w-[30vw] max-h-[309px] max-w-[500px] rounded-[16px] overflow-hidden"}
          src={SecondImage} alt={""}
          animate={{
            opacity: 9 * value,
            y: (9 * value - 1) * windowHeight + 'px'
          }}
          transition={{ease: "easeOut", duration: 0.618}}
        />

        <motion.span 
          animate={{
              opacity: 9 * value,
             y: -(9 * value - 1) * windowHeight + 'px'
            }}
            transition={{ease: "easeOut", duration: 0.618}}
            className={"text-[16px] lg:text-[32px] max-w-[30vw] select-none overflow-hidden"}>
        贺阳明同学说：“错的不是我，而是整个世界。”怪默写喽！注：此图不是他的杰作
        </motion.span>
      </div>

      <div className="w-screen h-screen" >3</div>
      <div className="w-screen h-screen" >4</div>
      <div className="w-screen h-screen" >5</div>
      <div className="w-screen h-screen" >6</div>
      <div className="w-screen h-screen" >7</div>
      <div className="w-screen h-screen" >8</div>
      <div className="w-screen h-screen" >9</div>
      <div className="w-screen h-screen" >10</div>
    
    </div>
  );
}

export default React.memo(Seventh);