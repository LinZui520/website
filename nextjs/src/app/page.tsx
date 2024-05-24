'use client'

import Footer from "@/components/(web)/Footer";
import { motion } from "framer-motion";
import { useEffect } from "react";

const Home = () => {



  useEffect(() => window.scroll({ top: 0 }), [])


  return (
    <>
      <div className={"w-full bg-[#fbfbfd] relative z-10 flex flex-col items-center"}>
        <div className={"h-screen relative select-none sm:w-[96vw] w-[80vw] flex flex-col justify-center"}>
          <motion.svg
            xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512"
            className={"absolute top-[100vh] sm:w-[36px] md:w-[54px] lg:w-[64px] sm:h-[54px] md:h-[81px] lg:h-[96px]"}
            initial={{ y: -128 }}
          >
            <path fill="#1d1d1f" d="M16.1 260.2c-22.6 12.9-20.5 47.3 3.6 57.3L160 376V479.3c0 18.1 14.6 32.7 32.7 32.7c9.7 0 18.9-4.3 25.1-11.8l62-74.3 123.9 51.6c18.9 7.9 40.8-4.5 43.9-24.7l64-416c1.9-12.1-3.4-24.3-13.5-31.2s-23.3-7.5-34-1.4l-448 256zm52.1 25.5L409.7 90.6 190.1 336l1.2 1L68.2 285.7zM403.3 425.4L236.7 355.9 450.8 116.6 403.3 425.4z"/>
          </motion.svg>

          <div
            className={"text-[#1d1d1f] flex justify-center items-center sm:text-[36px] md:text-[54px] lg:text-[64px] mt-[32px] self-start"}>
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
              whileInView={{ opacity: 1, x: 0, transition: { delay: 1.5 }}}
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
              <path fill="#1d1d1f" d="M258.6 0c-1.7 0-3.4 .1-5.1 .5C168 17 115.6 102.3 130.5 189.3c2.9 17 8.4 32.9 15.9 47.4L32 224H29.4C13.2 224 0 237.2 0 253.4c0 1.7 .1 3.4 .5 5.1C17 344 102.3 396.4 189.3 381.5c17-2.9 32.9-8.4 47.4-15.9L224 480v2.6c0 16.2 13.2 29.4 29.4 29.4c1.7 0 3.4-.1 5.1-.5C344 495 396.4 409.7 381.5 322.7c-2.9-17-8.4-32.9-15.9-47.4L480 288h2.6c16.2 0 29.4-13.2 29.4-29.4c0-1.7-.1-3.4-.5-5.1C495 168 409.7 115.6 322.7 130.5c-17 2.9-32.9 8.4-47.4 15.9L288 32V29.4C288 13.2 274.8 0 258.6 0zM256 224a32 32 0 1 1 0 64 32 32 0 1 1 0-64z"/>
            </motion.svg>
          </div>

          <div
            className={"text-[#1d1d1f] flex justify-center items-center sm:text-[36px] md:text-[54px] lg:text-[64px] mt-[32px] self-end"}>
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
              initial={{ scale: 0.5, opacity: 1 }}
              animate={{
                scale: [0.5, 1, 0.5],
                opacity: [1, 0.5, 1]
              }}
              transition={{
                delay: 2.5, duration: 2,
                repeat: Infinity, ease: "easeInOut"
              }}
            >
              <motion.path
                fill="#1d1d1f"
                d="M47.6 300.4L228.3 469.1c7.5 7 17.4 10.9 27.7 10.9s20.2-3.9 27.7-10.9L464.4 300.4c30.4-28.3 47.6-68 47.6-109.5v-5.8c0-69.9-50.5-129.5-119.4-141C347 36.5 300.6 51.4 268 84L256 96 244 84c-32.6-32.6-79-47.5-124.6-39.9C50.5 55.6 0 115.2 0 185.1v5.8c0 41.5 17.2 81.2 47.6 109.5z"
              />
            </motion.svg>

            <motion.div
              initial={{ opacity: 0, x: -65 }}
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


      </div>
      <Footer/>
    </>
  );
}

export default Home;
