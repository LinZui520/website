import { motion } from "framer-motion";
import React from "react";
import {useNavigate} from "react-router-dom";
import Timer from "./Timer";
import useGetMenu from "../../hooks/useGetMenu";


const Footer = () => {

  const navigate = useNavigate()

  const { menu } = useGetMenu()

  return (
    <div className={"bg-[#1d1d1f] w-screen h-screen flex flex-col justify-around items-center"}>
      <motion.ul
        variants={{
          open: {transition: {staggerChildren: 0.07, delayChildren: 0.2}},
          closed: {transition: {staggerChildren: 0.05, staggerDirection: -1}}
        }}
        className={"flex flex-col justify-center items-center"}
      >
        {menu.map(item =>
          item === null ? null :
          <motion.li
            variants={{
              open: {y: 0, opacity: 1, transition: {y: {stiffness: 1000, velocity: -100}}},
              closed: {y: 50, opacity: 0, transition: {y: {stiffness: 1000}}}
            }}
            whileHover={{scale: 1.3}} whileTap={{scale: 0.95}}
            className={"cursor-pointer mb-[5vh] select-none text-[#fbfbfd] text-[24px] lg:text-[36px]"}
            key={item.href} onClick={() => navigate(item.href)}
          >
            {item.text}
          </motion.li>
        )}
      </motion.ul>

      <div className={"w-screen flex flex-col lg:flex-row justify-between select-none"}>
        <div className={"text-[#fbfbfd] text-[8px] lg:text-[16px] ml-[32px]"}>
          网站运行时间：<Timer />
        </div>

        <div className={"flex flex-col lg:flex-row justify-between"}>
          <a
            rel='noopener noreferrer' href='https://beian.miit.gov.cn/' target='_blank'
            className={"text-[#fbfbfd] text-[8px] lg:text-[16px] ml-[32px]"}
          >
            赣ICP备2023014673号-1
          </a>
          <a
            rel='noopener noreferrer' href='https://github.com/LinZui520/website' target='_blank'
            className={"text-[#fbfbfd] text-[8px] lg:text-[16px] mr-[32px] ml-[32px]"}
          >
            Copyright ©2023-2024 Yangming He
          </a>
        </div>

      </div>
    </div>
  );
}

export default Footer