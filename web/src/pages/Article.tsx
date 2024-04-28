import { MdPreview } from "md-editor-rt";
import { useParams } from "react-router-dom";
import useFetchArticle from "../hooks/article/useFetchArticle";
import NotFind from "./NotFind";
import Comment from "../components/article/Comment";

const Article = () => {
  const params = useParams()
  const {article, status} = useFetchArticle(Number(params.id))

  return (
    !status ? <NotFind /> :
    <div className={"flex flex-col items-center w-screen"}>
      <MdPreview
        className={"bg-[#fbfbfd] min-h-screen w-[80vw] max-w-[800px]"}
        modelValue={article.content}
      />

      <Comment article={Number(params.id)} />
    </div>
  );
}

export default Article;