import {useSelector} from "react-redux";
import {RootState} from "../../redux";
import useFetchComments from "./useFetchComments";
import useFetchCommentsByAuthor from "./useFetchCommentsByAuthor";
import {useState} from "react";
import {message} from "antd";
import {DeleteComment} from "../../api/comment";

const useManagerComment = () => {
  const user = useSelector((state: RootState) => state.user)
  const { comments, fetchData } = (() => user.power >= 1 ? useFetchComments : useFetchCommentsByAuthor)()();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [title, setTitle] = useState("");
  const [manage, setManage] = useState<() => void>(() => () => {});
  const [messageApi, contextHolder] = message.useMessage();

  const handleDelete = (id: number) => {
    setManage(() => () => {
      DeleteComment(id).then(res => {
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
    setTitle("确定删除该评论？");
    setIsModalOpen(true);
  }

  return {
    title,
    isModalOpen,
    setIsModalOpen,
    manage,
    contextHolder,
    comments,
    handleDelete,
  }
}

export default useManagerComment;