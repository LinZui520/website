import React, {useEffect} from 'react';
import Footer from '../components/index/Footer';
import {motion} from "framer-motion";
import Header from "../components/memories/21/Header";
import First from "../components/memories/21/First";
import Second from "../components/memories/21/Second";
import Third from "../components/memories/21/Third";
import useHandleWheelScroll from "../hooks/useHandleWheelScroll";
import TypingEffect from "../components/index/TypingEffect";
import useHandleTouchScroll from "../hooks/useHandleTouchScroll";
import Fourth from '../components/memories/21/Fourth';
import Fifth from "../components/memories/21/Fifth";
import Sixth from "../components/memories/21/Sixth";
import SixthNext from "../components/memories/21/SixthNext";
import Eighth from "../components/memories/21/Eighth";
import Seventh from '../components/memories/21/Seventh';

const Home = () => {

  const {handleTouch} = useHandleTouchScroll()
  const {handleWheel, ScrollDown} = useHandleWheelScroll()

  useEffect(() => {
    window.scrollTo(0, 0);
    document.body.style.overflow = 'hidden'

    return () => {
      document.body.style.overflow = 'auto'
    }
  }, []);

  return (
    <div className={"touch-none"} onTouchMove={handleTouch} onWheel={handleWheel}>
      <div className={"h-screen w-screen flex flex-col justify-center items-center"}>
        <motion.div
          whileHover={{scale: 1.2}}
          whileTap={{scale: 0.9}}
          drag dragConstraints={{top: 0, left: 0, right: 0, bottom: 0}}
          className={"text-[#1d1d1f] text-[32px] lg:text-[64px]"}
        >
          朱贵是混蛋
        </motion.div>
        <span className={"text-[#888888] text-[7px] lg:text-[14px]"}>
          &#47; * <TypingEffect text={"一 个 简 约 风 格 的 网 站"} speed={128} waitTime={2048}/> * &#47;
        </span>

        <motion.button
          className={"sticky top-[100vh] select-none"}
          onClick={ScrollDown} whileHover={{scale: 1.2}} whileTap={{scale: 0.9}}
          animate={{
            y: [0, -20, 0],
            transition: {
              duration: 1,
              repeat: Infinity,
              repeatType: 'mirror',
            },
          }}
        >
          <svg viewBox="0 0 23 23" className={"w-[25px] h-[25px] lg:w-[50px] lg:h-[50px]"}>
            <motion.path
              fill="transparent" strokeWidth="3" stroke="black" strokeLinecap="round"
              d="M2 2.5 L11.5 12 M11.5 12 L20 2.5"
            />
          </svg>
        </motion.button>

      </div>

      <Header />
      <First />
      <Second />
      <Third />
      <Fourth />
      <Fifth />
      <Sixth />
      <SixthNext />
      <Seventh />
      <Eighth />
      

      <Footer />
    </div>
  );
}

export default Home;