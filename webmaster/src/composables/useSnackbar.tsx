import { ref } from 'vue';
import { VSnackbar } from 'vuetify/components';

export type SnackbarOptions = {
  timeout: number;
  location: 'top' | 'bottom' | 'left' | 'right' | 'center';
};

export const useSnackbar = (options: SnackbarOptions) => {
  const visible = ref(false);
  const text = ref('');
  const color = ref('');

  const show = (message: string, type: 'success' | 'error' | 'warning' | 'info' = 'info') => {
    text.value = message;
    color.value = type;
    visible.value = true;
  };

  const close = () => {
    visible.value = false;
  };

  const SnackbarComponent = () => (
    <VSnackbar
      modelValue={visible.value}
      {...{
        'onUpdate:modelValue': (val: boolean) => {
          visible.value = val;
        }
      }}
      color={color.value}
      location={options.location}
      timeout={options.timeout}
    >
      {text.value}
    </VSnackbar>
  );

  return {
    show,
    close,
    SnackbarComponent
  };
};
