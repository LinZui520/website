import Menu from '../components/Menu.tsx';
import { Outlet } from 'react-router-dom';
import { CookiesProvider } from 'react-cookie';
import NotificationProvider from '../contexts/NotificationProvider.tsx';
import AuthProvider from '../contexts/AuthProvider.tsx';

const Layout = () => {

  return (
    <>
      <CookiesProvider defaultSetOptions={{ path: '/' }}>
        <NotificationProvider>
          <AuthProvider>
            <Menu />
            <Outlet />
          </AuthProvider>
        </NotificationProvider>
      </CookiesProvider>
    </>
  );
};

export default Layout;
