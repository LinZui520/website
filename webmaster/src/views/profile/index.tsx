import { defineComponent, ref } from 'vue';
import { VAvatar, VBtn, VCard, VCardActions, VCardText, VCardTitle, VCol, VContainer, VFileInput, VRow, VTextField } from 'vuetify/components';
import { useAuthStore } from '@/stores/auth';
import { useState } from '@/composables/useState';
import { useRequest } from '@/composables/useRequest';
import { mdiCamera, mdiContentSave, mdiLogout } from '@mdi/js';
import { uploadAvatar } from './api';

export default defineComponent({
  name: 'ProfileView',
  setup() {
    const authStore = useAuthStore();
    const [uploadLoading, setUploadLoading] = useState(false);
    const [username, setUsername] = useState(authStore.user?.username || '');
    const [email, setEmail] = useState(authStore.user?.email || '');
    const avatar = ref(authStore.user?.avatar || '');
    const fileInputRef = ref<HTMLInputElement | null>(null);

    const { handleRequest, SnackbarComponent } = useRequest();

    const handleUploadAvatar = (file: File) => {
      setUploadLoading(true);

      const formData = new FormData();
      formData.append('avatar', file);

      handleRequest(
        () => uploadAvatar(formData),
        undefined,
        undefined,
        () => setUploadLoading(false)
      );
    };

    const handleSave = () => {
    };

    return () => (
      <VContainer fluid style={{ height: 'calc(100vh - 64px)', display: 'flex', alignItems: 'center' }}>
        <VRow justify="center" style={{ width: '100%' }}>
          <VCol cols="12" lg="6" md="8">
            <VCard class="pa-6">
              <VCardTitle class="text-h5 text-center mb-6">个人资料</VCardTitle>

              <VCardText>
                <VRow class="mb-6" justify="center">
                  <VCol cols="auto">
                    <div class="d-flex flex-column align-center">
                      <VAvatar class="mb-4" size="120">
                        <img
                          alt="头像"
                          src={avatar.value}
                          style={{
                            width: '100%',
                            height: '100%',
                            objectFit: 'cover',
                            objectPosition: 'center'
                          }}
                        />
                      </VAvatar>
                      <VBtn
                        loading={uploadLoading.value}
                        prependIcon={mdiCamera}
                        variant="outlined"
                        {...{ onClick: () => fileInputRef.value?.click() }}
                      >
                        更换头像
                      </VBtn>
                      <VFileInput
                        onUpdate:modelValue={(value: File | File[]) => handleUploadAvatar(Array.isArray(value) ? value[0] || null : value)}
                        ref={fileInputRef}
                        style={{ display: 'none' }}
                        {...{ accept: 'image/*' }}
                      />
                    </div>
                  </VCol>
                </VRow>

                <VRow>
                  <VCol cols="12">
                    <VTextField
                      disabled
                      label="用户名"
                      modelValue={username.value}
                      onUpdate:modelValue={(value) => setUsername(value)}
                      variant="outlined"
                    />
                  </VCol>
                  <VCol cols="12">
                    <VTextField
                      disabled
                      label="邮箱"
                      modelValue={email.value}
                      onUpdate:modelValue={(value) => setEmail(value)}
                      type="email"
                      variant="outlined"
                    />
                  </VCol>
                </VRow>
              </VCardText>

              <VCardActions class="px-6 pb-6">
                <VRow class="w-100">
                  <VCol class="d-flex justify-space-between" cols="12">
                    <VBtn
                      prependIcon={mdiLogout}
                      variant="text"
                      {...{ onClick: () => authStore.logout() }}
                    >
                      退出登录
                    </VBtn>
                    <VBtn
                      disabled
                      prependIcon={mdiContentSave}
                      variant="text"
                      {...{ onClick: () => handleSave() }}
                    >
                      保存修改
                    </VBtn>
                  </VCol>
                </VRow>
              </VCardActions>
            </VCard>
          </VCol>
        </VRow>
        <SnackbarComponent />
      </VContainer>
    );
  }
});
