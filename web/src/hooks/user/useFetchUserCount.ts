import {useCallback, useEffect, useState} from "react";
import { UserCount } from "../../api/user";

const useFetchUserCount = () => {

  const [userCount, setUserCount] = useState<number>(0);

  const count = useCallback(async () => {
    try {
      const res = await UserCount();
      if (res.data.code === 200) {
        setUserCount(res.data.data)
      } else {
        setUserCount(0)
      }
    } catch (_) {
      setUserCount(0)
    }
  },[])

  useEffect(() => {
    count().then(() => {})
  }, [count])

  return {
    userCount
  }
}

export default useFetchUserCount;