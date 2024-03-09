import {Button, Modal, Table} from "antd";
import {ColumnsType} from "antd/es/table";
import {Article} from "../../../hooks/article/useFetchArticle";
import useManageArticle from "../../../hooks/article/useManageArticle";


const ManagerArticle = () => {

  const {
    title,
    isModalOpen,
    setIsModalOpen,
    manage,
    contextHolder,
    articles,
    handleDelete,
    handleUpdate,
    handleView,
  } = useManageArticle();

  const columns: ColumnsType<Article> = [
    {
      title: '文章编号', dataIndex: 'id', key: 'id'
    },
    {
      title: '作者', dataIndex: 'username', key: 'username'
    },
    {
      title: '标题', dataIndex: 'title', key: 'title'
    },
    {
      title: '创建时间', dataIndex: 'create', key: 'create',
      render: (text: string) => <span>{new Date(text).toLocaleString()}</span>,
    },
    {
      title: '操作', key: 'action', fixed: 'right',
      render: (record: Article) => <div>
        <Button type="link" onClick={() => handleDelete(record.id)}>
          删除
        </Button>
        <Button type="link" onClick={() => handleUpdate(record.id)}>
          修改
        </Button>
        <Button type="link" onClick={() => handleView(record.id)}>
          查看
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
      >
      </Modal>

      <Table
        columns={columns}
        dataSource={articles.map((article: Article) => ({ ...article, key: article.id }))}
        scroll={{y: '80vh'}}
        bordered
      />
    </div>
  );
}

export default ManagerArticle;