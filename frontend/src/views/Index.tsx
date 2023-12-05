import Footer from '../components/Index/Footer';
import Menu from '../components/Index/Menu';
import { Outlet } from 'react-router-dom';

const Home = () => {
  return (
    <div className='index'>
      <Menu />
      <Outlet /> 
      {/* <FloatButton.BackTop icon={<ArrowUpOutlined />} visibilityHeight={500} /> */}
      <Footer />
    </div>
  );
}
  
export default Home;