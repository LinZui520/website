import { ArrowUpOutlined } from '@ant-design/icons';
import { FloatButton } from 'antd';
import { useEffect } from 'react';
import Footer from '../components/index/Footer';

const Home = () => {


  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);
  
  return (
    <div style={{background: '#fbfbfd'}}>
        <div style={{marginLeft: '10vw', marginRight: '10vw', height: '100vh', alignItems: 'center', display: 'flex', flexDirection: 'column', justifyContent: 'center', fontSize: '2rem'}}>
          <span>朱贵是混蛋</span>
        </div>
      <FloatButton.BackTop icon={<ArrowUpOutlined style={{color: 'white'}} />} visibilityHeight={600} />
      <Footer />
    </div>
  );
}
  
export default Home;