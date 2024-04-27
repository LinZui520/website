import {useSelector} from "react-redux";
import {RootState} from "../redux";


const useGetMenu = () => {
  const user = useSelector((state: RootState) => state.user);

  const menu = [
    {href: '/', text: '首页'},
    {href: '/articles', text: '博客'},
    {href: '/message', text: '留言板'},
    user.id !== 0 ? {href: '/photo', text: '照片墙'} : null,
    user.id !== 0 ? {href: '/chat', text: '聊天室'} : null,
    user.id !== 0 ? {href: '/admin', text: '控制台'} : null,
    user.id === 0 ? {href: '/login', text: '登\u00A0\u00A0\u00A0\u00A0录'} : {href: '/info/' + user.username, text: user.username},
  ]

  return { menu };
}

export default useGetMenu;