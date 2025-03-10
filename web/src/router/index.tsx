import { createBrowserRouter } from 'react-router-dom';
import IndexPage from '../pages/index/page.tsx';
import RegisterPage from '../pages/register/page.tsx';
import LoginPage from '../pages/login/page.tsx';

const router = createBrowserRouter([
  {
    path: '/',
    element: <IndexPage />
  },
  {
    path: '/register',
    element: <RegisterPage />
  },
  {
    path: '/login',
    element: <LoginPage />
  }
]);

export default router;
