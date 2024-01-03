import { message } from "antd";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { DeleteArticle } from "../../api/article";
import useFetchArticles from "./useFetchArticles";

const useManageArticle = () => {
  const navigate = useNavigate();
  const {articles, fetchData} = useFetchArticles()
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [title, setTitle] = useState("");
  const [manage, setManage] = useState<() => void>(() => () => {});
  const [messageApi, contextHolder] = message.useMessage();

  const handleDelete = (id: number) => {
    setManage(() => () => {
      DeleteArticle(id).then(res => {
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
    setTitle("确定删除该文章？");
    setIsModalOpen(true);
  };

  const handleUpdate = (id: number) => {
    setManage(() => () => {
      navigate(`/admin/article/update/${id}`);
      setIsModalOpen(false);
    });
    setTitle("确定修改该文章？");
    setIsModalOpen(true);
  };

  const handleView = (id: number) => {
    setManage(() => () => {
      navigate(`/article/${id}`);
      setIsModalOpen(false);
    });
    setTitle("确定查看该文章？");
    setIsModalOpen(true);
  };

  return {
    isModalOpen,
    setIsModalOpen,
    title,
    articles,
    manage,
    contextHolder,
    handleDelete,
    handleUpdate,
    handleView,
  };
}

export default useManageArticle;