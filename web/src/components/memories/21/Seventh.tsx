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
            y: 1.5 * windowHeight * 9 * value + 'px'
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
          className={"text-[16px] lg:text-[32px] max-w-[30vw] select-none overflow-hidden"}
        >
          有时候，挺无奈的，挺惆怅的……这图片是不是可以代表我们的心情？
        </motion.span>
      </div>

      <div className="h-screen w-screen flex flex-row justify-evenly items-center sticky top-0 bottom-0 overflow-hidden">
        <motion.img 
          className={"h-[30vw] w-[30vw] max-h-[309px] max-w-[500px] rounded-[16px] overflow-hidden"}
          src={SecondImage} alt={""}
          animate={{
            opacity: 9 * value,
            scale: 9 * value,
            y: (9 * value - 1) * 1.5 * windowHeight + 'px'
          }}
          transition={{ease: "easeOut", duration: 0.618}}
        />

        <motion.span 
          animate={{
              opacity: 9 * value,
              scale: 9 * value,
             y: -(9 * value - 1) * windowHeight + 'px'
            }}
            transition={{ease: "easeOut", duration: 0.618}}
            className={"text-[16px] lg:text-[32px] max-w-[30vw] select-none overflow-hidden"}
        >
          贺阳明同学说：“错的不是我，而是整个世界。”怪默写喽！注：此图不是他的杰作
        </motion.span>
      </div>

      <div className="h-screen w-screen flex flex-row justify-evenly items-center sticky top-0 bottom-0 overflow-hidden">
        <motion.img 
          className={"h-[30vw] w-[30vw] max-h-[400px] max-w-[400px] rounded-[16px] overflow-hidden"}
          src={ThirdImage} alt={""}
          animate={{
            opacity: 9 * value -1,
            scale: 9 * value -1,
            y: (9 * value - 2) * 1.5 * windowHeight + 'px'
          }}
          transition={{ease: "easeOut", duration: 0.618}}
        />

        <motion.span 
          animate={{
            opacity: 9 * value -1,
            scale: 9 * value -1,
            y: -(9 * value - 2) * windowHeight + 'px'
          }}
          transition={{ease: "easeOut", duration: 0.618}}
          className={"text-[16px] lg:text-[32px] max-w-[30vw] select-none overflow-hidden"}
        >
          难兄难弟
        </motion.span>
      </div>

      <div className="h-screen w-screen flex flex-row justify-evenly items-center sticky top-0 bottom-0 overflow-hidden">
        <motion.img 
          className={"h-[30vw] w-[30vw] max-h-[309px] max-w-[500px] rounded-[16px] overflow-hidden"}
          src={FourthImage} alt={""}
          animate={{
            opacity: 9 * value -2,
            scale: 9 * value -2,
            y: (9 * value - 3) * 1.5 * windowHeight + 'px'
          }}
          transition={{ease: "easeOut", duration: 0.618}}
        />

        <motion.span 
          animate={{
            opacity: 9 * value -2,
            scale: 9 * value -2,
            y: -(9 * value - 3) * windowHeight + 'px'
          }}
          transition={{ease: "easeOut", duration: 0.618}}
          className={"text-[16px] lg:text-[32px] max-w-[30vw] select-none overflow-hidden"}
        >
          感觉孤单
        </motion.span>
      </div>
      <div className="h-screen w-screen flex flex-row justify-evenly items-center sticky top-0 bottom-0 overflow-hidden">
        <motion.img 
          className={"h-[30vw] w-[30vw] max-h-[540px] max-w-[540px] rounded-[16px] overflow-hidden"}
          src={FifthImage} alt={""}
          animate={{
            opacity: 9 * value -3,
            scale: 9 * value -3,
            y: (9 * value - 4) * 1.5 * windowHeight + 'px'
          }}
          transition={{ease: "easeOut", duration: 0.618}}
        />

        <motion.span 
          animate={{
            opacity: 9 * value -3,
            scale: 9 * value -3,
            y: -(9 * value - 4) * windowHeight + 'px'
          }}
          transition={{ease: "easeOut", duration: 0.618}}
          className={"text-[16px] lg:text-[32px] max-w-[30vw] select-none overflow-hidden"}
        >
          快来找错别字！
        </motion.span>
      </div>

      <div className="h-screen w-screen flex flex-row justify-evenly items-center sticky top-0 bottom-0 overflow-hidden">
        <motion.img 
          className={"h-[30vw] w-[30vw] max-h-[720px] max-w-[720px] rounded-[16px] overflow-hidden"}
          src={SixthImage} alt={""}
          animate={{
            opacity: 9 * value -4,
            scale: 9 * value -4,
            y: (9 * value - 5) * 1.5 * windowHeight + 'px'
          }}
          transition={{ease: "easeOut", duration: 0.618}}
        />
      </div>

      <div className="h-screen w-screen flex flex-row justify-evenly items-center sticky top-0 bottom-0 overflow-hidden">
        <motion.img 
          className={"h-[30vw] w-[30vw] max-h-[750px] max-w-[1000px] rounded-[16px] overflow-hidden"}
          src={SeventhImage} alt={""}
          animate={{
            opacity: 9 * value -5,
            scale: 9 * value -5,
            y: (9 * value - 6) * 1.5 * windowHeight + 'px'
          }}
          transition={{ease: "easeOut", duration: 0.618}}
        />
      </div>

      <div className="h-screen w-screen flex flex-row justify-evenly items-center sticky top-0 bottom-0 overflow-hidden">
        <motion.img 
          className={"h-[30vw] w-[30vw] max-h-[309px] max-w-[500px] rounded-[16px] overflow-hidden"}
          src={EighthImage} alt={""}
          animate={{
            opacity: 9 * value -6,
            scale: 9 * value -6,
            y: (9 * value - 7) * 1.5 * windowHeight + 'px'
          }}
          transition={{ease: "easeOut", duration: 0.618}}
        />

        <motion.span 
          animate={{
            opacity: 9 * value -6,
            scale: 9 * value -6,
            y: -(9 * value - 7) * windowHeight + 'px'
          }}
          transition={{ease: "easeOut", duration: 0.618}}
          className={"text-[16px] lg:text-[32px] max-w-[30vw] select-none overflow-hidden"}
        >
          李明志同学，出镜率特别高，不信，你们看！
        </motion.span>
      </div>

      <div className="h-screen w-screen flex flex-row justify-evenly items-center sticky top-0 bottom-0 overflow-hidden">
        <motion.img 
          className={"h-[30vw] w-[30vw] max-h-[300px] max-w-[480px] rounded-[16px] overflow-hidden"}
          src={NinthImage} alt={""}
          animate={{
            opacity: 9 * value -7,
            scale: 9 * value -7,
            y: (9 * value - 8) * 1.5 * windowHeight + 'px'
          }}
          transition={{ease: "easeOut", duration: 0.618}}
        />

        <motion.span 
          animate={{
            opacity: 9 * value -7,
            scale: 9 * value -7,
            y: -(9 * value - 8) * windowHeight + 'px'
          }}
          transition={{ease: "easeOut", duration: 0.618}}
          className={"text-[16px] lg:text-[32px] max-w-[30vw] select-none overflow-hidden"}
        >
          评人家的作文
        </motion.span>
      </div>

      <div className="h-screen w-screen flex flex-row justify-evenly items-center sticky top-0 bottom-0 overflow-hidden">
        <motion.img 
          className={"h-[30vw] w-[30vw] max-h-[600px] max-w-[800px] rounded-[16px] overflow-hidden"}
          src={TenthImage} alt={""}
          animate={{
            opacity: 9 * value -8,
            scale: 9 * value -8,
            y: (9 * value - 9) * 1.5 * windowHeight + 'px'
          }}
          transition={{ease: "easeOut", duration: 0.618}}
        />

        <motion.span 
          animate={{
            opacity: 9 * value -8,
            scale: 9 * value -8,
            y: -(9 * value - 9) * windowHeight + 'px'
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