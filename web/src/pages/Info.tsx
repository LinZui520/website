import { motion } from "framer-motion";
import {useSelector} from "react-redux";
import {useEffect} from "react";
import cookie from "react-cookies";
import {useNavigate} from "react-router-dom";


const Info = () => {

  const navigate = useNavigate()
  const user = useSelector((state: any) => state.user)
  useEffect(() => {
    if (cookie.load('token') === undefined || (user.id !== 0 && user.power === 0)) {
      navigate('/404');
    }
  }, [user, navigate]);

  return (
    <div style={{
      display: 'flex', flexDirection: 'column',
      justifyContent: 'center', alignItems: 'center',
      background: '#fbfbfd', height: '100vh', width: '100vw'
    }}>
      <motion.div
        whileHover={{scale: 1.2}}
        whileTap={{scale: 0.9}}
        drag
        dragConstraints={{
          top: -0,
          left: -0,
          right: 0,
          bottom: 0,
        }}
        style={{
          color: '#1d1d1f', fontSize: '64px'
        }}
      >
        {user.username}
      </motion.div>
    </div>
  );
}

export default Info;