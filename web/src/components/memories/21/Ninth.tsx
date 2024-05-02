import React, {useRef, useState} from "react";
import FirstImage from "../../../assets/image/memories/21/2024-05-2-20-12-16.png";
import SeconedImage from "../../../assets/image/memories/21/2024-05-2-20-13-16.png";
import ThirdImage from "../../../assets/image/memories/21/2024-05-2-20-14-16.png";
import FourthImage from "../../../assets/image/memories/21/2024-05-2-20-15-16.png";
import FifthImage from "../../../assets/image/memories/21/2024-05-2-20-16-16.png";
import SixthImage from "../../../assets/image/memories/21/2024-05-2-20-17-16.png";
import SeventhImage from "../../../assets/image/memories/21/2024-05-2-20-18-16.png";
import EighthImage from "../../../assets/image/memories/21/2024-05-2-20-19-16.png";
import NinthImage from  "../../../assets/image/memories/21/2024-05-2-20-20-16.png";
import {motion, useMotionValueEvent, useScroll} from "framer-motion";


const Ninth = () => {

  const ref = useRef(null)
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end end"]
  })

  //const windowWidth = window.innerWidth;
  const windowHeight = window.innerHeight;
  const [value, setValue] = useState(0)

  useMotionValueEvent(scrollYProgress, "change", (latest: number)=> {
    setValue(latest)
  })

  return (
    <div ref={ref} className={"w-screen h-[800vh]"} >
      <div className={"h-screen w-screen flex flex-row justify-evenly items-center sticky top-0 bottom-0 overflow-hidden"}>
        <motion.img
          className={"h-[40vw] w-[30vw] max-h-[800px] max-w-[600px] rounded-[16px] overflow-hidden"}
          src={FirstImage} alt={""}
          animate={{
            opacity: 7 * (1 /7 - value),
            scale: 7 *(1 /7 - value),
            y: 1.5 * windowHeight * 7 * value  + 'px'
          }}
          transition={{ease: "easeOut", duration: 0.618}}
        />

        <motion.span 
          animate={{
            opacity: 7 * (1 /7 - value),
            scale: 7 *(1 /7 - value),
            y: -7 * value  * windowHeight + 'px'
          }}
          transition={{ease: "easeOut", duration: 0.618}}
          className={"text-[16px] lg:text-[32px] max-w-[30vw] select-none overflow-hidden"}
        >
          叉腰的那位，你在学化学老师吗？
        </motion.span>
      </div>

      <div className="h-screen w-screen flex flex-row justify-evenly items-center sticky top-0 bottom-0 overflow-hidden">
        <motion.img 
          className={"h-[40vw] w-[30vw] max-h-[800px] max-w-[600px] rounded-[16px] overflow-hidden"}
          src={SeconedImage} alt={""}
          animate={{
            opacity: 7 * value,
            scale: 7 * value ,
            y: (7 * value - 1) * 1.5 * windowHeight + 'px'
          }}
          transition={{ease: "easeOut", duration: 0.618}}
        />

        <motion.span 
          animate={{
              opacity: 7 * value,
              scale: 7 * value ,
             y: -(7 * value - 1) * windowHeight + 'px'
            }}
            transition={{ease: "easeOut", duration: 0.618}}
            className={"text-[16px] lg:text-[32px] max-w-[30vw] select-none overflow-hidden"}
        >
          班主任说:“我更在意你的学习态度”,“贺阳明,把那些fou(浮)躁的人的名单给我”。
        </motion.span>
      </div>

      <div className="h-screen w-screen flex flex-row justify-evenly items-center sticky top-0 bottom-0 overflow-hidden">
        <motion.img 
          className={"h-[40vw] w-[30vw] max-h-[800px] max-w-[600px] rounded-[16px] overflow-hidden"}
          src={ThirdImage} alt={""}
          animate={{
            opacity: 7 * value -1,
            scale: 7 * value  -1,
            y: (7 * value  - 2) * 1.5 * windowHeight + 'px'
          }}
          transition={{ease: "easeOut", duration: 0.618}}
        />

        <motion.span 
          animate={{
            opacity: 7 * value -1,
            scale: 7 * value  -1,
            y: -(7 * value  - 2) * windowHeight + 'px'
          }}
          transition={{ease: "easeOut", duration: 0.618}}
          className={"text-[16px] lg:text-[32px] max-w-[30vw] select-none overflow-hidden"}
        >
          看看帅哥们——
        </motion.span>
      </div>

      <div className="h-screen w-screen flex flex-row justify-evenly items-center sticky top-0 bottom-0 overflow-hidden">
        <motion.img 
          className={"h-[40vw] w-[30vw] max-h-[800px] max-w-[600px] rounded-[16px] overflow-hidden"}
          src={FourthImage} alt={""}
          animate={{
            opacity: 7 * value -2,
            scale: 7 * value  -2,
            y: (7 * value  - 3) * 1.5 * windowHeight + 'px'
          }}
          transition={{ease: "easeOut", duration: 0.618}}
        />

        <motion.img 
          className={"h-[40vw] w-[30vw] max-h-[800px] max-w-[600px] rounded-[16px] overflow-hidden"}
          src={FifthImage} alt={""}
          animate={{
            opacity: 7 * value -2,
            scale: 7 * value  -2,
            y: -(7 * value  - 3) * 1.5 * windowHeight + 'px'
          }}
          transition={{ease: "easeOut", duration: 0.618}}
        />  
      </div>

      <div className="h-screen w-screen flex flex-row justify-evenly items-center sticky top-0 bottom-0 overflow-hidden">
        <motion.img 
          className={"h-[40vw] w-[30vw] max-h-[800px] max-w-[600px] rounded-[16px] overflow-hidden"}
          src={SixthImage} alt={""}
          animate={{
            opacity: 7 * value -3,
            scale: 7 * value  -3,
            y: (7 * value  - 4) * 1.5 * windowHeight + 'px'
          }}
          transition={{ease: "easeOut", duration: 0.618}}
        />

        <motion.span 
          animate={{
            opacity: 7 * value -3,
            scale: 7 * value  -3,
            y: -(7 * value  - 4) * windowHeight + 'px'
          }}
          transition={{ease: "easeOut", duration: 0.618}}
          className={"text-[16px] lg:text-[32px] max-w-[30vw] select-none overflow-hidden"}
        >
          王彬说怎么能少了我呢？“你们变强只是无限接近我。”
        </motion.span>
      </div>

      <div className="h-screen w-screen flex flex-row justify-evenly items-center sticky top-0 bottom-0 overflow-hidden">
        <motion.img 
          className={"h-[40vw] w-[30vw] max-h-[800px] max-w-[600px] rounded-[16px] overflow-hidden"}
          src={SeventhImage} alt={""}
          animate={{
            opacity: 7 * value -4,
            scale: 7 * value  -4,
            y: (7 * value  - 5) * 1.5 * windowHeight + 'px'
          }}
          transition={{ease: "easeOut", duration: 0.618}}
        />
      </div>

      <div className="h-screen w-screen flex flex-row justify-evenly items-center sticky top-0 bottom-0 overflow-hidden">
        <motion.img 
          className={"h-[36vw] w-[48vw] max-h-[600px] max-w-[800px] rounded-[16px] overflow-hidden"}
          src={EighthImage} alt={""}
          animate={{
            opacity: 7 * value -5,
            scale: 7 * value  -5,
            y: (7 * value  - 6) * 1.5 * windowHeight + 'px'
          }}
          transition={{ease: "easeOut", duration: 0.618}}
        />
      </div>

      <div className="h-screen w-screen flex flex-row justify-evenly items-center sticky top-0 bottom-0 overflow-hidden">
        <motion.img 
          className={"h-[36vw] w-[48vw] max-h-[600px] max-w-[800px] rounded-[16px] overflow-hidden"}
          src={NinthImage} alt={""}
          animate={{
            opacity: 7 * value -6,
            scale: 7 * value  -6,
            y: (7 * value  - 7) * 1.5 * windowHeight + 'px'
          }}
          transition={{ease: "easeOut", duration: 0.618}}
        />
      </div>


    </div>
  );
}

export default React.memo(Ninth);