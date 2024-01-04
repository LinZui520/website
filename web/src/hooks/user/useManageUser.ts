import {useState} from "react";
import {message} from "antd";
import useFetchUsers from "./useFetchUsers";
import {BlockUser, BoostUser} from "../../api/user";


const useManageUser = () => {
  const {users, fetchData} = useFetchUsers()
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [title, setTitle] = useState("");
  const [manage, setManage] = useState<() => void>(() => () => {});
  const [messageApi, contextHolder] = message.useMessage();

  const handleBlock = (id: number) => {
    setManage(() => () => {
      BlockUser(id).then(res => {
        if (res.data.code === 200) {
          messageApi.success(res.data.message).then(() => {})
          fetchData().then(() => {})
          setIsModalOpen(false)
        } else {
          messageApi.error(res.data.message).then(() => {})
        }
      }).catch(() => {
        messageApi.error("网络原因，封禁失败").then(() => {})
      })
    })
    setTitle("确定封禁该用户？")
    setIsModalOpen(true);
  };

  const handleBoost = (id: number) => {
    setManage(() => () => {
      BoostUser(id).then(res => {
        if (res.data.code === 200) {
          messageApi.success(res.data.message).then(() => {})
          fetchData().then(() => {})
          setIsModalOpen(false)
        } else {
          messageApi.error(res.data.message).then(() => {})
        }
      }).catch(() => {
        messageApi.error("网络原因，封禁失败").then(() => {})
      })
    })
    setTitle("确定提升该用户权限？")
    setIsModalOpen(true);
  };

  return {
    title,
    isModalOpen,
    setIsModalOpen,
    manage,
    contextHolder,
    users,
    handleBlock,
    handleBoost,
  };
}

export default useManageUser;