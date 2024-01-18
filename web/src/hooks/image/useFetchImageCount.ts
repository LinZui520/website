import {useCallback, useEffect, useState} from "react";
import { ImageCount } from "../../api/image";

const useFetchImageCount = () => {
  const [imageCount, setImageCount] = useState<number>(0);

  const count = useCallback(async () => {
    try {
      const res = await ImageCount();
      if (res.data.code === 200) {
        setImageCount(res.data.data)
      } else {
        setImageCount(0)
      }
    } catch (_) {
      setImageCount(0)
    }
  },[])

  useEffect(() => {
    count().then(() => {})
  }, [count])

  return {
    imageCount
  }
}

export default useFetchImageCount;