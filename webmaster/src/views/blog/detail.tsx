import { useState } from '@/composables/useState';
import { markdown } from '@/utils/markdown';
import { mdiContentSaveEdit, mdiEye } from '@mdi/js';
import { defineComponent, onMounted, onUnmounted, ref, watch, watchEffect } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { VBtn, VCheckbox, VCombobox, VContainer, VTextField } from 'vuetify/components';
import ErrorView from '../error';
import type { TagVO } from '../tag/type';
import { listTags } from '../tag/api';
import { useRequest } from '@/composables/useRequest';
import type { BlogVO } from './type';
import { createBlog, readBlog, updateBlog } from './api';

type PageType = 'create' | 'update';

export default defineComponent({
  name: 'BlogDetail',
  setup() {
    // 表单数据
    const [title, setTitle] = useState('');
    const [content, setContent] = useState('');
    const [tags, setTags] = useState<TagVO[]>([]);
    const [publish, setPublish] = useState(false);
    const [tagList, setTagList] = useState<TagVO[]>([]);

    // 预览数据
    const [loading, setLoading] = useState(false);
    const [markedText, setMarkdownText] = useState('');
    const [isPreview, setIsPreview] = useState(false);
    const editorRef = ref<HTMLTextAreaElement | null>(null);

    // 路由参数
    const router = useRouter();
    const route = useRoute();
    const type = ref<PageType>();
    const id = ref<string>('');

    const { handleRequest, SnackbarComponent } = useRequest();

    const submit = () => {
      setLoading(true);
      switch (type.value) {
        case 'create':
          handleRequest<string>(
            () => createBlog(title.value, content.value, tags.value.map((item: TagVO) => item.tag_id), publish.value),
            (res) => router.replace({ query: { type: 'update', id: res.data.data } }),
            undefined,
            () => setLoading(false)
          );
          break;
        case 'update':
          handleRequest<BlogVO>(
            () => updateBlog(id.value, title.value, content.value, tags.value.map(item => item.tag_id), publish.value),
            undefined,
            undefined,
            () => setLoading(false)
          );
          break;
      }
    };

    const getBlogInfo = async () => {
      const res = await readBlog<BlogVO>(id.value);
      setTitle(res.data.data.title);
      setContent(res.data.data.content);
      setPublish(res.data.data.publish);
      setTags(res.data.data.tags);
    };

    watchEffect(async () => setMarkdownText(await markdown(content.value)));
    watch(
      () => route.query,
      (query) => {
        type.value = query.type as PageType;
        id.value = query.id as string;
      },
      { immediate: true }
    );

    const handleKeydown = (event: KeyboardEvent) => {
      // 全局快捷键
      if ((event.ctrlKey || event.metaKey) && event.key === 'p') {
        event.preventDefault();
        isPreview.value = !isPreview.value;
      } else if ((event.ctrlKey || event.metaKey) && event.key === 's') {
        event.preventDefault();
        submit();
      }

      // 输入框快捷键
      if (document.activeElement !== editorRef.value) {
        return;
      }
      if (event.key === 'Tab') {
        event.preventDefault();
        const target = event.target as HTMLTextAreaElement;
        const start = target.selectionStart;
        const end = target.selectionEnd;

        // 插入2个空格（你可以根据需要调整数量）
        const spaces = '  ';

        // 创建新的文本内容
        setContent(content.value.substring(0, start) + spaces + content.value.substring(end));

        // 设置新的光标位置
        setTimeout(() => {
          target.selectionStart = target.selectionEnd = start + spaces.length;
        }, 0);
      }
    };
    onMounted(() => document.addEventListener('keydown', handleKeydown));
    onUnmounted(() => document.removeEventListener('keydown', handleKeydown));

    onMounted(() => {
      listTags<TagVO[]>().then((res) => setTagList(res.data.data));
    });

    onMounted(() => {
      switch (type.value) {
        case 'create':
          break;
        case 'update':
          getBlogInfo();
          break;
      }
    });

    return () => type.value === 'create' || type.value === 'update' ? (
      <form class="d-flex flex-column" onSubmit={submit} style={{ height: '100%' }}>
        <div
          class="d-flex align-center justify-space-between mt-4 ml-4 mr-4"
          style={{ height: '48px' }}
        >
          <div class="d-flex align-center" style={{ height: '48px' }}>
            <VBtn
              icon={mdiContentSaveEdit}
              loading={loading.value}
              rounded="xl"
              variant="text"
              {...{ onClick: () => submit() }}
            />

            <VBtn
              icon={mdiEye}
              rounded="xl"
              variant="text"
              {...{ onClick: () => setIsPreview(!isPreview.value) }}
            />
          </div>

          <div class="d-flex" style={{ height: '48px' }}>
            <VTextField
              class="mr-4"
              label="标题"
              modelValue={title.value}
              onUpdate:modelValue={(value) => setTitle(value)}
              rounded="xl"
              style={{ height: '48px' }}
              variant="underlined"
              width="200px"
            />
            <VCombobox
              chips
              class="mr-4"
              itemTitle="tag_name"
              itemValue="id"
              items={tagList.value}
              label="标签"
              modelValue={tags.value}
              multiple
              onUpdate:modelValue={(value) => setTags(value)}
              rounded="xl"
              style={{ height: '48px', minWidth: '200px' }}
              variant="underlined"
            />
            <VCheckbox class="mr-4" label="发布" modelValue={publish.value} onUpdate:modelValue={(value) => setPublish(Boolean(value))} />
          </div>
        </div>
        <VContainer class="d-flex flex-row" fluid style={{ height: 'calc(100% - 64px)' }}>
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
        <SnackbarComponent />
      </form>
    ) : (
      <ErrorView />
    );
  }
});
