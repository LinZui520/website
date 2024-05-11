'use client'

import { motion } from "framer-motion";
import React, { useEffect, useState } from "react";
import Link from "next/link";
import { useSession } from "next-auth/react";

const Menu = () => {

  const [isOpen, setIsOpen] = useState(false)

  const session = useSession()

  const menu = [
    {href: '/', text: '首页'},
    {href: '/article', text: '博客'},
    {href: '/message', text: '留言板'},
    {href: '/photo', text: '照片墙'},
    {href: '/chat', text: '聊天室'},
    {href: '/admin', text: '控制台'},
    session.data ? {href: `/user/${session.data.user?.id}`, text: session.data.user?.name} :
      {href: '/login', text: '登\u00A0\u00A0\u00A0\u00A0录'}
  ]

  const windowWidth = window.innerWidth

  useEffect(() => {
    isOpen && (document.body.style.overflow = 'hidden');
  }, [isOpen]);

  return (
    <motion.nav initial={false} animate={isOpen ? "open" : "closed"}>

      <motion.ul
        variants={{
          open: { x: 0 }, closed: { x: -windowWidth }
        }}
        transition={{
          duration: 1, ease: "easeInOut"
        }}
        className={
          "z-50 flex flex-col justify-center items-center fixed " +
          "bg-[#fbfbfd] right-0 top-0 w-full h-screen "
        }
        onAnimationComplete={() => !isOpen && (document.body.style.overflow = 'auto')}
      >
        {menu.map(item =>
          <motion.li
            key={item.href}
            onClick={() => setIsOpen(!isOpen)}
            initial={{
              color: "#1d1d1f",
              backgroundColor: "#fbfbfd"
            }}
            whileHover={{
              color: "#fbfbfd",
              backgroundColor: "#1d1d1f"
            }}
            className={
              "z-50 list-none cursor-pointer mb-[3vh] select-none rounded-full " +
              "font-light text-[18px] md:text-[22px] lg:text-[27px] p-[8px] pl-[16px] pr-[16px]"
            }
          >
            <Link href={item.href}>{item.text}</Link>
          </motion.li>
        )}
      </motion.ul>

      <svg
        onClick={() => setIsOpen(!isOpen)}
        width="32" height="32" viewBox="0 0 23 23"
        className={"z-50 top-[25px] right-[25px] cursor-pointer fixed"}
      >
        <motion.path
          fill="transparent" strokeWidth="3" stroke="#1d1d1f" strokeLinecap="round"
          variants={{
            closed: { d: "M 2 2.5 L 20 2.5" }, open: { d: "M 3 16.5 L 17 2.5" }
          }}
        />
        <motion.path
          fill="transparent" strokeWidth="3" stroke="#1d1d1f" strokeLinecap="round"
          d="M 2 9.423 L 20 9.423"
          variants={{
            closed: { opacity: 1 }, open: { opacity: 0 }
          }}
          transition={{ duration: 0.1 }}
        />
        <motion.path
          fill="transparent" strokeWidth="3" stroke="#1d1d1f" strokeLinecap="round"
          variants={{
            closed: { d: "M 2 16.346 L 20 16.346" }, open: { d: "M 3 2.5 L 17 16.346" }
          }}
        />
      </svg>
    </motion.nav>
  );
};

export default Menu;