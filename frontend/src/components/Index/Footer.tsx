import { ConfigProvider, Button } from 'antd';
import './Footer.css'


const Footer = () => {
  return (
    <div className='footer-container'>
      <ConfigProvider 
        theme={{
          components: {
            Button: {
              contentFontSize: 16,
              colorLink: "#000000",
              colorLinkHover: "#000000",
              colorLinkActive: "#000000",
            }
          }
        }}
      >
        <Button type="link" href='https://beian.miit.gov.cn/' target='_blank'>赣ICP备2023014673号-1</Button>
        <Button type="link" href='https://github.com/LinZui520/website' target='_blank'>Copyright ©2023 YangmingHe</Button>
      </ConfigProvider>
    </div>
  );
}

export default Footer