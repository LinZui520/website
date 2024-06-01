'use client'

import Footer from "@/components/(web)/Footer";
import { motion, useScroll, useTransform } from "framer-motion";
import { useEffect, useRef } from "react";

const Home = () => {

  useEffect(() => window.scroll({ top: 0 }), [])

  return (
    <>
      <div className={"w-full bg-[#fbfbfd] relative z-10 flex flex-col items-center"}>
        <First />

        <Second />

        <Third />
      </div>
      <Footer/>
    </>
  );
}

const First = () => {
  return (
    <div className={"h-screen select-none sm:w-[96vw] w-[80vw] flex flex-col justify-center"}>
      <motion.svg
        xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512"
        className={"absolute top-[100vh] sm:w-[36px] md:w-[54px] lg:w-[64px] sm:h-[54px] md:h-[81px] lg:h-[96px]"}
        initial={{ y: -128 }}
      >
        <path
          fill="#1d1d1f"
          d="M16.1 260.2c-22.6 12.9-20.5 47.3 3.6 57.3L160 376V479.3c0 18.1 14.6 32.7 32.7 32.7c9.7 0 18.9-4.3 25.1-11.8l62-74.3 123.9 51.6c18.9 7.9 40.8-4.5 43.9-24.7l64-416c1.9-12.1-3.4-24.3-13.5-31.2s-23.3-7.5-34-1.4l-448 256zm52.1 25.5L409.7 90.6 190.1 336l1.2 1L68.2 285.7zM403.3 425.4L236.7 355.9 450.8 116.6 403.3 425.4z"
        />
      </motion.svg>

      <div className={"text-[#1d1d1f] flex justify-center items-center sm:text-[36px] md:text-[54px] lg:text-[64px] mt-[32px] sm:self-center self-start"}>
        <motion.div
          initial={{ scaleY: -1, y: 64 }}
          whileInView={{ scaleY: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{
            delay: 0.5, type: "spring",
            stiffness: 260, damping: 20
          }}
        >I
        </motion.div>

        <motion.div
          initial={{ y: 64, opacity: 0 }}
          whileInView={{ y: 0, opacity: 1 }}
          viewport={{ once: true }}
          transition={{
            delay: 1, type: "spring",
            stiffness: 260, damping: 20
          }}
        >{"\u00A0"}am{"\u00A0"}
        </motion.div>

        <motion.div
          initial={{ opacity: 0, x: -64 }}
          whileInView={{ opacity: 1, x: 0, transition: { delay: 1.5 } }}
          viewport={{ once: true }}
          animate={{ scaleX: [-1, 1] }}
          transition={{
            delay: 1.5, duration: 4,
            type: "spring",
            stiffness: 65, damping: 20,
            repeat: Infinity, repeatType: "reverse"
          }}
          className={"text-[#11efef] sm:text-[54px] md:text-[64px] lg:text-[78px]"}
        >贺
        </motion.div>

        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{
            delay: 1, type: "spring",
            stiffness: 260, damping: 20
          }}
          className={"text-[#11efef] sm:text-[54px] md:text-[64px] lg:text-[78px]"}
        >{"\u00A0"}阳
        </motion.div>

        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{
            delay: 1, type: "spring",
            stiffness: 260, damping: 20
          }}
          className={"text-[#11efef] sm:text-[54px] md:text-[64px] lg:text-[78px]"}
        >明
        </motion.div>

        {"\u00A0"}{"\u00A0"}{"\u00A0"}{"\u00A0"}

        <motion.svg
          xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512"
          className={"sm:w-[36px] md:w-[54px] lg:w-[64px] sm:h-[54px] md:h-[81px] lg:h-[96px]"}
          initial={{ scale: 0, opacity: 0 }}
          whileInView={{
            scale: 1, opacity: 1,
            transition: {
              delay: 1.5, type: "spring",
              stiffness: 260, damping: 20
            }
          }}
          viewport={{ once: true }}
          animate={{ rotate: [0, 360] }}
          transition={{
            delay: 1.5, duration: 1,
            type: "spring", damping: 64,
            repeat: Infinity
          }}
        >
          <path
            fill="#FF8000"
            d="M258.6 0c-1.7 0-3.4 .1-5.1 .5C168 17 115.6 102.3 130.5 189.3c2.9 17 8.4 32.9 15.9 47.4L32 224H29.4C13.2 224 0 237.2 0 253.4c0 1.7 .1 3.4 .5 5.1C17 344 102.3 396.4 189.3 381.5c17-2.9 32.9-8.4 47.4-15.9L224 480v2.6c0 16.2 13.2 29.4 29.4 29.4c1.7 0 3.4-.1 5.1-.5C344 495 396.4 409.7 381.5 322.7c-2.9-17-8.4-32.9-15.9-47.4L480 288h2.6c16.2 0 29.4-13.2 29.4-29.4c0-1.7-.1-3.4-.5-5.1C495 168 409.7 115.6 322.7 130.5c-17 2.9-32.9 8.4-47.4 15.9L288 32V29.4C288 13.2 274.8 0 258.6 0zM256 224a32 32 0 1 1 0 64 32 32 0 1 1 0-64z"
          />
        </motion.svg>
      </div>

      <div className={"text-[#1d1d1f] flex justify-center items-center sm:text-[36px] md:text-[54px] lg:text-[64px] mt-[32px] sm:self-center self-end"}>
        <motion.div
          initial={{ scale: 0 }}
          whileInView={{ scale: 1, transition: { delay: 1.5 } }}
          viewport={{ once: true }}
          animate={{ rotate: [0, 360] }}
          transition={{
            delay: 1.5, duration: 4,
            type: "spring",
            stiffness: 65, damping: 20,
            repeat: Infinity
          }}
        >一
        </motion.div>

        <motion.div
          initial={{ scale: 0 }}
          whileInView={{ scale: 1 }}
          viewport={{ once: true }}
          transition={{
            delay: 1.5, duration: 4,
            type: "spring",
            stiffness: 65, damping: 20,
          }}
        >{"\u00A0"}个{"\u00A0"}
        </motion.div>

        <motion.svg
          xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512"
          className={"sm:w-[36px] md:w-[54px] lg:w-[64px] sm:h-[54px] md:h-[81px] lg:h-[96px]"}
          initial={{ scale: 0.5 }}
          animate={{
            scale: [0.5, 1, 0.5]
          }}
          transition={{
            delay: 2.5, duration: 2,
            repeat: Infinity, ease: "easeInOut"
          }}
        >
          <path
            fill="#aa381e"
            d="M47.6 300.4L228.3 469.1c7.5 7 17.4 10.9 27.7 10.9s20.2-3.9 27.7-10.9L464.4 300.4c30.4-28.3 47.6-68 47.6-109.5v-5.8c0-69.9-50.5-129.5-119.4-141C347 36.5 300.6 51.4 268 84L256 96 244 84c-32.6-32.6-79-47.5-124.6-39.9C50.5 55.6 0 115.2 0 185.1v5.8c0 41.5 17.2 81.2 47.6 109.5z"
          />
        </motion.svg>

        <motion.div
          initial={{ opacity: 0, x: -64 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{
            delay: 2, duration: 4,
            type: "spring",
            stiffness: 65, damping: 20,
          }}
          className={"text-[#11efef] sm:text-[54px] md:text-[64px] lg:text-[78px]"}
        >{"\u00A0"}编程
        </motion.div>

        <motion.div
          initial={{ scale: 0 }}
          whileInView={{ scale: 1, transition: { delay: 1.5 } }}
          viewport={{ once: true }}
          transition={{
            delay: 1.5, type: "spring",
            stiffness: 65, damping: 20
          }}
        >{"\u00A0"}の{"\u00A0"}
        </motion.div>

        <motion.svg
          xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512"
          className={"sm:w-[54px] md:w-[64px] lg:w-[78px] sm:h-[81px] md:h-[96px] lg:h-[117px]"}
          initial={{ opacity: 0 }}
          animate={{ opacity: [0, 1] }}
          transition={{
            delay: 3, duration: 1,
            ease: "easeInOut",
            repeat: Infinity, repeatType: "reverse"
          }}
        >
          <path
            fill="#1d1d1f"
            d="M464 256A208 208 0 1 0 48 256a208 208 0 1 0 416 0zM0 256a256 256 0 1 1 512 0A256 256 0 1 1 0 256zm177.6 62.1C192.8 334.5 218.8 352 256 352s63.2-17.5 78.4-33.9c9-9.7 24.2-10.4 33.9-1.4s10.4 24.2 1.4 33.9c-22 23.8-60 49.4-113.6 49.4s-91.7-25.5-113.6-49.4c-9-9.7-8.4-24.9 1.4-33.9s24.9-8.4 33.9 1.4zM144.4 208a32 32 0 1 1 64 0 32 32 0 1 1 -64 0zm165.8 21.7c-7.6 8.1-20.2 8.5-28.3 .9s-8.5-20.2-.9-28.3c14.5-15.5 35.2-22.3 54.6-22.3s40.1 6.8 54.6 22.3c7.6 8.1 7.1 20.7-.9 28.3s-20.7 7.1-28.3-.9c-5.5-5.8-14.8-9.7-25.4-9.7s-19.9 3.8-25.4 9.7z"
          />
        </motion.svg>
      </div>
    </div>
  );
}

