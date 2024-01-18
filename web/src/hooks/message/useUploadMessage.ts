import {AddMessage} from "../../api/message";
import React from "react";
import {useSelector} from "react-redux";
import {RootState} from "../../redux";

const useUploadMessage = (fetchData: () => {}, callback: React.Dispatch<React.SetStateAction<string>>) => {

  const user = useSelector((state: RootState) => state.user)

  return (content: string) => {
    if (content === "") return
    if (user.id === 0) return callback("请先登录！")
    AddMessage(content).then(res => {
      if (res.data.code !== 200) return callback("error!")
      callback("");
      fetchData()
    }).catch(() => {
      callback("error!");
    })
  }
}

export default useUploadMessage;