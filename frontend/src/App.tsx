import { RouterProvider } from "react-router-dom";
import router from "./router";
import { ConfigProvider } from "antd";

const App = () => {
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
      <RouterProvider router={router} />
    </ConfigProvider>
  );
}

export default App;
