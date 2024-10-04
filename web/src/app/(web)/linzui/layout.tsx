'use client'
import React, { Children } from 'react'
import { motion } from 'framer-motion'

export default function Layout({
  
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <>
      <div
        className="flex flex-col items-center justify-center h-screen w-full overflow-hidden"
        style = {{ backgroundColor: "#1d1d1f" }}
      >
        <Header />
        <div
          className='h-full w-11/12 flex items-center justify-around'
        >
          <Intraduction />
          <div
            className='h-full w-9/12'
          >
            {children}
          </div>
        </div>
        <Footer />
      </div>
    </>
  )
}

const Header = () => {
  return (
    <div className="h-16 w-full bg-[#1d1d1f] flex justify-center items-center"></div>
    )
}

const Intraduction = () => {
  return (
    <div 
      className="h-full w-3/12 border-2 border-[#fbfbfd] rounded-lg p-4 overflow-hidden"
    >
      <motion.h1
        className="text-6xl font-thin text-[#fbfbfd] font-mono "
        initial={{ y: -100, opacity: 0 }}
        animate={{ x: 0, y: 0, opacity: 1 }}
        transition={{ duration: 1, type: "spring", stiffness: 100, damping: 10 }}
      >
        林醉
        <motion.a
          className="text-3xl font-thin italic text-[#fbfbfd] font-serif"
        >
          Lin_zui
        </motion.a>
      </motion.h1>

      <motion.h6
        className="font-thin text-[#fbfbfd] font-mono "
        initial={{ y: -100, opacity: 0 }}
        animate={{ x: 0, y: 0, opacity: 1 }}
        transition={{ duration: 1, type: "spring", stiffness: 100, damping: 10 }}
      >
        Blog Developer | Designer
      </motion.h6>

    </div>
  )
}

const Footer = () => {
  return (
    <div
      className="w-full h-16 bg-[#1d1d1f] flex justify-center items-center"
    >
    </div>
  );
}