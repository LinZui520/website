import { createBrowserRouter } from "react-router-dom";

import Home from "../views/Home";
import Login from "../views/Login";
import Register from "../views/Register";
import Articles from "../views/Articles";
import Info from "../views/Info";

const router = createBrowserRouter([
  {
    path: '/',
    element: <Home />,
  },
  {
    path: '/articles',
    element: <Articles />
  },
  {
    path: '/login',
    element: <Login />
  },
  {
    path: '/register',
    element: <Register />
  },
  {
    path: '/info',
    element: <Info />
  }
  
]);

export default router