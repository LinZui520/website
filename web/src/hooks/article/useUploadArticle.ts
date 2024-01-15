import {useState} from "react";
import {message} from "antd";
import {AddArticle} from "../../api/article";
import useUploadImage from "../image/useUploadImage";

const useUploadArticle = () => {
  const [title, setTitle] = useState('')
  const [content, setContent] = useState('')
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [messageApi, contextHolder] = message.useMessage()

  const upload = () => {
    if (title === '') {
      messageApi.warning("请输入标题").then(() => {})
      return
    }
    AddArticle(title, content).then(res => {
      if (res.data.code === 200) {
        messageApi.success(res.data.message).then(() => {})
        setTitle('')
        setContent('')
        setIsModalOpen(false)
      } else {
        messageApi.error(res.data.message).then(() => {})
      }
    }).catch(() => {
      messageApi.error("网络原因，上传失败").then(() => {})
    })
  }

  const { uploadImage } = useUploadImage(messageApi)

  return {
    title,
    setTitle,
    content,
    setContent,
    isModalOpen,
    setIsModalOpen,
    contextHolder,
    upload,
    uploadImage
  }

}

export default useUploadArticle;