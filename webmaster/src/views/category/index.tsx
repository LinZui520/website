import { defineComponent, onMounted } from 'vue';
import { deleteCategory, getCategoryList } from './api';
import type { Category } from './type';
import { VBtn, VCard, VCardActions, VCardText, VChip, VCol, VDataTable, VDialog, VRow, VSpacer } from 'vuetify/components';
import { useRequest } from '@/composables/useRequest';
import { useState } from '@/composables/useState';
import { headers } from './constant';

export default defineComponent({
  name: 'CategoryView',
  setup() {
    const [categoryList, setCategoryList] = useState<Category[]>([]);
    const [showDeleteDialog, setShowDeleteDialog] = useState<boolean>(false);
    const [deleteCategoryId, setDeleteCategoryId] = useState<number>(0);
    const { handleRequest, SnackbarComponent } = useRequest();

    const handleOpenDeleteDialog = (id: number) => {
      setShowDeleteDialog(true);
      setDeleteCategoryId(id);
    };

    const handleDeleteCategory = () => handleRequest(
      () => deleteCategory(deleteCategoryId.value),
      () => setCategoryList(categoryList.value.filter((item) => item.id !== deleteCategoryId.value))
    ).then(() => setShowDeleteDialog(false));

    onMounted(() => {
      handleRequest<Category[]>(
        () => getCategoryList(),
        (res) => setCategoryList(res.data.data)
      );
    });

    return () => (
      <>
        <VDataTable
          headers={headers}
          items={categoryList.value}
        >
          {{
            top: () => (
              <VRow class="pa-4">
                <VCol cols="12" md="4">
                  <VCard title="标签管理" variant="text" />
                </VCol>
                <VCol cols="12" md="6">
                </VCol>
                <VCol cols="12" md="2">
                  <VBtn>添加标签</VBtn>
                </VCol>
              </VRow>
            ),
            'item.name': ({ item }: { item: Category }) => (<VChip>{item.name}</VChip>),
            'item.created_at': ({ item }: { item: Category }) => (new Date(item.created_at).toLocaleString()),
            'item.actions': ({ item }: { item: Category }) => (
              <VBtn
                variant="text"
                {...{ onClick: () => { handleOpenDeleteDialog(item.id); } }}
              >
                删除
              </VBtn>
            )
          }}
        </VDataTable>
        <VDialog maxWidth="500px" modelValue={showDeleteDialog.value}>
          <VCard class="pa-4" title="确认">
            <VCardText>
              是否删除该标签？
            </VCardText>
            <VCardActions>
              <VSpacer />
              <VBtn variant="outlined" {...{ onClick: () => setShowDeleteDialog(false) }}>取消</VBtn>
              <VBtn variant="outlined" {...{ onClick: () => { handleDeleteCategory(); } }}>确定</VBtn>
            </VCardActions>
          </VCard>
        </VDialog>
        <SnackbarComponent />
      </>
    );
  }
});
