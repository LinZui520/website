import { defineComponent } from 'vue';
import { VBtn } from 'vuetify/components';

export default defineComponent({
  name: 'CategoryDetail',
  setup() {
    return () => (
      <>
        <VBtn>添加标签</VBtn>
      </>
    );
  }
});
