import { defineComponent, onMounted } from 'vue';
import { deleteTag, listTags } from './api';
import type { Tag } from './type';
import { VBtn, VCard, VCardActions, VCardText, VChip, VCol, VContainer, VDataTable, VDialog, VRow, VSpacer } from 'vuetify/components';
import { useRequest } from '@/composables/useRequest';
import { useState } from '@/composables/useState';
import { headers } from './constant';
import { useRouter } from 'vue-router';
import { mdiDelete, mdiPlus, mdiTagEdit } from '@mdi/js';

export default defineComponent({
  name: 'TagView',
  setup() {
    const [loading, setLoading] = useState(false);
    const [tagList, setTagList] = useState<Tag[]>([]);
    const [showDeleteDialog, setShowDeleteDialog] = useState<boolean>(false);
    const [deleteTagId, setDeleteTagId] = useState<number>(0);
    const router = useRouter();
    const { handleRequest, SnackbarComponent } = useRequest();

    const getTagList = () => {
      listTags<Tag[]>().then((res) => setTagList(res.data.data));
    };

    const handleOpenDeleteDialog = (id: number) => {
      setShowDeleteDialog(true);
      setDeleteTagId(id);
    };

    const handleDeleteTag = () => {
      setLoading(true);
      handleRequest(
        () => deleteTag(deleteTagId.value),
        () => getTagList(),
        undefined,
        () => {
          setLoading(false);
          setShowDeleteDialog(false);
        }
      );
    };

    onMounted(() => {
      getTagList();
    });

    return () => (
      <VContainer fluid>
        <VDataTable
          headers={headers}
          items={tagList.value}
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
                  <VBtn prependIcon={mdiPlus} {...{ onClick: () => router.push({ name: 'tagDetail', query: { type: 'create' } }) }}>添加标签</VBtn>
                </VCol>
              </VRow>
            ),
            'item.name': ({ item }: { item: Tag }) => (<VChip>{item.name}</VChip>),
            'item.created_at': ({ item }: { item: Tag }) => (new Date(item.created_at).toLocaleString()),
            'item.actions': ({ item }: { item: Tag }) => (
              <>
                <VBtn
                  prependIcon={mdiTagEdit}
                  variant="text"
                  {...{ onClick: () => router.push({ name: 'tagDetail', query: { type: 'update', id: item.id } }) }}
                >
                  修改
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
              是否删除该标签？
            </VCardText>
            <VCardActions>
              <VSpacer />
              <VBtn rounded="xl" variant="outlined" {...{ onClick: () => setShowDeleteDialog(false) }}>取消</VBtn>
              <VBtn loading={loading.value} rounded="xl" variant="outlined" {...{ onClick: () => { handleDeleteTag(); } }}>确定</VBtn>
            </VCardActions>
          </VCard>
        </VDialog>
        <SnackbarComponent />
      </VContainer>
    );
  }
});
