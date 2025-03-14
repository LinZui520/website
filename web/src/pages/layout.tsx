import Menu from '../components/Menu.tsx';
import { Outlet } from 'react-router-dom';
import NotificationProvider from '../contexts/NotificationProvider.tsx';

const Layout = () => {

  return (
    <>
      <NotificationProvider>
        <Menu />
        <Outlet />
      </NotificationProvider>
    </>
  );
};

export default Layout;
