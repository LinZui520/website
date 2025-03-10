import { createBrowserRouter } from 'react-router-dom';
import IndexLayout from '../pages/layout.tsx';
import IndexPage from '../pages/index/page.tsx';
import BlogPage from '../pages/blog/page.tsx';
import RegisterPage from '../pages/register/page.tsx';
import LoginPage from '../pages/login/page.tsx';

const router = createBrowserRouter([
  {
    path: '/',
    element: <IndexLayout />,
    children: [
      {
        path: '',
        element: <IndexPage />
      },
      {
        path: 'blog',
        element: <BlogPage />
      },
      {
        path: 'register',
        element: <RegisterPage />
      },
      {
        path: 'login',
        element: <LoginPage />
      }
    ]
  }
]);

export default router;
