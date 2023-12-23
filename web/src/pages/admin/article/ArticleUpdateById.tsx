import useFetchArticle from "../../../hook/useFetchArticle";
import {useNavigate, useParams} from "react-router-dom";
import {useEffect, useState} from "react";
import {Input, message, Modal} from "antd";
import {MdEditor} from "md-editor-rt";
import {UpdateArticle} from "../../../api/article";

const ArticleUpdateById = () => {
  const params = useParams()
  const navigate = useNavigate()
  const {article, status} = useFetchArticle(Number(params.id))

  const [title, setTitle] = useState('')
  const [content, setContent] = useState('')
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [messageApi, contextHolder] = message.useMessage()


  useEffect(() => {
    if (!status) {
      navigate("/404")
    }
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
    <div className={"flex flex-col"}>
      {contextHolder}
      <Modal title="提交博客" open={isModalOpen} onOk={update} onCancel={() => setIsModalOpen(false)}>
        <Input
          placeholder="文章标题" value={title}
          onChange={(e) => {
            setTitle(e.target.value)
          }}
        />
      </Modal>
      <MdEditor
        className={"h-screen"}
        modelValue={content}
        onChange={setContent}
        toolbars={[
          'sub', 'sup', '-',
          'image', '-',
          'save', '-', '=',
          'pageFullscreen', 'fullscreen'
        ]}
        onSave={() => setIsModalOpen(true)}
        onUploadImg={() => {

        }}
      />
    </div>
  );
}

export default ArticleUpdateById;