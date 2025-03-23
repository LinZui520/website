import Menu from '../components/Menu.tsx';
import { Outlet, useLocation } from 'react-router-dom';
import { CookiesProvider } from 'react-cookie';
import NotificationProvider from '../contexts/NotificationProvider.tsx';
import AuthProvider from '../contexts/AuthProvider.tsx';
import { useEffect, useLayoutEffect, useRef } from 'react';
import useScroll from '../hooks/useScroll.tsx';

const Layout = () => {

  const container = useRef(document.documentElement);
  const { scrollTo, Scrollbar } = useScroll(
    container,
    (x: number) => 1 - Math.pow(1 - x, 3),
    500
  );

  const pathname = useLocation();
  useLayoutEffect(() => { window.scrollTo(0, 0); }, [pathname, scrollTo]);
  useEffect(() => { scrollTo(0); }, [scrollTo]);

  return (
    <CookiesProvider defaultSetOptions={{ path: '/' }}>
      <NotificationProvider>
        <AuthProvider>
          <Menu />
          <Outlet />
          <Scrollbar />
        </AuthProvider>
      </NotificationProvider>
    </CookiesProvider>
  );
};

export default Layout;
