import { ConfigProvider, Button } from 'antd';
import './Footer.css'


const Footer = () => {
  return (
    <div className='footer'>
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
        <div style={{color: '#000000'}}>Copyright ©2023 朱贵是混蛋</div>
      </ConfigProvider>
    </div>
  );
}

export default Footer