import ArticleTable from "../../../components/admin/article/ArticleTable";
import {DeleteArticle, GetAllArticle} from "../../../api/article";
import {message, Modal} from "antd";
import {useCallback, useEffect, useState } from "react";

interface Article {
  id: number
  author: number
  avatar: string
  username: string
  title: string,
  content: string
  create: string
  update: string
}

const ArticleDelete = () => {

  const [id, setId] = useState(0);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [messageApi, contextHolder] = message.useMessage()

  const [articles, setArticles] = useState<Article[]>([]);

  const fetchData = useCallback(async () => {
    try {
      const res = await GetAllArticle();
      if (res.data.code === 200) {
        if (res.data.data !== null) {
          setArticles(res.data.data)
        } else {
          setArticles([])
        }
      }
    } catch (_) {

    }
  }, [])


  useEffect(() => {
    fetchData().then(() => {})
  }, [fetchData])


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