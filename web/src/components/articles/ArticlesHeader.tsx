import {motion} from "framer-motion";


const ArticlesHeader = () => {
  return (
    <div style={{
      display: 'flex', flexDirection: 'column',
      justifyContent: 'center', alignItems: 'center',
      width: '100vw', height: '100vh'
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
          color: '#1d1d1f', fontSize: '64px',
        }}
      >
        博客
      </motion.div>
    </div>
  );
}

export default ArticlesHeader;