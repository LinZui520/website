import {config, MdEditor} from "md-editor-rt";
import MarkExtension from "markdown-it-mark";
import '@vavt/rt-extension/lib/asset/style.css';
import {Input, Modal} from "antd";
import React, { ReactNode } from "react";


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
  uploadImage: (files: Array<File>) => void;
}

const ArticleMarkDown: React.FC<ArticleMarkDownProps> = (
  {
    title, setTitle,
    content, setContent,
    isModalOpen, setIsModalOpen,
    modalTitle, contextHolder, operate,
    uploadImage
  }) => {

  return (
    <div>
      {contextHolder}
      <Modal title={modalTitle} open={isModalOpen} onOk={operate} onCancel={() => setIsModalOpen(false)}>
        <Input
          placeholder="文章标题" value={title}
          onChange={(e) => {
            setTitle(e.target.value)
          }}
        />
      </Modal>
      <MdEditor
        className={"h-screen"}
        modelValue={content}
        onChange={setContent}
        toolbars={[
          'sub', 'sup', '-',
          'image', '-',
          'save', '-', '=',
          'pageFullscreen', 'fullscreen'
        ]}
        onSave={() => setIsModalOpen(true)}
        onUploadImg={uploadImage}
      />
    </div>
  );
}

export default ArticleMarkDown;