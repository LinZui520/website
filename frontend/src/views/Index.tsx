import { ArrowUpOutlined } from '@ant-design/icons';
import { FloatButton } from 'antd';
import Footer from '../components/Index/Footer';
import { Outlet } from 'react-router-dom';

const Home = () => {
  
  return (
    <div className='index'>
      <Outlet /> 
      <FloatButton.BackTop icon={<ArrowUpOutlined style={{color: 'white'}} />} visibilityHeight={600} />
      <Footer />
    </div>
  );
}
  
export default Home;