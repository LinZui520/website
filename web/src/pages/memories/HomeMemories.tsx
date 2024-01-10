import {motion} from "framer-motion";


const HomeMemories = () => {


  return (
    <motion.div
      whileHover={{scale: 1.2}}
      whileTap={{scale: 0.9}}
      drag
      dragConstraints={{top: -0, left: -0, right: 0, bottom: 0}}
      className={"flex flex-col justify-center items-center h-screen text-[#1d1d1f] text-[16px] lg:text-[32px]"}
    >
      如果你想添加属于你自己班级的独家回忆录
      <br />
      欢迎联系我 yangminghe20@gmail.com
    </motion.div>
  );
}

export default HomeMemories;