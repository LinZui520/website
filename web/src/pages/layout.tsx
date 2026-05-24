import { useEffect } from 'react';
import Menu from '../components/Menu.tsx';
import { Outlet } from 'react-router-dom';
import { CookiesProvider } from 'react-cookie';
import NotificationProvider from '../contexts/NotificationProvider.tsx';
import AuthProvider from '../contexts/AuthProvider.tsx';
import ScrollProvider from '../contexts/ScrollProvider.tsx';
import TransitionProvider from '../contexts/TransitionProvider.tsx';
import useMarkdownTheme from '../hooks/useMarkdownTheme.ts';
import Cursor from '../components/Cursor.tsx';

const Layout = () => {
  useMarkdownTheme();

  useEffect(() => {
    console.log('%c朱贵是混蛋', 'font-size:24px; font-weight:300; letter-spacing:0.2em; color:#FAFAFC; background:#1D1D1F; padding:12px 24px;');
  }, []);

  return (
    <CookiesProvider defaultSetOptions={{ path: '/' }}>
      <NotificationProvider>
        <AuthProvider>
          <ScrollProvider>
            <TransitionProvider>
              <Cursor />
              <Menu />
              <Outlet />
            </TransitionProvider>
          </ScrollProvider>
        </AuthProvider>
      </NotificationProvider>
    </CookiesProvider>
  );
};

export default Layout;
