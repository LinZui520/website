import {useCallback, useEffect, useState} from "react";
import {Article} from "./useFetchArticle";
import { GetArticlesById } from "../../api/article";


const useFetchUserInfoArticles = (id: number) => {

  const [articles, setArticles] = useState<Article[]>([]);
  const [isLoaded, setIsLoaded] = useState(false);

  const fetchData = useCallback(async (id: number) => {
    if (id === 0) return
    try {
      const res = await GetArticlesById(id);
      if (res.data.code === 200) {
        setArticles(res.data.data !== null ? res.data.data : []);
      } else {
        setArticles([])
      }
    } catch (_) {
      setArticles([])
    } finally {
      setIsLoaded(true)
    }
  }, []);

  useEffect(() => {
    fetchData(id).then(() => {});
  }, [fetchData, id]);

  return { articles, isLoaded, fetchData: fetchData };
}

export default useFetchUserInfoArticles;