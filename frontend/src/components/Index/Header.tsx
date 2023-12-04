import { ConfigProvider, Button } from "antd";
import './Header.css'
import gsap from "gsap";
import { useEffect } from "react";

const Header = () => {
  useEffect(() => {
    gsap.from(".header", {
      y: -60
    })
  })

  

  return (
    <div className="header">
      <ConfigProvider 
        theme={{
          components: {
            Button: {
              contentFontSize: 20,
              // colorLink: "#909399",
              colorLink: "#000000",
              colorLinkHover: "#888888",
              colorLinkActive: "#888888",
            }
          }
        }}
      >
        <div className="header-left">
          <Button type="link" href="/">首页</Button>
          <Button type="link" href="/about">关于</Button>
        </div>

        <div className="header-right">
          <Button type="link" href="/login">登陆</Button>
        </div>
      </ConfigProvider>
    </div>
  );
}

export default Header