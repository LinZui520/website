import { motion } from "framer-motion";


const Messages = () => {
  return (
    <div className={"flex flex-col justify-center items-center h-screen"}>
      <motion.div
        className={"text-[#1d1d1f] text-[32px] lg:text-[64px] flex flex-col justify-center items-center h-screen"}
        whileHover={{scale: 1.2}}
        whileTap={{scale: 0.9}}
        drag
        dragConstraints={{top: -0, left: -0, right: 0, bottom: 0}}
      >
        <span>留言墙(敬请期待)</span>
      </motion.div>
    </div>
  );
}

export default Messages;