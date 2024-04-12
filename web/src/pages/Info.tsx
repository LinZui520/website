import { motion } from "framer-motion";
import {useSelector} from "react-redux";
import NotFind from "./NotFind";
import { RootState } from "../redux";
import React, { useRef } from "react";
import useUploadAvatar from "../hooks/user/useUploadAvatar";
import {useParams} from "react-router-dom";
import useGetUserInfo from "../hooks/user/useGetUserInfo";


const Info = () => {

  const params = useParams()
  const { userInfo } = useGetUserInfo(String(params.username))
  const user = useSelector((state: RootState) => state.user)
  const isSelf = user.username === userInfo.username

  const ref = useRef<HTMLInputElement>(null);

  const { uploadAvatar } = useUploadAvatar()

  return (
    userInfo.id === 0 ? <NotFind /> :
      <div className={"flex flex-col justify-center items-center h-screen w-screen"}>
        <motion.img
          src={`${window.location.origin}/image/${userInfo.avatar}`} alt={""}
          whileHover={isSelf ? {scale: 1.2, rotate: 360} : {scale: 1, rotate: 360}}
          whileTap={isSelf ? {scale: 0.9} : {scale: 1}}
          transition={{duration: 0.618}}
          className={"w-[32px] h-[32px] lg:w-[64px] lg:h-[64px] object-contain rounded-full mr-[16px] select-none" + (isSelf ? " cursor-pointer" : "")}
          onClick={() => isSelf && ref.current && (() => ref.current.click())()}
        />
        <input
          ref={ref} type={"file"}
          accept={".png, .jpg, .jpeg"}
          className={"hidden"} onChange={uploadAvatar}
        />

        <motion.div
          drag dragConstraints={{top: -0, left: -0, right: 0, bottom: 0}}
          className={"text-[#1d1d1f] text-[32px]"}
        >
          {userInfo.username}
        </motion.div>

        <motion.div
          drag dragConstraints={{top: -0, left: -0, right: 0, bottom: 0}}
          className={"text-[#1d1d1f] text-[32px]"}
        >
          {userInfo.email}
        </motion.div>

        <motion.div
          drag dragConstraints={{top: -0, left: -0, right: 0, bottom: 0}}
          className={"text-[#1d1d1f] text-[32px]"}
        >
          {userInfo.power}
        </motion.div>

        <motion.div
          drag dragConstraints={{top: -0, left: -0, right: 0, bottom: 0}}
          className={"text-[#1d1d1f] text-[32px]"}
        >
          {userInfo.register}
        </motion.div>

      </div>
  );
}

export default Info;
