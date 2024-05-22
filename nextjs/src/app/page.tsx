'use client'

import Footer from "@/components/(web)/Footer";
import { motion } from "framer-motion";
import { useEffect } from "react";

const Home = () => {



  useEffect(() => window.scroll({ top: 0 }), [])


  return (
    <>
      <div className={"bg-[#fbfbfd] relative z-10 flex flex-col items-center"}>
        <div className={"h-screen sm:w-[96vw] w-[80vw] flex flex-col justify-center"}>
          <div className={"text-[#1d1d1f] flex sm:text-[36px] md:text-[54px] lg:text-[64px] mt-[32px] self-start"}>
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
            >贺
            </motion.div>

            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{
                delay: 1, type: "spring",
                stiffness: 260, damping: 20
              }}
            >{"\u00A0"}阳
            </motion.div>

            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{
                delay: 1, type: "spring",
                stiffness: 260, damping: 20
              }}
            >明
            </motion.div>
          </div>

          <div className={"text-[#1d1d1f] flex sm:text-[36px] md:text-[54px] lg:text-[64px] mt-[32px] self-end"}>
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
            >个
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
            >编程
            </motion.div>

            <motion.div
              initial={{ scale: 0 }}
              whileInView={{ scale: 1, transition: { delay: 1.5 } }}
              viewport={{ once: true }}
              transition={{
                delay: 1.5, type: "spring",
                stiffness: 65, damping: 20
              }}
            >の
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
