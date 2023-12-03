import { createBrowserRouter } from "react-router-dom";

import Index from "../views/Index";
import Home from "../views/Home";
import About from "../views/About";
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
      {
        path: 'about',
        element: <About />,
      },
    ]
  },
  {
    path: '/login',
    element: <Login />
  }
  
]);

export default router