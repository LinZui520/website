import { ConfigProvider, Button } from 'antd';
import './Footer.css'


const Footer = () => {
  return (
    <div className='footer'>
      <ConfigProvider 
        theme={{
          components: {
            Button: {
              contentFontSize: 20,
              colorLink: "white",
              colorLinkHover: "white",
              colorLinkActive: "white",
            }
          }
        }}
      >
        <Button type="link" href='https://beian.miit.gov.cn/' target='_blank'>赣ICP备2023014673号-1</Button>
        <span style={{fontSize: '20px', color: 'white'}}>Copyright ©2023 Yangming He</span>
      </ConfigProvider>
    </div>
  );
}

export default Footer