import {ColumnsType} from "antd/es/table";
import {Button, Modal, Table} from "antd";
import {Comment} from "../../hooks/comment/useFetchComments";
import useManagerComment from "../../hooks/comment/useManagerComment";


const CommentManager = () => {

  const {
    title,
    isModalOpen,
    setIsModalOpen,
    manage,
    contextHolder,
    comments,
    handleDelete,
  } = useManagerComment()

  const columns: ColumnsType<Comment> = [
    {
      title: '评论编号', dataIndex: 'id', key: 'id'
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
      title: '文章标题', dataIndex: 'title', key: 'title'
    },
    {
      title: '评论内容', dataIndex: 'content', key: 'content'
    },
    {
      title: '评论时间', dataIndex: 'create', key: 'create',
      render: (text: string) => <span>{new Date(text).toLocaleString()}</span>,
    },
    {
      title: '操作', key: 'action', fixed: 'right',
      render: (record: Comment) => <div>
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
        dataSource={comments.map((comment: Comment) => ({ ...comment, key: comment.id }))}
        bordered
        scroll={{y: '80vh'}}
        className={"w-[80vw]"}
      />
    </div>
  );
}

export default CommentManager;