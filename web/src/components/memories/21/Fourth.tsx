import { motion } from "framer-motion";
import FirstImage from "../../../assets/image/memories/21/Screenshot_20240125_184942.png"
import SecondImage from "../../../assets/image/memories/21/2024-01-27 15-14-34.png";
import ThirdImage from "../../../assets/image/memories/21/2024-01-27 15-15-25.png"

const Fourth = () => {


  return (
    <div className="h-[500vh] w-[100vw] flex flex-col justify-center items-center">
      <motion.div
        className={"h-screen w-screen text-[16px] lg:text-[32px] select-none flex justify-center items-center"}
        initial={{opacity: 0, scale: 0.5}}
        whileInView={{opacity: 1, scale: 1}}
      >
        我们听过的午觉唤醒曲
      </motion.div>
      <motion.div
        className={"h-screen w-screen flex justify-center items-center"}
        initial={{scale: 0, opacity: 0}}
        whileInView={{scale: 1, opacity: 1}}
        viewport={{once: true}}
      >
        <img
          className={"h-[71vw] w-[59vw] max-h-[568px] max-w-[470px] rounded-[16px] overflow-hidden"}
          src={FirstImage}
          alt={""}
        />
      </motion.div>

      <motion.div
        className={"h-screen w-screen text-[16px] lg:text-[32px] select-none flex justify-center items-center"}
        initial={{opacity: 0, scale: 0.5}}
        whileInView={{opacity: 1, scale: 1}}
      >
        阴云密布，抑或晴空万里
      </motion.div>

      <motion.div
        className={"h-screen w-screen flex justify-center items-center"}
        initial={{scale: 0, opacity: 0}}
        whileInView={{scale: 1, opacity: 1}}
        viewport={{once: true}}
      >
        <img
          className={"h-[60vw] w-[60vw] max-h-[500px] max-w-[500px] rounded-[16px] overflow-hidden"}
          src={SecondImage}
          alt={""}
        />
      </motion.div>

      <motion.div
        className={"h-screen w-screen flex justify-center items-center"}
        initial={{scale: 0, opacity: 0}}
        whileInView={{scale: 1, opacity: 1}}
        viewport={{once: true}}
      >
        <img
          className={"h-[60vw] w-[60vw] max-h-[500px] max-w-[500px] rounded-[16px] overflow-hidden"}
          src={ThirdImage}
          alt={""}
        />
      </motion.div>


    </div>
  );
}

export default Fourth;