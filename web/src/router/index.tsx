import { Navigate, createBrowserRouter } from 'react-router-dom';

import Home from '../pages/Home';
import Index from '../pages/Index';
import NotFind from '../pages/NotFind';
import IndexAdmin from "../pages/admin/IndexAdmin";
import HomeAdmin from "../pages/admin/HomeAdmin";
import UserManager from "../pages/admin/UserManager";
import ArticleManager from "../pages/admin/ArticleManager";
import Login from "../pages/Login";
import ArticleUpload from "../pages/admin/article/ArticleUpload";
import Articles from "../pages/Articles";
import Messages from "../pages/Messages";
import Info from "../pages/Info";
import Article from "../pages/Article";
import Register from "../pages/Register";
import ArticleUpdate from "../pages/admin/article/ArticleUpdate";
import ManagerArticle from "../pages/admin/article/ManagerArticle";
import ClassTwentyOne from "../pages/memories/ClassTwentyOne";
import IndexMemories from "../pages/memories/IndexMemories";
import HomeMemories from "../pages/memories/HomeMemories";

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
            path: 'upload',
            element: <ArticleUpload />,
          },
          {
            path: 'manager',
            element: <ManagerArticle />,
          },
          {
            path: 'update/:id',
            element: <ArticleUpdate />,
          },
        ]
      }
    ]
  },
  {
    path: '/memories',
    element: <IndexMemories />,
    children: [
      {
        path: '',
        element: <HomeMemories />,
      },
      {
        path: '*',
        element: <HomeMemories />,
      },
      {
        path: '21',
        element: <ClassTwentyOne />
      }
    ],
  },
  {
    path: '*',
    element: <NotFind />
  },
]);

export default router;