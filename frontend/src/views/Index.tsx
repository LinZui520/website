import Header from '../components/Index/Header';
import Footer from '../components/Index/Footer';
import { Outlet } from 'react-router-dom';
import { FloatButton } from 'antd';
import { ArrowUpOutlined } from '@ant-design/icons';

const Home = () => {
  return (
    <div className='index'>
      <Header />
      <Outlet />
      <FloatButton.BackTop icon={<ArrowUpOutlined />} visibilityHeight={500} />
      <Footer />
    </div>
  );
}
  
export default Home;