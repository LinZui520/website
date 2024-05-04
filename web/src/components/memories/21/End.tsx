import React, { useRef, useState ,memo } from "react";
import {motion, useMotionValueEvent, useScroll} from "framer-motion";
import FirstImage from "../../../assets/image/memories/21/2024-05-3-13-33-02.png";
import SecondImage from "../../../assets/image/memories/21/2024-05-3-13-34-02.png";
import ThirdImage from "../../../assets/image/memories/21/2024-05-3-13-35-02.png";
import FourthImage from "../../../assets/image/memories/21/2024-05-3-13-36-02.png";
import FifthImage from "../../../assets/image/memories/21/2024-05-3-13-37-02.png";
import SixthImage from "../../../assets/image/memories/21/2024-05-3-13-38-02.png";
import SeventhImage from "../../../assets/image/memories/21/2024-05-3-13-39-02.png";
import EighthImage from "../../../assets/image/memories/21/2024-05-3-13-40-02.png";
import NinthImage from "../../../assets/image/memories/21/2024-05-3-13-41-02.png";


const End = () =>{

    const ref = useRef(null)
    const { scrollYProgress } = useScroll({
      target: ref,
      offset: ["start start", "end end"]
    })
  
    const windowWidth = window.innerWidth;
    const windowHeight = window.innerHeight;
    const [value, setValue] = useState(0)
  
    useMotionValueEvent(scrollYProgress, "change", (latest: number)=> {
      setValue(Math.ceil(latest * 8))
    })

    
    return(
      <div ref={ref} className={"w-screen h-[900vh]"} >
        <div className={"h-screen w-screen flex flex-col justify-evenly items-center sticky top-0 bottom-0 overflow-hidden"}>
          <motion.span
            animate={{
              opacity:-100 * value * value + 1,
              y:-2 * windowHeight * Math.sin(Math.PI / 2 * value),
            }}
            transition={{ease: "easeOut", duration: 0.618}}
            className={"text-[#ff3434] text-[16px] lg:text-[32px] max-w-[52vw] select-none overflow-hidden"}
          >
            老师同你们一起走过高中岁月，人生旅途漫漫，虽然每个人都只能陪你走一段岁月，但点点滴滴便汇聚成了记忆的海洋。
          </motion.span>

          <motion.span
            animate={{
              opacity:-100 * value * value + 1,
              x:-2 * windowWidth * Math.sin(Math.PI / 2 * value),
              y:-2 * windowHeight * Math.sin(Math.PI / 2 * value ),
            }}
            transition={{ease: "easeOut", duration: 0.618}}
            className={"text-[#000000] text-[16px] lg:text-[32px] max-w-[52vw] select-none overflow-hidden"}
          >
            班主任:1.大家学会做人啊！ 2.努什么样的力，结什么样的因。
          </motion.span>

          <motion.span
            animate={{
              opacity:-100 * value * value + 1,
              x:2 * windowWidth * Math.sin(Math.PI / 2 * value),
              y:-2 * windowHeight * Math.sin(Math.PI / 2 * value ),
            }}
            transition={{ease: "easeOut", duration: 0.618}}
            className={"text-[#0d1dff] text-[16px] lg:text-[32px] max-w-[52vw] select-none overflow-hidden "}
          >
            数学老师:1.朱昊活过来了吧?2.重点班要有重点班学生的模样。
          </motion.span>

          <motion.span
            animate={{
              opacity:-100 * value * value + 1,
              x:-2 * windowWidth * Math.sin(Math.PI / 2 * value),
            }}
            transition={{ease: "easeOut", duration: 0.618}}
            className={"text-[#000000] text-[16px] lg:text-[32px] max-w-[52vw] select-none overflow-hidden "}
          >
            化学老师:1.生物教主在哪里？ 2.三个和尚没水喝。
          </motion.span>

          <motion.span
            animate={{
              opacity:-100 * value * value + 1,
              x:2 * windowWidth * Math.sin(Math.PI / 2 * value),
            }}
            transition={{ease: "easeOut", duration: 0.618}}
            className={"text-[#0d1dff] text-[16px] lg:text-[32px] max-w-[52vw] select-none overflow-hidden "}
          >
            英语老师:1.嘿嘿，开小差了。
                       2.朱昊，来一个，你笑得真好看。
          </motion.span>

          <motion.span
            animate={{
              opacity:-100 * value * value + 1,
              x:-2 * windowWidth * Math.sin(Math.PI / 2 * value),
              y:windowHeight * Math.sin(Math.PI / 2 * value ),
            }}
            transition={{ease: "easeOut", duration: 0.618}}
            className={"text-[#000000] text-[16px] lg:text-[32px] max-w-[52vw] select-none overflow-hidden "}
          >
            生物老师:1.首先把形式搞起来。2.学习不就是一个洗脑的过程？
          </motion.span>

          <motion.span
            animate={{
              opacity:-100 * value * value + 1,
              x:2 * windowWidth * Math.sin(Math.PI / 2 * value),
              y:windowHeight * Math.sin(Math.PI / 2 * value ),
            }}
            transition={{ease: "easeOut", duration: 0.618}}
            className={"text-[#0d1dff] text-[16px] lg:text-[32px] max-w-[52vw] select-none overflow-hidden "}
          >
            语文老师:1.难道说我们古代的诗词他不香吗？ 2.康师傅，你来给我翻译一下。
          </motion.span>
        </div>


        <div className="h-screen w-screen flex flex-row justify-evenly items-center sticky top-0 bottom-0 overflow-hidden">
          <motion.img
            className={"h-[40vw] w-[30vw] max-h-[800px] max-w-[600px] rounded-[16px] overflow-hidden"}
            src={FirstImage} alt={""}
            animate={{
              opacity:-100 * (value - 1) * (value - 1) + 1,
              scale: 1,
              x:60 * value + 'px',
            }}
            transition={{ease: "easeOut", duration: 0.618}}
          />

          <motion.img
            className={"h-[40vw] w-[30vw] max-h-[1000px] max-w-[750px] rounded-[16px] overflow-hidden"}
            src={SecondImage} alt={""}
            animate={{
              opacity:-100 * (value - 1) * (value - 1) + 1,
              scale: 1,
              x:-60 * value + 'px'
            }}
            transition={{ease: "easeOut", duration: 0.618}}
          />
          
        </div>


        <div className="h-screen w-screen flex flex-raw justify-evenly items-center sticky top-0 bottom-0 overflow-hidden">
          <motion.img
            className={"h-[40vw] w-[60vw] max-h-[1000px] max-w-[750px] rounded-[16px] overflow-hidden"}
            src={ThirdImage} alt={""}
            animate={{
              opacity:-100 * (value - 2) * (value - 2) + 1,
              scale: (value - 1) * (value - 1),
            }}
            transition={{ease: "easeOut", duration: 0.618}}
          />
        </div>


        <div className="h-screen w-screen flex flex-raw justify-evenly items-center sticky top-0 bottom-0 overflow-hidden">
          <motion.img
            className={"h-[40vw] w-[30vw] max-h-[800px] max-w-[600px] rounded-[16px] overflow-hidden"}
            src={FourthImage} alt={""}
            animate={{
              opacity:-100 * (value - 3) * (value - 3) + 1,
              scale: 1,
              x:-(value - 2) * (value - 3) * windowWidth / 2 + 'px',
            }}
            transition={{ease: "easeOut", duration: 0.618}}
          />

          <motion.img
            className={"h-[40vw] w-[30vw] max-h-[1000px] max-w-[750px] rounded-[16px] overflow-hidden"}
            src={FifthImage} alt={""}
            animate={{
              opacity:-100 * (value - 3) * (value - 3) + 1,
              scale: 1,
              x:(value - 2) * (value - 3) * windowWidth / 2 + 'px',
            }}
            transition={{ease: "easeOut", duration: 0.618}}
          />
        </div>


        <div className="h-screen w-screen flex flex-raw justify-evenly items-center sticky top-0 bottom-0 overflow-hidden">
          <motion.img
            className={"h-[40vw] w-[30vw] max-h-[1000px] max-w-[750px] rounded-[16px] overflow-hidden"}
            src={SixthImage} alt={""}
            animate={{
              opacity:-100 * (value - 4) * (value - 4) + 1,
              scale: 1,
              y:-(value - 4) * windowWidth / 2 + 'px',
            }}
            transition={{ease: "easeOut", duration: 0.618}}
          />
        </div>


        <div className="h-screen w-screen flex flex-raw justify-evenly items-center sticky top-0 bottom-0 overflow-hidden">
          <motion.span
            animate={{
              opacity:-100 * (value - 5) * (value - 5) + 1,
              y:-windowHeight * Math.sin(Math.PI * (value -3) / 2) + 'px',
              x:-windowWidth * Math.abs(Math.sin(Math.PI * (value -3) / 2)) + 'px',
            }}
            transition={{ease: "easeOut", duration: 0.618}}
            className={"text-[#ff3434] text-[16px] lg:text-[32px] max-w-[40vw] select-none overflow-hidden"}
          >
          {'\u00A0'}{'\u00A0'}{'\u00A0'}{'\u00A0'}{'\u00A0'}{'\u00A0'}{'\u00A0'}{'\u00A0'}现在你携带着书和剑走向应试的辽远广阔之路，就像鲲鹏从北海展翅翱游到南海，又像凤凰飞向东升的太阳。
          </motion.span>
          
          <motion.img
            className={"h-[40vw] w-[30vw] max-h-[1000px] max-w-[750px] rounded-[16px] overflow-hidden"}
            src={SeventhImage} alt={""}
            animate={{
              opacity:-100 * (value - 5) * (value - 5) + 1,
              scale:(value - 4),
            }}
            transition={{ease: "easeOut", duration: 0.618}}
          />
        </div>


        <div className="h-screen w-screen flex flex-col justify-evenly items-center sticky top-0 bottom-0 overflow-hidden">
          <motion.img
            className={"h-[40vw] w-[60vw] max-h-[1000px] max-w-[750px] rounded-[16px] overflow-hidden"}
            src={EighthImage} alt={""}
            animate={{
              opacity:-100 * (value - 6) * (value - 6) + 1,
              scale:(value - 5),
            }}
            transition={{ease: "easeOut", duration: 0.618}}
          />
        </div>


        <div className="h-screen w-screen flex flex-col justify-end items-center sticky top-0 bottom-0 overflow-hidden">
          <motion.span
            animate={{
              opacity:-100 * (value - 7) * (value - 7) + 1,
              scale: (value - 6),
            }}
            transition={{ease: "easeOut", duration: 0.618}}
            className={"text-[#000000] text-[16px] lg:text-[32px] max-w-[64vw] mb-[15vh] select-none overflow-hidden"}
          >
          {'\u00A0'}{'\u00A0'}{'\u00A0'}{'\u00A0'}{'\u00A0'}{'\u00A0'}{'\u00A0'}{'\u00A0'}亲爱的同学们,你们所乘坐的2018—2021永不返程号列车即将到站,带上祝福,带上自信,走向高考,勇敢地奔赴你们的战场吧,一起上大学,不负遇见！心之所向,终将抵达。
          <br />
          {'\u00A0'}{'\u00A0'}{'\u00A0'}{'\u00A0'}{'\u00A0'}{'\u00A0'}{'\u00A0'}{'\u00A0'}盛夏即将来临，愿你们永远这样朝气蓬勃，未来无限精彩！
          </motion.span>

          <motion.img
            className={"w-[100vw] h-[35vh] md:w-[80vw] lg:w-[100vw] lg:h-[40vh] max-w-[100vw] rounded-[16px] flex flex-row justify-end items-center"}
            src={NinthImage} alt={""}
            animate={{
              opacity:-100 * (value - 7) * (value - 7) + 1,
              scale: (value - 6),
            }}
            transition={{ease: "easeOut", duration: 0.618}}
          />
        </div>


        <div className="h-screen w-screen flex flex-raw justify-evenly items-center sticky top-0 bottom-0 overflow-hidden">
          <motion.span
            animate={{
              opacity:-100 * (value - 8) * (value - 8) + 1,
            }}
            transition={{ease: "easeIn", duration: 5}}
            className={"text-[#000000] text-[16px] lg:text-[32px] max-w-[64vw] mb-[20vh] select-none overflow-hidden"}
          >
          长街漫漫终无故人游......
          </motion.span>
        </div>


      </div>
    );
}
export default React.memo(End);
