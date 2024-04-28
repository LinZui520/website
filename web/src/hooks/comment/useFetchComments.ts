import {useCallback, useEffect, useState} from "react"
import {GetComments} from "../../api/comment";

export interface Comment {
  id: number
  author: number
  avatar: string
  username: string
  article: number
  title: string,
  content: string
  create: string
}

const useFetchComments = () => {

  const [comments, setComments] = useState<Comment[]>([]);

  const fetchData = useCallback(async () => {
    try {
      const res = await GetComments();
      if (res.data.code === 200) {
        setComments(res.data.data !== null ? res.data.data : []);
      } else {
        setComments([])
      }
    } catch (_) {
      setComments([])
    }
  }, []);

  useEffect(() => {
    fetchData().then(() => {});
  }, [fetchData]);

  return { comments, fetchData: fetchData };
}

export default useFetchComments;