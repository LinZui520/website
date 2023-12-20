import {Button, Input, message} from "antd";
import { useState } from "react";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { UserLogin } from "../api/user";
import { setUser } from "../store/user";
import cookie from 'react-cookies'
const Login = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate()
  const dispatch = useDispatch();
  const [messageApi, contextHolder] = message.useMessage();

  const login = () => {
    if (username === '' || username.length > 16) {
      messageApi.warning('账号格式错误').then(() => {});
      return
    }
    if (password === '' || password.length > 32) {
      messageApi.warning('密码格式错误').then(() => {});
      return
    }
    UserLogin(username, password).then(res => {
      if (res.data.code === 200) {
        dispatch(setUser(res.data.data.user))
        cookie.save('token', res.data.data.token, {path:"/"})
        messageApi.success('登录成功').then(() => {});
        navigate('/')
      } else {
        messageApi.warning(res.data.message).then(() => {})
      }
    }).catch(_ => {
      messageApi.error('网络问题登录失败').then(() => {});
    })
  }
  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      width: '100vw',
      height: '100vh',
      justifyContent: 'center',
      alignItems: 'center'
    }}>
      {contextHolder}
      <span style={{marginBottom: '5vh'}}>登录</span>
      <Input
        style={{marginBottom: '5vh', width: '60vw', maxWidth: '400px'}}
        placeholder="用户名"
        value={username}
        onChange={e => {
        setUsername(e.target.value)
      }}></Input>
      <Input
        style={{marginBottom: '5vh', width: '60vw', maxWidth: '400px'}}
        placeholder="密码"
        value={password}
        onChange={e => {
        setPassword(e.target.value)
      }}></Input>
      <div style={{marginBottom: '5vh'}}>
        <Button type="link">忘记密码？</Button>
        <Button type="link" href="/register">注册账号？</Button>
      </div>
      <Button style={{marginBottom: '5vh',width: '80px'}} onClick={login}>登陆</Button>
    </div>
  );
}

export default Login;