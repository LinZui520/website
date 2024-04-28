import {useCallback, useEffect, useState} from "react";
import {Comment} from "./useFetchComments";
import {GetCommentByAuthor} from "../../api/comment";

const useFetchCommentsByAuthor = () => {

  const [comments, setComments] = useState<Comment[]>([]);

  const fetchData = useCallback(async () => {
    try {
      const res = await GetCommentByAuthor();
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

export default useFetchCommentsByAuthor;