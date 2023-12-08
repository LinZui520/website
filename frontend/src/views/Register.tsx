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

  const register = () => {
    if (nickname === '' || nickname.length > 16) {
      message.warning('昵称格式错误');
      return
    }
    if (username === '' || username.length > 16) {
      message.warning('账号格式错误');
      return
    }
    if (password === '' || password.length > 32) {
      message.warning('密码格式错误');
      return
    }
    UserRegister(nickname, username, password).then(res => {
      if (res.data.code === 200) {
        message.success("注册成功")
        navigate('/login')
      } else {
        message.warning(res.data.msg)
      }
     
    }).catch(_ => {
      message.error("网络原因注册失败")
    })
    
  }

  return (
    <div className="register-container">
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