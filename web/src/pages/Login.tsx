import { useState } from "react";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { UserLogin } from "../api/user";
import { setUser } from "../store/user";
import cookie from 'react-cookies'
import { motion } from "framer-motion";
const Login = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate()
  const dispatch = useDispatch();

  const login = () => {
    if (username === '' || username.length > 16) {
      return
    }
    if (password === '' || password.length > 32) {
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
      }
    }).catch(_ => {

    })
  }
  return (
    <div style={{
      display: 'flex', flexDirection: 'column',
      width: '100vw', height: '100vh',
      justifyContent: 'center', alignItems: 'center'
    }}>
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
      <motion.div
        style={{
          width: '80px', height: '40px',cursor: 'pointer',
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