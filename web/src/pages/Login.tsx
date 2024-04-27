import { motion } from "framer-motion";
import useUserLogin from "../hooks/user/useUserLogin";
import React from "react";

const Login = () => {

  const {
    username,
    setUsername,
    password,
    setPassword,
    contextHolder,
    navigateSecurity,
    navigateRegister,
    login
  } = useUserLogin()

  return (
    <div className={"flex flex-col justify-center items-center w-screen h-screen"}>
      {contextHolder}
      <motion.span drag whileHover={{scale: 1.1}} className="mb-[32px] text-[32px] select-none">
        登录
      </motion.span>
      <motion.input
        drag whileFocus={{scale: 1.1}}
        type="text" placeholder="账号" value={username}
        className={
          "w-[320px] h-[32px] mb-[32px] border-2 " +
          "border-[#1d1d1f] rounded-[16px] px-[10px] outline-none"
        }
        onChange={(e: React.ChangeEvent<HTMLInputElement>) => setUsername(e.target.value)}
      />
      <motion.input
        drag whileFocus={{scale: 1.1}}
        type="password" placeholder="密码" value={password}
        className={
          "w-[320px] h-[32px] mb-[32px] border-2 " +
          "border-[#1d1d1f] rounded-[16px] px-[10px] outline-none"
        }
        onChange={(e: React.ChangeEvent<HTMLInputElement>) => setPassword(e.target.value)}
      />
      <div className={"flex flex-row justify-between items-center w-[320px] h-[32px] mb-[32px]"}>
        <motion.button
          whileHover={{scale: 1.2}}
          whileTap={{scale: 0.9}}
          className="text-[#1d1d1f] cursor-pointer select-none"
          onClick={navigateSecurity}
        >找回密码
        </motion.button>
        <motion.button
          whileHover={{scale: 1.2}}
          whileTap={{scale: 0.9}}
          className="text-[#1d1d1f] cursor-pointer select-none"
          onClick={navigateRegister}
        >注册账号
        </motion.button>
      </div>
      <motion.button
        className={
          "w-[80px] h-[40px] cursor-pointer bg-[#1d1d1f] text-[#fbfbfd] " +
          "select-none rounded-[24px] flex justify-center items-center"
        }
        onClick={login} whileHover={{scale: 1.2}} whileTap={{scale: 0.9}}
      >
        登录
      </motion.button>
    </div>
  );
}

export default Login;