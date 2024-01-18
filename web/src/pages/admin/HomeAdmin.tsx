import CountUp from "react-countup";
import useFetchUserCount from "../../hooks/user/useFetchUserCount";
import useFetchArticleCount from "../../hooks/article/useFetchArticleCount";
import useFetchImageCount from "../../hooks/image/useFetchImageCount";
import useFetchMessageCount from "../../hooks/message/useFetchMessageCount";

const Statistic = ({title, count}: {title: string, count: number}) => {
  return (
    <div className={"flex flex-row items-center text-[#1d1d1f] text-[16px]"}>
      <span>{title}：</span>
      <CountUp end={count} separator=","/>
    </div>
  );
}

const HomeAdmin = () => {

  const { userCount } = useFetchUserCount()
  const { articleCount } = useFetchArticleCount()
  const { imageCount } = useFetchImageCount()
  const { messageCount } = useFetchMessageCount()

  return (
    <div className={"flex flex-col justify-around items-center bg-[#fbfbfd] h-screen w-[80vw]"}>
      <div className={"flex flex-col lg:flex-row justify-evenly items-center w-[80vw] select-none"}>
        <Statistic title={"用户总数"} count={userCount} />
        <Statistic title={"文章总数"} count={articleCount} />
        <Statistic title={"图片总数"} count={imageCount} />
        <Statistic title={"留言总数"} count={messageCount} />
      </div>
    </div>
  );
}

export default HomeAdmin;