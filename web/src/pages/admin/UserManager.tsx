import useFetchUsers, { User } from "../../hooks/user/useFetchUsers";
import {ColumnsType} from "antd/es/table";
import {Button, message, Modal, Table} from "antd";
import {BlockUser, BoostUser} from "../../api/user";
import {useState} from "react";

const UserManager = () => {

  const columns: ColumnsType<User> = [
    {
      title: '用户编号',
      dataIndex: 'id',
      key: 'id',
    },
    {
      title: '用户名',
      dataIndex: 'username',
      key: 'username',
    },
    {
      title: '邮箱',
      dataIndex: 'email',
      key: 'email',
    },
    {
      title: '权限',
      dataIndex: 'power',
      key: 'power',
      render: text => text < 0 ? <span>人下人</span> :
        text === 0 ? <span>普通用户</span> :
          text === 1 ? <span>管理员</span> : <span>超级管理员</span>
    },
    {
      title: '最近登陆时间',
      dataIndex: 'login',
      key: 'login',
      render: text => <span>{new Date(text).toLocaleString()}</span>,
    },
    {
      title: '操作',
      key: 'action',
      fixed: 'right',
      render: record => <div>
        <Button type="link" onClick={() => {
          setBlockId(record.id)
          setIsBlockModalOpen(true)
        }}>
          封禁
        </Button>

        <Button type="link" onClick={() => {
          setBoostId(record.id)
          setIsBoostModalOpen(true)
        }}>
          提升权限
        </Button>
      </div>
    },
  ]

  const {users, fetchData} = useFetchUsers()
  const [isBlockModalOpen, setIsBlockModalOpen] = useState(false)
  const [blockId, setBlockId] = useState(0)
  const [isBoostModalOpen, setIsBoostModalOpen] = useState(false)
  const [boostId, setBoostId] = useState(0)
  const [messageApi, contextHolder] = message.useMessage()


  return (
    <div>
      {contextHolder}
      <Modal
        title="确定封禁该用户？"
        open={isBlockModalOpen}
        onCancel={() => setIsBlockModalOpen(false)}
        onOk={() => {
          BlockUser(blockId).then(res => {
            if (res.data.code === 200) {
              messageApi.success(res.data.message).then(() => {})
              fetchData().then(() => {})
              setIsBlockModalOpen(false)
            } else {
              messageApi.error(res.data.message).then(() => {
              })
            }
          }).catch(() => {
            messageApi.error("网络原因，封禁失败").then(() => {
            })
          })
        }}
      ></Modal>

      <Modal
        title="确定提升该用户权限？"
        open={isBoostModalOpen}
        onCancel={() => setIsBoostModalOpen(false)}
        onOk={() => {
          BoostUser(boostId).then(res => {
            if (res.data.code === 200) {
              messageApi.success(res.data.message).then(() => {})
              fetchData().then(() => {})
              setIsBoostModalOpen(false)
            } else {
              messageApi.error(res.data.message).then(() => {
              })
            }
          }).catch(() => {
            messageApi.error("网络原因，封禁失败").then(() => {
            })
          })
        }}
      ></Modal>

      <Table
        columns={columns}
        dataSource={users.map((user: User) => ({ ...user, key: user.id }))}
        bordered
        className={"w-[80vw]"}
      />
    </div>
  );
}

export default UserManager;