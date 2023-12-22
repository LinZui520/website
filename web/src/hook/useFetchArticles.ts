import { useState, useEffect, useCallback } from 'react';
import { GetAllArticle } from '../api/article';

interface Article {
  id: number
  author: number
  avatar: string
  username: string
  title: string,
  content: string
  create: string
  update: string
}

const useFetchArticles = () => {
  const [articles, setArticles] = useState<Article[]>([])


  const fetchData = useCallback(async () => {
    try {
      const res = await GetAllArticle();
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
};

export default useFetchArticles;