import {Menu, MenuProps} from "antd";
import {useEffect, useState} from "react";
import { useSelector } from "react-redux";
import {Outlet, useLocation, useNavigate} from "react-router-dom";
import {UserOutlined, HomeOutlined, ReadOutlined, FileImageOutlined, RollbackOutlined} from '@ant-design/icons';
import { RootState } from "../../redux";

type MenuItem = Required<MenuProps>['items'][number];

const IndexAdmin = () => {

  const navigate = useNavigate()
  const [inlineCollapsed, setInlineCollapsed] = useState(false);
  const user = useSelector((state: RootState) => state.user)
  const [selectedKey, setSelectedKey] = useState(window.location.pathname)

  const screenWidthThreshold = 768;

  useEffect(() => {
    const handleResize = () => {
      setInlineCollapsed(window.innerWidth <= screenWidthThreshold);
    };
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  const onSelect: MenuProps['onSelect'] = (e) => {
    navigate(e.key)
    setSelectedKey(e.key)
  }

  const { pathname } = useLocation()

  useEffect(() => {
    if (pathname.includes('/admin/article/update')) {
      setSelectedKey('/admin/article/manager')
      return
    }
    setSelectedKey(pathname)
  }, [pathname]);

  const items: MenuItem[] = [
    {
      label: '返回', key: '/', icon: <RollbackOutlined />,
    },
    {
      label: '主页', key: '/admin', icon: <HomeOutlined />,
    },
    {
      label: '用户管理', key: '/admin/user', icon: <UserOutlined />,
      disabled: user.power <= 1
    },
    {
      label: '文章管理', key: '/admin/article', icon: <ReadOutlined />,
      disabled: user.power <= 0,
      children: [
        {
          label: '增加文章', key: '/admin/article/upload',
          disabled: user.power <= 0,
        },
        {
          label: '管理文章', key: '/admin/article/manager',
          disabled: user.power <= 0,
        },
      ]
    },
    {
      label: '图片管理', key: '/admin/image', icon: <FileImageOutlined />,
      disabled: user.power <= 0,
    }
  ];


  return (
    <div className={"flex flex-row h-screen w-screen"}>
      <Menu
        mode="inline"
        selectedKeys={[selectedKey]}
        defaultOpenKeys={['/admin/article']}
        onSelect={onSelect}
        className={"w-[20vw] select-none"}
        items={items}
        inlineCollapsed={inlineCollapsed}
        // theme="dark"
      />
      <Outlet />
    </div>
  );
}

export default IndexAdmin;