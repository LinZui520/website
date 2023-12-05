import { ArrowUpOutlined } from '@ant-design/icons';
import { ConfigProvider, FloatButton } from 'antd';

const BackTopButton = () => {

  return (
    <ConfigProvider 
      theme={{
        token: {
          colorBgElevated: 'black'
        }
      }}
    >
      <FloatButton.BackTop icon={<ArrowUpOutlined style={{color: 'white'}} />} visibilityHeight={500} />
    </ConfigProvider>
  )
}

export default BackTopButton