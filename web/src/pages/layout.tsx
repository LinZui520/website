import Menu from '../components/Menu.tsx';
import { Outlet } from 'react-router-dom';

const Layout = () => {

  return (
    <>
      <Menu />
      <Outlet />
    </>
  );
};

export default Layout;
