import { MdEditor, config } from 'md-editor-rt';
import 'md-editor-rt/lib/style.css';
import {useEffect, useState} from 'react';
import MarkExtension from 'markdown-it-mark';
import '@vavt/rt-extension/lib/asset/style.css';
const ArticleAdd = () => {

  const [content, setContent] = useState('');

  useEffect(() => {

  }, []);

  config({
    markdownItConfig(md) {
      md.use(MarkExtension);
    }
  });

  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
    }}>
      {/*<div style={{height: '10vh'}}>sb</div>*/}
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
        onSave={() => {}}
        onUploadImg={() => {}}
      />
    </div>
  );
}

export default ArticleAdd;