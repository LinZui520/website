import { motion } from "framer-motion";
import {useSelector} from "react-redux";
import NotFind from "./NotFind";
import { RootState } from "../redux";


const Info = () => {

  const user = useSelector((state: RootState) => state.user)


  return (
    user.id === 0 ? <NotFind /> :
      <div className={"flex flex-row justify-center items-center h-screen w-screen"}>
        <img
          src={"https://www.zhuguishihundan.cn/image/" + user.avatar} alt={""}
          className={"w-[32px] h-[32px] lg:w-[64px] lg:h-[64px] object-contain rounded-full mr-[16px] select-none"}
        />
        <motion.div
          drag dragConstraints={{top: -0, left: -0, right: 0, bottom: 0}}
          className={"text-[#1d1d1f] text-[32px] lg:text-[64px]"}
        >
          {user.username}
        </motion.div>
      </div>
  );
}

export default Info;
