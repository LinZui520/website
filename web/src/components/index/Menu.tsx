import { motion } from "framer-motion";
import {useEffect, useState} from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

const MenuItem = ({ item, onCloseMenu }: any) => {
  const navigate = useNavigate()
  return (
    <motion.li
      variants={{
        open: {
          y: 0,
          opacity: 1,
          transition: {
            y: { stiffness: 1000, velocity: -100 }
          }
        },
        closed: {
          y: 50,
          opacity: 0,
          transition: {
            y: { stiffness: 1000 }
          }
        }
      }}
      whileHover={{ scale: 1.3 }}
      whileTap={{ scale: 0.95 }}
      className={
        "z-50 list-none cursor-pointer mb-[5vh] select-none " +
        "text-[#fbfbfd] text-[36px]"
      }
      onClick={() => {
        navigate(item.href);
        onCloseMenu();
      }}
    >
      {item.text}
    </motion.li>
  );
};

export const Menu = () => {
  const [isOpen, setIsOpen] = useState(false);

  const user = useSelector((state: any) => state.user);

  const menu = [
    {href: '/', text: '首页'},
    {href: '/articles', text: '博客'},
    {href: '/messages', text: '留言'},
    user.power > 0 ? {href: '/admin', text: '管理'} : null,
    user.id === 0 ? {href: '/login', text: '登录'} : {href: '/info', text: user.username},
  ]

  useEffect(() => {
    document.body.style.overflow = isOpen ? 'hidden' : 'auto';
  }, [isOpen]);

  return (
    <motion.nav
      initial={false}
      animate={isOpen ? "open" : "closed"}
    >
      <motion.div
        className={"z-50 fixed left-0 top-0 w-screen h-screen bg-[#1d1d1f]"}
        variants={{
          open: (height = 1024) => ({
            clipPath: `circle(${height * 2 + 200}px at 40px 40px)`,
            transition: {
              type: "spring",
              stiffness: 20,
              restDelta: 2
            }
          }),
          closed: {
            clipPath: "circle(30px at 40px 40px)",
            transition: {
              delay: 0.5,
              type: "spring",
              stiffness: 400,
              damping: 40
            }
          }
        }}
      />

      <motion.ul
        variants={{
          open: {
            transition: { staggerChildren: 0.07, delayChildren: 0.2 }
          },
          closed: {
            transition: { staggerChildren: 0.05, staggerDirection: -1 }
          }
        }}
        className={
          "z-50 flex flex-col justify-center items-center fixed " +
          "left-0 top-0 w-screen h-screen " +
          (isOpen ? "pointer-events-auto" : "pointer-events-none")
        }
      >
        {menu.map(item =>
          item === null ? null :
          <MenuItem key={item.href} item={item} onCloseMenu={() => setIsOpen(!isOpen)}  />
        )}
      </motion.ul>

      <motion.button
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.8 }}
        className={
          "z-50 flex justify-center items-center " +
          "outline-none border-none rounded-full cursor-pointer " +
          "fixed pt-[4px] top-[10px] left-[10px] w-[60px] h-[60px]"
        }
        onClick={() => setIsOpen(!isOpen)}
      >
        <svg width="25" height="25" viewBox="0 0 23 23">
          <motion.path
            fill="transparent"
            strokeWidth="3"
            stroke="white"
            strokeLinecap="round"
            variants={{
              closed: { d: "M 2 2.5 L 20 2.5" },
              open: { d: "M 3 16.5 L 17 2.5" }
            }}
          />
          <motion.path
            fill="transparent"
            strokeWidth="3"
            stroke="white"
            strokeLinecap="round"
            d="M 2 9.423 L 20 9.423"
            variants={{
              closed: { opacity: 1 },
              open: { opacity: 0 }
            }}
            transition={{ duration: 0.1 }}
          />
          <motion.path
            fill="transparent"
            strokeWidth="3"
            stroke="white"
            strokeLinecap="round"
            variants={{
              closed: { d: "M 2 16.346 L 20 16.346" },
              open: { d: "M 3 2.5 L 17 16.346" }
            }}
          />
        </svg>
      </motion.button>
    </motion.nav>
  );
};

export default Menu