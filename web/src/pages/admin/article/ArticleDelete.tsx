import ArticleTable from "../../../components/admin/article/ArticleTable";
import { DeleteArticle } from "../../../api/article";
import {message, Modal} from "antd";
import { useState } from "react";
import useFetchArticles from "../../../hook/useFetchArticles";

const ArticleDelete = () => {

  const [id, setId] = useState(0);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [messageApi, contextHolder] = message.useMessage()

 const {articles, fetchData} = useFetchArticles()

  return (
    <div>
      {contextHolder}
      <Modal
        title="确定删除该文章？"
        open={isModalOpen}
        onCancel={() => setIsModalOpen(false)}
        onOk={() => {
          DeleteArticle(id).then(res => {
            if (res.data.code === 200) {
              messageApi.success(res.data.message).then(() => {})
              fetchData().then(() => {})
              setIsModalOpen(false)
            } else {
              messageApi.error(res.data.message).then(() => {})
            }
          }).catch(() => {
            messageApi.error("网络原因，删除失败").then(() => {})
          })
        }}
      >
      </Modal>
      <ArticleTable
        operate={"删除"}
        articles={articles}
        effect={(id: number) => {
          setIsModalOpen(true)
          setId(id)
        }}
      />
    </div>
  );
}

export default ArticleDelete;