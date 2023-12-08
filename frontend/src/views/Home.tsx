import { useSelector } from 'react-redux';
import { ArrowUpOutlined } from '@ant-design/icons';
import { FloatButton } from 'antd';
import { useEffect } from 'react';
import Footer from '../components/Index/Footer';

const Home = () => {

  const user = useSelector((state: any) => state.user);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);
  
  return (
    <div>
        <div style={{marginLeft: '10vw', marginRight: '10vw', height: '100vh', alignItems: 'center', display: 'flex', flexDirection: 'column', justifyContent: 'center', fontSize: '2rem'}}>
          <span>朱贵是混蛋</span>
          {user.nickname}
        </div>

        <div style={{height: '100vh', alignItems: 'center', display: 'flex', justifyContent: 'center'}}>
          朱贵是混蛋
        </div>
      <FloatButton.BackTop icon={<ArrowUpOutlined style={{color: 'white'}} />} visibilityHeight={600} />
      <Footer />
    </div>
  );
}
  
export default Home;