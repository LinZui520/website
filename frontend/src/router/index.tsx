import { createBrowserRouter } from "react-router-dom";

import Index from "../views/Index";
import Home from "../views/Home";
import Login from "../views/Login";

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
  }
  
]);

export default router