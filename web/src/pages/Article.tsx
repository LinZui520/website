import { MdPreview } from "md-editor-rt";
import {useEffect, useState } from "react";
import {useNavigate, useParams } from "react-router-dom";
import { GetOneArticle } from "../api/article";

interface ArticleData {
  id: number
  author: number
  avatar: string
  username: string
  title: string,
  content: string
  create: string
  update: string
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
    <div
      style={{
        width: '100vw', display: 'flex', flexDirection: 'column',
        alignItems: 'center', background: '#fbfbfd'
      }}
    >
      <MdPreview
        style={{width: '80vw', maxWidth: '800px', background: '#fbfbfd'}}
        modelValue={article ? article.content: ""}
      />
    </div>
  );
}

export default Article;