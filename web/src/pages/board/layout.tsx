import { Outlet } from 'react-router-dom';
import { BoardVO } from './type';
import { useEffect, useState } from 'react';
import { readBoard } from './api';

const Layout = () => {
  const [boards, setBoards] = useState<BoardVO[]>([]);

  useEffect(() => {
    readBoard<BoardVO[]>().then(res => setBoards(res.data.data));
  }, []);

  return (
    <Outlet context={{ boards }} />
  );
};

export default Layout;
