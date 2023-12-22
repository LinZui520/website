import {useState} from "react";
import {useNavigate} from "react-router-dom";
import useFetchArticles from "../../../hook/useFetchArticles";
import {Modal} from "antd";
import ArticleTable from "../../../components/admin/article/ArticleTable";


const ArticleView = () => {
  const [id, setId] = useState(0);
  const navigate = useNavigate()
  const [isModalOpen, setIsModalOpen] = useState(false);

  const {articles} = useFetchArticles()


  return (
    <div>
      <Modal
        title="确定查看该文章？"
        open={isModalOpen}
        onCancel={() => setIsModalOpen(false)}
        onOk={() => {
          navigate('/article/' + id)
        }}
      >
      </Modal>
      <ArticleTable
        operate={"查看"}
        articles={articles}
        effect={(id: number) => {
          setIsModalOpen(true)
          setId(id)
        }}
      />
    </div>
  );
}

export default ArticleView;