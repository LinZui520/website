import {motion} from "framer-motion";

const ArticlesHeader = () => {
  return (
    <div className={"flex flex-col justify-center items-center w-screen h-screen"}>
      <motion.span
        whileHover={{scale: 1.2}}
        whileTap={{scale: 0.9}}
        drag
        dragConstraints={{top: -0, left: -0, right: 0, bottom: 0}}
        className={"text-[32px] lg:text-[64px] text-[#1d1d1f]"}
      >
        博客
      </motion.span>
    </div>
  );
}

export default ArticlesHeader;