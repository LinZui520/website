import {motion} from "framer-motion";
import TypingEffect from "../index/TypingEffect";

const ArticlesHeader = () => {
  return (
    <div className={"flex flex-col justify-center items-center w-screen h-screen"}>
      <motion.div
        whileHover={{scale: 1.2}}
        whileTap={{scale: 0.9}}
        drag
        dragConstraints={{top: -0, left: -0, right: 0, bottom: 0}}
        className={"text-[32px] lg:text-[64px] text-[#1d1d1f]"}
      >
        <TypingEffect text={"博客"} speed={256} waitTime={2048} />
      </motion.div>
    </div>
  );
}

export default ArticlesHeader;