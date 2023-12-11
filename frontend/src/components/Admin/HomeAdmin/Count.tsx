import {useEffect, useState} from "react";
import {GetCount} from "../../../api/admin";
import CountUp from "react-countup";


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
        <div style={{display: 'flex', flexDirection: 'column', alignItems: 'center'}}>
          <span>用户总数</span>
          <CountUp style={{fontSize: '24px'}} end={CountOfUser} duration={1}/>
        </div>
        <div style={{display: 'flex', flexDirection: 'column', alignItems: 'center'}}>
          <span>文章总数</span>
          <CountUp style={{fontSize: '24px'}} end={CountOfArticle} duration={1}/>
        </div>

        <div style={{display: 'flex', flexDirection: 'column', alignItems: 'center'}}>
          <span>留言总数</span>
          <CountUp style={{fontSize: '24px'}} end={CountOfMessage} duration={1}/>
        </div>
      </div>

    </div>
  )
    ;
}

export default Count;