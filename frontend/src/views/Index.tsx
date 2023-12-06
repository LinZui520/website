import { ArrowUpOutlined } from '@ant-design/icons';
import { FloatButton } from 'antd';
import Footer from '../components/Index/Footer';
import Menu from '../components/Index/Menu';
import { Outlet } from 'react-router-dom';

const Home = () => {
  
  return (
    <div className='index'>
      <Menu />
      <Outlet /> 
      <FloatButton.BackTop icon={<ArrowUpOutlined style={{color: 'white'}} />} visibilityHeight={600} />
      <Footer />
    </div>
  );
}
  
export default Home;