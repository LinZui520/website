import { motion } from "framer-motion";
import { MenuItem } from "./MenuItem";
import "./Menu.css"
import { useEffect, useState } from "react";

const variantsDiv = {
  open: (height = 1000) => ({
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
};

const variantsUl = {
  open: {
    transition: { staggerChildren: 0.07, delayChildren: 0.2 }
  },
  closed: {
    transition: { staggerChildren: 0.05, staggerDirection: -1 }
  }
};

const menu = [
  {href: '/', text: '首页'},
  {href: '/articles', text: '文章'},
  {href: '/comments', text: '留言'},
  {href: '/login', text: '登陆'},
]



export const Menu = () => {
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    document.body.style.overflow = isOpen ? 'hidden' : 'auto';
    // if (isOpen) {
    //   props.onDataReceived(isOpen)
    // } else {
    //   const delayDuration = 800;
    //   const timer = setTimeout(() => {
    //     props.onDataReceived(isOpen);
    //   }, delayDuration);
    //   return () => clearTimeout(timer);
    // }
  }, [isOpen]);

  return (
    <motion.nav
      initial={false}
      animate={isOpen ? "open" : "closed"}
      className="menu-container"
    >
      <motion.div className="menu-background" variants={variantsDiv} />

      <motion.ul variants={variantsUl} style={{pointerEvents: isOpen?'auto':'none'}} className="menu-ul">
        {menu.map(item => 
          <MenuItem key={item.href} item={item} />
        )}
      </motion.ul>

      <button 
        className="menu-button" 
        onClick={() => setIsOpen(!isOpen)} 
        style={{alignItems: 'center', display: 'flex', justifyContent: 'center',paddingTop: '4px'}}
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
