import { useEffect } from "react";
import ArticlesMain from "../components/articles/ArticlesMain";
import ArticlesHeader from "../components/articles/ArticlesHeader";
import Footer from '../components/index/Footer';

const Articles = () => {


  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);


  return (
    <div>
      <ArticlesHeader />
      <ArticlesMain />
      <Footer />
    </div>
  );
}

export default Articles;