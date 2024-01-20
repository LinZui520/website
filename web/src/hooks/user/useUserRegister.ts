import {useCallback, useRef, useState} from "react";
import {useNavigate} from "react-router-dom";
import {message} from "antd";
import {UserRegister, UserVerify} from "../../api/user";
import {ActionType} from "rc-slider-captcha";

export interface CaptchaData {
  x: number;
  y: number;
  duration: number;
  trail: [number, number][];
}

const useUserRegister = () => {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [email, setEmail] = useState('')
  const [code, setCode] = useState('')
  const navigate = useNavigate()
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [messageApi, contextHolder] = message.useMessage()
  const actionRef = useRef<ActionType>();

  const fetchCode = () => {
    if (email === '') {
      messageApi.warning("邮箱格式错误").then(() => {})
      return
    }
    setIsModalOpen(true)
  }

  const verify = useCallback(async (data: CaptchaData) => {
    try {
      const res = await UserVerify(email, data.x, data.y, data.duration, data.trail, data.trail.length)
      if (res.data.message === "我一眼就看出你不是人") {
        return Promise.reject()
      }
      if (res.data.code === 200) {
        messageApi.success(res.data.message).then(() => {})
      } else {
        messageApi.warning(res.data.message).then(() => {})
      }
      setIsModalOpen(false)
      return Promise.resolve()
    } catch (_) {
      messageApi.warning("网络原因，验证失败").then(() => {})
      return Promise.reject()
    }
  },[email, messageApi])

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


  return {
    username,
    setUsername,
    password,
    setPassword,
    email,
    setEmail,
    code,
    setCode,
    actionRef,
    isModalOpen,
    setIsModalOpen,
    navigate,
    messageApi,
    contextHolder,
    fetchCode,
    verify,
    register
  }
}

export default useUserRegister;