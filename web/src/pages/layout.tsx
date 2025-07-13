import Menu from '../components/Menu.tsx';
import { Outlet, useLocation } from 'react-router-dom';
import { CookiesProvider } from 'react-cookie';
import NotificationProvider from '../contexts/NotificationProvider.tsx';
import AuthProvider from '../contexts/AuthProvider.tsx';
import ScrollProvider, { useScrollContext } from '../contexts/ScrollProvider.tsx';
import { useEffect, useLayoutEffect } from 'react';
import useMarkdownTheme from '../hooks/useMarkdownTheme.ts';

const Component = () => {
  const { scrollTo } = useScrollContext();
  useMarkdownTheme();

  const pathname = useLocation();
  useLayoutEffect(() => { window.scrollTo(0, 0); }, [pathname, scrollTo]);
  useEffect(() => { scrollTo(0); }, [scrollTo]);

  return (
    <>
      <Menu />
      <Outlet />
    </>
  );
};

const Layout = () => (
  <CookiesProvider defaultSetOptions={{ path: '/' }}>
    <NotificationProvider>
      <AuthProvider>
        <ScrollProvider>
          <Component />
        </ScrollProvider>
      </AuthProvider>
    </NotificationProvider>
  </CookiesProvider>
);

export default Layout;
