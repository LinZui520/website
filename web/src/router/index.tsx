import { Navigate, createBrowserRouter } from 'react-router-dom';

import Home from '../pages/Home';
import Index from '../pages/Index';
import NotFind from '../pages/NotFind';
import IndexAdmin from "../pages/admin/IndexAdmin";
import HomeAdmin from "../pages/admin/HomeAdmin";
import UserManager from "../pages/admin/UserManager";
import ArticleManager from "../pages/admin/ArticleManager";
import Login from "../pages/Login";
import ArticleAdd from "../pages/admin/article/ArticleAdd";
import ArticleDelete from "../pages/admin/article/ArticleDelete";
import Articles from "../pages/Articles";
import Messages from "../pages/Messages";
import Info from "../pages/Info";
import Article from "../pages/Article";
import Register from "../pages/Register";

const router = createBrowserRouter([
  {
    path: '/',
    element: <Index />,
    children: [
      {
        path: '',
        element: <Home />,
      },
      {
        path: 'articles',
        element: <Articles />,
      },
      {
        path: 'article/:id',
        element: <Article />,
      },
      {
        path: 'messages',
        element: <Messages />,
      },
      {
        path: 'info',
        element: <Info />,
      },
      {
        path: 'login',
        element: <Login />,
      },
      {
        path: 'register',
        element: <Register />
      },
    ],
  },
  {
    path: '/admin',
    element: <IndexAdmin />,
    children: [
      {
        path: '',
        element: <HomeAdmin />,
      },
      {
        path: 'user',
        element: <UserManager />,
      },
      {
        path: 'article',
        element: <ArticleManager />,
        children: [
          {
            path: '',
            element: <Navigate to="/404" />
          },
          {
            path: 'add',
            element: <ArticleAdd />,
          },
          {
            path: 'delete',
            element: <ArticleDelete />,
          }
        ]
      }
    ]
  },
  {
    path: '*',
    element: <Navigate to="/404" />
  },
  {
    path: '/404',
    element: <NotFind />
  }
  
]);

export default router;