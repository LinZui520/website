import {useEffect, useState} from "react";
import {GetCount} from "../../../api/admin";
import CountUp from "react-countup";
import { Statistic } from "antd";


const Count = () => {
  const [CountOfUser, setCountOfUser] = useState(0)
  const [CountOfArticle, setCountOfArticle] = useState(0)
  const [CountOfMessage, setCountOfMessage] = useState(0)


  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await GetCount();
        if (res.data.code === 200) {
          setCountOfUser(res.data.data.user)
          setCountOfArticle(res.data.data.article)
          setCountOfMessage(res.data.data.message)
        }
      } catch (_) {

      }
    }
    fetchData().then(() => {})
  }, []);

  return (
    <div style={{paddingTop: '30px'}}>
      <div style={{display: 'flex', flexDirection: 'row', justifyContent: 'space-evenly'}}>
        <Statistic title="用户总数" value={CountOfUser} formatter={() => <CountUp end={CountOfUser} separator="," />} />
        <Statistic title="文章总数" value={CountOfArticle} formatter={() => <CountUp end={CountOfArticle} separator="," />} />
        <Statistic title="留言总数" value={CountOfMessage} formatter={() => <CountUp end={CountOfMessage} separator="," />} />
      </div>

    </div>
  )
    ;
}

export default Count;