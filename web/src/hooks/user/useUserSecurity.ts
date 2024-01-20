import { UserSecurity } from "../../api/user";
import useUserRegister from "./useUserRegister";

const useUserSecurity = () => {

  const {
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
  } = useUserRegister()

  const security = () => {
    if (email === '' || email.length > 32) {
      messageApi.warning("邮箱格式错误").then(() => {})
      return
    }
    if (code === '') {
      messageApi.warning("验证码格式错误").then(() => {})
      return
    }
    if (username === '' || username.length > 16) {
      messageApi.warning("用户名格式错误").then(() => {})
      return
    }
    if (password === '' || password.length > 32) {
      messageApi.warning("密码格式错误").then(() => {})
      return
    }
    UserSecurity(username, password, email, code).then(res => {
      if (res.data.code === 200) {
        messageApi.success(res.data.message).then(() => {})
        navigate('/login')
      } else {
        actionRef.current?.refresh()
        messageApi.error(res.data.message).then(() => {})
      }
    }).catch(_ => {
      messageApi.success("网络原因，更新失败").then(() => {})
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
    security,
  }
}

export default useUserSecurity;