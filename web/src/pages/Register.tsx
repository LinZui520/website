import {useState} from "react";
import {useNavigate} from "react-router-dom";
import {motion} from "framer-motion";
import {UserRegister, UserVerify} from "../api/user";
import {message} from "antd";
import Captcha from "../components/index/Captcha";

const Register = () => {

  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [email, setEmail] = useState('')
  const [code, setCode] = useState('')
  const navigate = useNavigate()
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [messageApi, contextHolder] = message.useMessage()

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

      <Captcha
        isModalOpen={isModalOpen}
        setIsModalOpen={setIsModalOpen}
        verify={async (data: any) => {
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
        }}
      />

      <motion.span drag whileHover={{scale: 1.1}} className="mb-[32px] text-[32px] select-none">注册</motion.span>
      <motion.input
        drag whileFocus={{scale: 1.1}}
        type="text" placeholder="账号" value={username}
        className={
          "w-[320px] h-[32px] mb-[32px] border-2 " +
          "border-[#1d1d1f] rounded-[16px] px-[10px] outline-none"
        }
        onChange={(e) => setUsername(e.target.value)}
      />
      <motion.input
        drag whileFocus={{scale: 1.1}}
        type="password" placeholder="密码" value={password}
        className={
          "w-[320px] h-[32px] mb-[32px] border-2 " +
          "border-[#1d1d1f] rounded-[16px] px-[10px] outline-none"
        }
        onChange={(e) => setPassword(e.target.value)}
      />

      <motion.input
        drag whileFocus={{scale: 1.1}}
        type="email" placeholder="邮箱" value={email}
        className={
          "w-[320px] h-[32px] mb-[32px] border-2 " +
          "border-[#1d1d1f] rounded-[16px] px-[10px] outline-none"
        }
        onChange={(e) => setEmail(e.target.value)}
      />

      <div className={"flex flex-row justify-between items-center h-8 w-80 mb-8"}>
        <motion.input
          drag whileFocus={{scale: 1.1}}
          type="text" placeholder="验证码" value={code}
          className={
            "w-[96px] h-[32px] border-2 border-[#1d1d1f]" +
            " rounded-[16px] px-[10px] outline-none"
          }
          onChange={(e) => setCode(e.target.value)}
        />

        <motion.button
          whileHover={{scale: 1.1}}
          whileTap={{scale: 0.9}}
          className={"text-[#1d1d1f] cursor-pointer select-none"}
          onClick={() => {
            if (email === '') {
              messageApi.warning("邮箱格式错误").then(() => {})
              return
            }
            setIsModalOpen(true)
          }}
        >获取验证码
        </motion.button>
      </div>
      <motion.button
        className={
          "w-[80px] h-[40px] cursor-pointer bg-[#1d1d1f] text-[#fbfbfd] " +
          "select-none rounded-[24px] flex justify-center items-center"
        }
        onClick={register} whileHover={{scale: 1.2}} whileTap={{scale: 0.9}}
      >
        注册
      </motion.button>

    </div>
  );
}

export default Register;