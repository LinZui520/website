import { RouterProvider } from "react-router-dom";
import router from "./router";
import cookie from 'react-cookies'
import { UserTokenLogin } from "./api/user";
import { setUser } from "./store/user";
import {useDispatch, useSelector} from 'react-redux';
import { useEffect } from "react";
import {RootState} from "./store";

const App = () => {

  const dispatch = useDispatch()
  const user = useSelector((state: RootState) => state.user)


  useEffect(() => {
    const fetchData = async () => {
      if (cookie.load('token') !== undefined && user.id === 0 ) {
        try {
          const res = await UserTokenLogin();
          if (res.data.code === 200) {
            cookie.save('token', res.data.data.token, { 
              path: "/", 
              expires: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000) 
            });
            dispatch(setUser(res.data.data));
          }
        } catch (_) {

        } 
      } 
    }
    fetchData().then(() => {})
  }, [user, dispatch]);


  return (
    <RouterProvider router={router} />
  );
}

export default App;
