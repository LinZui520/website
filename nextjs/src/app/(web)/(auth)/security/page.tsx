'use client'

import React, { useState } from "react";
import request from "@/lib/axios";
import { motion } from "framer-motion";
import { Input , Button } from "@nextui-org/react";
import { useRouter } from "next/navigation";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

/*
* Author: Lin_Zui
* Date: 2024-5-14 17:20:00
* Description: register page
* Version: 1.0.0
*/

const Page = () => {

  const [email, setEmail] = useState('')
  const [code, setCode] = useState('')
  const [password, setPassword] = useState('')

  const [isHovered, setIsHovered] = useState(false)

  const router = useRouter()


  const resetPassword = async () => {
    try {
      const res = await request({
        url: '/auth/security',
        method: 'PUT',
        data: {email, code, password}
      })
      if (res.data.code === 200) {
        toast.success("重置密码成功")
        setTimeout(() => router.push('/login'), 2048)
      } else {
        toast.warning(res.data.message)
      }
    } catch (_) {
      toast.error("系统错误")
    }
  }

  const getCode = async () => {
    const res = await request({
      url: `/auth/verify`, method: 'POST', data: { email }
    })
    return res.data.code === 200 ? Promise.resolve() : Promise.reject()
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
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 512 512">
            <path d="M256 0c4.6 0 9.2 1 13.4 2.9L457.7 82.8c22 9.3 38.4 31 38.3 57.2c-.5 99.2-41.3 280.7-213.6 363.2c-16.7 8-36.1 8-52.8 0C57.3 420.7 16.5 239.2 16 140c-.1-26.2 16.3-47.9 38.3-57.2L242.7 2.9C246.8 1 251.4 0 256 0zm0 66.8V444.8C394 378 431.1 230.1 432 141.4L256 66.8l0 0z"/></svg>
          
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
              type="email" label="邮箱" value={email}
              onChange={(e) => setEmail(e.target.value)}
              endContent={
                <svg
                  xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512"
                  width="18" height="18"
                >
                  <path d="M48 64C21.5 64 0 85.5 0 112c0 15.1 7.1 29.3 19.2 38.4L236.8 313.6c11.4 8.5 27 8.5 38.4 0L492.8 150.4c12.1-9.1 19.2-23.3 19.2-38.4c0-26.5-21.5-48-48-48H48zM0 176V384c0 35.3 28.7 64 64 64H448c35.3 0 64-28.7 64-64V176L294.4 339.2c-22.8 17.1-54 17.1-76.8 0L0 176z"/>
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
              type="password" label="新密码" value={password}
              onChange={(e) => setPassword(e.target.value)}
              endContent={
                <svg
                  xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512"
                  width="18" height="18"
                >
                  <path d="M144 144v48H304V144c0-44.2-35.8-80-80-80s-80 35.8-80 80zM80 192V144C80 64.5 144.5 0 224 0s144 64.5 144 144v48h16c35.3 0 64 28.7 64 64V448c0 35.3-28.7 64-64 64H64c-35.3 0-64-28.7-64-64V256c0-35.3 28.7-64 64-64H80z"/>
                </svg>
              }
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
                type="text" label="验证码" value={code} className="w-[180px]"
                onChange={(e) => setCode(e.target.value)}
                endContent={
                  <svg
                    xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512"
                    width="18" height="18"
                  >
                    <path d="M256 0c4.6 0 9.2 1 13.4 2.9L457.7 82.8c22 9.3 38.4 31 38.3 57.2c-.5 99.2-41.3 280.7-213.6 363.2c-16.7 8-36.1 8-52.8 0C57.3 420.7 16.5 239.2 16 140c-.1-26.2 16.3-47.9 38.3-57.2L242.7 2.9C246.8 1 251.4 0 256 0z"/>
                  </svg>
                }
              />

              <Button
                type="button"
                isIconOnly
                className="bg-[#fbfbfd]"
                onClick={() => toast.promise(getCode, {
                  pending: '正在发送验证码',
                  success: '发送验证码成功',
                  error: '发送验证码失败'
                })}
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
              initial={{ scale: 0.9 }}
              whileHover={{ scale: 1, opacity: 0.9 }}
              whileTap={{ scale: 0.9 }}
              onClick={() => resetPassword()}
              className="w-full h-[40px] bg-[#1d1d1f] text-[#fbfbfd] font-bold text-lg rounded-[12px] border-[1px] border-[#1d1d1f] hover:bg-[#1d1d1f] hover:text-[#fbfbfd]"
            >
              重置密码
            </motion.button>
          </motion.div>
        </motion.div>
      </motion.div>
    </div>
  );
}

export default Page;
