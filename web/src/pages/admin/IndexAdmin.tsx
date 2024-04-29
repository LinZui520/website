import {Menu, MenuProps} from "antd";
import {useEffect, useState} from "react";
import { useSelector } from "react-redux";
import {Outlet, useLocation, useNavigate} from "react-router-dom";
import {
  UserOutlined, HomeOutlined, ReadOutlined, FileImageOutlined,
  RollbackOutlined, MessageOutlined, MailOutlined
} from '@ant-design/icons';
import { RootState } from "../../redux";
import NotFind from "../NotFind";

type MenuItem = Required<MenuProps>['items'][number];

const IndexAdmin = () => {

  const navigate = useNavigate()
  const [inlineCollapsed, setInlineCollapsed] = useState(false);
  const user = useSelector((state: RootState) => state.user)
  const [selectedKey, setSelectedKey] = useState(window.location.pathname)

  const screenWidthThreshold = 768;

  useEffect(() => {
    const handleResize = () => setInlineCollapsed(window.innerWidth <= screenWidthThreshold);

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const onSelect: MenuProps['onSelect'] = (e) => {
    navigate(e.key)
    setSelectedKey(e.key)
  }

  const { pathname } = useLocation()

  useEffect(() => {
    if (pathname.includes('/admin/article/update')) return setSelectedKey('/admin/article/manager')
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
      disabled: user.power <= 0
    },
    {
      label: '文章管理', key: '/admin/article', icon: <ReadOutlined />,
      children: [
        {
          label: '增加文章', key: '/admin/article/upload',
        },
        {
          label: '管理文章', key: '/admin/article/manager',
        },
      ]
    },
    {
      label: '图片管理', key: '/admin/image', icon: <FileImageOutlined />,
    },
    {
      label: '评论管理', key: '/admin/comment', icon: <MessageOutlined />,
    },
    {
      label: '留言管理', key: '/admin/message', icon: <MailOutlined />,
    }
  ];


  return (
    user.id === 0 ? <NotFind /> :
    <div className={"flex flex-row min-h-screen w-screen"}>
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