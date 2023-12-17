import { createBrowserRouter } from 'react-router-dom';
import Register from "../pages/Register";



const router = createBrowserRouter([
  {
    path: '/',
    element: <Register />,
  }
]);

export default router;