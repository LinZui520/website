import {useCallback, useEffect, useState} from "react";
import { ArticleCount } from "../../api/article";

const useFetchArticleCount = () => {

  const [articleCount, setArticleCount] = useState<number>(0);

  const count = useCallback(async () => {
    try {
      const res = await ArticleCount();
      if (res.data.code === 200) {
        setArticleCount(res.data.data)
      } else {
        setArticleCount(0)
      }
    } catch (_) {
      setArticleCount(0)
    }
  },[])

  useEffect(() => {
    count().then(() => {})
  }, [count])

  return {
    articleCount
  }
}

export default useFetchArticleCount;