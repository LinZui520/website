import { defineComponent, onMounted } from 'vue';
import { deleteBlog, listBlogs } from './api';
import type { BlogDTO } from './type';
import { VBtn, VCard, VCardActions, VCardText, VChip, VCol, VContainer, VDataTable, VDialog, VRow, VSpacer } from 'vuetify/components';
import { useRequest } from '@/composables/useRequest';
import { useState } from '@/composables/useState';
import { useRouter } from 'vue-router';
import { mdiDelete, mdiPlus, mdiBookEdit } from '@mdi/js';
import { headers } from './constant';
import type { Tag } from '../tag/type';

export default defineComponent({
  name: 'BlogView',
  setup() {
    const [loading, setLoading] = useState(false);
    const [blogList, setBlogList] = useState<BlogDTO[]>([]);
    const [showDeleteDialog, setShowDeleteDialog] = useState<boolean>(false);
    const [deleteBlogId, setDeleteBlogId] = useState<number>(0);
    const router = useRouter();
    const { handleRequest, SnackbarComponent } = useRequest();

    const getBlogList = () => {
      listBlogs<BlogDTO[]>().then((res) => setBlogList(res.data.data));
    };

    const handleOpenDeleteDialog = (id: number) => {
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
            'item.tags': ({ item }: { item: BlogDTO }) => (
              <div class="d-flex ga-4">
                {item.tags.map((tag: Tag) => (
                  <VChip key={tag.id}>{tag.name}</VChip>
                ))}
              </div>
            ),
            'item.publish': ({ item }: { item: BlogDTO }) => (
              <VChip color={item.publish ? 'success' : 'warning'}>
                {item.publish ? '已发布' : '草稿'}
              </VChip>
            ),
            'item.created_at': ({ item }: { item: BlogDTO }) => (new Date(item.created_at).toLocaleString()),
            'item.updated_at': ({ item }: { item: BlogDTO }) => (new Date(item.updated_at).toLocaleString()),
            'item.actions': ({ item }: { item: BlogDTO }) => (
              <>
                <VBtn
                  prependIcon={mdiBookEdit}
                  variant="text"
                  {...{ onClick: () => router.push({ name: 'blogDetail', query: { type: 'update', id: item.id } }) }}
                >
                  编辑
                </VBtn>
                <VBtn
                  prependIcon={mdiDelete}
                  variant="text"
                  {...{ onClick: () => handleOpenDeleteDialog(item.id) }}
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
