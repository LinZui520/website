import {useCallback, useEffect, useState} from "react";
import {MessageCount} from "../../api/message";


const useFetchMessageCount = () => {
  const [messageCount, setMessageCount] = useState<number>(0);

  const count = useCallback(async () => {
    try {
      const res = await MessageCount();
      if (res.data.code === 200) {
        setMessageCount(res.data.data)
      } else {
        setMessageCount(0)
      }
    } catch (_) {
      setMessageCount(0)
    }
  },[])

  useEffect(() => {
    count().then(() => {})
  }, [count])

  return {
    messageCount
  }
}

export default useFetchMessageCount;