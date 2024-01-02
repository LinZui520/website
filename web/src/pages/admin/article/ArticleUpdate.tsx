import useFetchArticle from "../../../hooks/useFetchArticle";
import {useNavigate, useParams} from "react-router-dom";
import {useEffect, useState} from "react";
import {message} from "antd";
import {UpdateArticle} from "../../../api/article";
import ArticleMarkDown from "../../../components/admin/article/ArticleMarkDown";
import NotFind from "../../NotFind";

const ArticleUpdate = () => {
  const params = useParams()
  const navigate = useNavigate()
  const {article, status} = useFetchArticle(Number(params.id))

  const [title, setTitle] = useState('')
  const [content, setContent] = useState('')
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [messageApi, contextHolder] = message.useMessage()


  useEffect(() => {
    setTitle(article === undefined ? '' : article.title)
    setContent(article === undefined ? '' : article.content)
  }, [article, navigate, status]);


  const update = () => {
    if (title === '') {
      messageApi.warning("请输入标题").then(() => {})
      return
    }
    UpdateArticle(Number(params.id), title, content).then(res => {
      if (res.data.code === 200) {
        messageApi.success(res.data.message).then(() => {})
        setIsModalOpen(false)
      } else {
        messageApi.error(res.data.message).then(() => {})
      }
    }).catch(() => {
      messageApi.error("网络原因，更新失败").then(() => {})
    })
  }


  return (
    !status ? <NotFind /> :
    <ArticleMarkDown
      title={title} setTitle={setTitle}
      content={content} setContent={setContent}
      isModalOpen={isModalOpen} setIsModalOpen={setIsModalOpen}
      modalTitle={"更新文章"} contextHolder={contextHolder}
      operate={update}
    />
  );
}

export default ArticleUpdate;