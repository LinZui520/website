import { RouterProvider } from "react-router-dom";
import router from "./router";
import zhCN from "antd/locale/zh_CN";
import { ConfigProvider, theme } from "antd";
import useUserAuthentication from "./hooks/user/useUserAuthentication";

const App = () => {

  const isHookFinished = useUserAuthentication();


  return (
    !isHookFinished ? <div /> :
    <ConfigProvider
      locale={zhCN}
      theme={{
        components: {
          Button: {
            primaryColor: '#1677ff',
          }
        },
        algorithm: theme.defaultAlgorithm, // 默认算法
      }}

    >
      <RouterProvider router={router}/>
    </ConfigProvider>
  );
}

export default App;
