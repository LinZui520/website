import {MessageInstance} from "antd/es/message/interface";
import {UploadImage} from "../../api/image";

const useUploadImage = (messageApi:  MessageInstance) => {

  const uploadImage = async (files: File[], callback: (urls: string[]) => void) => {
    try {
      const res = await UploadImage(files[0])
      if (res.data.code === 200) {
        messageApi.success(res.data.message).then(() => {})
        callback([`${window.location.origin}/image/${res.data.data.filename}`])
      } else {
        messageApi.error(res.data.message).then(() => {})
      }
    } catch (_) {
      messageApi.error("网络原因，上传图片失败").then(() => {})
    }
  }

  return {
    uploadImage,
  }
}

export default useUploadImage;