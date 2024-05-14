'use client'

import { signIn } from "next-auth/react";
import { useState } from "react";
import { useRouter } from 'next/navigation';
import { motion } from "framer-motion";
import { Input , Button } from "@nextui-org/react";

/*
* Author: Lin_Zui
* Date: 2024-5-14 12:25:50
* Description: login page
* Version: 1.0.0
*/

const Page = () => {

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const router = useRouter()

  const login = async () => {
    try {
      const response = await signIn('credentials', {
        email, password,
        redirect: false, redirectTo: '/'
      })
      if (response && !response.error) {
        router.push('/')
        router.refresh()
      } else {
        alert("账户或密码错误")
      }
    } catch (_) {

    }
  }

  return (
    <div className="h-screen w-full flex flex-col justify-center items-center overflow-hidden bg-[#fbfbfd]">
      
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
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"></circle><polyline points="12 16 16 12 12 8"></polyline><line x1="8" y1="12" x2="16" y2="12"></line></svg>

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
              type="email"
              label="邮箱"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            
          </motion.div>

          <motion.div
            className="h-[50px] w-full"
            initial={{ opacity: 0, x: -200 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.618, type: "spring", stiffness: 100, damping: 10, delay: 0.6 }}
          >

            <Input
              type="password"
              label="密码"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            
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
              whileHover={{ scale: 1 }}
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

{/* <div className={"h-screen w-full flex flex-col justify-center items-center"}>
      <input
        type="email" placeholder="Email" name="Email" autoComplete="Email"
        onChange={e => setEmail(e.target.value)}
      />
      <input
        type="password" placeholder="Password" name="Password"
        onChange={e => setPassword(e.target.value)}
      />
      <button type="submit" title="login" onClick={login}>
        Login
      </button>
    </div> */}