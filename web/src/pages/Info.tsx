import { motion } from "framer-motion";
import {useSelector} from "react-redux";
import NotFind from "./NotFind";
import { RootState } from "../redux";
import React, {useEffect, useRef} from "react";
import useUploadAvatar from "../hooks/user/useUploadAvatar";
import {useLocation, useParams} from "react-router-dom";
import useGetUserInfo from "../hooks/user/useGetUserInfo";
import useFetchUserInfoArticles from "../hooks/article/useFetchUserInfoArticles";
import ArticlesMain from "../components/articles/ArticlesMain";


const Info = () => {

  const params = useParams()
  const { userInfo, isGetUserInfoFinished } = useGetUserInfo(String(params.username))
  const user = useSelector((state: RootState) => state.user)
  const isSelf = user.username === userInfo.username

  const ref = useRef<HTMLInputElement>(null);

  const { uploadAvatar } = useUploadAvatar()

  const { articles, isLoaded, fetchData } = useFetchUserInfoArticles(userInfo.id);
  useEffect(() => {
    fetchData(userInfo.id).then(() => {});
  }, [userInfo.id, isGetUserInfoFinished, fetchData]);


  const location = useLocation();
  useEffect(() => {
    if (isLoaded) window.scrollTo(0, 0);
  }, [location, isLoaded]);

  return (
    !isLoaded ? <div /> :
    isGetUserInfoFinished && userInfo.id === 0 ? <NotFind /> :
    <div className={"flex flex-col justify-center items-center min-h-screen w-screen"}>
      <div className={"h-[50vh] w-screen flex flex-row justify-center items-center"}>
        <motion.img
          src={`${window.location.origin}/image/${userInfo.avatar}`} alt={""}
          whileHover={isSelf ? {scale: 1, rotate: 360} : {scale: 1, rotate: 360}}
          whileTap={isSelf ? {scale: 0.9} : {scale: 1}}
          transition={{duration: 0.618}}
          className={"w-[72px] h-[72px] mr-[18px] object-contain rounded-full select-none" + (isSelf ? " cursor-pointer" : "")}
          onClick={() => isSelf && ref.current && (() => ref.current.click())()}
        />
        <input
          ref={ref} type={"file"}
          accept={".png, .jpg, .jpeg"}
          className={"hidden"} onChange={uploadAvatar}
        />

        <div className={"flex flex-col justify-center items-start"}>
          <div className={"text-[#1d1d1f] select-none" + (isSelf ? " cursor-pointer" : "")}>
            {userInfo.username}({userInfo.power < 0 ? "人下人" : userInfo.power < 1 ? "普通用户" : userInfo.power < 2 ? "管理员" : "站长"})
          </div>

          <div className={"text-[#1d1d1f] select-none"}>
            {userInfo.email}
          </div>

          <div className={"text-[#1d1d1f] select-none"}>
            注册时间：{`${new Date(userInfo.register).getFullYear()}/${(new Date(userInfo.register).getMonth() + 1).toString().padStart(2, '0')}/${new Date(userInfo.register).getDate().toString().padStart(2, '0')}`}
          </div>
        </div>

      </div>

      <ArticlesMain   articles={articles}/>


    </div>
  );
}

export default Info;
