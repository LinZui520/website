import {useState} from "react";
import {useNavigate} from "react-router-dom";
import {useDispatch} from "react-redux";
import {message} from "antd";
import {UserLogin} from "../../api/user";
import cookie from "react-cookies";
import {setUser} from "../../redux/user";


const useUserLogin = () => {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const navigate = useNavigate()
  const dispatch = useDispatch()
  const [messageApi, contextHolder] = message.useMessage()

  const navigateSecurity = () => navigate("/security")

  const navigateRegister = () => navigate("/register")

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

  return {
    username,
    setUsername,
    password,
    setPassword,
    contextHolder,
    navigateSecurity,
    navigateRegister,
    login
  }

}

export default useUserLogin;