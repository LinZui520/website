import { createBrowserRouter } from 'react-router-dom';
import IndexLayout from '../pages/layout.tsx';
import IndexPage from '../pages/index/page.tsx';
import BlogPage from '../pages/blog/page.tsx';
import BlogDetailPage from '../pages/blog/[id]/page.tsx';
import TrailLayout from '../pages/trail/layout.tsx';
import TrailPage from '../pages/trail/page.tsx';
import TrailLocationPage from '../pages/trail/[location]/page.tsx';
/*
 * 留言板暂时下线，相关 import 一并注释（留着会被判为未使用变量）。
 * pages/board 目录本身没删 —— components/comment/* 仍从它的 [id]/type 取 CommentVO。
 *
 * import BoardLayout from '../pages/board/layout.tsx';
 * import BoardPage from '../pages/board/page.tsx';
 * import BoardDetailPage from '../pages/board/[id]/page.tsx';
 */
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
        path: 'blog/:id',
        element: <BlogDetailPage />
      },
      {
        path: 'trail',
        element: <TrailLayout />,
        children: [
          {
            path: '',
            element: <TrailPage />
          },
          {
            path: ':location',
            element: <TrailLocationPage />
          }
        ]
      },
      /*
       * 留言板暂时下线。恢复时把下面每行行首的 " * " 去掉即可。
       *
       * {
       *   path: 'board',
       *   element: <BoardLayout />,
       *   children: [
       *     {
       *       path: '',
       *       element: <BoardPage />
       *     },
       *     {
       *       path: ':id',
       *       element: <BoardDetailPage />
       *     }
       *   ]
       * },
       */
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
