import { useState } from '@/composables/useState';
import { markdown } from '@/utils/markdown';
import { mdiContentSaveEdit, mdiEye } from '@mdi/js';
import { defineComponent, onMounted, onUnmounted, ref, watchEffect } from 'vue';
import { VBtn, VContainer } from 'vuetify/components';

export default defineComponent({
  name: 'IndexView',
  setup() {
    const content = ref('# Markdown与数学公式示例\n\n## 代码示例\n```js\nconsole.log("Hello, world!");\n```\n\n## 数学公式示例\n\n行内公式: $E=mc^2$\n\n块级公式:\n\n$$\n\\frac{d}{dx}\\left( \\int_{0}^{x} f(u)\\,du\\right)=f(x)\n$$\n\n$$\n\\begin{pmatrix}\n1 & 0 & 0 \\\\\n0 & 1 & 0 \\\\\n0 & 0 & 1\n\\end{pmatrix}\n$$\n\n# Markdown与数学公式示例\n\n## 代码示例\n```js\nconsole.log("Hello, world!");\n```\n\n## 数学公式示例\n\n行内公式: $E=mc^2$\n\n块级公式:\n\n$$\n\\frac{d}{dx}\\left( \\int_{0}^{x} f(u)\\,du\\right)=f(x)\n$$\n\n$$\n\\begin{pmatrix}\n1 & 0 & 0 \\\\\n0 & 1 & 0 \\\\\n0 & 0 & 1\n\\end{pmatrix}\n$$\n\n# Markdown与数学公式示例\n\n## 代码示例\n```js\nconsole.log("Hello, world!");\n```\n\n## 数学公式示例\n\n行内公式: $E=mc^2$\n\n块级公式:\n\n$$\n\\frac{d}{dx}\\left( \\int_{0}^{x} f(u)\\,du\\right)=f(x)\n$$\n\n$$\n\\begin{pmatrix}\n1 & 0 & 0 \\\\\n0 & 1 & 0 \\\\\n0 & 0 & 1\n\\end{pmatrix}\n$$');
    const [markedText, setMarkdownText] = useState('');
    const [isPreview, setIsPreview] = useState(false);
    const editorRef = ref<HTMLTextAreaElement | null>(null);

    const save = () => {
      console.log('save');
    };

    const handleKeydown = (event: KeyboardEvent) => {
      // 全局快捷键
      if ((event.ctrlKey || event.metaKey) && event.key === 'p') {
        event.preventDefault();
        isPreview.value = !isPreview.value;
      }

      // 输入框快捷键
      if (document.activeElement !== editorRef.value) {
        return;
      }
      if ((event.ctrlKey || event.metaKey) && event.key === 's') {
        event.preventDefault();
        save();
      } else if (event.key === 'Tab') {
        event.preventDefault();
        const target = event.target as HTMLTextAreaElement;
        const start = target.selectionStart;
        const end = target.selectionEnd;

        // 插入2个空格（你可以根据需要调整数量）
        const spaces = '  ';

        // 创建新的文本内容
        content.value = content.value.substring(0, start) +
          spaces +
          content.value.substring(end);

        // 设置新的光标位置
        setTimeout(() => {
          target.selectionStart = target.selectionEnd = start + spaces.length;
        }, 0);
      }
    };

    onMounted(() => {
      document.addEventListener('keydown', handleKeydown);
    });

    onUnmounted(() => {
      document.removeEventListener('keydown', handleKeydown);
    });

    watchEffect(
      async () => setMarkdownText(await markdown(content.value))
    );

    return () => (
      <div class="d-flex flex-column" style={{ height: '100%' }}>
        <div
          class="d-flex flex-row align-center"
          style={{ height: '48px', marginTop: '16px', marginLeft: '16px', marginRight: '16px' }}
        >
          <VBtn
            icon={mdiContentSaveEdit}
            rounded="xl"
            variant="text"
            {...{ onClick: () => save() }}
          />

          <VBtn
            icon={mdiEye}
            rounded="xl"
            variant="text"
            {...{ onClick: () => setIsPreview(!isPreview.value) }}
          />
        </div>
        <VContainer class="d-flex flex-row" style={{ height: 'calc(100% - 64px)' }}>
          {!isPreview.value ?
            <textarea
              class="markdown-editor pa-4 overflow-y-scroll"
              name="markdown-editor"
              ref={editorRef}
              style={{
                height: '100%',
                width: '100%'
              }}
              v-model={content.value}
            /> :
            <div
              class="markdown-body pa-4 overflow-y-scroll border"
              innerHTML={markedText.value}
              style={{
                height: '100%',
                width: '100%'
              }}
            />
          }
        </VContainer>
      </div>
    );
  }
});
