import ArticleMarkDown from "../../../components/admin/article/ArticleMarkDown";
import NotFind from "../../NotFind";
import useUpdateArticle from "../../../hooks/article/useUpdateArticle";

const ArticleUpdate = () => {

  const {
    status,
    title,
    setTitle,
    content,
    setContent,
    isModalOpen,
    setIsModalOpen,
    contextHolder,
    update,
    uploadImage,
  } = useUpdateArticle()


  return (
    !status ? <NotFind /> :
    <ArticleMarkDown
      title={title} setTitle={setTitle}
      content={content} setContent={setContent}
      isModalOpen={isModalOpen} setIsModalOpen={setIsModalOpen}
      modalTitle={"更新文章"} contextHolder={contextHolder}
      operate={update}
      uploadImage={uploadImage}
    />
  );
}

export default ArticleUpdate;