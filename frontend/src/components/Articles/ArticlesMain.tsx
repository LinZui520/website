import { Button, Flex } from 'antd';
import { GetAllArticle } from '../../api/article';
import './ArticlesMain.css'
import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';


interface Article {
  Article: {
    id: 0,
    author: 0,
    image: 0,
    title: '',
    content: '',
    creation: '',
    latest: '',
  },
  AuthorNickName: '',
  ImageFilename: '',
}


const ArticlesMain = () => {



  const [articles, setArticles] = useState<Article[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await GetAllArticle();
        if (res.data.code === 200) {
          setArticles(res.data.data)
        }
      } catch (_) {

      } 
    }
    fetchData()
  }, [])

  
  return (
    <Flex className="articles-main-container" wrap="wrap" gap="large">
      {articles.map(item => 

        <div className='article' key={item.Article.id}>
          <div className='article-image'>
            <img src={"/image/" + item.ImageFilename} draggable="false" />
          </div>
          <div style={{fontSize: '25px', fontWeight: 'bold', marginBottom: '5px'}}>{item.Article.title}</div>
          <div style={{fontSize: '15px', marginBottom: '5px'}}>作者：{item.AuthorNickName}</div>
          <div style={{fontSize: '15px', marginBottom: '30px'}}>
            发布于：{new Date(item.Article.creation).toLocaleString()}
          </div>
        </div>

      )}
    </Flex>
  );
}
  
export default ArticlesMain;