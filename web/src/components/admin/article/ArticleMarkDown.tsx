import {config, MdEditor, NormalToolbar} from "md-editor-rt";
import MarkExtension from "markdown-it-mark";
import '@vavt/rt-extension/lib/asset/style.css';
import {Input, Modal} from "antd";
import {FileImageOutlined} from '@ant-design/icons';
import React, { ReactNode, useState } from "react";
import ImageList from "./ImageList";
import useFetchImagesByAuthor from "../../../hooks/image/useFetchImagesByAuthor";


config({
  markdownItConfig(md) {
    md.use(MarkExtension);
  }
})


interface ArticleMarkDownProps {
  title: string;
  setTitle: (value: string) => void;
  content: string;
  setContent: (value: string) => void;
  isModalOpen: boolean;
  setIsModalOpen: (value: boolean) => void;
  modalTitle: string;
  contextHolder: ReactNode;
  operate: () => void;
  uploadImage: (files: File[], callback: (urls: string[]) => void) => void;
}

const ArticleMarkDown: React.FC<ArticleMarkDownProps> = (
  {
    title, setTitle,
    content, setContent,
    isModalOpen, setIsModalOpen,
    modalTitle, contextHolder, operate,
    uploadImage
  }) => {

  const [isImageModalOpen, setImageModalOpen] = useState(false);
  const { images, fetchData } = useFetchImagesByAuthor()

  return (
    <div>
      {contextHolder}
      <Modal title={modalTitle} open={isModalOpen} onOk={operate} onCancel={() => setIsModalOpen(false)}>
        <Input
          placeholder="文章标题" value={title}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
            setTitle(e.target.value)
          }}
        />
      </Modal>
      <ImageList
        isModalOpen={isImageModalOpen}
        setIsModalOpen={setImageModalOpen}
        images={images}
      />
      <MdEditor
        className={"h-screen"}
        modelValue={content}
        onChange={setContent}
        defToolbars={[
          <NormalToolbar
            key={"我的图片"}
            title={"我的图片"}
            trigger={<FileImageOutlined />}
            onClick={() => fetchData().then(() => setImageModalOpen(true))}
          />
        ]}
        toolbars={[
          'sub', 'sup', '-',
          'link', 'image', 0, '-',
          'save', '-',
          '=', 'pageFullscreen', 'fullscreen'
        ]}
        onSave={() => setIsModalOpen(true)}
        onUploadImg={uploadImage}
      />
    </div>
  );
}

export default ArticleMarkDown;