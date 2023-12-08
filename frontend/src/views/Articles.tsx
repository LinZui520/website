import ArticlesHeader from '../components/Articles/ArticlesHeader';
import ArticlesMain from '../components/Articles/ArticlesMain';
import Menu from '../components/Index/Menu';
import Footer from '../components/Index/Footer';
import { ArrowUpOutlined } from '@ant-design/icons';
import { FloatButton } from 'antd';
import { useEffect } from 'react';

const Articles = () => {

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);
  
  return (
    <div>
      <Menu />
      <ArticlesHeader />
      <ArticlesMain />
      <FloatButton.BackTop icon={<ArrowUpOutlined style={{color: 'white'}} />} visibilityHeight={600} />
      <Footer />
    </div>
  );
}
  
export default Articles;