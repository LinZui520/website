import Menu from '../components/Menu.tsx';
import { Outlet } from 'react-router-dom';
import { CookiesProvider } from 'react-cookie';
import NotificationProvider from '../contexts/NotificationProvider.tsx';
import AuthProvider from '../contexts/AuthProvider.tsx';
import { useRef } from 'react';
import useScroll from '../hooks/useScroll.tsx';

const Layout = () => {

  const container = useRef(document.documentElement);
  const { Scrollbar } = useScroll(
    container,
    (x: number) => 1 - Math.pow(1 - x, 4),
    700
  );

  return (
    <>
      <CookiesProvider defaultSetOptions={{ path: '/' }}>
        <NotificationProvider>
          <AuthProvider>
            <Menu />
            <Outlet />
            <Scrollbar />
          </AuthProvider>
        </NotificationProvider>
      </CookiesProvider>
    </>
  );
};

export default Layout;
