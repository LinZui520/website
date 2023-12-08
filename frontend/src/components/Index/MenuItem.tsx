import { Button, ConfigProvider } from "antd";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import './Menu.css'

const variants = {
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
};

export const MenuItem = ({ item, onCloseMenu }: any) => {
  const navigate = useNavigate()
  return (
    <motion.li
      variants={variants}
      whileHover={{ scale: 1.3 }}
      whileTap={{ scale: 0.95 }}
      className="menu-li"
    >
      <ConfigProvider 
        theme={{
          components: {
            Button: {
              contentFontSize: 32,
              colorLink: "white",
              colorLinkHover: "white",
              colorLinkActive: "white",
            }
          }
        }}
      >
        <Button type="link" onClick={() => {
          navigate(item.href);
          onCloseMenu();
        }}>
          {item.text}
        </Button>
      </ConfigProvider>
      
    </motion.li>
  );
};
