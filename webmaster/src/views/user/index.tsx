import { defineComponent, onMounted } from 'vue';
import { listUsers, increaseUserPermission, decreaseUserPermission } from './api';
import type { UserVO } from './type';
import { VAvatar, VBtn, VCard, VCardActions, VCardText, VChip, VCol, VContainer, VDataTable, VDialog, VRow, VSpacer } from 'vuetify/components';
import { useRequest } from '@/composables/useRequest';
import { useState } from '@/composables/useState';
import { headers } from './constant';
import { permissionMap } from '@/constants/menu';
import { mdiThumbDown, mdiThumbUp } from '@mdi/js';

export default defineComponent({
  name: 'UserView',
  setup() {
    const [userList, setUserList] = useState<UserVO[]>([]);
    const [loading, setLoading] = useState(false);
    const [showDialog, setShowDialog] = useState(false);
    const [currentUserId, setCurrentUserId] = useState<number>(0);
    const [action, setAction] = useState<typeof increaseUserPermission>(() => Promise.reject());
    const { handleRequest, SnackbarComponent } = useRequest();

    const getUserList = () => {
      listUsers<UserVO[]>().then((res) => setUserList(res.data.data));
    };

    const updatePermission = () => {
      setLoading(true);
      handleRequest<void>(
        () => action.value(currentUserId.value),
        () => {
          setShowDialog(false);
          setLoading(false);
          getUserList();
        },
        () => setLoading(false)
      );
    };

    onMounted(() => {
      getUserList();
    });

    return () => (
      <VContainer fluid>
        <VDataTable
          headers={headers}
          items={userList.value}
        >
          {{
            top: () => (
              <VRow class="pa-4">
                <VCol cols="12" md="4">
                  <VCard title="用户管理" variant="text" />
                </VCol>
                <VCol cols="12" md="6">
                </VCol>
                <VCol cols="12" md="2">
                </VCol>
              </VRow>
            ),
            'item.avatar': ({ item }: { item: UserVO }) => (
              <VAvatar size="40">
                <img
                  alt={item.username}
                  height="40"
                  src={item.avatar_url}
                  style={{
                    objectFit: 'cover',
                    objectPosition: 'center'
                  }}
                  width="40"
                />
              </VAvatar>
            ),
            'item.permission': ({ item }: { item: UserVO }) => (
              <VChip size="small">
                {permissionMap[item.permission.toString()] || '未知'}
              </VChip>
            ),
            'item.actions': ({ item }: { item: UserVO }) => (
              <>
                <VBtn
                  prependIcon={mdiThumbDown}
                  variant="text"
                  {...{ onClick: () => {
                    setCurrentUserId(item.id);
                    setAction(decreaseUserPermission);
                    setShowDialog(true);
                  } }}
                >
                  降低权限
                </VBtn>
                <VBtn
                  prependIcon={mdiThumbUp}
                  variant="text"
                  {...{ onClick: () => {
                    setCurrentUserId(item.id);
                    setAction(increaseUserPermission);
                    setShowDialog(true);
                  } }}
                >
                  增加权限
                </VBtn>
              </>
            )
          }}
        </VDataTable>

        <VDialog maxWidth="500px" modelValue={showDialog.value} onUpdate:modelValue={(value) => setShowDialog(value)}>
          <VCard class="pa-4" title="确认">
            <VCardText>
              确定要操作该用户吗？
            </VCardText>
            <VCardActions>
              <VSpacer />
              <VBtn rounded="xl" variant="outlined" {...{ onClick: () => setShowDialog(false) }}>
                取消
              </VBtn>
              <VBtn
                loading={loading.value}
                rounded="xl"
                variant="outlined"
                {...{ onClick: () => { updatePermission(); } }}
              >
                确定
              </VBtn>
            </VCardActions>
          </VCard>
        </VDialog>

        <SnackbarComponent />
      </VContainer>
    );
  }
});
