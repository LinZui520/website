import { RouterProvider } from "react-router-dom";
import router from "./router";
import { ConfigProvider } from "antd";
import cookie from 'react-cookies'
import { UserTokenLogin } from "./api/user";
import { setUser } from "./store/user";
import { useDispatch } from 'react-redux';
import { useEffect } from "react";
import { useSelector } from 'react-redux';

const App = () => {

  const dispatch = useDispatch()
  const user = useSelector((state: any) => state.user)


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
            dispatch(setUser(res.data.data.user));
          }
        } catch (_) {

        } 
      } 
    }
    fetchData()
  }, [user, dispatch]);


  return ( 
    <ConfigProvider 
      theme={{
        token: {
          colorBgElevated: 'black',
          colorPrimary: 'black',
        },
        components: {
          Button: {
            colorLink: "#000000",
            colorLinkHover: "#666666",
            colorLinkActive: "#666666",
          },
          Message: {
            contentBg: 'white',
          }
        }
      }}
    >
      <RouterProvider router={router} />
    </ConfigProvider>
  );
}

export default App;
