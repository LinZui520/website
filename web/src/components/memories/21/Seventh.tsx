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
      <div className={"h-screen w-screen flex flex-col justify-center items-center sticky top-0 bottom-0 overflow-hidden" }>
        <motion.img
          className="h-[60vw] w-[60vw] max-h-[300px] max-w-[300px] rounded-[16px] overflow-hidden"
          src={FirstImage} alt={""}
          animate={{
            opacity: 9 * (1 / 9 - value),
            scale: 9 * (1 / 9 - value),
            x: -9 * value * windowWidth + 'px'
          }}
          transition={{ease: "easeOut", duration: 0.618}}
        />
      </div>
      
      <div className="w-screen h-screen" >2</div>
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