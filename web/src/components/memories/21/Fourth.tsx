import { motion } from "framer-motion";
import FirstImage from "../../../assets/image/memories/21/Screenshot_20240125_184942.png"
import SecondImage from "../../../assets/image/memories/21/2024-01-27 15-14-34.png";
import ThirdImage from "../../../assets/image/memories/21/2024-01-27 15-15-25.png"

const Fourth = () => {


  return (
    <div className="h-[500vh] w-[100vw] flex flex-col justify-center items-center overflow-clip">
      <div className={"h-screen w-screen flex justify-center items-center"}>
        <motion.span
          initial={{opacity: 0, scale: 0.3}}
          whileInView={{opacity: 1, scale: 1}}
          transition={{ease: "easeOut", duration: 0.618}}
          className={"text-[16px] lg:text-[32px] select-none"}
        >
          我们听过的午觉唤醒曲
        </motion.span>
      </div>
      <div className={"h-screen w-screen flex justify-center items-center"}>
        <motion.img
          className={"h-[71vw] w-[59vw] max-h-[568px] max-w-[470px] rounded-[16px] overflow-hidden"}
          src={FirstImage} alt={""}
          initial={{scale: 0, opacity: 0}}
          whileInView={{scale: 1, opacity: 1}}
          viewport={{once: true}}
          transition={{ease: "easeOut", duration: 0.618}}
        />
      </div>

      <div className={"h-screen w-screen flex justify-center items-center"}>
        <motion.span
          initial={{opacity: 0, scale: 0.3}}
          whileInView={{opacity: 1, scale: 1}}
          transition={{ease: "easeOut", duration: 0.618}}
          className={"text-[16px] lg:text-[32px] select-none"}
        >
          阴云密布，抑或晴空万里
        </motion.span>
      </div>

      <div className={"h-screen w-screen flex justify-center items-center overflow-clip"}>
        <motion.img
          className={"h-[60vw] w-[60vw] max-h-[500px] max-w-[500px] rounded-[16px] overflow-hidden"}
          src={SecondImage} alt={""}
          initial={{scale: 0, opacity: 0, x: -128}}
          whileInView={{scale: 1, opacity: 1, x: 0}}
          transition={{ease: "easeOut", duration: 0.618}}
          viewport={{once: true}}
        />
      </div>

      <div className={"h-screen w-screen flex justify-center items-center overflow-clip"}>
        <motion.img
          className={"h-[60vw] w-[60vw] max-h-[500px] max-w-[500px] rounded-[16px] overflow-hidden"}
          src={ThirdImage} alt={""}
          initial={{scale: 0, opacity: 0, x: 128}}
          whileInView={{scale: 1, opacity: 1, x: 0}}
          transition={{ease: "easeOut", duration: 0.618}}
          viewport={{once: true}}
        />
      </div>

    </div>
  );
}

export default Fourth;