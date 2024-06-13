'use client'

import React, { useState } from "react";
import request from "@/lib/axios";
import { motion } from "framer-motion";
import { Input } from "@nextui-org/react";
import { useRouter } from "next/navigation";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Verify from "@/components/(web)/(auth)/Verify";


/*
 * Author: Lin_Zui
 * Date: 2024-5-14 17:20:00
 * Description: register page
 * Version: 1.0.2
 */

const Page = () => {

  const [username, setUsername] = useState('')
  const [email, setEmail] = useState('')
  const [code, setCode] = useState('')
  const [password, setPassword] = useState('')

  const router = useRouter()

  const register = async () => {
    try {
      const res = await request({
        url: '/auth/register',
        method: 'POST',
        data: {username, password, email, code}
      })
      if (res.data.code === 200) {
        toast.success("注册成功")
        setTimeout(() => router.push('/login'), 2048)
      } else {
        toast.warning(res.data.message)
      }
    } catch (_) {
      toast.error("系统错误")
    }
  }

  return (
    <div className="h-screen w-full flex flex-col justify-center items-center overflow-hidden bg-[#fbfbfd] select-none">
      <ToastContainer
        position="top-center"
        closeOnClick={true}
      />

      <motion.div
        whileInView={{height: "480px"}}
        transition={{duration: 0.618, type: "spring", stiffness: 100, damping: 10}}
        className="h-[64px] w-[360px] flex flex-col items-center border-solid shadow-lg border-[#1d1d1f] border-4 p-4 rounded-[20px] bg-[#fbfbfd] space-y-4"
      >
        <motion.div
          initial={{opacity: 1, y: -9.0}}
          animate={{opacity: 1, y: 0}}
          transition={{duration: 0.618, type: "spring", stiffness: 100, damping: 10}}
          className="flex flex-raw items-center border-solid shadow-lg border-[#1d1d1f] border-4 p-4 rounded-full bg-[#fbfbfd] w-[320px] h-[25px] justify-between font-bold"
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 512 512">
            <path fill="#1d1d1f" d="M256 48a208 208 0 1 1 0 416 208 208 0 1 1 0-416zm0 464A256 256 0 1 0 256 0a256 256 0 1 0 0 512zM160 152V264v96c0 13.3 10.7 24 24 24s24-10.7 24-24V288h60.9l37.2 81.9c5.5 12.1 19.7 17.4 31.8 11.9s17.4-19.7 11.9-31.8L315.7 275c21.8-14.3 36.3-39 36.3-67c0-44.2-35.8-80-80-80H184c-13.3 0-24 10.7-24 24zm48 88V176h64c17.7 0 32 14.3 32 32s-14.3 32-32 32H208z" />
          </svg>
          
          朱贵是混蛋

          <div className="w-[20px] h-[20px]"/>
        </motion.div>

        
        <motion.div
          className="h-[375px] w-[320px] flex flex-col items-center border-solid shadow-lg border-[#1d1d1f] border-4 p-4 rounded-[20px] bg-[#fbfbfd] justify-center space-y-4 overflow-hidden"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.618, type: "spring", stiffness: 100, damping: 10 }}
        >

          <motion.div
            className="h-[50px] w-full" 
            initial={{ opacity: 0, x: -200 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.618, type: "spring", stiffness: 100, damping: 10, delay: 0.2 }}
          >

            <Input
              type="username" label="用户名" value={username}
              onChange={(e) => setUsername(e.target.value)}
              endContent={
                <svg
                  xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512"
                  width="18" height="18"
                >
                  <path fill="#1d1d1f" d="M224 256A128 128 0 1 0 224 0a128 128 0 1 0 0 256zm-45.7 48C79.8 304 0 383.8 0 482.3C0 498.7 13.3 512 29.7 512H418.3c16.4 0 29.7-13.3 29.7-29.7C448 383.8 368.2 304 269.7 304H178.3z"/>
                </svg>
              }
            />

          </motion.div>

          <motion.div
            className="h-[50px] w-full"
            initial={{opacity: 0, x: -200}}
            animate={{opacity: 1, x: 0}}
            transition={{duration: 0.618, type: "spring", stiffness: 100, damping: 10, delay: 0.4}}
          >

            <Input
              type="email" label="邮箱" value={email}
              onChange={(e) => setEmail(e.target.value)}
              endContent={
                <svg
                  xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512"
                  width="18" height="18"
                >
                  <path fill="#1d1d1f" d="M48 64C21.5 64 0 85.5 0 112c0 15.1 7.1 29.3 19.2 38.4L236.8 313.6c11.4 8.5 27 8.5 38.4 0L492.8 150.4c12.1-9.1 19.2-23.3 19.2-38.4c0-26.5-21.5-48-48-48H48zM0 176V384c0 35.3 28.7 64 64 64H448c35.3 0 64-28.7 64-64V176L294.4 339.2c-22.8 17.1-54 17.1-76.8 0L0 176z" />
                </svg>
              }
            />
            
          </motion.div>
          
          <motion.div
            className="h-[50px] w-full"
            initial={{ opacity: 0, x: -200 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.618, type: "spring", stiffness: 100, damping: 10, delay: 0.6 }}
          >

            <Input
              type="password" label="密码" value={password}
              onChange={(e) => setPassword(e.target.value)}
              endContent={
                <svg
                  xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512"
                  width="18" height="18"
                >
                  <path fill="#1d1d1f" d="M144 144v48H304V144c0-44.2-35.8-80-80-80s-80 35.8-80 80zM80 192V144C80 64.5 144.5 0 224 0s144 64.5 144 144v48h16c35.3 0 64 28.7 64 64V448c0 35.3-28.7 64-64 64H64c-35.3 0-64-28.7-64-64V256c0-35.3 28.7-64 64-64H80z" />
                </svg>
              }
            />
            
          </motion.div>

          <Verify email={email} code={code} setCode={setCode} />

          <motion.div
            className="h-[30px] w-full"
            initial={{ opacity: 0, x: -200 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.618, type: "spring", stiffness: 100, damping: 10, delay: 1.0 }}
          >
            <motion.button 
              onClick={register} 
              initial={{ scale: 0.9 }}
              whileHover={{ scale: 1, opacity: 0.9 }}
              whileTap={{ scale: 0.9 }}
              className="w-full h-[40px] bg-[#1d1d1f] text-[#fbfbfd] font-bold text-lg rounded-[12px] border-[1px] border-[#1d1d1f] hover:bg-[#1d1d1f] hover:text-[#fbfbfd]"
            >
              注册
            </motion.button>
          </motion.div>
        </motion.div>
      </motion.div>
    </div>
  );
}

export default Page;