const Second = () => {

  const message = [
    'L', '\u00A0', 'i', '\u00A0', 'n', '\u00A0', 'u', '\u00A0', 'x'
  ]

  return (
    <div className={"h-screen sm:w-[96vw] w-[80vw] select-none flex flex-col justify-evenly items-center"}>
      <div className={"text-[#1d1d1f] flex justify-center items-center sm:text-[24px] md:text-[34px] lg:text-[44px]"}>
        {message.map((item, index) => <motion.div
          key={index}
          initial={{ opacity: 0, y: 64 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{
            delay: 0.5 + 0.1 * index, duration: 1,
            type: "spring", stiffness: 260, damping: 20
          }}
        >
          {item}
        </motion.div>)}
      </div>

      <svg
        xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512"
        className={"sm:w-[24px] sm:h-[36px] md:w-[34px] md:h-[51px] lg:w-[44px] lg:h-[66px]"}
      >
        <path
          fill="#1d1d1f"
          d="M225.8 468.2l-2.5-2.3L48.1 303.2C17.4 274.7 0 234.7 0 192.8v-3.3c0-70.4 50-130.8 119.2-144C158.6 37.9 198.9 47 231 69.6c9 6.4 17.4 13.8 25 22.3c4.2-4.8 8.7-9.2 13.5-13.3c3.7-3.2 7.5-6.2 11.5-9c0 0 0 0 0 0C313.1 47 353.4 37.9 392.8 45.4C462 58.6 512 119.1 512 189.5v3.3c0 41.9-17.4 81.9-48.1 110.4L288.7 465.9l-2.5 2.3c-8.2 7.6-19 11.9-30.2 11.9s-22-4.2-30.2-11.9zM239.1 145c-.4-.3-.7-.7-1-1.1l-17.8-20c0 0-.1-.1-.1-.1c0 0 0 0 0 0c-23.1-25.9-58-37.7-92-31.2C81.6 101.5 48 142.1 48 189.5v3.3c0 28.5 11.9 55.8 32.8 75.2L256 430.7 431.2 268c20.9-19.4 32.8-46.7 32.8-75.2v-3.3c0-47.3-33.6-88-80.1-96.9c-34-6.5-69 5.4-92 31.2c0 0 0 0-.1 .1s0 0-.1 .1l-17.8 20c-.3 .4-.7 .7-1 1.1c-4.5 4.5-10.6 7-16.9 7s-12.4-2.5-16.9-7z"
        />
      </svg>

      <div className={"text-[#1d1d1f] flex justify-center items-center sm:text-[24px] md:text-[34px] lg:text-[44px]"}>
        {['W', '\u00A0', 'e', '\u00A0', 'b'].map((item, index) => <motion.div
          key={index}
          initial={{ opacity: 0, y: 64 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{
            delay: 0.5 + 0.1 * index, duration: 1,
            type: "spring", stiffness: 260, damping: 20
          }}
        >
          {item}
        </motion.div>)}
      </div>
    </div>
  );
}

const Third = () => {

  const ref = useRef(null)
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end end"]
  })

  const x = useTransform(scrollYProgress, [0, 1], ["-0vw", "-200vw"])

  return (
    <div ref={ref} className={"h-[300vh] w-full select-none overflow-x-clip"}>
      <motion.div
        style={{ x }}
        transition={{ duration: 2, type: "spring", stiffness: 130, damping: 10 }}
        className={"h-screen w-[300vw] sticky bottom-0 top-0 flex flex-row items-center"}
      >
        <div className={"h-screen w-[100vw] flex justify-center items-center sm:text-[24px] md:text-[34px] lg:text-[44px]"}>
          <svg
            xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512"
            className={"sm:w-[24px] sm:h-[36px] md:w-[34px] md:h-[51px] lg:w-[44px] lg:h-[66px]"}
          >
            <path
              fill="#1d1d1f"
              d="M250.8 1.4c-35.2-3.7-66.6 21.8-70.3 57L174 119 156.7 69.6C145 36.3 108.4 18.8 75.1 30.5S24.2 78.8 35.9 112.1L88.7 262.2C73.5 276.7 64 297.3 64 320v0 24c0 92.8 75.2 168 168 168h48c92.8 0 168-75.2 168-168V272 256 224c0-35.3-28.7-64-64-64c-7.9 0-15.4 1.4-22.4 4c-10.4-21.3-32.3-36-57.6-36c-.7 0-1.5 0-2.2 0l5.9-56.3c3.7-35.2-21.8-66.6-57-70.3zm-.2 155.4C243.9 166.9 240 179 240 192v48c0 .7 0 1.4 0 2c-5.1-1.3-10.5-2-16-2h-7.4l-5.4-15.3 17-161.3c.9-8.8 8.8-15.2 17.6-14.2s15.2 8.8 14.2 17.6l-9.5 90.1zM111.4 85.6L165.7 240H144c-4 0-8 .3-11.9 .9L81.2 96.2c-2.9-8.3 1.5-17.5 9.8-20.4s17.5 1.5 20.4 9.8zM288 192c0-8.8 7.2-16 16-16s16 7.2 16 16v32 16c0 8.8-7.2 16-16 16s-16-7.2-16-16V192zm38.4 108c10.4 21.3 32.3 36 57.6 36c5.5 0 10.9-.7 16-2v10c0 66.3-53.7 120-120 120H232c-66.3 0-120-53.7-120-120l0-24 0 0c0-17.7 14.3-32 32-32h80c8.8 0 16 7.2 16 16s-7.2 16-16 16H184c-13.3 0-24 10.7-24 24s10.7 24 24 24h40c35.3 0 64-28.7 64-64c0-.7 0-1.4 0-2c5.1 1.3 10.5 2 16 2c7.9 0 15.4-1.4 22.4-4zM400 272c0 8.8-7.2 16-16 16s-16-7.2-16-16V240 224c0-8.8 7.2-16 16-16s16 7.2 16 16v32 16z"
            />
          </svg>
          {'\u00A0'}
          {'\u00A0'}
          喜{'\u00A0'}欢{'\u00A0'}听{'\u00A0'}周{'\u00A0'}董{'\u00A0'}的{'\u00A0'}歌
          {'\u00A0'}
          {'\u00A0'}
          <svg
            xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512"
            className={"sm:w-[24px] sm:h-[36px] md:w-[34px] md:h-[51px] lg:w-[44px] lg:h-[66px]"}
          >
            <path
              fill="#1d1d1f"
              d="M250.8 1.4c-35.2-3.7-66.6 21.8-70.3 57L174 119 156.7 69.6C145 36.3 108.4 18.8 75.1 30.5S24.2 78.8 35.9 112.1L88.7 262.2C73.5 276.7 64 297.3 64 320v0 24c0 92.8 75.2 168 168 168h48c92.8 0 168-75.2 168-168V272 256 224c0-35.3-28.7-64-64-64c-7.9 0-15.4 1.4-22.4 4c-10.4-21.3-32.3-36-57.6-36c-.7 0-1.5 0-2.2 0l5.9-56.3c3.7-35.2-21.8-66.6-57-70.3zm-.2 155.4C243.9 166.9 240 179 240 192v48c0 .7 0 1.4 0 2c-5.1-1.3-10.5-2-16-2h-7.4l-5.4-15.3 17-161.3c.9-8.8 8.8-15.2 17.6-14.2s15.2 8.8 14.2 17.6l-9.5 90.1zM111.4 85.6L165.7 240H144c-4 0-8 .3-11.9 .9L81.2 96.2c-2.9-8.3 1.5-17.5 9.8-20.4s17.5 1.5 20.4 9.8zM288 192c0-8.8 7.2-16 16-16s16 7.2 16 16v32 16c0 8.8-7.2 16-16 16s-16-7.2-16-16V192zm38.4 108c10.4 21.3 32.3 36 57.6 36c5.5 0 10.9-.7 16-2v10c0 66.3-53.7 120-120 120H232c-66.3 0-120-53.7-120-120l0-24 0 0c0-17.7 14.3-32 32-32h80c8.8 0 16 7.2 16 16s-7.2 16-16 16H184c-13.3 0-24 10.7-24 24s10.7 24 24 24h40c35.3 0 64-28.7 64-64c0-.7 0-1.4 0-2c5.1 1.3 10.5 2 16 2c7.9 0 15.4-1.4 22.4-4zM400 272c0 8.8-7.2 16-16 16s-16-7.2-16-16V240 224c0-8.8 7.2-16 16-16s16 7.2 16 16v32 16z"
            />
          </svg>
        </div>

        <motion.svg
          xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512"
          animate={{ rotate: [0, 360] }}
          transition={{
            duration: 1, type: "spring", stiffness: 65, damping: 20,
            repeat: Infinity
          }}
          className={"sm:w-[24px] sm:h-[36px] md:w-[34px] md:h-[51px] lg:w-[44px] lg:h-[66px]"}
        >
          <path
            fill="#1d1d1f"
            d="M375.7 19.7c-1.5-8-6.9-14.7-14.4-17.8s-16.1-2.2-22.8 2.4L256 61.1 173.5 4.2c-6.7-4.6-15.3-5.5-22.8-2.4s-12.9 9.8-14.4 17.8l-18.1 98.5L19.7 136.3c-8 1.5-14.7 6.9-17.8 14.4s-2.2 16.1 2.4 22.8L61.1 256 4.2 338.5c-4.6 6.7-5.5 15.3-2.4 22.8s9.8 13 17.8 14.4l98.5 18.1 18.1 98.5c1.5 8 6.9 14.7 14.4 17.8s16.1 2.2 22.8-2.4L256 450.9l82.5 56.9c6.7 4.6 15.3 5.5 22.8 2.4s12.9-9.8 14.4-17.8l18.1-98.5 98.5-18.1c8-1.5 14.7-6.9 17.8-14.4s2.2-16.1-2.4-22.8L450.9 256l56.9-82.5c4.6-6.7 5.5-15.3 2.4-22.8s-9.8-12.9-17.8-14.4l-98.5-18.1L375.7 19.7zM269.6 110l65.6-45.2 14.4 78.3c1.8 9.8 9.5 17.5 19.3 19.3l78.3 14.4L402 242.4c-5.7 8.2-5.7 19 0 27.2l45.2 65.6-78.3 14.4c-9.8 1.8-17.5 9.5-19.3 19.3l-14.4 78.3L269.6 402c-8.2-5.7-19-5.7-27.2 0l-65.6 45.2-14.4-78.3c-1.8-9.8-9.5-17.5-19.3-19.3L64.8 335.2 110 269.6c5.7-8.2 5.7-19 0-27.2L64.8 176.8l78.3-14.4c9.8-1.8 17.5-9.5 19.3-19.3l14.4-78.3L242.4 110c8.2 5.7 19 5.7 27.2 0zM256 368a112 112 0 1 0 0-224 112 112 0 1 0 0 224zM192 256a64 64 0 1 1 128 0 64 64 0 1 1 -128 0z"
          />
        </motion.svg>

        <motion.div className={"w-[200vw] text-[6vw] flex justify-center items-center"}>
          {['童', '\u00A0', '年', '\u00A0', '的', '\u00A0'].map((item, index) => <motion.div
            key={index}
            initial={{ opacity: 0, y: 64, x: "40vw" }}
            whileInView={{ opacity: [0, 1], y: [64, 0], x: [0, 0] }}
            viewport={{ once: true }}
            transition={{
              duration: 1, type: "spring", stiffness: 260, damping: 20
            }}
          >
            {item}
          </motion.div>)}

          <motion.div
            initial={{ opacity: 0, scale: 1, x: "40vw" }}
            whileInView={{ opacity: [0, 1], scale: [2, 1], x: [0, 0] }}
            viewport={{ once: true }}
            transition={{
              duration: 2, type: "spring", stiffness: 260, damping: 10
            }}
          >
            纸{'\u00A0'}飞{'\u00A0'}机
          </motion.div>

          {[
            '\u00A0', '，', '\u00A0', '现', '\u00A0', '在', '\u00A0',
            '终', '\u00A0', '于', '\u00A0'
          ].map((item, index) => <motion.div
            key={index}
            initial={{ opacity: 0, y: 64, x: "40vw" }}
            whileInView={{ opacity: [0, 1], y: [64, 0], x: [0, 0] }}
            viewport={{ once: true }}
            transition={{
              duration: 1, type: "spring", stiffness: 260, damping: 20
            }}
          >
            {item}
          </motion.div>)}

          <motion.div
            initial={{ opacity: 0, scale: 1, x: "40vw" }}
            whileInView={{ opacity: [0, 1], scale: [2, 1], x: [0, 0] }}
            viewport={{ once: true }}
            transition={{
              duration: 2, type: "spring", stiffness: 260, damping: 10
            }}
          >
            飞{'\u00A0'}回
          </motion.div>

          {[
            '\u00A0', '我', '\u00A0', '手', '\u00A0', '里', '\u00A0', '。'
          ].map((item, index) => <motion.div
            key={index}
            initial={{ opacity: 0, y: 64, x: "40vw" }}
            whileInView={{ opacity: [0, 1], y: [64, 0], x: [0, 0] }}
            viewport={{ once: true }}
            transition={{
              duration: 1, type: "spring", stiffness: 260, damping: 20
            }}
          >
            {item}
          </motion.div>)}

        </motion.div>
      </motion.div>
    </div>
  );
}

export default Home;
