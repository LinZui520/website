import {useState} from "react";
import {Modal} from "antd";
import useFetchArticles from "../../../hook/useFetchArticles";
import ArticleTable from "../../../components/admin/article/ArticleTable";
import {useNavigate} from "react-router-dom";


const ArticleUpdate = () => {

  const [id, setId] = useState(0);
  const navigate = useNavigate()
  const [isModalOpen, setIsModalOpen] = useState(false);

  const {articles} = useFetchArticles()


  return (
    <div>
      <Modal
        title="确定修改该文章？"
        open={isModalOpen}
        onCancel={() => setIsModalOpen(false)}
        onOk={() => {
          navigate('/admin/article/update/' + id)
        }}
      >
      </Modal>
      <ArticleTable
        operate={"修改"}
        articles={articles}
        effect={(id: number) => {
          setIsModalOpen(true)
          setId(id)
        }}
      />
    </div>
  );
}

export default ArticleUpdate;