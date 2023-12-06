import { Button, Input } from "antd";
import "./Login.css";
import Menu from "../components/Index/Menu";
import { useState } from "react";
import { UserLogin } from "../api/user";
import { setUser } from "../store/user";

const Login = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');


  const login = () => {
    UserLogin(username, password).then(res => {
      setUser(res.data.data.User)
      console.log(res.data)
    }).catch(err => {

    })
  }

  return (
    <div className="login-container">
      <Menu />

      <span className="login-item">登录</span>
      <Input 
        className="login-item" 
        placeholder="请输入账号" 
        value={username} 
        onChange={e => {setUsername(e.target.value)}} 
      />
      <Input.Password 
        className="login-item" 
        placeholder="请输入密码" 
        value={password} 
        onChange={e => {setPassword(e.target.value)}} 
      />
      <div className="login-item">
        <Button type="link" block>忘记密码？</Button>
        <Button type="link" block>注册账号？</Button>
      </div>
      <div className="login-item">
        <Button style={{width: '80px'}} onClick={login}>登陆</Button>
      </div>
    </div>
  );
};

export default Login;
