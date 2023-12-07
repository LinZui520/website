import { RouterProvider } from "react-router-dom";
import router from "./router";
import { ConfigProvider } from "antd";
import cookie from 'react-cookies'
import { UserTokenLogin } from "./api/user";
import { setUser } from "./store/user";
import { useDispatch } from 'react-redux';
import { useCallback, useEffect } from "react";
import { useSelector } from 'react-redux';
import Menu from "./components/Index/Menu";

const App = () => {

  const dispatch = useDispatch()
  const user = useSelector((state: any) => state.user)

  const fetchData = useCallback(async () => {
    if (cookie.load('token') !== undefined && user.id === 0 ) {
      try {
        const res = await UserTokenLogin();
        if (res.data.code === 200) {
          cookie.save('token', res.data.data.Token, { path: "/" });
          dispatch(setUser(res.data.data.User));
          console.log("tokenlogin")
        }
      } catch (err) {

      } 
    } else {
      console.log("notokenlogin")
    }
  }, [dispatch, user]) 

  useEffect(() => {
    console.log(user)
    fetchData()
  }, [user, dispatch, fetchData]);


  return ( 
    <ConfigProvider 
      theme={{
        token: {
          colorBgElevated: 'black',
          colorPrimary: 'black',
        },
        components: {
          Input: {
            activeShadow: 'black',
          },
          Button: {
            colorLink: "#000000",
            colorLinkHover: "#666666",
            colorLinkActive: "#666666",
          },
        }
      }}
    >
      <Menu />
      <RouterProvider router={router} />
    </ConfigProvider>
  );
}

export default App;
