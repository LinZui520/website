import { defineComponent, onMounted } from 'vue';
import { deleteBlog, readBlogs } from './api';
import type { BlogVO } from './type';
import { VBtn, VCard, VCardActions, VCardText, VChip, VCol, VContainer, VDataTable, VDialog, VRow, VSpacer } from 'vuetify/components';
import { useRequest } from '@/composables/useRequest';
import { useState } from '@/composables/useState';
import { useRouter } from 'vue-router';
import { mdiDelete, mdiPlus, mdiBookEdit } from '@mdi/js';
import { headers } from './constant';
import type { TagVO } from '../tag/type';

export default defineComponent({
  name: 'BlogView',
  setup() {
    const [loading, setLoading] = useState(false);
    const [blogList, setBlogList] = useState<BlogVO[]>([]);
    const [showDeleteDialog, setShowDeleteDialog] = useState<boolean>(false);
    const [deleteBlogId, setDeleteBlogId] = useState<string>('');
    const router = useRouter();
    const { handleRequest, SnackbarComponent } = useRequest();

    const getBlogList = () => {
      readBlogs<BlogVO[]>().then((res) => setBlogList(res.data.data));
    };

    const handleOpenDeleteDialog = (id: string) => {
      setShowDeleteDialog(true);
      setDeleteBlogId(id);
    };

    const handleDeleteBlog = () => {
      setLoading(true);
      handleRequest(
        () => deleteBlog(deleteBlogId.value),
        () => getBlogList(),
        undefined,
        () => {
          setLoading(false);
          setShowDeleteDialog(false);
        }
      );
    };

    onMounted(() => {
      getBlogList();
    });

    return () => (
      <VContainer fluid>
        <VDataTable
          headers={headers}
          items={blogList.value}
        >
          {{
            top: () => (
              <VRow class="pa-4">
                <VCol cols="12" md="4">
                  <VCard title="博客管理" variant="text" />
                </VCol>
                <VCol cols="12" md="6">
                </VCol>
                <VCol cols="12" md="2">
                  <VBtn prependIcon={mdiPlus} {...{ onClick: () => router.push({ name: 'blogDetail', query: { type: 'create' } }) }}>写博客</VBtn>
                </VCol>
              </VRow>
            ),
            'item.tags': ({ item }: { item: BlogVO }) => (
              <div class="d-flex ga-4">
                {item.tags.map((tag: TagVO) => (
                  <VChip key={tag.tag_id}>{tag.tag_name}</VChip>
                ))}
              </div>
            ),
            'item.publish': ({ item }: { item: BlogVO }) => (
              <VChip color={item.publish ? 'success' : 'warning'}>
                {item.publish ? '已发布' : '草稿'}
              </VChip>
            ),
            'item.created_at': ({ item }: { item: BlogVO }) => (new Date(item.created_at).toLocaleString()),
            'item.updated_at': ({ item }: { item: BlogVO }) => (new Date(item.updated_at).toLocaleString()),
            'item.actions': ({ item }: { item: BlogVO }) => (
              <>
                <VBtn
                  prependIcon={mdiBookEdit}
                  variant="text"
                  {...{ onClick: () => router.push({ name: 'blogDetail', query: { type: 'update', id: item.blog_id } }) }}
                >
                  编辑
                </VBtn>
                <VBtn
                  prependIcon={mdiDelete}
                  variant="text"
                  {...{ onClick: () => handleOpenDeleteDialog(item.blog_id) }}
                >
                  删除
                </VBtn>
              </>
            )
          }}
        </VDataTable>
        <VDialog maxWidth="500px" modelValue={showDeleteDialog.value} onUpdate:modelValue={(value) => setShowDeleteDialog(value)}>
          <VCard class="pa-4" title="确认">
            <VCardText>
              是否删除该博客？
            </VCardText>
            <VCardActions>
              <VSpacer />
              <VBtn rounded="xl" variant="outlined" {...{ onClick: () => setShowDeleteDialog(false) }}>取消</VBtn>
              <VBtn loading={loading.value} rounded="xl" variant="outlined" {...{ onClick: () => { handleDeleteBlog(); } }}>确定</VBtn>
            </VCardActions>
          </VCard>
        </VDialog>
        <SnackbarComponent />
      </VContainer>
    );
  }
});
