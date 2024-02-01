import { RouterProvider } from "react-router-dom";
import router from "./router";
import zhCN from "antd/locale/zh_CN";
import { ConfigProvider } from "antd";
import useUserAuthentication from "./hooks/user/useUserAuthentication";
import { useEffect } from "react";

const App = () => {

  const isHookFinished = useUserAuthentication();
  
  useEffect(() => {
    console.log("啊 你真吃啊")
  }, [])

  return (
    !isHookFinished ? <div /> :
    <ConfigProvider
      locale={zhCN}
      theme={{
        components: {
          Button: {
            primaryColor: '#1677ff'
          }
        }
      }}
    >
      <RouterProvider router={router}/>
    </ConfigProvider>
  );
}

export default App;
