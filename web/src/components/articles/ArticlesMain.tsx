import {motion} from "framer-motion";
import {useNavigate} from "react-router-dom";
import useFetchArticles from "../../hooks/article/useFetchArticles";
import React from "react";

const ArticlesMain = () => {

  const navigate = useNavigate()
  const {articles} = useFetchArticles()

  return (
    <div className={"w-screen bg-[#1d1d1f] min-h-screen flex flex-col justify-evenly items-center"}>
      {articles.map(item =>
        <motion.div
          key={item.id}
          onClick={() => navigate('/article/' + item.id)}
          whileHover={{scale: 1.1}}
          whileTap={{scale: 0.9}}
          initial={{opacity: 0, scale: 0}}
          whileInView={{opacity: 1, scale: 1}}
          transition={{duration: 0.5}}
          className={
            "border-2 border-white w-[90vw] h-[45vw] m-[5vw] " +
            "max-w-[600px] max-h-[300px] flex flex-col " +
            "cursor-pointer select-none rounded-[25px]"
          }
        >
          <div className={"flex flex-row items-center w-[100%] mt-[16px]"}>
            <img
              src={`${window.location.origin}/image/${item.avatar}`} alt={""}
              className={"w-[32px] h-[32px] lg:w-[64px] lg:h-[64px] " +
                "object-contain rounded-full select-none ml-[16px] mr-[16px]"}
            />
            <div className={"flex flex-col justify-center"}>
              <div className={"text-[12px] lg:text-[24px] text-[#fbfbfd]"}>
                {item.username}
              </div>
              <div className={"text-[8px] lg:text-[16px] text-[#fbfbfd]"}>
                {new Date(item.create).toLocaleString()}
              </div>
            </div>
          </div>

          <div className={"flex flex-auto flex-col justify-center items-center w-[100%]"}>
            <h1 className={"text-[16px] lg:text-[24px] text-[#fbfbfd]"}>
              {item.title}
            </h1>
          </div>
        </motion.div>
      )}
    </div>
  );
}

export default ArticlesMain;