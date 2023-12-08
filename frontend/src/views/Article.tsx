import { useParams } from 'react-router-dom';
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

  const { id } = useParams()

  const [article, setArticle] = useState<ArticleData>({
    id: 0,
    author: 0,
    image: 0,
    title: '',
    content: '',
    creation: '',
    latest: '',
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await GetOneArticle(Number(id));
        if (res.data.code === 200) {
          setArticle(res.data.data)
        }
      } catch (_) {

      } 
    }
    fetchData()
  }, [id])

  
  return (
    <div style={{width: '100vw', display: 'flex', flexDirection: 'column', alignItems: 'center'}}>
      <MdPreview style={{width: '80vw', maxWidth: '800px'}} modelValue={article.content} />
    </div>
  );
}
  
export default Article;