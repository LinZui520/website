import { defineComponent, onMounted, ref } from 'vue';
import { deletePicture, listPictures, uploadPicture } from './api';
import type { PictureVO } from './type';
import { VBtn, VCard, VCardActions, VCardText, VCol, VContainer, VDataTable, VDialog, VFileInput, VImg, VRow, VSpacer } from 'vuetify/components';
import { useRequest } from '@/composables/useRequest';
import { useState } from '@/composables/useState';
import { headers } from './constant';
import { mdiContentCopy, mdiDelete, mdiPlus, mdiUpload } from '@mdi/js';

export default defineComponent({
  name: 'PictureView',
  setup() {
    const [loading, setLoading] = useState(false);
    const [pictureList, setPictureList] = useState<PictureVO[]>([]);
    const [showDeleteDialog, setShowDeleteDialog] = useState<boolean>(false);
    const [showUploadDialog, setShowUploadDialog] = useState<boolean>(false);
    const [deletePictureId, setDeletePictureId] = useState<string>('');
    const fileInput = ref<File | null>(null);
    const { handleRequest, SnackbarComponent, show } = useRequest();

    const getPictureList = () => {
      listPictures<PictureVO[]>().then((res) => setPictureList(res.data.data));
    };

    const handleOpenDeleteDialog = (id: string) => {
      setShowDeleteDialog(true);
      setDeletePictureId(id);
    };

    const handleCopyUrl = async (url: string) => {
      try {
        await navigator.clipboard.writeText(url);
        show('复制URL成功', 'success');
      } catch (err) {
        show('复制URL失败:' + err, 'error');
      }
    };

    const handleDeletePicture = () => {
      setLoading(true);
      handleRequest(
        () => deletePicture(deletePictureId.value),
        () => getPictureList(),
        undefined,
        () => {
          setLoading(false);
          setShowDeleteDialog(false);
        }
      );
    };

    const handleUploadPicture = () => {
      if (!fileInput.value) {
        return;
      }

      setLoading(true);
      const formData = new FormData();
      formData.append('picture', fileInput.value);

      handleRequest(
        () => uploadPicture(formData),
        () => getPictureList(),
        undefined,
        () => {
          setLoading(false);
          setShowUploadDialog(false);
          fileInput.value = null;
        }
      );
    };

    onMounted(() => {
      getPictureList();
    });

    return () => (
      <VContainer fluid>
        <VDataTable
          headers={headers}
          items={pictureList.value}
        >
          {{
            top: () => (
              <VRow class="pa-4">
                <VCol cols="12" md="4">
                  <VCard title="博客图片素材库" variant="text" />
                </VCol>
                <VCol cols="12" md="6">
                </VCol>
                <VCol cols="12" md="2">
                  <VBtn prependIcon={mdiPlus} {...{ onClick: () => setShowUploadDialog(true) }}>上传图片</VBtn>
                </VCol>
              </VRow>
            ),
            'item.picture_url': ({ item }: { item: PictureVO }) => (
              <VImg
                height="240"
                src={item.picture_url}
                style={{ objectFit: 'cover', objectPosition: 'center' }}
                width="240"
              />
            ),
            'item.created_by': ({ item }: { item: PictureVO }) => item.created_by?.username || '未知',
            'item.created_at': ({ item }: { item: PictureVO }) => (new Date(item.created_at).toLocaleString()),
            'item.actions': ({ item }: { item: PictureVO }) => (
              <div style={{ display: 'flex', gap: '8px' }}>
                <VBtn
                  prependIcon={mdiContentCopy}
                  variant="text"
                  {...{ onClick: () => handleCopyUrl(item.picture_url) }}
                >
                  复制URL
                </VBtn>
                <VBtn
                  prependIcon={mdiDelete}
                  variant="text"
                  {...{ onClick: () => handleOpenDeleteDialog(item.picture_id) }}
                >
                  删除
                </VBtn>
              </div>
            )
          }}
        </VDataTable>

        {/* 删除确认对话框 */}
        <VDialog maxWidth="500px" modelValue={showDeleteDialog.value} onUpdate:modelValue={(value) => setShowDeleteDialog(value)}>
          <VCard class="pa-4" title="确认">
            <VCardText>
              是否删除该图片？
            </VCardText>
            <VCardActions>
              <VSpacer />
              <VBtn rounded="xl" variant="outlined" {...{ onClick: () => setShowDeleteDialog(false) }}>取消</VBtn>
              <VBtn loading={loading.value} rounded="xl" variant="outlined" {...{ onClick: () => { handleDeletePicture(); } }}>确定</VBtn>
            </VCardActions>
          </VCard>
        </VDialog>

        {/* 上传图片对话框 */}
        <VDialog maxWidth="500px" modelValue={showUploadDialog.value} onUpdate:modelValue={(value) => setShowUploadDialog(value)}>
          <VCard class="pa-4" title="上传图片">
            <VCardText>
              <VFileInput
                label="选择图片文件"
                modelValue={fileInput.value}
                multiple={false}
                name="image"
                onUpdate:modelValue={(value: File | File[]) => fileInput.value = Array.isArray(value) ? value[0] || null : value}
                prependIcon={mdiUpload}
                variant="outlined"
                {...{ accept: 'image/*' }}
              />
            </VCardText>
            <VCardActions>
              <VSpacer />
              <VBtn rounded="xl" variant="outlined" {...{ onClick: () => setShowUploadDialog(false) }}>取消</VBtn>
              <VBtn
                disabled={!fileInput.value}
                loading={loading.value}
                rounded="xl"
                variant="outlined"
                {...{ onClick: () => { handleUploadPicture(); } }}
              >
                上传
              </VBtn>
            </VCardActions>
          </VCard>
        </VDialog>

        <SnackbarComponent />
      </VContainer>
    );
  }
});
