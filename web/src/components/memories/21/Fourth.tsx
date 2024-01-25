import { motion } from "framer-motion";
import FirstImage from "../../../assets/image/memories/21/Screenshot_20240125_184942.png"

const Fourth = () => {


  return (
    <div className="h-[200vh] w-[100vw] flex flex-col justify-center items-center">
      <motion.div
          className={"h-screen w-screen text-[16px] lg:text-[32px] select-none flex justify-center items-center"}
          initial={{opacity: 0, scale: 0.5}}
          whileInView={{opacity: 1, scale: 1}}
        >
          我们听过的午觉唤醒曲
        </motion.div>
      <img
        className={"h-[130vw] w-[58vw] max-h-[1307px] max-w-[586px] rounded-[16px] overflow-hidden"}
        src={FirstImage}
        alt={""}
      />

    </div>
  );
}

export default Fourth;