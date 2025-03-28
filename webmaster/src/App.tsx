import { RouterView } from 'vue-router';
import { computed, defineComponent, onMounted, onUnmounted } from 'vue';
import ErrorView from './views/error/index.tsx';
import { VApp, VAppBar, VBtn, VList, VListItem, VMain, VNavigationDrawer } from 'vuetify/components';
import request from './utils/axios';
import { useAuthStore, type AuthState } from './stores/auth';
import { mdiHome, mdiTag, mdiBookOpenPageVariantOutline } from '@mdi/js';
import { useTheme } from 'vuetify';
import useMarkdownTheme from './composables/useMarkdownTheme.ts';

export default defineComponent({
  name: 'App',
  setup() {
    const theme = useTheme();
    const authStore = useAuthStore();
    const { toggleMarkdownTheme } = useMarkdownTheme();
    const permission = computed(() => authStore.permission);
    const menu = [
      { title: '主页', icon: mdiHome, to: '/' },
      { title: '标签管理', icon: mdiTag, to: '/category' },
      { title: '博客管理', icon: mdiBookOpenPageVariantOutline, to: '/blog' }
    ];

    const media = window.matchMedia('(prefers-color-scheme: dark)');
    const toggleTheme = (event: MediaQueryListEvent | MediaQueryList) => {
      theme.global.name.value = event.matches ? 'dark' : 'light';
      toggleMarkdownTheme(event.matches);
    };

    onMounted(() => {
      request<AuthState>({ url: '/user/jwt-login', method: 'get' })
        .then((res) => authStore.setAuth(res.data.data.user, res.data.data.token));
    });

    onMounted(() => {
      toggleTheme(media);
      media.addEventListener('change', toggleTheme);
    });
    onUnmounted(() => {
      media.removeEventListener('change', toggleTheme);
    });

    return () => permission.value ? (
      <VApp>
        <VAppBar elevation="1">
          {{
            prepend: () => (
              <VListItem
                lines="two"
                prepend-avatar="https://www.zhuguishihundan.com/image/root.png"
                title={authStore.user?.username}
              />
            )
          }}
        </VAppBar>
        <VNavigationDrawer>
          {{
            default: () => (
              <VList>
                {menu.map((item) => (
                  <VListItem key={item.title} link prependIcon={item.icon} title={item.title} to={item.to} />
                ))}
              </VList>
            ),
            append: () => (
              <div class="pa-2">
                <VBtn block>退出</VBtn>
              </div>
            )
          }}
        </VNavigationDrawer>
        <VMain style={{ height: 'calc(100vh - 64px)', overflowY: 'scroll' }}>
          <RouterView />
        </VMain>
      </VApp>
    ) : (
      <VApp>
        <VMain style={{ height: 'calc(100vh - 64px)', overflowY: 'scroll' }}>
          <ErrorView />
        </VMain>
      </VApp>
    );
  }
});
