import { motion } from "framer-motion";
import {useSelector} from "react-redux";
import cookie from "react-cookies";
import NotFind from "./NotFind";


const Info = () => {

  const user = useSelector((state: any) => state.user)


  return (
    (cookie.load('token') === undefined || user.id === 0) ? <NotFind /> :
    <div className={"flex flex-col justify-center items-center bg-[#fbfbfd] h-screen w-screen"}>
      <motion.div
        whileHover={{scale: 1.2}}
        whileTap={{scale: 0.9}}
        drag
        dragConstraints={{
          top: -0,
          left: -0,
          right: 0,
          bottom: 0,
        }}
        className={"text-[#1d1d1f] text-[54px]"}
      >
        {user.username}
      </motion.div>
    </div>
  );
}

export default Info;
