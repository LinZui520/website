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
import Message from "../pages/Message";
import Info from "../pages/Info";
import Article from "../pages/Article";
import Register from "../pages/Register";
import ArticleUpdate from "../pages/admin/article/ArticleUpdate";
import ManagerArticle from "../pages/admin/article/ManagerArticle";
import ClassTwentyOne from "../pages/memories/ClassTwentyOne";
import IndexMemories from "../pages/memories/IndexMemories";
import HomeMemories from "../pages/memories/HomeMemories";
import Security from "../pages/Security";
import ImageManager from "../pages/admin/ImageManager";
import MessageManager from "../pages/admin/MessageManager";
import Chat from "../pages/Chat";
import Photo from '../pages/Photo';
import CommentManager from "../pages/admin/CommentManager";

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
        path: 'message',
        element: <Message />,
      },
      {
        path: 'photo',
        element: <Photo />,
      },
      {
        path: 'chat',
        element: <Chat />
      },
      {
        path: 'info/:username',
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
      {
        path: 'security',
        element: <Security />
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
      },
      {
        path: 'image',
        element: <ImageManager />
      },
      {
        path: 'comment',
        element: <CommentManager />
      },
      {
        path: 'message',
        element: <MessageManager />
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