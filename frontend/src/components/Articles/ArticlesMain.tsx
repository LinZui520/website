import { Flex } from 'antd';
import { GetAllArticle } from '../../api/article';
import { useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import './ArticlesMain.css'

interface Article {
  Article: {
    id: number,
    author: number,
    image: number,
    title: string,
    content: string,
    creation: string,
    latest: string,
  },
  AuthorNickName: string,
  ImageFilename: string,
}


const ArticlesMain = () => {

  const navigate = useNavigate()

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
        <div className='article' key={item.Article.id} onClick={() => {
          navigate('/article/' + item.Article.id)
        }}>
          <div className='article-image'>
            <img src={"/image/" + item.ImageFilename} alt={item.Article.title} draggable="false" />
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