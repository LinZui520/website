import { MdPreview } from "md-editor-rt";
import { useParams } from "react-router-dom";
import useFetchArticle from "../hooks/useFetchArticle";
import NotFind from "./NotFind";

const Article = () => {
  const params = useParams()
  const {article, status} = useFetchArticle(Number(params.id))

  return (
    !status ? <NotFind /> :
    <div className={"flex flex-col items-center w-screen"}>
      <MdPreview
        className={"bg-[#fbfbfd] min-h-screen w-[80vw] max-w-[800px]"}
        modelValue={article ? article.content: ""}
      />
    </div>
  );
}

export default Article;