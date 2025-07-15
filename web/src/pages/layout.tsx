import Menu from '../components/Menu.tsx';
import { Outlet } from 'react-router-dom';
import { CookiesProvider } from 'react-cookie';
import NotificationProvider from '../contexts/NotificationProvider.tsx';
import AuthProvider from '../contexts/AuthProvider.tsx';
import ScrollProvider from '../contexts/ScrollProvider.tsx';
import useMarkdownTheme from '../hooks/useMarkdownTheme.ts';

const Layout = () => {
  useMarkdownTheme();

  return (
    <CookiesProvider defaultSetOptions={{ path: '/' }}>
      <NotificationProvider>
        <AuthProvider>
          <ScrollProvider>
            <Menu />
            <Outlet />
          </ScrollProvider>
        </AuthProvider>
      </NotificationProvider>
    </CookiesProvider>
  );
};

export default Layout;
