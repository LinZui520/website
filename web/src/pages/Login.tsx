import { useState } from "react";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { UserLogin } from "../api/user";
import { setUser } from "../store/user";
import cookie from 'react-cookies'
import { motion } from "framer-motion";
import {message} from "antd";
const Login = () => {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const navigate = useNavigate()
  const dispatch = useDispatch()
  const [messageApi, contextHolder] = message.useMessage()

  const login = () => {
    if (username === '' || username.length > 16) {
      messageApi.warning("用户名格式错误").then(() => {})
      return
    }
    if (password === '' || password.length > 32) {
      messageApi.warning("密码格式错误").then(() => {})
      return
    }
    UserLogin(username, password).then(res => {
      if (res.data.code === 200) {
        cookie.save('token', res.data.data.token, {
          path: "/",
          expires: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)
        });
        dispatch(setUser(res.data.data));
        navigate('/')
      } else {
        messageApi.error(res.data.message).then(() => {})
      }
    }).catch(() => {
      messageApi.error("网络原因，登陆失败").then(() => {})
    })
  }

  return (
    <div className={"flex flex-col justify-center items-center w-screen h-screen"}>
      {contextHolder}
      <span className="mb-[32px] text-[32px]">登录</span>
      <input
        type="text" placeholder="账号" value={username}
        className={
          "w-[320px] h-[32px] mb-[32px] border-2 " +
          "border-[#1d1d1f] rounded-[16px] px-[10px] outline-none"
        }
        onChange={(e) => {
          setUsername(e.target.value)
        }}
      />
      <input
        type="password" placeholder="密码" value={password}
        className={
          "w-[320px] h-[32px] mb-[32px] border-2 " +
          "border-[#1d1d1f] rounded-[16px] px-[10px] outline-none"
        }
        onChange={(e) => {
          setPassword(e.target.value)
        }}
      />
      <div className={"flex flex-row justify-between items-center w-[320px] h-[32px] mb-[32px]"}>
        <motion.button
          whileHover={{scale: 1.2}}
          whileTap={{scale: 0.9}}
          className="text-[#1d1d1f] cursor-pointer select-none"
          onClick={() => navigate("/register")}
        >邮箱登陆
        </motion.button>
        <motion.button
          whileHover={{scale: 1.2}}
          whileTap={{scale: 0.9}}
          className="text-[#1d1d1f] cursor-pointer select-none"
          onClick={() => navigate("/register")}
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
        登陆
      </motion.button>
    </div>
  );
}

export default Login;