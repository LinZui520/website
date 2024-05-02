import { useEffect } from "react";
import ArticlesMain from "../components/articles/ArticlesMain";
import ArticlesHeader from "../components/articles/ArticlesHeader";
import Footer from '../components/index/Footer';
import useFetchArticles from "../hooks/article/useFetchArticles";
import { useLocation } from "react-router-dom";

const Articles = () => {

  const { articles, isLoaded } = useFetchArticles()

  const location = useLocation();

  useEffect(() => {
    if (isLoaded) window.scrollTo(0, 0);
  }, [location, isLoaded]);


  return (
    !isLoaded ? <div /> :
    <>
      <ArticlesHeader />
      <ArticlesMain articles={articles}/>
      <Footer />
    </>
  );
}

export default Articles;