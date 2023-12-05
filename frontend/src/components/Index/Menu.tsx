import { motion, useCycle } from "framer-motion";
import "./Menu.css"
import { MenuItem } from "./MenuItem";

interface PathProps {
  [key: string]: any;
}
const Path: React.FC<PathProps> = (props) => (
  <motion.path
    fill="transparent"
    strokeWidth="3"
    stroke="white"
    strokeLinecap="round"
    {...props}
  />
);

const sidebar = {
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

const variantsUL = {
  open: {
    transition: { staggerChildren: 0.07, delayChildren: 0.2 }
  },
  closed: {
    transition: { staggerChildren: 0.05, staggerDirection: -1 }
  }
};

const menu = [
  {href: '/', text: '首页'},
  {href: '/', text: '文章'},
  {href: '/', text: '留言'},
  {href: '/about', text: '关于'},
]

export const Menu = () => {
  const [isOpen, toggleOpen] = useCycle(false, true);

  return (
    <motion.nav
      initial={false}
      animate={isOpen ? "open" : "closed"}
      className="menu"
    >
      <motion.div className="menu-background" variants={sidebar} />

      <motion.ul variants={variantsUL} className="menu-ul">
        {menu.map((item, index) => (
          <MenuItem key={index} item={item} />
        ))}
      </motion.ul>

      <button className="menu-button" onClick={() => toggleOpen()} style={{alignItems: 'center', display: 'flex', justifyContent: 'center',paddingTop: '4px'}}>
        <svg width="25" height="25" viewBox="0 0 23 23">
          <Path
            variants={{
              closed: { d: "M 2 2.5 L 20 2.5" },
              open: { d: "M 3 16.5 L 17 2.5" }
            }}
          />
          <Path
            d="M 2 9.423 L 20 9.423"
            variants={{
              closed: { opacity: 1 },
              open: { opacity: 0 }
            }}
            transition={{ duration: 0.1 }}
          />
          <Path
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
