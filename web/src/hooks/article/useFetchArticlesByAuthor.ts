import {useCallback, useEffect, useState} from "react";
import {Article} from "./useFetchArticle";
import {GetArticleByAuthor} from "../../api/article";


const useFetchArticlesByAuthor = () => {
  const [articles, setArticles] = useState<Article[]>([])

  const fetchData = useCallback(async () => {
    try {
      const res = await GetArticleByAuthor();
      if (res.data.code === 200) {
        setArticles(res.data.data !== null ? res.data.data : []);
      } else {
        setArticles([])
      }
    } catch (_) {
      setArticles([])
    }
  }, []);

  useEffect(() => {
    fetchData().then(() => {});
  }, [fetchData]);

  return { articles, fetchData: fetchData };
}

export default useFetchArticlesByAuthor;