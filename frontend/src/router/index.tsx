import { createBrowserRouter } from "react-router-dom";

import Index from "../views/Index";
import Home from "../views/Home";
import Login from "../views/Login";
import Register from "../views/Register";

const router = createBrowserRouter([
  {
    path: '/',
    element: <Index />,
    children: [
      {
        path: '',
        element: <Home />
      },
    ]
  },
  {
    path: '/login',
    element: <Login />
  },
  {
    path: '/register',
    element: <Register />
  }
  
]);

export default router