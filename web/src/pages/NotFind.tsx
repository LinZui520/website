import { motion } from "framer-motion";


const NotFind = () => {
  return (
    <div style={{
      height: '100vh',
      alignItems: 'center',
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'center',
      fontSize: '2rem',
      background: '#fbfbfd'
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
        404 NotFind
      </motion.div>
    </div>
  );
}

export default NotFind;