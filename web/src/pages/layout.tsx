import Menu from '../components/Menu.tsx';
import { Outlet } from 'react-router-dom';

const Layout = () => {

  return (
    <div className="bg-mint-50 font-mono">
      <Menu />
      <Outlet />
    </div>
  );
};

export default Layout;
