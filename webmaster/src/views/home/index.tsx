import { defineComponent } from 'vue';
import { VContainer } from 'vuetify/components';

export default defineComponent({
  name: 'HomeView',
  setup() {
    return () => (
      <VContainer
        class="d-flex flex-column align-center justify-center pa-0 h-100"
        fluid
      >
        <span>朱贵是混蛋---控制台</span>
      </VContainer>
    );
  }
});
