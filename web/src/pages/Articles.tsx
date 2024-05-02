import { useEffect } from "react";
import ArticlesMain from "../components/articles/ArticlesMain";
import ArticlesHeader from "../components/articles/ArticlesHeader";
import Footer from '../components/index/Footer';
import useFetchArticles from "../hooks/article/useFetchArticles";
import { useLocation } from "react-router-dom";
import ScrollBar from "../components/index/ScrollBar";

const Articles = () => {

  const { articles, isLoaded } = useFetchArticles()

  const location = useLocation();

  useEffect(() => {
    if (isLoaded) window.scrollTo(0, 0);
  }, [location, isLoaded]);


  return (
    !isLoaded ? <div /> :
    <>
      <ScrollBar />
      <ArticlesHeader />
      <ArticlesMain articles={articles}/>
      <Footer />
    </>
  );
}

export default Articles;