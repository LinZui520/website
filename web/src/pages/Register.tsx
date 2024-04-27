import {motion} from "framer-motion";
import Captcha from "../components/index/Captcha";
import useUserRegister from "../hooks/user/useUserRegister";

const Register = () => {

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
    contextHolder,
    fetchCode,
    verify,
    register
  } = useUserRegister()

  return (
    <div className={"flex flex-col justify-center items-center h-screen w-screen"}>
      {contextHolder}

      <Captcha
        actionRef={actionRef}
        isModalOpen={isModalOpen}
        setIsModalOpen={setIsModalOpen}
        verify={verify}
      />

      <motion.span drag whileHover={{scale: 1.1}} className="mb-[32px] text-[32px] select-none">
        注册
      </motion.span>
      <motion.input
        drag whileFocus={{scale: 1.1}}
        type="text" placeholder="账号" value={username}
        className={
          "w-[320px] h-[32px] mb-[32px] border-2 " +
          "border-[#1d1d1f] rounded-[16px] px-[10px] outline-none"
        }
        onChange={(e: React.ChangeEvent<HTMLInputElement>) => setUsername(e.target.value)}
      />
      <motion.input
        drag whileFocus={{scale: 1.1}}
        type="password" placeholder="密码" value={password}
        className={
          "w-[320px] h-[32px] mb-[32px] border-2 " +
          "border-[#1d1d1f] rounded-[16px] px-[10px] outline-none"
        }
        onChange={(e: React.ChangeEvent<HTMLInputElement>) => setPassword(e.target.value)}
      />

      <motion.input
        drag whileFocus={{scale: 1.1}}
        type="email" placeholder="邮箱" value={email}
        className={
          "w-[320px] h-[32px] mb-[32px] border-2 " +
          "border-[#1d1d1f] rounded-[16px] px-[10px] outline-none"
        }
        onChange={(e: React.ChangeEvent<HTMLInputElement>) => setEmail(e.target.value)}
      />

      <div className={"flex flex-row justify-between items-center w-[320px] h-[32px] mb-[32px]"}>
        <motion.input
          drag whileFocus={{scale: 1.1}}
          type="text" placeholder="验证码" value={code}
          className={
            "w-[96px] h-[32px] border-2 border-[#1d1d1f]" +
            " rounded-[16px] px-[10px] outline-none"
          }
          onChange={(e: React.ChangeEvent<HTMLInputElement>) => setCode(e.target.value)}
        />

        <motion.button
          whileHover={{scale: 1.1}}
          whileTap={{scale: 0.9}}
          className={"text-[#1d1d1f] cursor-pointer select-none"}
          onClick={fetchCode}
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