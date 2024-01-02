import {motion} from "framer-motion";
import {useNavigate} from "react-router-dom";
import useFetchArticles from "../../hooks/useFetchArticles";
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
            "max-w-[600px] max-h-[300px]  " +
            "flex flex-col justify-center items-center " +
            "cursor-pointer select-none rounded-[25px] p-[5px]"
          }
        >
          <h1 className={"text-[28px] text-[#fbfbfd] mb-[2vw]"}>
            {item.title}
          </h1>
          <div className={"text-[14px] text-[#fbfbfd]"}>作者：{item.username}</div>
          <div className={"text-[14px] text-[#fbfbfd]"}>发表时间：{new Date(item.create).toLocaleString()}</div>
        </motion.div>
      )}
    </div>
  );
}

export default ArticlesMain;