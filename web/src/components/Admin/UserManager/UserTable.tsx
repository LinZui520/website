import { Table } from "antd";
import { ColumnsType } from "antd/es/table";
import {useEffect, useState} from "react";
import {GetAllUser} from "../../../api/user";

interface User {
  id: number;
  nickname: string;
  username: number;
  password: string;
  power: number;
  creation: string;
  latest: string;
}

const UserTable = () => {

  const columns: ColumnsType<User> = [
    {
      title: '用户编号',
      dataIndex: 'id',
      key: 'id',
    },
    {
      title: '昵称',
      dataIndex: 'nickname',
      key: 'nickname',
    },
    {
      title: '用户名',
      dataIndex: 'username',
      key: 'username',
    },
    {
      title: '权力',
      dataIndex: 'power',
      key: 'power',
      render: text => text === 0 ? <span>普通用户</span> : text === 1 ? <span>管理员</span> : <span>超级管理员</span>
    },
    // {
    //   title: '创建时间',
    //   dataIndex: 'creation',
    //   key: 'creation',
    //   render: text => <span>{new Date(text).toLocaleString()}</span>,
    // },
    // {
    //   title: '最近登陆时间',
    //   dataIndex: 'latest',
    //   key: 'latest',
    //   render: text => <span>{new Date(text).toLocaleString()}</span>,
    // },
    {
      title: '操作',
      key: 'action',
      fixed: 'right',
     },
  ]

  const [users, setUsers] = useState<User[]>([])


  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await GetAllUser();
        if (res.data.code === 200) {
          setUsers(res.data.data)
        }
      } catch (_) {
      }
    }
    fetchData().then(() => {})
  }, [])

  return (
    <Table columns={columns} dataSource={users.map(user => ({ ...user, key: user.id }))} bordered />
  );
}

export default UserTable;