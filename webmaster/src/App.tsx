import { RouterLink, RouterView } from 'vue-router';
import { defineComponent } from 'vue';

export default defineComponent({
  name: 'App',
  setup() {
    return () => (
      <>
        <RouterLink to={'/'}>home</RouterLink>
        <RouterLink to={'/blogs'}>blogs</RouterLink>
        <RouterView />
      </>
    );
  }
});
