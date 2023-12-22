import { MdEditor, config } from 'md-editor-rt';
import 'md-editor-rt/lib/style.css';
import {useState} from 'react';
import MarkExtension from 'markdown-it-mark';
import '@vavt/rt-extension/lib/asset/style.css';
import {Input, message, Modal} from 'antd';
import {AddArticle} from "../../../api/article";

config({
  markdownItConfig(md) {
    md.use(MarkExtension);
  }
})

const ArticleAdd = () => {

  const [title, setTitle] = useState('')
  const [content, setContent] = useState('')
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [messageApi, contextHolder] = message.useMessage()

  const upload = () => {
    if (title === '') {
      messageApi.warning("请输入标题").then(() => {})
      return
    }
    AddArticle(title, content).then(res => {
      if (res.data.code === 200) {
        messageApi.success(res.data.message).then(() => {})
        setTitle('')
        setContent('')
        setIsModalOpen(false)
      } else {
        messageApi.error(res.data.message).then(() => {})
      }
    }).catch(() => {
      messageApi.error("网络原因，上传失败").then(() => {})
    })
  }


  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
    }}>
      {contextHolder}
      <Modal title="提交博客" open={isModalOpen} onOk={upload} onCancel={() => setIsModalOpen(false)}>
        <Input
          placeholder="文章标题" value={title}
          onChange={(e) => {
            setTitle(e.target.value)
          }}
        />
      </Modal>
      <MdEditor
        style={{height: '100vh'}}
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

export default ArticleAdd;