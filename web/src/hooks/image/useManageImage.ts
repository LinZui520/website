import {useState} from "react";
import {message} from "antd";
import {DeleteImage} from "../../api/image";
import { useSelector } from "react-redux";
import { RootState } from "../../redux";
import useFetchImagesByAuthor from "./useFetchImagesByAuthor";
import useFetchImages from "./useFetchImages";


const useManageImage = () => {
  const user = useSelector((state: RootState) => state.user)
  const {images, fetchData} = (() => user.power >= 1 ? useFetchImages : useFetchImagesByAuthor)()();
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

  const handleCopy = (url: string) => {
    navigator.clipboard.writeText(url).then(() => {
      messageApi.success("复制成功").then(() => {});
    }).catch(() => {
      messageApi.error("复制失败").then(() => {});
    })
  }

  return {
    user,
    title,
    isModalOpen,
    setIsModalOpen,
    manage,
    contextHolder,
    images,
    handleDelete,
    handleCopy
  }
}

export default useManageImage;