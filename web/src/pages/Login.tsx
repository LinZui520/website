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
    <div style={{
      display: 'flex', flexDirection: 'column',
      width: '100vw', height: '100vh',
      justifyContent: 'center', alignItems: 'center'
    }}>
      {contextHolder}
      <span style={{
        marginBottom: '30px', fontSize: '32px'
      }}>登录</span>
      <input
        type="text" placeholder="账号" value={username}
        onChange={(e) => {
          setUsername(e.target.value)
        }}
        style={{
          width: '300px', height: '30px', outline: 'none', marginBottom: '20px',
          border: "1px solid #999999", borderRadius: '16px', padding: '0 10px',
        }}
      />
      <input
        type="password" placeholder="密码" value={password}
        onChange={(e) => {
          setPassword(e.target.value)
        }}
        style={{
          width: '300px', height: '30px', outline: 'none', marginBottom: '20px',
          border: "1px solid #999999", borderRadius: '16px', padding: '0 10px',
        }}
      />
      <div
        style={{
          display: 'flex', flexDirection: 'row',
          justifyContent: 'space-between', alignItems: 'center',
          width: '300px', height: '30px', marginBottom: '20px',
        }}
      >
        <motion.div
          whileHover={{scale: 1.2}}
          whileTap={{scale: 0.9}}
          style={{color: '#1d1d1f', cursor: 'pointer', userSelect: 'none'}}
          onClick={() => navigate("/register")}
        >邮箱登陆
        </motion.div>
        <motion.div
          whileHover={{scale: 1.2}}
          whileTap={{scale: 0.9}}
          style={{color: '#1d1d1f', cursor: 'pointer', userSelect: 'none'}}
          onClick={() => navigate("/register")}
        >注册账号
        </motion.div>
      </div>
      <motion.div
        style={{
          width: '80px', height: '40px', cursor: 'pointer',
          borderRadius: '25px', background: '#1d1d1f',
          display: 'flex', justifyContent: 'center', alignItems: 'center',
          color: '#fbfbfd', userSelect: 'none'
        }}
        onClick={login} whileHover={{scale: 1.2}} whileTap={{scale: 0.9}}
      >
        登陆
      </motion.div>
    </div>
  );
}

export default Login;