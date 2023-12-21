import {useState} from "react";
import {useNavigate} from "react-router-dom";
import {motion} from "framer-motion";
import {UserRegister, UserVerify} from "../api/user";
import { message } from "antd";

const Register = () => {

  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [email, setEmail] = useState('')
  const [code, setCode] = useState('')
  const navigate = useNavigate()
  const [messageApi, contextHolder] = message.useMessage()
  const verify = () => {
    if (email === '') {
      messageApi.warning("邮箱格式错误").then(() => {})
      return
    }
    UserVerify(email).then(res => {
      if (res.data.code === 200) {
        messageApi.success(res.data.message).then(() => {})
      } else {
        messageApi.error(res.data.message).then(() => {})
      }
    }).catch(() => {
      messageApi.error("网络原因，验证码发送失败").then(() => {})
    })
  }

  const register = () => {
    if (username === '' || username.length > 16) {
      messageApi.warning("用户名格式错误").then(() => {})
      return
    }
    if (password === '' || password.length > 32) {
      messageApi.warning("密码格式错误").then(() => {})
      return
    }
    if (email === '' || email.length > 32) {
      messageApi.warning("邮箱格式错误").then(() => {})
      return
    }
    if (code === '') {
      messageApi.warning("验证码格式错误").then(() => {})
      return
    }
    UserRegister(username, password, email, code).then(res => {
      if (res.data.code === 200) {
        messageApi.success(res.data.message).then(() => {})
        navigate('/login')
      } else {
        messageApi.error(res.data.message).then(() => {})
      }
    }).catch(_ => {
      messageApi.success("网络原因，注册失败").then(() => {})
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
      }}>注册</span>
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

      <input
        type="email" placeholder="邮箱" value={email}
        onChange={(e) => {
          setEmail(e.target.value)
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
          height: '30px', width: '300px', marginBottom: '20px',
        }}
      >
        <input
          type="text" placeholder="验证码" value={code}
          onChange={(e) => {
            setCode(e.target.value)
          }}
          style={{
            width: '100px', height: '30px', outline: 'none',
            border: "1px solid #999999", borderRadius: '16px', padding: '0 10px',
          }}
        />

        <motion.div
          whileHover={{scale: 1.1}}
          whileTap={{scale: 0.9}}
          style={{color: '#1d1d1f', cursor: 'pointer', userSelect: 'none'}}
          onClick={verify}
        >获取验证码
        </motion.div>
      </div>
      <motion.div
        style={{
          width: '80px', height: '40px', cursor: 'pointer',
          borderRadius: '25px', background: '#1d1d1f',
          display: 'flex', justifyContent: 'center', alignItems: 'center',
          color: '#fbfbfd', userSelect: 'none'
        }}
        onClick={register} whileHover={{scale: 1.2}} whileTap={{scale: 0.9}}
      >
        注册
      </motion.div>

    </div>
  );
}

export default Register;