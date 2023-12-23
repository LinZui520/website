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
    <div className={"flex flex-col items-center w-screen"}>
      <MdPreview
        className={"bg-[#fbfbfd] min-h-screen w-[80vw] max-w-[800px]"}
        modelValue={article ? article.content: ""}
      />
    </div>
  );
}

export default Article;