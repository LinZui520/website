import {Button, Image as IMAGE, Modal, Table} from "antd";
import React from "react";
import {Image} from "../../../hooks/image/useFetchImages";
import {ColumnsType} from "antd/es/table";
import useManageImage from "../../../hooks/image/useManageImage";

interface ImageListProps {
  isModalOpen: boolean;
  setIsModalOpen: (value: boolean) => void;
  images: Image[];
}

const ImageList: React.FC<ImageListProps> = ({isModalOpen, setIsModalOpen, images}) => {

  const {
    contextHolder,
    handleCopy,
  } = useManageImage()

  const columns: ColumnsType<Image> = [
    {
      title: '预览图', dataIndex: 'filename', key: 'filename',
      render: text => <IMAGE
        src={"/image/"+text} alt={text}
        className={"max-w-[80px] max-h-[80px] object-contain"}
      />
    },
    {
      title: '操作', key: 'action', fixed: 'right',
      render: record => <div>
        <Button type="link" onClick={() =>
          handleCopy(`${window.location.origin}/image/${record.filename}`)
        }>
          复制图片URL
        </Button>
      </div>
    },
  ]


  return (
    <div>
      {contextHolder}
      <Modal open={isModalOpen} onCancel={() => setIsModalOpen(false)} footer={null}>
        <Table
          columns={columns}
          dataSource={images.map((image: Image) => ({ ...image, key: image.id }))}
          bordered
          className={"w-[80vw] select-none"}
          scroll={{ x: 400, y: 400 }}
        />
      </Modal>
    </div>
  );
}

export default ImageList;