import { motion } from "framer-motion";
import {useSelector} from "react-redux";
import NotFind from "./NotFind";
import { RootState } from "../redux";
import React, {useRef} from "react";
import useUploadAvatar from "../hooks/user/useUploadAvatar";


const Info = () => {

  const ref = useRef<HTMLInputElement>(null);
  const user = useSelector((state: RootState) => state.user)
  const { uploadAvatar } = useUploadAvatar()

  return (
    user.id === 0 ? <NotFind /> :
    <div className={"flex flex-row justify-center items-center h-screen w-screen"}>
      <motion.img
        src={`${window.location.origin}/image/${user.avatar}`} alt={""}
        whileHover={{scale: 1.2}} whileTap={{scale: 0.9}}
        className={"w-[32px] h-[32px] lg:w-[64px] lg:h-[64px] object-contain rounded-full mr-[16px] select-none"}
        onClick={() => {
          ref.current && (() => ref.current.click())();
        }}
      />

      <motion.div
        drag dragConstraints={{top: -0, left: -0, right: 0, bottom: 0}}
        className={"text-[#1d1d1f] text-[32px] lg:text-[64px]"}
      >
        {user.username}
      </motion.div>

      <input
        ref={ref} type={"file"}
        accept={".png, .jpg, .jpeg"}
        className={"hidden"} onChange={uploadAvatar}
      />

    </div>
  );
}

export default Info;
