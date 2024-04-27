import { motion } from "framer-motion";
import React, {useEffect, useState} from "react";
import { useNavigate } from "react-router-dom";
import useGetMenu from "../../hooks/useGetMenu";

interface MenuItemProps {
  item: { href: string; text: string };
  onCloseMenu: () => void;
  navigate: (path: string) => void;
}

const MenuItem: React.FC<MenuItemProps> = ({ item, onCloseMenu, navigate }) => {
  return (
    <motion.li
      variants={{
        open: {y: 0, opacity: 1, transition: {y: {stiffness: 1000, velocity: -100}}},
        closed: {y: 50, opacity: 0, transition: {y: { stiffness: 1000 }}}
      }}
      whileHover={{ scale: 1.3 }} whileTap={{ scale: 0.95 }}
      className={
        "z-50 list-none cursor-pointer mb-[3vh] select-none " +
        "text-[#fbfbfd] text-[24px] lg:text-[36px]"
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
  const navigate = useNavigate()

  const { menu } = useGetMenu()

  useEffect(() => {
    document.body.style.overflow = isOpen ? 'hidden' : 'auto';
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
          item === null ? null :
          <MenuItem
            key={item.href} item={item} navigate={navigate}
            onCloseMenu={() => setIsOpen(!isOpen)}
          />
        )}
      </motion.ul>

      <motion.button
        whileHover={{ scale: 1.2 }} whileTap={{ scale: 0.84}}
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
      </motion.button>
    </motion.nav>
  );
};

export default Menu