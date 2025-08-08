import { useRequest } from '@/composables/useRequest';
import { useState } from '@/composables/useState';
import { defineComponent, onMounted } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { VBtn, VCol, VContainer, VForm, VRow, VTextarea, VTextField } from 'vuetify/components';
import { createBoard, getBoard, updateBoard } from './api';
import type { BoardVO } from './type';
import ErrorView from '../error';

type PageType = 'create' | 'update';

export default defineComponent({
  name: 'BoardDetail',
  setup() {
    const [loading, setLoading] = useState(false);
    const [name, setName] = useState('');
    const [description, setDescription] = useState('');
    const route = useRoute();
    const router = useRouter();
    const { handleRequest, SnackbarComponent } = useRequest();
    const { type, id } = route.query as { type: PageType; id: string };

    const back = () => router.back();

    const submit = (event: Event) => {
      event.preventDefault();
      setLoading(true);
      switch (type) {
        case 'create':
          handleRequest(
            () => createBoard(name.value, description.value || undefined),
            () => setTimeout(() => back(), 1000),
            undefined,
            () => setLoading(false)
          );
          break;
        case 'update':
          handleRequest<BoardVO>(
            () => updateBoard(id, name.value, description.value || undefined),
            () => setTimeout(() => back(), 1000),
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
          getBoard<BoardVO>(id).then((res) => {
            const board = res.data.data;
            setName(board.name);
            setDescription(board.description || '');
          });
          break;
      }
    });

    return () => type === 'create' || type === 'update' ? (
      <VContainer class="d-flex justify-center items-center">
        <VRow justify="center">
          <VCol cols="8">
            <VForm onSubmit={submit}>
              <VTextField
                label="留言版名称"
                modelValue={name.value}
                variant="solo-filled"
                {...{ 'onUpdate:modelValue': (value) => setName(value) }}
              />
              <VTextarea
                class="mt-4"
                label="描述"
                modelValue={description.value}
                rows="3"
                variant="solo-filled"
                {...{ 'onUpdate:modelValue': (value) => setDescription(value) }}
              />
              <VRow class="mt-4" justify="center">
                <VBtn
                  loading={loading.value}
                  rounded="xl"
                  size="large"
                  {...{ onClick: submit, type: 'submit' }}
                >
                  {type === 'create' ? '创建' : '更新'}
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
