import { useNavigate, useParams } from 'react-router-dom';
import { GetOneArticle } from '../api/article';
import { useEffect, useState } from 'react';
import { MdPreview } from 'md-editor-rt';
import 'md-editor-rt/lib/preview.css';

interface ArticleData {
  id: number,
  author: number,
  image: number,
  title: string,
  content: string,
  creation: string,
  latest: string,
}


const Article = () => {

  const params = useParams()
  const navigate = useNavigate()

  const [article, setArticle] = useState<ArticleData>();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await GetOneArticle(Number(params.id));
        if (res.data.code === 200) {
          setArticle(res.data.data)
        } else {
          navigate("/404")
        }
      } catch (_) {

      }
    }
    fetchData().then(() => {})
  }, [params, navigate])

  
  return (
    <div style={{width: '100vw', display: 'flex', flexDirection: 'column', alignItems: 'center'}}>
      <MdPreview style={{width: '80vw', maxWidth: '800px'}} modelValue={article ? article.content: ""} />
    </div>
  );
}
  
export default Article;