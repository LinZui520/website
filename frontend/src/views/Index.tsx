import BackTopButton from '../components/Index/BackTopButton';
import Footer from '../components/Index/Footer';
import Menu from '../components/Index/Menu';
import { Outlet } from 'react-router-dom';
import { useState } from 'react';

const Home = () => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className='index'>
      <Menu onDataReceived={setIsOpen} />
      <Outlet /> 
      { isOpen ? null : <BackTopButton />}
      <Footer />
    </div>
  );
}
  
export default Home;