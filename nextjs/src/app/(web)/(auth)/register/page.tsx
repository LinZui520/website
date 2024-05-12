'use client'

import { useState } from "react";
import request from "@/lib/axios";
import { delay, motion , stagger } from "framer-motion";

const Page = () => {

  const [username, setUsername] = useState('')
  const [email, setEmail] = useState('')
  const [code, setCode] = useState('')
  const [password, setPassword] = useState('')

  const [isOpen, setIsOpen] = useState(false)

  const register = async () => {
    const res = request({
      url: '/auth/register',
      method: 'POST',
      data: {
        username, password,
        email, code,
      }
    })

    console.log(res)
  }

  const getCode = async () => {
    const res = await request({
      url: `/auth/verify`,
      method: 'POST',
      data: { email }
    })
    console.log(res)
  }


  return (
    <div className="h-screen w-full flex flex-col justify-center items-center overflow-hidden bg-[#fbfbfd]">
    
      <motion.div
        whileInView={{ height:"480px"}}
        transition={{ duration: 0.618,type: "spring", stiffness: 100, damping: 10 }}
        className="h-[64px] w-[360px] flex flex-col items-center border-solid shadow-lg border-[#1d1d1f] border-4 p-4 rounded-[20px] bg-[#fbfbfd] justify-between"
      >
        
        <motion.div
          whileInView={{ y: -200 }}
          transition={{ duration: 0.618,type: "spring", stiffness: 100, damping: 10 }}
          className="flex flex-raw items-center border-solid shadow-lg border-[#1d1d1f] border-4 p-4 rounded-full bg-[#fbfbfd] w-[320px] h-[25px] justify-between fixed top-[47.5vh]"
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 512 512"><path d="M256 48a208 208 0 1 1 0 416 208 208 0 1 1 0-416zm0 464A256 256 0 1 0 256 0a256 256 0 1 0 0 512zM160 152V264v96c0 13.3 10.7 24 24 24s24-10.7 24-24V288h60.9l37.2 81.9c5.5 12.1 19.7 17.4 31.8 11.9s17.4-19.7 11.9-31.8L315.7 275c21.8-14.3 36.3-39 36.3-67c0-44.2-35.8-80-80-80H184c-13.3 0-24 10.7-24 24zm48 88V176h64c17.7 0 32 14.3 32 32s-14.3 32-32 32H208z"/></svg>
          朱贵是混蛋
          <div className="w-[20px] h-[20px]"/>
        </motion.div>

        
        <motion.div
          className="h-[375px] w-[320px] flex flex-col items-center border-solid shadow-lg border-[#1d1d1f] border-4 p-4 rounded-[20px] bg-[#fbfbfd] justify-between overflow-hidden"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 ,y: 60 }}
          transition={{ duration: 0.618,type: "spring", stiffness: 100, damping: 10 }}
        >

          <motion.div
            className="h-[50px] w-full"
            initial={{ opacity: 0 ,x: -200}}
            animate={{ opacity: 1 ,x: 0}}
            transition={{ duration: 0.618,type: "spring", stiffness: 100, damping: 10,}}
          >
            <label className="text-[#1d1d1f] text-lg font-bold object-left">用户名</label>
            <input type="text" value={username} onChange={(e) => setUsername(e.target.value)} className="w-full h-[40px] border-[1px] border-[#1d1d1f] rounded-[5px] px-[10px] text-[#1d1d1f] placeholder-[#999999] focus:outline-none focus:border-[#1d1d1f]"/>
          </motion.div>

          <motion.div
            className="h-[50px] w-full"
            initial={{ opacity: 0 ,x: -200}}
            animate={{ opacity: 1 ,x: 0}}
            transition={{ duration: 0.618,type: "spring", stiffness: 100, damping: 10,}}
          >
            <label className="text-[#1d1d1f] text-lg font-bold">邮箱</label>
            <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} className="w-full h-[40px] border-[1px] border-[#1d1d1f] rounded-[5px] px-[10px] text-[#1d1d1f] placeholder-[#999999] focus:outline-none focus:border-[#1d1d1f]"/>
          </motion.div>
          
          <motion.div
            className="h-[50px] w-full"
            initial={{ opacity: 0 ,x: -200}}
            animate={{ opacity: 1 ,x: 0}}
            transition={{ duration: 0.618,type: "spring", stiffness: 100, damping: 10,}}
          >
            <label className="text-[#1d1d1f] text-lg font-bold">密码</label>  
            <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} className="w-full h-[40px] border-[1px] border-[#1d1d1f] rounded-[5px] px-[10px] text-[#1d1d1f] placeholder-[#999999] focus:outline-none focus:border-[#1d1d1f]"/>
          </motion.div>

          <motion.div
            className="h-[50px] w-full"
            initial={{ opacity: 0 ,x: -200}}
            animate={{ opacity: 1 ,x: 0}}
            transition={{ duration: 0.618,type: "spring", stiffness: 100, damping: 10,}}
          >
            <label className="text-[#1d1d1f] text-lg font-bold">验证码</label>
            <div className="flex flex-row justify-between items-center">
            <input type="text" value={code} onChange={(e) => setCode(e.target.value)} className="w-[120px] h-[40px] border-[1px] border-[#1d1d1f] rounded-[5px] px-[10px] text-[#1d1d1f] placeholder-[#999999] focus:outline-none focus:border-[#1d1d1f]"/>
            <button onClick={getCode} className="w-[120px] h-[40px] bg-[#1d1d1f] text-[#fbfbfd] font-bold text-lg rounded-[5px] border-[1px] border-[#1d1d1f] hover:bg-[#1d1d1f] hover:text-[#fbfbfd]">获取验证码</button>
            </div>
          </motion.div>

          <motion.div
            className="h-[30px] w-full"
            initial={{ opacity: 0 ,x: -200}}
            animate={{ opacity: 1 ,x: 0}}
            transition={{ duration: 0.618,type: "spring", stiffness: 100, damping: 10,}}
          >
            <button onClick={register} className="w-full h-[40px] bg-[#1d1d1f] text-[#fbfbfd] font-bold text-lg rounded-[5px] border-[1px] border-[#1d1d1f] hover:bg-[#1d1d1f] hover:text-[#fbfbfd]">注册</button>
          </motion.div>

        </motion.div>
        

      </motion.div>

    </div>
  );
}

export default Page;
