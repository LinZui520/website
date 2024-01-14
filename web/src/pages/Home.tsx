import {useEffect} from 'react';
import Footer from '../components/index/Footer';
import {motion} from "framer-motion";
import Header from "../components/memories/21/Header";
import First from "../components/memories/21/First";
import Second from "../components/memories/21/Second";
import Third from "../components/memories/21/Third";
import useHandleWheelScroll from "../hooks/useHandleWheelScroll";

const Home = () => {

  const {handleWheel} = useHandleWheelScroll()

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div onWheel={handleWheel}>
      <div className={"flex flex-col justify-center items-center h-screen"}>
        <motion.div
          whileHover={{scale: 1.2}}
          whileTap={{scale: 0.9}}
          drag
          dragConstraints={{top: 0, left: 0, right: 0, bottom: 0}}
          className={"text-[#1d1d1f] text-[32px] lg:text-[64px]"}
        >
          朱贵是混蛋
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