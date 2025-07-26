import { defineComponent, onMounted } from 'vue';
import { deleteTag, listTags } from './api';
import type { TagVO } from './type';
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
    const [tagList, setTagList] = useState<TagVO[]>([]);
    const [showDeleteDialog, setShowDeleteDialog] = useState<boolean>(false);
    const [deleteTagId, setDeleteTagId] = useState<string>('');
    const router = useRouter();
    const { handleRequest, SnackbarComponent } = useRequest();

    const getTagList = () => {
      listTags<TagVO[]>().then((res) => setTagList(res.data.data));
    };

    const handleOpenDeleteDialog = (id: string) => {
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
                  <VCard title="博客标签管理" variant="text" />
                </VCol>
                <VCol cols="12" md="6">
                </VCol>
                <VCol cols="12" md="2">
                  <VBtn prependIcon={mdiPlus} {...{ onClick: () => router.push({ name: 'tagDetail', query: { type: 'create' } }) }}>添加标签</VBtn>
                </VCol>
              </VRow>
            ),
            'item.tag_name': ({ item }: { item: TagVO }) => (<VChip>{item.tag_name}</VChip>),
            'item.actions': ({ item }: { item: TagVO }) => (
              <>
                <VBtn
                  prependIcon={mdiTagEdit}
                  variant="text"
                  {...{ onClick: () => router.push({ name: 'tagDetail', query: { type: 'update', id: item.tag_id } }) }}
                >
                  修改
                </VBtn>
                <VBtn
                  prependIcon={mdiDelete}
                  variant="text"
                  {...{ onClick: () => handleOpenDeleteDialog(item.tag_id) }}
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
