import {useSelector} from "react-redux";
import {RootState} from "../../redux";
import useFetchMessages from "./useFetchMessages";
import useFetchMessagesByAuthor from "./useFetchMessagesByAuthor";
import {useState} from "react";
import {message} from "antd";
import { DeleteMessage } from "../../api/message";

const useManageMessage = () => {
  const user = useSelector((state: RootState) => state.user)
  const { messages, fetchData } = (() => user.power >= 1 ? useFetchMessages : useFetchMessagesByAuthor)()();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [title, setTitle] = useState("");
  const [manage, setManage] = useState<() => void>(() => () => {});
  const [messageApi, contextHolder] = message.useMessage();

  const handleDelete = (id: number) => {
    setManage(() => () => {
      DeleteMessage(id).then(res => {
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
    setTitle("确定删除该留言？");
    setIsModalOpen(true);
  }

  return {
    title,
    isModalOpen,
    setIsModalOpen,
    manage,
    contextHolder,
    messages,
    handleDelete,
  }
}

export default useManageMessage;