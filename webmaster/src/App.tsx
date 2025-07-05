import { RouterView } from 'vue-router';
import { computed, defineComponent, onMounted, onUnmounted, ref } from 'vue';
import ErrorView from './views/error/index.tsx';
import { VApp, VAppBar, VBtn, VList, VListItem, VMain, VNavigationDrawer, VAppBarNavIcon } from 'vuetify/components';
import request from './utils/axios';
import { useAuthStore, type AuthState } from './stores/auth';
import { mdiHome, mdiTag, mdiBookOpenPageVariantOutline } from '@mdi/js';
import { useTheme } from 'vuetify';
import useMarkdownTheme from './composables/useMarkdownTheme.ts';
import { getWebsiteUrl } from './utils/env.ts';

export default defineComponent({
  name: 'App',
  setup() {
    const theme = useTheme();
    const authStore = useAuthStore();
    const { toggleMarkdownTheme } = useMarkdownTheme();
    const permission = computed(() => authStore.permission);
    // 控制导航抽屉的显示状态
    const drawer = ref(false);
    const menu = [
      { title: '主页', icon: mdiHome, to: '/home' },
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
              <VAppBarNavIcon block {...{ onClick: () => { drawer.value = !drawer.value; } }} />
            ),
            default: () => (
              <VListItem
                lines="two"
                prepend-avatar={getWebsiteUrl() + `/avatar/${authStore.user?.avatar}`}
                title={authStore.user?.username}
              />
            )
          }}
        </VAppBar>
        <VNavigationDrawer modelValue={drawer.value} temporary>
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
                <VBtn
                  block
                  {...{ onClick: () => {
                    window.location.href = getWebsiteUrl();
                  } }}
                >
                  退出
                </VBtn>
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
