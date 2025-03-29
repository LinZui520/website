import { createBrowserRouter } from 'react-router-dom';
import IndexLayout from '../pages/layout.tsx';
import IndexPage from '../pages/index/page.tsx';
import BlogPage from '../pages/blog/page.tsx';
import AuthPage from '../pages/auth/page.tsx';
import ErrorPage from '../pages/error/page.tsx';

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
        path: 'auth',
        element: <AuthPage />
      },
      {
        path: '*',
        element: <ErrorPage />
      }
    ]
  }
]);

export default router;
