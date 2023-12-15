import { Navigate, createBrowserRouter } from 'react-router-dom';

import Home from '../pages/Home';
import Login from '../pages/Login';
import Register from '../pages/Register';
import Articles from '../pages/Articles';
import Info from '../pages/Info';
import Index from '../pages/Index';
import Messages from '../pages/Messages';
import NotFind from '../pages/NotFind';
import Article from '../pages/Article';
import IndexAdmin from '../pages/admin/IndexAdmin'
import UserManager from "../pages/admin/UserManager";
import ArticleManager from "../pages/admin/ArticleManager";
import MessageManager from "../pages/admin/MessageManager";
import HomeAdmin from "../pages/admin/HomeAdmin";

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
        element: <Articles />
      },
      {
        path: 'article/:id',
        element: <Article />
      },
      {
        path: 'messages',
        element: <Messages />
      },
      {
        path: 'login',
        element: <Login />
      },
      {
        path: 'register',
        element: <Register />
      },
      {
        path: 'info',
        element: <Info />
      },
    ],
  },
  {
    path: '/admin',
    element: <IndexAdmin />,
    children: [
      {
        path: '',
        element: <HomeAdmin />
      },
      {
        path: 'user',
        element: <UserManager />,
      },
      {
        path: 'article',
        element: <ArticleManager />
      },
      {
        path: 'message',
        element: <MessageManager />
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