'use client'

import React, { useState } from "react";
import request from "@/lib/axios";
import { motion } from "framer-motion";
import { Input , Button } from "@nextui-org/react";

/*
* Author: Lin_Zui
* Date: 2024-5-13 22:26:33
* Description: register page
* Version: 1.0.0
*/

const Page = () => {

  const [username, setUsername] = useState('')
  const [email, setEmail] = useState('')
  const [code, setCode] = useState('')
  const [password, setPassword] = useState('')

  const [isHovered, setIsHovered] = useState(false)

  const register = async () => {
    const res = request({
      url: '/auth/register',
      method: 'POST',
      data: {
        username, password,
        email, code,
      }
    })
  }

  const getCode = async () => {
    const res = await request({
      url: `/auth/verify`,
      method: 'POST',
      data: { email }
    })
  }

  return (
    <div className="h-screen w-full flex flex-col justify-center items-center overflow-hidden bg-[#fbfbfd]">
    
      <motion.div
        whileInView={{ height:"480px" }}
        transition={{ duration: 0.618, type: "spring", stiffness: 100, damping: 10 }}
        className="h-[64px] w-[360px] flex flex-col items-center border-solid shadow-lg border-[#1d1d1f] border-4 p-4 rounded-[20px] bg-[#fbfbfd] justify-between"
      >
        
        <motion.div
          whileInView={{ y: -200 }}
          transition={{ duration: 0.618, type: "spring", stiffness: 100, damping: 10 }}
          className="flex flex-raw items-center border-solid shadow-lg border-[#1d1d1f] border-4 p-4 rounded-full bg-[#fbfbfd] w-[320px] h-[25px] justify-between fixed top-[47.5vh] font-bold"
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 512 512">
            <path d="M256 48a208 208 0 1 1 0 416 208 208 0 1 1 0-416zm0 464A256 256 0 1 0 256 0a256 256 0 1 0 0 512zM160 152V264v96c0 13.3 10.7 24 24 24s24-10.7 24-24V288h60.9l37.2 81.9c5.5 12.1 19.7 17.4 31.8 11.9s17.4-19.7 11.9-31.8L315.7 275c21.8-14.3 36.3-39 36.3-67c0-44.2-35.8-80-80-80H184c-13.3 0-24 10.7-24 24zm48 88V176h64c17.7 0 32 14.3 32 32s-14.3 32-32 32H208z"/></svg>
          
          朱贵是混蛋

          <div className="w-[20px] h-[20px]"/>
        </motion.div>

        
        <motion.div
          className="h-[375px] w-[320px] flex flex-col items-center border-solid shadow-lg border-[#1d1d1f] border-4 p-4 rounded-[20px] bg-[#fbfbfd] justify-between overflow-hidden"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1, y: 60 }}
          transition={{ duration: 0.618, type: "spring", stiffness: 100, damping: 10 }}
        >

          <motion.div
            className="h-[50px] w-full" 
            initial={{ opacity: 0, x: -200 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.618, type: "spring", stiffness: 100, damping: 10, delay: 0.2 }}
          >

            <Input
              type="username"
              label="用户名"
              value={username}
              onChange={(e) => setUsername(e.target.value)} 
            />

          </motion.div>

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
            className="h-[50px] w-full"
            initial={{ opacity: 0, x: -200 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.618, type: "spring", stiffness: 100, damping: 10, delay: 0.8 }}
          >
            
            <div className="flex flex-row space-x-8 items-center">

              <Input
                type="text"
                label="验证码"
                value={code}
                onChange={(e) => setCode(e.target.value)}
                className="w-[180px]"
              />

              <Button
                type="button"
                isIconOnly
                className="bg-[#fbfbfd]"
                onClick={getCode}
              >
                <motion.svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 512 512"
                  width="32" height="32"
                  onHoverStart={() => setIsHovered(true)}
                  onHoverEnd={() => setIsHovered(false)}
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                >
                  <path
                    fill={isHovered ? "#11efef" : "#1d1d1f"}
                    d="M64 112c-8.8 0-16 7.2-16 16v22.1L220.5 291.7c20.7 17 50.4 17 71.1 0L464 150.1V128c0-8.8-7.2-16-16-16H64zM48 212.2V384c0 8.8 7.2 16 16 16H448c8.8 0 16-7.2 16-16V212.2L322 328.8c-38.4 31.5-93.7 31.5-132 0L48 212.2zM0 128C0 92.7 28.7 64 64 64H448c35.3 0 64 28.7 64 64V384c0 35.3-28.7 64-64 64H64c-35.3 0-64-28.7-64-64V128z"
                  />
                </motion.svg>
              </Button>


            </div>
          </motion.div>

          <motion.div
            className="h-[30px] w-full"
            initial={{ opacity: 0, x: -200 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.618, type: "spring", stiffness: 100, damping: 10, delay: 1.0 }}
          >
            <motion.button 
              onClick={register} 
              initial={{ scale: 0.9 }}
              whileHover={{ scale: 1 }}
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
