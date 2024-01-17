import { User } from "../../hooks/user/useFetchUsers";
import {ColumnsType} from "antd/es/table";
import {Button, Modal, Table} from "antd";
import useManageUser from "../../hooks/user/useManageUser";

const UserManager = () => {

  const {
    title,
    isModalOpen,
    setIsModalOpen,
    manage,
    contextHolder,
    users,
    handleBlock,
    handleBoost,
  } = useManageUser();


  const columns: ColumnsType<User> = [
    {
      title: '用户编号', dataIndex: 'id', key: 'id'
    },
    {
      title: '头像', dataIndex: 'avatar', key: 'avatar',
      render: text => <img
        src={"https://www.zhuguishihundan.cn/image/" + text} alt={""}
        className={"w-[32px] h-[32px] object-contain rounded-full select-none"}
      />
    },
    {
      title: '用户名', dataIndex: 'username', key: 'username'
    },
    {
      title: '邮箱', dataIndex: 'email', key: 'email'
    },
    {
      title: '权限', dataIndex: 'power', key: 'power',
      render: text => text < 0 ? <span>人下人</span> :
        text === 0 ? <span>普通用户</span> :
          text === 1 ? <span>管理员</span> : <span>超级管理员</span>
    },
    {
      title: '最近登陆时间', dataIndex: 'login', key: 'login',
      render: text => <span>{new Date(text).toLocaleString()}</span>,
    },
    {
      title: '操作', key: 'action', fixed: 'right',
      render: record => <div>
        <Button type="link" onClick={() => handleBlock(record.id)}>
          封禁
        </Button>

        <Button type="link" onClick={() => handleBoost(record.id)}>
          提升权限
        </Button>
      </div>
    },
  ]

  return (
    <div>
      {contextHolder}
      <Modal
        title={title}
        open={isModalOpen}
        onCancel={() => setIsModalOpen(false)}
        onOk={() => manage()}
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