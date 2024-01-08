import {motion} from "framer-motion";


const HomeMemories = () => {


  return (
    <motion.div
      whileHover={{scale: 1.2}}
      whileTap={{scale: 0.9}}
      drag
      dragConstraints={{top: -0, left: -0, right: 0, bottom: 0}}
      className={"flex flex-col justify-center items-center h-screen text-[#1d1d1f] text-[54px]"}
    >
      Hello Memories
    </motion.div>
  );
}

export default HomeMemories;