import {useLocation, useNavigate} from "react-router-dom";
import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Article } from "../../hooks/article/useFetchArticle";

interface ArticlesMainProps {
  articles: Article[]
}

const ArticlesMain: React.FC<ArticlesMainProps> = ({ articles }) => {

  const navigate = useNavigate()
  const location = useLocation();

  const [isLargeScreen, setIsLargeScreen] = useState(window.innerWidth >= 1024);

  useEffect(() => {
    const handleResize = () => {
      setIsLargeScreen(window.innerWidth >= 1024);
    };

    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  const [keywords, setKeywords] = useState("")

  const filterArticles = ((articles: Article[], keywords: string) =>
    articles.filter(
      item =>
      item.title.toLowerCase().includes(keywords.toLowerCase()) ||
      item.content.toLowerCase().includes(keywords.toLowerCase()) ||
      item.username.toLowerCase().includes(keywords.toLowerCase()) ||
      item.create.toLowerCase().includes(keywords.toLowerCase())
    )
  )(articles, keywords)

  return (
    <div className={"w-screen bg-[#fbfbfd] p-[64px] flex flex-col justify-evenly items-center overflow-clip"}>
      <div className={"w-[90vw] md:w-[80vw] lg:w-[60vw] max-w-[768px] flex flex-row justify-end items-center"}>
        <motion.input
          placeholder="关键字搜索"
          value={keywords} onChange={(e: React.ChangeEvent<HTMLInputElement>) => setKeywords(e.target.value)}
          className={
            "max-w-[60vw] w-[38%] h-[30px] md:h-[38px] lg:h-[46px] text-[16px] md:text-[20px] lg:text-[24px] " +
            "border-2 mb-[64px] mr-[64px] border-[#1f1f1d] rounded-full outline-none z-10"
          }
          whileHover={{scale: 1.1}} whileTap={{scale: 0.9}} whileFocus={{scale: 1.1}}
        />
      </div>


      {filterArticles.length <= 0 ?
        <span className={"font-bold text-[18px] md:text-[24px] lg:text-[32px] text-[#1d1d1f] select-none"}>
          你在找一种很新的东西
        </span> : filterArticles.map(item =>
        <div
          key={item.id}
          className={
            "h-[86px] w-[90vw] md:w-[80vw] lg:w-[60vw] max-w-[768px] bg-[#fbfbfd] mb-[56px] md:mb-[48px] lg:mb-[20px] " +
            "flex flex-col justify-between items-center select-none"
          }
        >
          <div className={"w-[100%] flex flex-row justify-between items-center"}>
            <div className={"flex flex-row justify-center items-center"}>
              <motion.span
                initial={{x: -64, opacity: 0}}
                whileInView={{x: 0, opacity: 1}}
                transition={{duration: 0.5}}
                className={"italic text-[12px] md:text-[16px] lg:text-[24px] text-[#1d1d1f] mr-[32px]"}
              >
                {`${new Date(item.create).getFullYear()}/${(new Date(item.create).getMonth() + 1).toString().padStart(2, '0')}/${new Date(item.create).getDate().toString().padStart(2, '0')}`}
              </motion.span>

              <motion.h1
                onClick={() => navigate('/article/' + item.id)}
                whileHover={{scale: 1.1}}
                whileTap={{scale: 0.9}}
                initial={{opacity: 0, scale: 0}}
                whileInView={{opacity: 1, scale: 1}}
                transition={{duration: 0.5}}
                className={"font-bold text-[18px] md:text-[24px] lg:text-[32px] text-[#1d1d1f] cursor-pointer"}
              >
                {item.title}
              </motion.h1>
            </div>

            <div className={"flex flex-row justify-end items-center"}>
              <motion.img
                initial={isLargeScreen ? {x: 100, rotate: 180, opacity: 0} : {x: 50, rotate: 180, opacity: 0}}
                whileInView={{x: 0, rotate: 0, opacity: 1}}
                whileHover={location.pathname !== '/info/' + item.username ? {scale: 1.1, rotate: 360} : {scale: 1, rotate: 360}}
                whileTap={location.pathname !== '/info/' + item.username ? {scale: 0.9} : {scale: 1}}
                transition={{duration: 0.5}}
                src={`${window.location.origin}/image/${item.avatar}`}
                alt={""} title={item.username}
                onClick={() => location.pathname !== '/info/' + item.username && navigate('/info/' + item.username)}
                className={
                  "w-[32px] h-[32px] lg:w-[64px] lg:h-[64px] " +
                  "object-contain rounded-full select-none ml-[16px] mr-[16px] " + (location.pathname !== '/info/' + item.username ? "cursor-pointer" : "")
                }
              />
            </div>
          </div>

          <motion.hr
            initial={{scale: 0}}
            whileInView={{scale: 1}}
            transition={{duration: 0.5}}
            className={"w-[100%] border-t border-dashed border-[#1d1d1f]"}
          />
        </div>
      )}
    </div>
  );
}

export default ArticlesMain;