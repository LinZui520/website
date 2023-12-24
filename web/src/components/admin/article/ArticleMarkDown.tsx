import {config, MdEditor} from "md-editor-rt";
import MarkExtension from "markdown-it-mark";
import '@vavt/rt-extension/lib/asset/style.css';
import {Input, Modal} from "antd";


config({
  markdownItConfig(md) {
    md.use(MarkExtension);
  }
})

const ArticleMarkDown = (
  {
    title, setTitle,
    content, setContent,
    isModalOpen, setIsModalOpen,
    modalTitle, contextHolder, operate
  }: any) => {

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
        onUploadImg={() => {

        }}
      />
    </div>
  );
}

export default ArticleMarkDown;