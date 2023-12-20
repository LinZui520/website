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
      style={{
        zIndex: '999',
        listStyle: 'none',
        cursor: 'pointer',
        display: 'flex',
        marginBottom: '5vh',
      }}
    >
      <span
        style={{
          color: '#fbfbfd',
          fontSize: '32px'
        }}
        onClick={() => {
          navigate(item.href);
          onCloseMenu();
        }}
      >
        {item.text}
      </span>
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
    user.power > 0 ? {href: '/admin', text: '管理'} : {href: '/404', text: '404'},
    user.id === 0 ? {href: '/login', text: '登陆'} : {href: '/info', text: user.username},
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
        style={{
          zIndex: '998',
          position: 'fixed',
          left: '0',
          top: '0',
          width: '100vw',
          height: '100vh',
          background: '#1d1d1f'
        }}
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
        style={{
          pointerEvents: isOpen?'auto':'none',
          zIndex: '999',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'center',
          position: 'fixed',
          left: '0',
          top: '0',
          width: '100vw',
          height: '100vh',
          background: 'transparent',
        }}
      >
        {menu.map(item =>
          item.text === "404" ? <div key={item.href}></div> :
          <MenuItem key={item.href} item={item} onCloseMenu={() => setIsOpen(!isOpen)}  />
        )}
      </motion.ul>

      {/*-webkit-user-select: none;*/}
      {/*user-select: none;*/}
      {/*-moz-user-select: none;*/}
      {/*-ms-user-select: none;*/}
      <button
        onClick={() => setIsOpen(!isOpen)} 
        style={{
          alignItems: 'center',
          display: 'flex',
          justifyContent: 'center',
          paddingTop: '4px',
          zIndex: '1000',
          outline: 'none',
          border: 'none',
          cursor: 'pointer',
          position: 'fixed',
          top: '10px',
          left: '10px',
          width: '60px',
          height: '60px',
          borderRadius: '50%',
          background: 'transparent',
        }}
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
      </button>
    </motion.nav>
  );
};

export default Menu