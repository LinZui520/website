import { useEffect } from "react";
import ArticlesMain from "../components/articles/ArticlesMain";
import ArticlesHeader from "../components/articles/ArticlesHeader";


const Articles = () => {


  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);


  return (
    <div style={{background: '#fbfbfd'}}>
      <ArticlesHeader />
      <ArticlesMain />
    </div>
  );
}

export default Articles;