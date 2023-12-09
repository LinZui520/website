import { createBrowserRouter } from 'react-router-dom';

import Home from '../views/Home';
import Login from '../views/Login';
import Register from '../views/Register';
import Articles from '../views/Articles';
import Info from '../views/Info';
import Index from '../views/Index';
import Messages from '../views/Messages';
import NotFind from '../views/NotFind';
import Article from '../views/Article';

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
    path: '*',
    element: <NotFind />
  }
  
]);

export default router;