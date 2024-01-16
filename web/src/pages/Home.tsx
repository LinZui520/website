import {useEffect} from 'react';
import Footer from '../components/index/Footer';
import {motion} from "framer-motion";
import Header from "../components/memories/21/Header";
import First from "../components/memories/21/First";
import Second from "../components/memories/21/Second";
import Third from "../components/memories/21/Third";
import useHandleWheelScroll from "../hooks/useHandleWheelScroll";
import TypingEffect from "../components/index/TypingEffect";
import useHandleTouchScroll from "../hooks/useHandleTouchScroll";

const Home = () => {

  const {handleTouch} = useHandleTouchScroll()
  const {handleWheel} = useHandleWheelScroll()

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className={"touch-none"} onTouchMove={handleTouch} onWheel={handleWheel}>
      <div className={"flex flex-col justify-center items-center h-screen"}>
        <motion.div
          whileHover={{scale: 1.2}}
          whileTap={{scale: 0.9}}
          drag
          dragConstraints={{top: 0, left: 0, right: 0, bottom: 0}}
          className={"text-[#1d1d1f] text-[32px] lg:text-[64px]"}
        >
          <TypingEffect text={"朱贵是混蛋"} speed={128} waitTime={2048} />
        </motion.div>
      </div>

      <Header/>
      <First/>
      <Second/>
      <Third/>

      <Footer/>
    </div>
  );
}

export default Home;