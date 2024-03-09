import {Button, Modal, Table} from "antd";
import {ColumnsType} from "antd/es/table";
import {Message} from "../../hooks/message/useFetchMessages";
import useManageMessage from "../../hooks/message/useManageMessage";


const MessageManager = () => {

  const {
    title,
    isModalOpen,
    setIsModalOpen,
    manage,
    contextHolder,
    messages,
    handleDelete,
  } = useManageMessage()

  const columns: ColumnsType<Message> = [
    {
      title: '留言编号', dataIndex: 'id', key: 'id'
    },
    {
      title: '头像', dataIndex: 'avatar', key: 'avatar',
      render: (text: string) => <img
        src={`${window.location.origin}/image/${text}`} alt={""}
        className={"max-w-[32px] max-h-[32px] object-contain rounded-full select-none"}
      />
    },
    {
      title: '用户名', dataIndex: 'username', key: 'username'
    },
    {
      title: '内容', dataIndex: 'content', key: 'content',
    },
    {
      title: '创建时间', dataIndex: 'create', key: 'create',
      render: (text: string) => <span>{new Date(text).toLocaleString()}</span>,
    },
    {
      title: '操作', key: 'action', fixed: 'right',
      render: (record: Message) => <div>
        <Button type="link" onClick={() => handleDelete(record.id)}>
          删除
        </Button>
      </div>
    },
  ]


  return (
    <div className={"w-[80vw]"}>
      {contextHolder}
      <Modal
        title={title}
        open={isModalOpen}
        onCancel={() => setIsModalOpen(false)}
        onOk={() => manage()}
      ></Modal>

      <Table
        columns={columns}
        dataSource={messages.map((message: Message) => ({ ...message, key: message.id }))}
        bordered
        scroll={{y: '80vh'}}
        className={"w-[80vw]"}
      />
    </div>
  );
}

export default MessageManager;