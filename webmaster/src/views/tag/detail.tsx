import { useRequest } from '@/composables/useRequest';
import { useState } from '@/composables/useState';
import { defineComponent, onMounted } from 'vue';
import { useRoute } from 'vue-router';
import { VBtn, VCol, VContainer, VForm, VRow, VTextField } from 'vuetify/components';
import { createTag, getTag, updateTag } from './api';
import type { Tag } from './type';
import ErrorView from '../error';

type PageType = 'create' | 'update';

export default defineComponent({
  name: 'TagDetail',
  setup() {
    const [loading, setLoading] = useState(false);
    const [name, setName] = useState('');
    const route = useRoute();
    const { handleRequest, SnackbarComponent } = useRequest();
    const { type, id } = route.query as { type: PageType; id: string };

    const submit = (event: Event) => {
      event.preventDefault();
      setLoading(true);
      switch (type) {
        case 'create':
          handleRequest(
            () => createTag(name.value),
            () => setName(''),
            undefined,
            () => setLoading(false)
          );
          break;
        case 'update':
          handleRequest<Tag>(
            () => updateTag(Number(id), name.value),
            () => setName(''),
            undefined,
            () => setLoading(false)
          );
          break;
      }
    };

    onMounted(() => {
      switch (type) {
        case 'create':
          return;
        case 'update':
          handleRequest<Tag>(
            () => getTag(Number(id)),
            (res) => setName(res.data.data.name)
          );
          break;
      }
    });

    return () => type === 'create' || type === 'update' ? (
      <VContainer class="d-flex justify-center items-center">
        <VRow justify="center">
          <VCol cols="6">
            <VForm onSubmit={submit}>
              <VTextField label="标签名称" modelValue={name.value} onUpdate:modelValue={(value) => setName(value)} variant="solo-filled" />
              <VRow justify="center">
                <VBtn loading={loading.value} rounded="xl" size="large" {...{ onClick: submit, type: 'submit' }}>
                  提交
                </VBtn>
              </VRow>
            </VForm>
          </VCol>
        </VRow>
        <SnackbarComponent />
      </VContainer>
    ) : (
      <ErrorView />
    );
  }
});
