import { motion } from "framer-motion";


const Footer = () => {


  return (
    <div style={{
      width: '100vw', height: '100vh',
      display: 'flex', flexDirection: 'column',
      justifyContent: 'center', alignItems: 'center',
      background: '#1d1d1f',
    }}>

      <motion.a
        rel='noopener noreferrer' href='https://beian.miit.gov.cn/' target='_blank'
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
          color: '#fbfbfd', textDecoration: 'none',
          fontSize: '32px', marginBottom: '30px',
        }}
      >
        赣ICP备2023014673号-1
      </motion.a>
      <motion.a
        rel='noopener noreferrer' href='https://github.com/LinZui520/website' target='_blank'
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
          color: '#fbfbfd', textDecoration: 'none',
          fontSize: '32px', marginBottom: '30px',
        }}
      >
        Copyright ©2023 YangmingHe
      </motion.a>

    </div>
  );
}

export default Footer