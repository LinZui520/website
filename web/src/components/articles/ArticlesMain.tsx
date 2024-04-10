import {useNavigate} from "react-router-dom";
import useFetchArticles from "../../hooks/article/useFetchArticles";
import React from "react";
import { motion } from "framer-motion";

const ArticlesMain = () => {

  const navigate = useNavigate()
  const {articles} = useFetchArticles()

  return (
    <div className={"w-screen bg-[#fbfbfd] min-h-screen flex flex-col justify-evenly items-center"}>
      {articles.map(item =>
        <div
          key={item.id}
          className={
            "h-[86px] w-[90vw] md:w-[80vw] lg:w-[60vw] max-w-[768px] bg-[#fbfbfd] mb-[48px] lg:mb-[20px] " +
            "flex flex-col justify-between items-center select-none"
          }
        >
          <div className={"w-[100%] flex flex-row justify-between items-center"}>
            <div className={"flex flex-row justify-center items-center"}>
              <motion.span
                initial={{opacity: 0, scale: 0}}
                whileInView={{opacity: 1, scale: 1}}
                transition={{duration: 0.25}}
                className={"italic text-[16px] lg:text-[24px] text-[#1d1d1f] mr-[32px]"}
              >
                {`${new Date(item.create).getFullYear()}/${(new Date(item.create).getMonth() + 1).toString().padStart(2, '0')}/${new Date(item.create).getDate().toString().padStart(2, '0')}`}
              </motion.span>

              <motion.h1
                onClick={() => navigate('/article/' + item.id)}
                whileHover={{scale: 1.1}}
                whileTap={{scale: 0.9}}
                initial={{opacity: 0, scale: 0}}
                whileInView={{opacity: 1, scale: 1}}
                transition={{duration: 0.25}}
                className={"font-bold text-[24px] lg:text-[32px] text-[#1d1d1f] cursor-pointer"}
              >
                {item.title}
              </motion.h1>
            </div>

            <div className={"flex flex-row justify-center items-center"}>
              <motion.img
                initial={{opacity: 0, scale: 0}}
                whileInView={{opacity: 1, scale: 1}}
                transition={{duration: 0.25}}
                src={`${window.location.origin}/image/${item.avatar}`}
                alt={""} title={item.username}
                className={
                  "w-[32px] h-[32px] lg:w-[64px] lg:h-[64px] " +
                  "object-contain rounded-full select-none ml-[16px] mr-[16px]"
                }
              />
            </div>
          </div>

          <motion.hr
            initial={{opacity: 0, scale: 0}}
            whileInView={{opacity: 1, scale: 1}}
            transition={{duration: 0.25}}
            className={"w-[100%] border-t border-dashed border-[#1d1d1f]"}
          />
        </div>
      )}
    </div>
  );
}

export default ArticlesMain;