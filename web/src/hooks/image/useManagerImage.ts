import {useState} from "react";
import {message} from "antd";
import useFetchImage from "./useFetchImages";
import {DeleteImage} from "../../api/image";


const useManagerImage = () => {
  const {images, fetchData} = useFetchImage()
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [title, setTitle] = useState("");
  const [manage, setManage] = useState<() => void>(() => () => {});
  const [messageApi, contextHolder] = message.useMessage();


  const handleDelete = (id: number) => {
    setManage(() => () => {
      DeleteImage(id).then(res => {
        if (res.data.code === 200) {
          messageApi.success(res.data.message).then(() => {});
          fetchData().then(() => {});
          setIsModalOpen(false);
        } else {
          messageApi.error(res.data.message).then(() => {});
        }
      }).catch(() => {
        messageApi.error("网络原因，删除失败").then(() => {});
      });
    });
    setTitle("确定删除该图片？");
    setIsModalOpen(true);
  };


  return {
    title,
    isModalOpen,
    setIsModalOpen,
    manage,
    contextHolder,
    images,
    handleDelete,
  }
}

export default useManagerImage;