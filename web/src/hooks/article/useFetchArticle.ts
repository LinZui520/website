import {useCallback, useEffect, useState} from "react";
import {GetOneArticle} from "../../api/article";

export interface Article {
  id: number
  author: number
  avatar: string
  username: string
  title: string,
  content: string
  create: string
  update: string
}

const useFetchArticle = (id: number) => {
  const [status, setStatus] = useState(true)
  const [article, setArticle] = useState<Article>({
    id: 0, author: 0, avatar: '', username: '', title: '', content: '', create: '', update: ''
  });

  const fetchData = useCallback(async () => {
    try {
      const res = await GetOneArticle(id);
      if (res.data.code === 200) {
        setArticle(res.data.data)
        setStatus(true)
      } else {
        setStatus(false)
      }
    } catch (_) {
      setStatus(false)
    }
  }, [id])

  useEffect(() => {
    if (id === 0) return
    fetchData().then(() => {});
  }, [fetchData, id]);

  return { article, status, fetchData: fetchData };
}

export default useFetchArticle;