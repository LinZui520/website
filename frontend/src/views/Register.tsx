import { useState } from 'react';
import { UserRegister } from '../api/user';
import { Button, message } from "antd";
import { useNavigate } from "react-router-dom";
import './Register.css'

const Register = () => {
  const [nickname, setNickname] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate()
  const [messageApi, contextHolder] = message.useMessage();

  const register = () => {
    if (nickname === '' || nickname.length > 16) {
      messageApi.warning('昵称格式错误').then(_ => {});
      return
    }
    if (username === '' || username.length > 16) {
      messageApi.warning('账号格式错误').then(_ => {});
      return
    }
    if (password === '' || password.length > 32) {
      messageApi.warning('密码格式错误').then(_ => {});
      return
    }
    UserRegister(nickname, username, password).then(res => {
      if (res.data.code === 200) {
        messageApi.success("注册成功").then(_ => {});
        navigate('/login')
      } else {
        messageApi.warning("该账户已被注册").then(_ => {});
      }
     
    }).catch(_ => {
      messageApi.error("网络原因注册失败").then(_ => {});
    })
    
  }

  return (
    <div className="register-container">
      {contextHolder}
      <span className="register-item">注册</span>
      <div className="register-input" >
        <input type="text" value={nickname} onChange={e => {setNickname(e.target.value)}} required />
        <label>昵称</label>
      </div>
      <div className="register-input" >
        <input type="text" value={username} onChange={e => {setUsername(e.target.value)}} required />
        <label>账号</label>
      </div>
      <div className="register-input" >
        <input type="password" value={password} onChange={e => {setPassword(e.target.value)}} required />
        <label>密码</label>
      </div>
      <div className="register-item">
        <Button style={{width: '80px'}} onClick={register}>注册</Button>
      </div>
    </div>
  )
}

export default Register;