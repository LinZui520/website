import React, {useRef, useState} from "react";
import FirstImage from "../../../assets/image/memories/21/2024-02-16-13-14-38.png";
import SecondImage from "../../../assets/image/memories/21/2024-02-16-13-15-38.png"
import ThirdImage from "../../../assets/image/memories/21/2024-02-16-13-16-38.png"
import FourthImage from "../../../assets/image/memories/21/2024-02-16-13-17-38.png"
import FifthImage from "../../../assets/image/memories/21/2024-02-16-13-18-38.png"
import SixthImage from "../../../assets/image/memories/21/2024-02-16-13-19-38.png"
import SeventhImage from "../../../assets/image/memories/21/2024-02-16-13-20-38.png"
import EighthImage from "../../../assets/image/memories/21/2024-02-16-13-21-38.png"
import NinthImage from "../../../assets/image/memories/21/2024-02-16-13-22-38.png"
import TenthImage from "../../../assets/image/memories/21/2024-02-16-13-23-38.png"
import {motion, useMotionValueEvent, useScroll} from "framer-motion";


const Eighth = () => {

  const ref = useRef(null)
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end end"]
  })

  const windowWidth = window.innerWidth;
  const windowHeight = window.innerHeight;
  const [value, setValue] = useState(0)

  useMotionValueEvent(scrollYProgress, "change", (latest: number) => setValue(latest))

  return (
    <div ref={ref} className={"w-screen h-[700vh]"}>
      <div
        className={"w-screen h-screen flex flex-row justify-evenly items-center sticky top-0 bottom-0 overflow-hidden"}>
        <motion.span
          animate={{
            x: value < 1 / 6 ? -windowWidth / 2 * 6 * value + 'px' : -windowWidth / 2,
            opacity: value < 1 / 6 ? 6 * (1 / 6 - value) : 0
          }}
          transition={{ease: "easeOut", duration: 0.618}}
          className={"text-[16px] lg:text-[32px] max-w-[31vw] select-none overflow-hidden"}
        >
          吃辣条，一个人。
        </motion.span>
        <motion.img
          className={"h-[50vw] w-[31vw] max-h-[500px] max-w-[309px] rounded-[16px] overflow-hidden"}
          src={FirstImage} alt={""}
          animate={{
            x: value < 1 / 6 ? windowWidth / 2 * 6 * value + 'px' : windowWidth / 2,
            opacity: value < 1 / 6 ? 6 * (1 / 6 - value) : 0
          }}
          transition={{ease: "easeOut", duration: 0.618}}
        />
      </div>

      <div
        className={"w-screen h-screen flex flex-col justify-center items-center sticky top-0 bottom-0 overflow-hidden"}>
        <motion.span
          animate={{
            scale: value > 1 / 6 ? 1 : 6 * value,
            opacity: value > 1 / 6 ? (value < 2 / 6 ? 6 * (2 / 6 - value) : 0) : 6 * value,
            y: value > 1 / 6 ? (value < 2 / 6 ? -windowHeight / 2 * 6 * (value - 1 / 6) : -windowHeight / 2) : 0
          }}
          transition={{ease: "easeOut", duration: 0.618}}
          className={"text-[16px] lg:text-[32px] max-w-[100vw] select-none mb-[5vw] overflow-hidden"}
        >
          那些找试卷的同学们
        </motion.span>

        <div className={"w-screen flex flex-row justify-evenly items-center overflow-hidden"}>
          <motion.img
            className={"h-[50vw] w-[31vw] max-h-[500px] max-w-[309px] rounded-[16px] overflow-hidden"}
            src={SecondImage} alt={""}
            animate={{
              scale: value > 1 / 6 ? 1 : 6 * value,
              opacity: value > 1 / 6 ? (value < 2 / 6 ? 6 * (2 / 6 - value) : 0) : 6 * value,
              x: value > 1 / 6 ? (value < 2 / 6 ? -windowWidth / 2 * 6 * (value - 1 / 6) : -windowWidth / 2) : 0
            }}
            transition={{ease: "easeOut", duration: 0.618}}
          />

          <motion.img
            className={"h-[50vw] w-[31vw] max-h-[500px] max-w-[309px] rounded-[16px] overflow-hidden"}
            src={ThirdImage} alt={""}
            animate={{
              scale: value > 1 / 6 ? 1 : 6 * value,
              opacity: value > 1 / 6 ? (value < 2 / 6 ? 6 * (2 / 6 - value) : 0) : 6 * value,
              x: value > 1 / 6 ? (value < 2 / 6 ? windowWidth / 2 * 6 * (value - 1 / 6) : windowWidth / 2) : 0
            }}
            transition={{ease: "easeOut", duration: 0.618}}
          />
        </div>
      </div>

      <div
        className={"w-screen h-screen flex flex-col justify-center items-center sticky top-0 bottom-0 overflow-hidden"}>
        <motion.span
          animate={{
            scale: value > 2 / 6 ? 1 : (value > 1 / 6 ? 6 * (value - 1 / 6) :0),
            opacity: value > 2 / 6 ? (value < 3 / 6 ? 6 * (3 / 6 - value) : 0) : (value > 1 / 6 ? 6 * (value - 1 / 6) :0),
            y: value > 2 / 6 ? (value < 3 / 6 ? -windowHeight / 2 * 6 * (value - 2 / 6) : -windowHeight / 2) : 0
          }}
          transition={{ease: "easeOut", duration: 0.618}}
          className={"text-[16px] lg:text-[32px] max-w-[90vw] select-none mb-[5vw] overflow-hidden"}
        >
          朱昊语录：我每天用8小时睡觉，人们却用努力来埋没我的天赋。
        </motion.span>

        <div className={"w-screen flex flex-row justify-evenly items-center overflow-hidden"}>
          <motion.img
            className={"h-[50vw] w-[31vw] max-h-[500px] max-w-[309px] rounded-[16px] overflow-hidden"}
            src={FourthImage} alt={""}
            animate={{
              scale: value > 2 / 6 ? 1 : (value > 1 / 6 ? 6 * (value - 1 / 6) :0),
              opacity: value > 2 / 6 ? (value < 3 / 6 ? 6 * (3 / 6 - value) : 0) : (value > 1 / 6 ? 6 * (value - 1 / 6) :0),
              x: value > 2 / 6 ? (value < 3 / 6 ? -windowWidth / 2 * 6 * (value - 2 / 6) : -windowWidth / 2) : 0
            }}
            transition={{ease: "easeOut", duration: 0.618}}
          />

          <motion.img
            className={"h-[50vw] w-[31vw] max-h-[500px] max-w-[309px] rounded-[16px] overflow-hidden"}
            src={FifthImage} alt={""}
            animate={{
              scale: value > 2 / 6 ? 1 : (value > 1 / 6 ? 6 * (value - 1 / 6) :0),
              opacity: value > 2 / 6 ? (value < 3 / 6 ? 6 * (3 / 6 - value) : 0) : (value > 1 / 6 ? 6 * (value - 1 / 6) :0),
              x: value > 2 / 6 ? (value < 3 / 6 ? windowWidth / 2 * 6 * (value - 2 / 6) : windowWidth / 2) : 0
            }}
            transition={{ease: "easeOut", duration: 0.618}}
          />
        </div>
      </div>

      <div
        className={"w-screen h-screen flex flex-row justify-evenly items-center sticky top-0 bottom-0 overflow-hidden"}>
        <motion.img
          className={"h-[50vw] w-[31vw] max-h-[500px] max-w-[309px] rounded-[16px] overflow-hidden"}
          src={SixthImage} alt={""}
          animate={{
            scale: value > 3 / 6 ? 1 : (value > 2 / 6 ? 6 * (value - 2 / 6) : 0),
            opacity: value > 3 / 6 ? (value < 4 / 6 ? 6 * (4 / 6 - value) : 0) : (value > 2 / 6 ? 6 * (value - 2 / 6) : 0),
            x: value > 3 / 6 ? (value < 4 / 6 ? -windowWidth / 2 * 6 * (value - 3 / 6) : -windowWidth / 2) : 0
          }}
          transition={{ease: "easeOut", duration: 0.618}}
        />

        <motion.span
          animate={{
            scale: value > 3 / 6 ? 1 : (value > 2 / 6 ? 6 * (value - 2 / 6) : 0),
            opacity: value > 3 / 6 ? (value < 4 / 6 ? 6 * (4 / 6 - value) : 0) : (value > 2 / 6 ? 6 * (value - 2 / 6) : 0),
            x: value > 3 / 6 ? (value < 4 / 6 ? windowWidth / 2 * 6 * (value - 3 / 6) : windowWidth / 2) : 0
          }}
          transition={{ease: "easeOut", duration: 0.618}}
          className={"text-[16px] lg:text-[32px] max-w-[31vw] select-none overflow-hidden"}
        >
          没有什么比找到试卷更令人开心的了，终于可以来个正脸了。
        </motion.span>
      </div>

      <div
        className={"w-screen h-screen flex flex-col justify-center items-center sticky top-0 bottom-0 overflow-hidden"}>
        <motion.span
          animate={{
            scale: value > 4 / 6 ? 1 : (value > 3 / 6 ? 6 * (value - 3 / 6) : 0),
            opacity: value > 4 / 6 ? (value < 5 / 6 ? 6 * (5 / 6 - value) : 0) : (value > 3 / 6 ? 6 * (value - 3 / 6) : 0),
            y: value > 4 / 6 ? (value < 5 / 6 ? -windowHeight / 2 * 6 * (value - 4 / 6) : -windowHeight / 2) : 0
          }}
          transition={{ease: "easeOut", duration: 0.618}}
          className={"text-[16px] lg:text-[32px] max-w-[90vw] select-none mb-[5vw] overflow-hidden"}
        >
          郭益铭同学永远记得被你们恶意擦除客观题答案的经历。
        </motion.span>

        <div className={"w-screen flex flex-row justify-evenly items-center overflow-hidden"}>
          <motion.img
            className={"h-[50vw] w-[31vw] max-h-[500px] max-w-[309px] rounded-[16px] overflow-hidden"}
            src={SeventhImage} alt={""}
            animate={{
              scale: value > 4 / 6 ? 1 : (value > 3 / 6 ? 6 * (value - 3 / 6) : 0),
              opacity: value > 4 / 6 ? (value < 5 / 6 ? 6 * (5 / 6 - value) : 0) : (value > 3 / 6 ? 6 * (value - 3 / 6) : 0),
              x: value > 4 / 6 ? (value < 5 / 6 ? -windowWidth / 2 * 6 * (value - 4 / 6) : -windowWidth / 2) : 0
            }}
            transition={{ease: "easeOut", duration: 0.618}}
          />

          <motion.img
            className={"h-[50vw] w-[31vw] max-h-[500px] max-w-[309px] rounded-[16px] overflow-hidden"}
            src={EighthImage} alt={""}
            animate={{
              scale: value > 4 / 6 ? 1 : (value > 3 / 6 ? 6 * (value - 3 / 6) : 0),
              opacity: value > 4 / 6 ? (value < 5 / 6 ? 6 * (5 / 6 - value) : 0) : (value > 3 / 6 ? 6 * (value - 3 / 6) : 0),
              x: value > 4 / 6 ? (value < 5 / 6 ? windowWidth / 2 * 6 * (value - 4 / 6) : windowWidth / 2) : 0
            }}
            transition={{ease: "easeOut", duration: 0.618}}
          />
        </div>
      </div>

      <div
        className={"w-screen h-screen flex flex-row justify-evenly items-center sticky top-0 bottom-0 overflow-hidden"}>
        <motion.span
          animate={{
            scale: value > 5 / 6 ? 1 : (value > 4 / 6 ? 6 * (value - 4 / 6) : 0),
            opacity: value > 5 / 6 ? (value < 1 ? 6 * (1 - value) : 0) : (value > 4 / 6 ? 6 * (value - 4 / 6) : 0),
            x: value > 5 / 6 ? (value < 1 ? -windowWidth / 2 * 6 * (value - 5 / 6) : -windowWidth / 2) : 0
          }}
          transition={{ease: "easeOut", duration: 0.618}}
          className={"text-[16px] lg:text-[32px] max-w-[31vw] select-none overflow-hidden"}
        >
          这是证据
        </motion.span>
        <motion.img
          className={"h-[50vw] w-[31vw] max-h-[500px] max-w-[309px] rounded-[16px] overflow-hidden"}
          src={NinthImage} alt={""}
          animate={{
            scale: value > 5 / 6 ? 1 : (value > 4 / 6 ? 6 * (value - 4 / 6) : 0),
            opacity: value > 5 / 6 ? (value < 1 ? 6 * (1 - value) : 0) : (value > 4 / 6 ? 6 * (value - 4 / 6) : 0),
            x: value > 5 / 6 ? (value < 1 ? windowWidth / 2 * 6 * (value - 5 / 6) : windowWidth / 2) : 0
          }}
          transition={{ease: "easeOut", duration: 0.618}}
        />
      </div>

      <div
        className={"w-screen h-screen flex flex-row justify-evenly items-center sticky top-0 bottom-0 overflow-hidden"}>
        <motion.img
          className={"h-[50vw] w-[31vw] max-h-[500px] max-w-[309px] rounded-[16px] overflow-hidden"}
          src={TenthImage} alt={""}
          animate={{
            scale: value > 5 / 6 ? 6 * (value - 5 / 6) : 0,
            opacity: value > 5 / 6 ? 6 * (value - 5 / 6) : 0
          }}
          transition={{ease: "easeOut", duration: 0.618}}
        />

        <motion.span
          animate={{
            scale: value > 5 / 6 ? 6 * (value - 5 / 6) : 0,
            opacity: value > 5 / 6 ? 6 * (value - 5 / 6) : 0
          }}
          transition={{ease: "easeOut", duration: 0.618}}
          className={"text-[16px] lg:text-[32px] max-w-[31vw] select-none overflow-hidden"}
        >
          “老师，你知道这块玻璃的尺寸吗？”朱昊做坏事了。
        </motion.span>
      </div>
    </div>
  );
}

export default React.memo(Eighth);