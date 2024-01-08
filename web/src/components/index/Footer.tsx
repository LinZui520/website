import { motion } from "framer-motion";


const Footer = () => {


  return (
    <div className={"bg-[#1d1d1f] w-screen h-screen flex flex-col justify-center items-center"}>

      <motion.a
        rel='noopener noreferrer' href='https://beian.miit.gov.cn/' target='_blank'
        whileHover={{scale: 1.2}}
        whileTap={{scale: 0.9}}
        drag
        dragConstraints={{top: -0, left: -0, right: 0, bottom: 0}}
        className={"text-[#fbfbfd] no-underline text-[32px] mb-[32px]"}
      >
        赣ICP备2023014673号-1
      </motion.a>
      <motion.a
        rel='noopener noreferrer' href='https://github.com/LinZui520/website' target='_blank'
        whileHover={{scale: 1.2}}
        whileTap={{scale: 0.9}}
        drag
        dragConstraints={{top: -0, left: -0, right: 0, bottom: 0}}
        className={"text-[#fbfbfd] no-underline text-[32px] mb-[32px]"}
      >
        Copyright ©2023-2024 YangmingHe
      </motion.a>

    </div>
  );
}

export default Footer