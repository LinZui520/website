
import { createApp } from 'vue';
import { createPinia } from 'pinia';

import App from './App.tsx';
import router from './router';

import 'vuetify/styles';
import { createVuetify } from 'vuetify';
import { aliases, mdi } from 'vuetify/iconsets/mdi-svg';

const vuetify = createVuetify({
  theme: {
    defaultTheme: 'light'
  },
  icons: {
    defaultSet: 'mdi',
    aliases,
    sets: {
      mdi
    }
  }
});
createApp(App)
  .use(createPinia())
  .use(router)
  .use(vuetify)
  .mount('#app');
