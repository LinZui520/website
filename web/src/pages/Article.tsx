import { MdPreview } from "md-editor-rt";
import { useEffect } from "react";
import {useNavigate, useParams } from "react-router-dom";
import useFetchArticle from "../hook/useFetchArticle";

const Article = () => {
  const params = useParams()
  const navigate = useNavigate()
  const {article, status} = useFetchArticle(Number(params.id))

  useEffect(() => {
    if (!status) {
      navigate("/404")
    }
  }, [navigate, status]);


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