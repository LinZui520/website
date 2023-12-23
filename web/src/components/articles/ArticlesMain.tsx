import {motion} from "framer-motion";
import {useNavigate} from "react-router-dom";
import useFetchArticles from "../../hook/useFetchArticles";

const ArticlesMain = () => {

  const navigate = useNavigate()

  const {articles} = useFetchArticles()

  return (
    <div className={"w-screen bg-[#1d1d1f] min-h-screen flex flex-wrap justify-evenly items-center"}>
      {articles.map(item =>
        <motion.div
          key={item.id}
          onClick={() => navigate('/article/' + item.id)}
          whileHover={{scale: 1.2}}
          whileTap={{scale: 0.9}}
          className={
            "bg-[#fbfbfd] w-[30vw] h-[40vw] m-[5vw] " +
            "max-w-[300px] max-h-[400px] min-w-[240px] min-h-[320px] " +
            "flex flex-col justify-start items-center " +
            "cursor-pointer select-none rounded-[25px] p-[5px]"
          }
        >
          <h1 className={"text-[32px] text-[#1d1d1f] mb-[5vw]"}>{item.title}</h1>
          <div className={"text-[32px] text-[#1d1d1f] mb-[5vw]"}>作者：{item.username}</div>
          <div className={"text-[24px] text-[#1d1d1f]"}>发表时间：</div>
          <div className={"text-[24px] text-[#1d1d1f]"}>{new Date(item.create).toLocaleString()}</div>
        </motion.div>
      )}
    </div>
  );
}

export default ArticlesMain;