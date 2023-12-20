import { Button } from 'antd';
import './Footer.css'


const Footer = () => {
  return (
    <div className='footer-container'>
      <Button type="link" href='https://beian.miit.gov.cn/' target='_blank'>赣ICP备2023014673号-1</Button>
      <Button type="link" href='https://github.com/LinZui520/website' target='_blank'>Copyright ©2023 YangmingHe</Button>
    </div>
  );
}

export default Footer