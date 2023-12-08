import { createBrowserRouter } from 'react-router-dom';

import Home from '../views/Home';
import Login from '../views/Login';
import Register from '../views/Register';
import Articles from '../views/Articles';
import Info from '../views/Info';
import Index from '../views/Index';
import Message from '../views/Message';
import NotFind from '../views/NotFind';

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
        path: 'message',
        element: <Message />
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