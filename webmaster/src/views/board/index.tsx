import { defineComponent, onMounted } from 'vue';
import { deleteBoard, listBoards } from './api';
import type { BoardVO } from './type';
import { VBtn, VCard, VCardActions, VCardText, VChip, VCol, VContainer, VDataTable, VDialog, VRow, VSpacer } from 'vuetify/components';
import { useRequest } from '@/composables/useRequest';
import { useState } from '@/composables/useState';
import { headers } from './constant';
import { useRouter } from 'vue-router';
import { mdiDelete, mdiPlus, mdiPencil } from '@mdi/js';

export default defineComponent({
  name: 'BoardView',
  setup() {
    const [loading, setLoading] = useState(false);
    const [boardList, setBoardList] = useState<BoardVO[]>([]);
    const [showDeleteDialog, setShowDeleteDialog] = useState<boolean>(false);
    const [deleteBoardId, setDeleteBoardId] = useState<string>('');
    const router = useRouter();
    const { handleRequest, SnackbarComponent } = useRequest();

    const getBoardList = () => {
      listBoards<BoardVO[]>().then((res) => setBoardList(res.data.data));
    };

    const handleOpenDeleteDialog = (id: string) => {
      setShowDeleteDialog(true);
      setDeleteBoardId(id);
    };

    const handleDeleteBoard = () => {
      setLoading(true);
      handleRequest(
        () => deleteBoard(deleteBoardId.value),
        () => getBoardList(),
        undefined,
        () => {
          setLoading(false);
          setShowDeleteDialog(false);
        }
      );
    };

    onMounted(() => {
      getBoardList();
    });

    return () => (
      <VContainer fluid>
        <VDataTable
          headers={headers}
          items={boardList.value}
        >
          {{
            top: () => (
              <VRow class="pa-4">
                <VCol cols="12" md="4">
                  <VCard title="留言版管理" variant="text" />
                </VCol>
                <VCol cols="12" md="6">
                </VCol>
                <VCol cols="12" md="2">
                  <VBtn prependIcon={mdiPlus} {...{ onClick: () => router.push({ name: 'boardDetail', query: { type: 'create' } }) }}>添加留言版</VBtn>
                </VCol>
              </VRow>
            ),
            'item.name': ({ item }: { item: BoardVO }) => (<VChip>{item.name}</VChip>),
            'item.description': ({ item }: { item: BoardVO }) => (
              item.description ? (
                <span>{item.description.length > 20 ? item.description.substring(0, 20) + '...' : item.description}</span>
              ) : (
                <span style="color: #999">无描述</span>
              )
            ),
            'item.created_by': ({ item }: { item: BoardVO }) => item.created_by?.username || '未知',
            'item.created_at': ({ item }: { item: BoardVO }) => (new Date(item.created_at).toLocaleString()),
            'item.actions': ({ item }: { item: BoardVO }) => (
              <>
                <VBtn
                  prependIcon={mdiPencil}
                  variant="text"
                  {...{ onClick: () => router.push({ name: 'boardDetail', query: { type: 'update', id: item.board_id } }) }}
                >
                  修改
                </VBtn>
                <VBtn
                  prependIcon={mdiDelete}
                  variant="text"
                  {...{ onClick: () => handleOpenDeleteDialog(item.board_id) }}
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
              是否删除该留言版？
            </VCardText>
            <VCardActions>
              <VSpacer />
              <VBtn rounded="xl" variant="outlined" {...{ onClick: () => setShowDeleteDialog(false) }}>取消</VBtn>
              <VBtn loading={loading.value} rounded="xl" variant="outlined" {...{ onClick: () => { handleDeleteBoard(); } }}>确定</VBtn>
            </VCardActions>
          </VCard>
        </VDialog>
        <SnackbarComponent />
      </VContainer>
    );
  }
});
