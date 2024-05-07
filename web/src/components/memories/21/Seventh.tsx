import React, {useRef, useState} from "react";
import {motion, useMotionValueEvent, useScroll} from "framer-motion";
import FirstImage from "../../../assets/image/memories/21/2024-02-15-16-12-55.png";
import SecondImage from "../../../assets/image/memories/21/2024-02-15-16-13-55.png";
import ThirdImage from "../../../assets/image/memories/21/2024-02-15-16-14-55.png";
import FourthImage from "../../../assets/image/memories/21/2024-02-15-16-15-55.png";
import FifthImage from "../../../assets/image/memories/21/2024-02-15-16-16-55.png";
import SixthImage from "../../../assets/image/memories/21/2024-02-15-16-17-55.png";
import SeventhImage from "../../../assets/image/memories/21/2024-02-15-16-18-55.png";
import EighthImage from "../../../assets/image/memories/21/2024-02-15-16-19-55.png";
import NinthImage from "../../../assets/image/memories/21/2024-02-15-16-20-55.png";
import TenthImage from "../../../assets/image/memories/21/2024-02-15-16-21-55.png"

const Seventh = () => {

  const ref = useRef(null)
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end end"]
  })

  //const windowWidth = window.innerWidth;
  const windowHeight = window.innerHeight;
  const [value, setValue] = useState(0)

  useMotionValueEvent(scrollYProgress, "change", (latest: number)=> {
    setValue(Math.ceil(latest * 9))
  })

  return (
    <div ref={ref} className={"w-screen h-[1000vh]"} >
      <div className={"h-screen w-screen flex flex-row justify-evenly items-center sticky top-0 bottom-0 overflow-hidden"}>
        <motion.img
          className={"h-[30vw] w-[30vw] max-h-[600px] max-w-[600px] rounded-[16px] overflow-hidden"}
          src={FirstImage} alt={""}
          animate={{
            opacity: -10 * value * value + 1,
            scale: value <= 0 ? 1 - value  * value : 1,
            y: windowHeight / 5 *  value + 'px'
          }}
          transition={{ease: "easeOut", duration: 0.618}}
        />

        <motion.span 
          animate={{
            opacity: -10 * value * value + 1,
            scale: value <= 0 ? 1 - value  * value : 1,
            y: -windowHeight / 5 *  value + 'px'
          }}
          transition={{ease: "easeOut", duration: 0.618}}
          className={"text-[16px] lg:text-[32px] max-w-[30vw] select-none overflow-hidden"}
        >
          有时候，挺无奈的，挺惆怅的……这图片是不是可以代表我们的心情？
        </motion.span>
      </div>

      <div className="h-screen w-screen flex flex-row justify-evenly items-center sticky top-0 bottom-0 overflow-hidden">
        <motion.img 
          className={"h-[30vw] w-[50vw] max-h-[309px] max-w-[500px] rounded-[16px] overflow-hidden"}
          src={SecondImage} alt={""}
          animate={{
            opacity: -10 * (value - 1) * (value - 1) + 1,
            scale: value <= 1 ? 1 - (value - 1) * (value - 1) : 1,
            y: windowHeight / 5 *  (value - 1) + 'px'
          }}
          transition={{ease: "easeOut", duration: 0.618}}
        />

        <motion.span 
          animate={{
            opacity: -10 * (value - 1) * (value - 1) + 1,
            scale: value <= 1 ? 1 - (value - 1) * (value - 1) : 1,
            y: -windowHeight / 5 *  (value - 1) + 'px'
          }}
          transition={{ease: "easeOut", duration: 0.618}}
          className={"text-[16px] lg:text-[32px] max-w-[30vw] select-none overflow-hidden"}
        >
          贺阳明同学说：“错的不是我，而是整个世界。”怪默写喽！注：此图不是他的杰作
        </motion.span>
      </div>

      <div className="h-screen w-screen flex flex-row justify-evenly items-center sticky top-0 bottom-0 overflow-hidden">
        <motion.img 
          className={"h-[40vw] w-[40vw] max-h-[400px] max-w-[400px] rounded-[16px] overflow-hidden"}
          src={ThirdImage} alt={""}
          animate={{
            opacity: -10 * (value - 2) * (value - 2) + 1,
            scale: value <= 2 ? 1 - (value - 2) * (value - 2) : 1,
            y: windowHeight / 5 *  (value - 2) + 'px'
          }}
          transition={{ease: "easeOut", duration: 0.618}}
        />

        <motion.span 
          animate={{
            opacity: -10 * (value - 2) * (value - 2) + 1,
            scale: value <= 2 ? 1 - (value - 2) * (value - 2) : 1,
            y: -windowHeight / 5 *  (value - 2) + 'px'
          }}
          transition={{ease: "easeOut", duration: 0.618}}
          className={"text-[16px] lg:text-[32px] max-w-[30vw] select-none overflow-hidden"}
        >
          难兄难弟
        </motion.span>
      </div>

      <div className="h-screen w-screen flex flex-row justify-evenly items-center sticky top-0 bottom-0 overflow-hidden">
        <motion.img 
          className={"h-[30vw] w-[50vw] max-h-[309px] max-w-[500px] rounded-[16px] overflow-hidden"}
          src={FourthImage} alt={""}
          animate={{
            opacity: -10 * (value - 3) * (value - 3) + 1,
            scale: value <= 3 ? 1 - (value - 3) * (value - 3) : 1,
            y: windowHeight / 5 *  (value - 3) + 'px'
          }}
          transition={{ease: "easeOut", duration: 0.618}}
        />

        <motion.span 
          animate={{
            opacity: -10 * (value - 3) * (value - 3) + 1,
            scale: value <= 3 ? 1 - (value - 3) * (value - 3) : 1,
            y: -windowHeight / 5 *  (value - 3) + 'px'
          }}
          transition={{ease: "easeOut", duration: 0.618}}
          className={"text-[16px] lg:text-[32px] max-w-[30vw] select-none overflow-hidden"}
        >
          感觉孤单
        </motion.span>
      </div>

      <div className="h-screen w-screen flex flex-row justify-evenly items-center sticky top-0 bottom-0 overflow-hidden">
        <motion.img 
          className={"h-[54vw] w-[54vw] max-h-[540px] max-w-[540px] rounded-[16px] overflow-hidden"}
          src={FifthImage} alt={""}
          animate={{
            opacity: -10 * (value - 4) * (value - 4) + 1,
            scale: value <= 4 ? 1 - (value - 4) * (value - 3) : 1,
            y: windowHeight / 5 *  (value - 4) + 'px'
          }}
          transition={{ease: "easeOut", duration: 0.618}}
        />

        <motion.span 
          animate={{
            opacity: -10 * (value - 4) * (value - 4) + 1,
            scale: value <= 4 ? 1 - (value - 4) * (value - 3) : 1,
            y: -windowHeight / 5 *  (value - 4) + 'px'
          }}
          transition={{ease: "easeOut", duration: 0.618}}
          className={"text-[16px] lg:text-[32px] max-w-[30vw] select-none overflow-hidden"}
        >
          快来找错别字！
        </motion.span>
      </div>

      <div className="h-screen w-screen flex flex-row justify-evenly items-center sticky top-0 bottom-0 overflow-hidden">
        <motion.img 
          className={"h-[36vw] w-[36vw] max-h-[720px] max-w-[720px] rounded-[16px] overflow-hidden"}
          src={SixthImage} alt={""}
          animate={{
            opacity: -10 * (value - 5) * (value - 5) + 1,
            scale: value <= 5 ? 1 - (value - 5) * (value - 5) : 1,
            y: windowHeight / 5 *  (value - 5) + 'px'
          }}
          transition={{ease: "easeOut", duration: 0.618}}
        />
      </div>

      <div className="h-screen w-screen flex flex-row justify-evenly items-center sticky top-0 bottom-0 overflow-hidden">
        <motion.img 
          className={"h-[45vw] w-[60vw] max-h-[750px] max-w-[1000px] rounded-[16px] overflow-hidden"}
          src={SeventhImage} alt={""}
          animate={{
            opacity: -10 * (value - 6) * (value - 6) + 1,
            scale: value <= 6 ? 1 - (value - 6) * (value - 6) : 1,
            y: windowHeight / 5 *  (value - 6) + 'px'
          }}
          transition={{ease: "easeOut", duration: 0.618}}
        />
      </div>

      <div className="h-screen w-screen flex flex-row justify-evenly items-center sticky top-0 bottom-0 overflow-hidden">
        <motion.img 
          className={"h-[30vw] w-[50vw] max-h-[309px] max-w-[500px] rounded-[16px] overflow-hidden"}
          src={EighthImage} alt={""}
          animate={{
            opacity: -10 * (value - 7) * (value - 7) + 1,
            scale: value <= 7 ? 1 - (value - 7) * (value - 7) : 1,
            y: windowHeight / 5 *  (value - 7) + 'px'
          }}
          transition={{ease: "easeOut", duration: 0.618}}
        />

        <motion.span 
          animate={{
            opacity: -10 * (value - 7) * (value - 7) + 1,
            scale: value <= 7 ? 1 - (value - 7) * (value - 7) : 1,
            y: -windowHeight / 5 *  (value - 7) + 'px'
          }}
          transition={{ease: "easeOut", duration: 0.618}}
          className={"text-[16px] lg:text-[32px] max-w-[30vw] select-none overflow-hidden"}
        >
          李明志同学，出镜率特别高，不信，你们看！
        </motion.span>
      </div>

      <div className="h-screen w-screen flex flex-row justify-evenly items-center sticky top-0 bottom-0 overflow-hidden">
        <motion.img 
          className={"h-[40vw] w-[64vw] max-h-[300px] max-w-[480px] rounded-[16px] overflow-hidden"}
          src={NinthImage} alt={""}
          animate={{
            opacity: -10 * (value - 8) * (value - 8) + 1,
            scale: value <= 8 ? 1 - (value - 8) * (value - 8) : 1,
            y: windowHeight / 5 *  (value - 8) + 'px'
          }}
          transition={{ease: "easeOut", duration: 0.618}}
        />

        <motion.span 
          animate={{
            opacity: -10 * (value - 8) * (value - 8) + 1,
            scale: value <= 8 ? 1 - (value - 8) * (value - 8) : 1,
            y: -windowHeight / 5 *  (value - 8) + 'px'
          }}
          transition={{ease: "easeOut", duration: 0.618}}
          className={"text-[16px] lg:text-[32px] max-w-[30vw] select-none overflow-hidden"}
        >
          评人家的作文
        </motion.span>
      </div>

      <div className="h-screen w-screen flex flex-row justify-evenly items-center sticky top-0 bottom-0 overflow-hidden">
        <motion.img 
          className={"h-[48vw] w-[64vw] max-h-[600px] max-w-[800px] rounded-[16px] overflow-hidden"}
          src={TenthImage} alt={""}
          animate={{
            opacity: -10 * (value - 9) * (value - 9) + 1,
            scale: value <= 9 ? 1 - (value - 9) * (value - 9) : 1,
            y: windowHeight / 5 *  (value - 9) + 'px'
          }}
          transition={{ease: "easeOut", duration: 0.618}}
        />

        <motion.span 
          animate={{
            opacity: -10 * (value - 9) * (value - 9) + 1,
            scale: value <= 9 ? 1 - (value - 9) * (value - 9) : 1,
            y: -windowHeight / 5 *  (value - 9) + 'px'
          }}
          transition={{ease: "easeOut", duration: 0.618}}
          className={"text-[16px] lg:text-[32px] max-w-[30vw] select-none overflow-hidden"}
        >
          被人家评作文
        </motion.span>
      </div>
    
    </div>
  );
}

export default React.memo(Seventh);