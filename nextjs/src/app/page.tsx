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
        >个{"\u00A0"}
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

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: [0, 1] }}
          transition={{
            delay: 3, duration: 1,
            ease: "easeInOut",
            repeat: Infinity, repeatType: "reverse"
          }}
        >
          帅哥
        </motion.div>
      </div>
    </div>
  );
}

const Second = () => {

  const message = [
    'L', '\u00A0', 'i', '\u00A0', 'n', '\u00A0', 'u', '\u00A0','x'
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
        style={{x}}
        transition={{
          duration: 2, type: "spring", stiffness: 130, damping: 10
        }}
        className={"h-screen w-[300vw] sticky bottom-0 top-0 flex flex-row items-center"}
      >
        <div className={"h-screen w-[100vw] flex justify-center items-center sm:text-[24px] md:text-[34px] lg:text-[44px]"}>
          喜{'\u00A0'}欢{'\u00A0'}听{'\u00A0'}周{'\u00A0'}董{'\u00A0'}的{'\u00A0'}歌
        </div>

        <motion.div className={"w-[200vw] sm:text-[9vw] md:text-[9vw] lg:text-[9vw] flex justify-center items-center"}>
          {['童', '\u00A0', '年', '\u00A0', '的', '\u00A0'].map((item, index) => <motion.div
            key={index}
            initial={{ opacity: 0, y: 64 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{
              delay: 0.3, duration: 1,
              type: "spring", stiffness: 260, damping: 20
            }}
          >
            {item}
          </motion.div>)}

          <motion.div
            initial={{ opacity: 0, scale: 2 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{
              delay: 0.5, duration: 2,
              type: "spring", stiffness: 260, damping: 10
            }}
          >
            纸{'\u00A0'}飞{'\u00A0'}机
          </motion.div>

          {[
            '\u00A0', '，', '\u00A0', '现', '\u00A0', '在', '\u00A0',
            '终', '\u00A0', '于', '\u00A0'
          ].map((item, index) => <motion.div
            key={index}
            initial={{ opacity: 0, y: 64 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{
              delay: 0.3, duration: 1,
              type: "spring", stiffness: 260, damping: 20
            }}
          >
            {item}
          </motion.div>)}

          <motion.div
            initial={{ opacity: 0, scale: 2 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{
              delay: 0.5, duration: 2,
              type: "spring", stiffness: 260, damping: 10
            }}
          >
            飞{'\u00A0'}回
          </motion.div>

          {[
            '\u00A0', '我', '\u00A0', '手', '\u00A0', '里', '\u00A0', '。'
          ].map((item, index) => <motion.div
            key={index}
            initial={{ opacity: 0, y: 64 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{
              delay: 0.3, duration: 1,
              type: "spring", stiffness: 260, damping: 20
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
