import { useRequest } from '@/composables/useRequest';
import { useState } from '@/composables/useState';
import { defineComponent, onMounted } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { VBtn, VCol, VContainer, VForm, VRow, VTextField } from 'vuetify/components';
import { createCategory } from './api';

type PageType = 'create' | 'update';

export default defineComponent({
  name: 'CategoryDetail',
  setup() {
    const [name, setName] = useState('');
    const [description, setDescription] = useState('');
    const route = useRoute();
    const router = useRouter();
    const { handleRequest, SnackbarComponent } = useRequest();
    const { type, id } = route.query as { type: PageType; id: string };

    const submit = (event: Event) => {
      event.preventDefault();
      handleRequest(
        () => createCategory(name.value, description.value),
        () => {
          setName('');
          setDescription('');
          setTimeout(() => router.push({ name: 'category' }), 2000);
        }
      );
    };

    onMounted(() => {
      if (type === 'create') {
        console.log('create');
      } else if (type === 'update') {
        console.log('update', id);
      }
    });

    return () => (
      <VContainer class="d-flex justify-center items-center">
        <VRow justify="center">
          <VCol cols="6">
            <VForm onSubmit={submit}>
              <VTextField label="标签名称" modelValue={name} variant="solo-filled" />
              <VTextField label="标签描述" modelValue={description} variant="solo-filled" />
              <VRow justify="center">
                <VBtn rounded="xl" size="large" {...{ onClick: submit, type: 'submit' }}>
                  提交
                </VBtn>
              </VRow>
            </VForm>
          </VCol>
        </VRow>
        <SnackbarComponent />
      </VContainer>
    );
  }
});
