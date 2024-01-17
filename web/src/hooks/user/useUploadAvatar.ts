import { UploadAvatar } from "../../api/user";
import React from "react";
import {updateAvatar} from "../../redux/user";
import { useDispatch } from "react-redux";


const useUploadAvatar = () => {

  const dispatch = useDispatch()

  const uploadAvatar = async (e: React.ChangeEvent<HTMLInputElement>) => {
    try {
      if (e.target.files === null) return;
      const file = e.target.files[0];
      const res = await UploadAvatar(file);
      if (res.data.code === 200) {
        dispatch(updateAvatar(res.data.data))
      }
    } catch (err) {

    }
  }

  return { uploadAvatar };
}

export default useUploadAvatar;