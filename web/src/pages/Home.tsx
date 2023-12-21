import { useEffect } from 'react';
import Footer from '../components/index/Footer';
import {motion} from "framer-motion";

const Home = () => {


  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);
  
  return (
    <div style={{background: '#fbfbfd'}}>
      <div style={{
        height: '100vh',
        alignItems: 'center',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        fontSize: '2rem'
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
          朱贵是混蛋
        </motion.div>
      </div>
      <Footer/>
    </div>
  );
}

export default Home;