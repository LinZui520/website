'use client'

import { signIn } from "next-auth/react";
import { useState } from "react";
import { useRouter } from 'next/navigation';
import { motion } from "framer-motion";
import { Input } from "@nextui-org/react";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

/*
 * Author: Lin_Zui
 * Date: 2024-5-14 17:20:00
 * Description: login page
 * Version: 1.0.1
 */

const Page = () => {

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const router = useRouter()

  const login = async () => {
    try {
      const res = await signIn('credentials', {
        email, password,
        redirect: false, redirectTo: '/'
      })
      if (res && !res.error) {
        toast.success("登录成功")
        setTimeout(() => router.push('/'), 2048)
      } else {
        toast.warning("邮箱或密码错误")
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
        whileInView={{ height:"480px" }}
        transition={{ duration: 0.618, type: "spring", stiffness: 100, damping: 10 }}
        className="h-[64px] w-[360px] flex flex-col items-center border-solid shadow-lg border-[#1d1d1f] border-4 p-4 rounded-[20px] bg-[#fbfbfd] space-y-4"
      >
        <motion.div
          initial={{ opacity: 1, y: -9.0 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.618, type: "spring", stiffness: 100, damping: 10 }}
          className="flex flex-raw items-center border-solid shadow-lg border-[#1d1d1f] border-4 p-4 rounded-full bg-[#fbfbfd] w-[320px] h-[25px] justify-between font-bold"
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"></circle><polyline points="12 16 16 12 12 8"></polyline><line x1="8" y1="12" x2="16" y2="12"></line></svg>

          朱贵是混蛋

          <div className="w-[20px] h-[20px]"/>
        </motion.div>

        <motion.div
          className="h-[375px] w-[320px] flex flex-col items-center border-solid shadow-lg border-[#1d1d1f] border-4 p-4 rounded-[20px] bg-[#fbfbfd] justify-center space-y-8 overflow-hidden"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.618, type: "spring", stiffness: 100, damping: 10 }}
        >
          
          <motion.div
            className="h-[50px] w-full"
            initial={{ opacity: 0, x: -200 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.618, type: "spring", stiffness: 100, damping: 10, delay: 0.4 }}
          >
            
            <Input
              type="email" color="default"
              label="邮箱" value={email}
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
            initial={{opacity: 0, x: -200}}
            animate={{opacity: 1, x: 0}}
            transition={{duration: 0.618, type: "spring", stiffness: 100, damping: 10, delay: 0.6}}
          >

            <Input
              type="password" color="default"
              label="密码" value={password}
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

          <motion.div
            className=" w-full flex flex-row justify-between items-center"
            initial={{opacity: 0, x: -200}}
            animate={{opacity: 1, x: 0}}
            transition={{duration: 0.618, type: "spring", stiffness: 100, damping: 10, delay: 0.8}}
          >
            <motion.div
              initial={{scale: 0.8}}
              whileHover={{ scale: 1, opacity: 0.9 }}
              whileTap={{ scale: 0.8 }}
              onClick={() => router.push('/security')}
            >
              忘记密码
            </motion.div>

            <motion.div
              initial={{ scale: 0.8 }}
              whileHover={{ scale: 1, opacity: 0.9 }}
              whileTap={{ scale: 0.8 }}
              onClick={() => router.push('/register')}
            >
              注册
            </motion.div>
          </motion.div>

          <motion.div
            className="h-[30px] w-full"
            initial={{ opacity: 0, x: -200 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.618, type: "spring", stiffness: 100, damping: 10, delay: 1.0 }}
          >
            <motion.button 
              onClick={login} 
              initial={{ scale: 0.9 }}
              whileHover={{ scale: 1, opacity: 0.9 }}
              whileTap={{ scale: 0.9 }}
              className="w-full h-[40px] bg-[#1d1d1f] text-[#fbfbfd] font-bold text-lg rounded-[12px] border-[1px] border-[#1d1d1f] hover:bg-[#1d1d1f] hover:text-[#fbfbfd]"
            >
              登录
            </motion.button>
          </motion.div>
        </motion.div>
      </motion.div>
    </div>
  );
}

export default Page;