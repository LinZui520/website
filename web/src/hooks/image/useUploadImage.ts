import {MessageInstance} from "antd/es/message/interface";
import {UploadImage} from "../../api/image";

const useUploadImage = (messageApi:  MessageInstance) => {

  const uploadImage = (files: Array<File>) => {
    UploadImage(files[0]).then(res => {
      if (res.data.code === 200) {
        messageApi.success(res.data.message).then(() => {})
      } else {
        messageApi.error(res.data.message).then(() => {})
      }
    }).catch(() => {
      messageApi.error("网络原因，上传图片失败").then(() => {})
    })
  }

  return {
    uploadImage,
  }
}

export default useUploadImage;