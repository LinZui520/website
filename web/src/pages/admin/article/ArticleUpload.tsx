import 'md-editor-rt/lib/style.css';
import ArticleMarkDown from "../../../components/admin/article/ArticleMarkDown";
import useUploadArticle from "../../../hooks/article/useUploadArticle";

const ArticleUpload = () => {

  const {
    title,
    setTitle,
    content,
    setContent,
    isModalOpen,
    setIsModalOpen,
    contextHolder,
    upload,
    uploadImage
  } = useUploadArticle()

  return (
    <ArticleMarkDown
      title={title} setTitle={setTitle}
      content={content} setContent={setContent}
      isModalOpen={isModalOpen} setIsModalOpen={setIsModalOpen}
      modalTitle={"提交文章"} contextHolder={contextHolder}
      operate={upload}
      uploadImage={uploadImage}
    />
  );
}

export default ArticleUpload;