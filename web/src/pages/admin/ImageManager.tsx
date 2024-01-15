import {Button, Modal, Table} from "antd";
import {ColumnsType} from "antd/es/table";
import {Image} from "../../hooks/image/useFetchImages";
import useManagerImage from "../../hooks/image/useManagerImage";


const ImageManager = () => {

  const {
    title,
    isModalOpen,
    setIsModalOpen,
    manage,
    contextHolder,
    images,
    handleDelete
  } = useManagerImage();

  const columns: ColumnsType<Image> = [
    {
      title: '图片编号', dataIndex: 'id', key: 'id'
    },
    {
      title: '用户', dataIndex: 'author', key: 'author'
    },
    {
      title: '图片地址', dataIndex: 'filename', key: 'url',
      render: text => <span>
        {"https://www.zhuguishihundan.cn/image/"+text}
      </span>
    },
    {
      title: '预览图', dataIndex: 'filename', key: 'filename',
      render: text => <img
        src={"/image/"+text} alt={text}
        className={"max-w-[80px] max-h-[80px] object-contain"}
      />
    },
    {
      title: '创建时间', dataIndex: 'create', key: 'create',
      render: text => <span>{new Date(text).toLocaleString()}</span>,
    },
    {
      title: '操作', key: 'action', fixed: 'right',
      render: record => <div>
        <Button type="link" onClick={() => handleDelete(record.id)}>
          删除
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
        dataSource={images.map((image: Image) => ({ ...image, key: image.id }))}
        bordered
        className={"w-[80vw]"}
      />
    </div>
  );
}

export default ImageManager;