'use client'
import { motion } from "framer-motion";
import React, { useEffect, useState } from "react";
import Link from "next/link";
import { useSession } from "next-auth/react"

const Menu = () => {

  const [isOpen, setIsOpen] = useState(false);

  const session = useSession()

  const menu = [
    {href: '/', text: '首页'},
    {href: '/article', text: '博客'},
    {href: '/message', text: '留言板'},
    {href: '/photo', text: '照片墙'},
    {href: '/chat', text: '聊天室'},
    {href: '/admin', text: '控制台'},
    session.data ? {href: '/login', text: session.data.user?.name} : {href: '/login', text: '登\u00A0\u00A0\u00A0\u00A0录'}
  ]

  useEffect(() => {
    isOpen && (document.body.style.overflow = 'hidden');
  }, [isOpen]);

  return (
    <motion.nav initial={false} animate={isOpen ? "open" : "closed"}>
      <motion.div
        className={"z-50 fixed left-0 top-0 w-screen h-screen bg-[#1d1d1f]"}
        variants={{
          open: (height = 1024) => ({
            clipPath: `circle(${height * 2 + 200}px at 40px 40px)`,
            transition: {type: "spring", stiffness: 20, restDelta: 2}
          }),
          closed: {
            clipPath: "circle(30px at 40px 40px)",
            transition: {delay: 0.5, type: "spring", stiffness: 400, damping: 40}
          }
        }}
        onAnimationComplete={() => !isOpen && (document.body.style.overflow = 'auto')}
      />

      <motion.ul
        variants={{
          open: {transition: { staggerChildren: 0.07, delayChildren: 0.2 }},
          closed: {transition: { staggerChildren: 0.05, staggerDirection: -1 }}
        }}
        className={
          "z-50 flex flex-col justify-center items-center fixed " +
          "left-0 top-0 w-screen h-screen " +
          (isOpen ? "pointer-events-auto" : "pointer-events-none")
        }
      >
        {menu.map(item =>
          <motion.li
            variants={{
              open: {y: 0, opacity: 1, transition: {y: {stiffness: 1000, velocity: -100}}},
              closed: {y: 50, opacity: 0, transition: {y: {stiffness: 1000}}}
            }}
            whileHover={{scale: 1.3}} whileTap={{scale: 0.95}}
            className={
              "z-50 list-none cursor-pointer mb-[3vh] select-none " +
              "text-[#fbfbfd] text-[24px] lg:text-[36px]"
            }
            key={item.href}
            onClick={() => setIsOpen(!isOpen)}
          >
            <Link href={item.href}>{item.text}</Link>
          </motion.li>
        )}
      </motion.ul>

      <motion.div
        whileHover={{scale: 1.2}} whileTap={{scale: 0.9}}
        className={
          "z-50 flex justify-center items-center " +
          "outline-none border-none rounded-full cursor-pointer " +
          "fixed pt-[4px] top-[10px] left-[10px] w-[60px] h-[60px]"
        }
        onClick={() => setIsOpen(!isOpen)}
      >
        <svg width="25" height="25" viewBox="0 0 23 23">
          <motion.path
            fill="transparent" strokeWidth="3" stroke="white" strokeLinecap="round"
            variants={{
              closed: { d: "M 2 2.5 L 20 2.5" },
              open: { d: "M 3 16.5 L 17 2.5" }
            }}
          />
          <motion.path
            fill="transparent" strokeWidth="3" stroke="white" strokeLinecap="round"
            d="M 2 9.423 L 20 9.423"
            variants={{
              closed: { opacity: 1 },
              open: { opacity: 0 }
            }}
            transition={{ duration: 0.1 }}
          />
          <motion.path
            fill="transparent" strokeWidth="3" stroke="white" strokeLinecap="round"
            variants={{
              closed: { d: "M 2 16.346 L 20 16.346" },
              open: { d: "M 3 2.5 L 17 16.346" }
            }}
          />
        </svg>
      </motion.div>
    </motion.nav>
  );
};

export default Menu