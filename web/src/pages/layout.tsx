import Menu from '../components/Menu.tsx';
import { Outlet } from 'react-router-dom';

const Layout = () => {

  return (
    <div className="bg-mint-50 dark:bg-mint-950 font-[SmileySans]">
      <Menu />
      <Outlet />
    </div>
  );
};

export default Layout;
