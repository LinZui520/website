import {GetCommentByArticle} from "../../api/comment";
import {useCallback, useEffect, useState} from "react";
import {Comment} from "./useFetchComments";


const useFetchCommentsByArticle = (article: number) => {

  const [comments, setComments] = useState<Comment[]>([]);

  const fetchData = useCallback(async () => {
    try {
      const res = await GetCommentByArticle(article);
      if (res.data.code === 200) {
        setComments(res.data.data !== null ? res.data.data : []);
      } else {
        setComments([])
      }
    } catch (_) {
      setComments([])
    }
  }, [article]);

  useEffect(() => {
    if (article === 0) return
    fetchData().then(() => {});
  }, [fetchData, article]);

  return { comments, fetchData: fetchData };
}

export default useFetchCommentsByArticle;