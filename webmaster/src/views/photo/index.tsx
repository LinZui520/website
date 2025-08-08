import { defineComponent, onMounted } from 'vue';
import { deletePhoto, listPhotos, updatePhoto } from './api';
import type { PhotoVO } from './type';
import {
  VBtn, VCard, VCardActions, VCardText, VCol, VContainer, VDataTable,
  VDialog, VImg, VRow, VSpacer, VTextarea
} from 'vuetify/components';
import { useRequest } from '@/composables/useRequest';
import { useState } from '@/composables/useState';
import { headers } from './constant';
import { mdiDelete, mdiPencil } from '@mdi/js';

export default defineComponent({
  name: 'PhotoView',
  setup() {
    const [loading, setLoading] = useState(false);
    const [photoList, setPhotoList] = useState<PhotoVO[]>([]);
    const [showDeleteDialog, setShowDeleteDialog] = useState<boolean>(false);
    const [deletePhotoId, setDeletePhotoId] = useState<string>('');
    const [showUpdateDialog, setShowUpdateDialog] = useState<boolean>(false);
    const [updatePhotoId, setUpdatePhotoId] = useState<string>('');
    const [updateDescription, setUpdateDescription] = useState<string>('');
    const { handleRequest, SnackbarComponent } = useRequest();

    const getPhotoList = () => {
      listPhotos<PhotoVO[]>().then((res) => setPhotoList(res.data.data));
    };

    const handleOpenDeleteDialog = (id: string) => {
      setShowDeleteDialog(true);
      setDeletePhotoId(id);
    };

    const handleDeletePhoto = () => {
      setLoading(true);
      handleRequest(
        () => deletePhoto(deletePhotoId.value),
        () => getPhotoList(),
        undefined,
        () => {
          setLoading(false);
          setShowDeleteDialog(false);
        }
      );
    };

    const handleOpenUpdateDialog = (photo: PhotoVO) => {
      setShowUpdateDialog(true);
      setUpdatePhotoId(photo.photo_id);
      setUpdateDescription(photo.description || '');
    };

    const handleUpdatePhoto = () => {
      setLoading(true);
      handleRequest(
        () => updatePhoto(updatePhotoId.value, updateDescription.value),
        () => getPhotoList(),
        undefined,
        () => {
          setLoading(false);
          setShowUpdateDialog(false);
        }
      );
    };

    onMounted(() => {
      getPhotoList();
    });

    return () => (
      <VContainer fluid>
        <VDataTable
          headers={headers}
          items={photoList.value}
        >
          {{
            top: () => (
              <VRow class="pa-4">
                <VCol cols="12" md="4">
                  <VCard title="照片管理" variant="text" />
                </VCol>
                <VCol cols="12" md="6">
                </VCol>
                <VCol cols="12" md="2">
                </VCol>
              </VRow>
            ),
            'item.photo_url': ({ item }: { item: PhotoVO }) => (
              <VImg
                height="240"
                src={item.photo_url}
                style={{ objectFit: 'cover' }}
                width="240"
              />
            ),
            'item.description': ({ item }: { item: PhotoVO }) => item.description || '无描述',
            'item.location': ({ item }: { item: PhotoVO }) => item.location,
            'item.created_by': ({ item }: { item: PhotoVO }) => item.created_by?.username || '未知',
            'item.created_at': ({ item }: { item: PhotoVO }) => (new Date(item.created_at).toLocaleString()),
            'item.actions': ({ item }: { item: PhotoVO }) => (
              <>
                <VBtn
                  prependIcon={mdiPencil}
                  variant="text"
                  {...{ onClick: () => handleOpenUpdateDialog(item) }}
                >
                  更新
                </VBtn>
                <VBtn
                  prependIcon={mdiDelete}
                  variant="text"
                  {...{ onClick: () => handleOpenDeleteDialog(item.photo_id) }}
                >
                  删除
                </VBtn>
              </>
            )
          }}
        </VDataTable>

        {/* 删除确认对话框 */}
        <VDialog maxWidth="500px" modelValue={showDeleteDialog.value} onUpdate:modelValue={(value) => setShowDeleteDialog(value)}>
          <VCard class="pa-4" title="确认">
            <VCardText>
              是否删除该照片？
            </VCardText>
            <VCardActions>
              <VSpacer />
              <VBtn rounded="xl" variant="outlined" {...{ onClick: () => setShowDeleteDialog(false) }}>取消</VBtn>
              <VBtn loading={loading.value} rounded="xl" variant="outlined" {...{ onClick: () => { handleDeletePhoto(); } }}>确定</VBtn>
            </VCardActions>
          </VCard>
        </VDialog>

        {/* 更新描述对话框 */}
        <VDialog maxWidth="500px" modelValue={showUpdateDialog.value} onUpdate:modelValue={(value) => setShowUpdateDialog(value)}>
          <VCard class="pa-4" title="更新照片描述">
            <VCardText>
              <VTextarea
                label="描述"
                modelValue={updateDescription.value}
                onUpdate:modelValue={(value: string) => setUpdateDescription(value)}
                rows={3}
                variant="outlined"
              />
            </VCardText>
            <VCardActions>
              <VSpacer />
              <VBtn rounded="xl" variant="outlined" {...{ onClick: () => setShowUpdateDialog(false) }}>取消</VBtn>
              <VBtn loading={loading.value} rounded="xl" variant="outlined" {...{ onClick: () => { handleUpdatePhoto(); } }}>确认</VBtn>
            </VCardActions>
          </VCard>
        </VDialog>
        <SnackbarComponent />
      </VContainer>
    );
  }
});
