import { useEffect } from "react";
import ArticlesMain from "../components/articles/ArticlesMain";
import ArticlesHeader from "../components/articles/ArticlesHeader";
import Footer from '../components/index/Footer';
import useFetchArticles from "../hooks/article/useFetchArticles";

const Articles = () => {

  const {articles} = useFetchArticles()

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);


  return (
    <div>
      <ArticlesHeader />
      <ArticlesMain articles={articles}/>
      <Footer />
    </div>
  );
}

export default Articles;