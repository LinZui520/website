import { Navigate, createBrowserRouter } from 'react-router-dom';

import Home from '../views/Home';
import Login from '../views/Login';
import Register from '../views/Register';
import Articles from '../views/Articles';
import Info from '../views/Info';
import Index from '../views/Index';
import Messages from '../views/Messages';
import NotFind from '../views/NotFind';
import Article from '../views/Article';
import IndexAdmin from '../views/admin/IndexAdmin'
import UserManager from "../views/admin/UserManager";
import ArticleManager from "../views/admin/ArticleManager";
import MessageManager from "../views/admin/MessageManager";
import HomeAdmin from "../views/admin/HomeAdmin";

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