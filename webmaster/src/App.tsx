import { RouterView } from 'vue-router';
import { computed, defineComponent, onMounted, onUnmounted, ref } from 'vue';
import ErrorView from './views/error/index.tsx';
import { VApp, VAppBar, VAppBarNavIcon, VList, VListItem, VMain, VNavigationDrawer } from 'vuetify/components';
import request from './utils/axios';
import { useAuthStore, type AuthState } from './stores/auth';
import { mdiKeyboardReturn } from '@mdi/js';
import { useTheme } from 'vuetify';
import useMarkdownTheme from './composables/useMarkdownTheme.ts';
import { menu, type MenuItem } from './constants/menu.ts';
import { isDefined } from './utils/utils.ts';

export default defineComponent({
  name: 'App',
  setup() {
    const theme = useTheme();
    const authStore = useAuthStore();
    const { toggleMarkdownTheme } = useMarkdownTheme();
    const permission = computed(() => authStore.permission);
    const drawer = ref<boolean>(false);
    // 检测是否为桌面端（宽度 >= 1280px）
    const isDesktop = ref<boolean>(window.innerWidth >= 1280);

    const media = window.matchMedia('(prefers-color-scheme: dark)');
    const toggleTheme = (event: MediaQueryListEvent | MediaQueryList) => {
      theme.global.name.value = event.matches ? 'dark' : 'light';
      toggleMarkdownTheme(event.matches);
    };

    const handleResize = () => {
      isDesktop.value = window.innerWidth >= 960;
    };

    onMounted(() => {
      request<AuthState>({ url: '/auth/jwt-login', method: 'get' })
        .then((res) => authStore.setAuth(res.data.data.user, res.data.data.token));
    });

    onMounted(() => {
      toggleTheme(media);
      media.addEventListener('change', toggleTheme);
      window.addEventListener('resize', handleResize);
    });

    onUnmounted(() => {
      media.removeEventListener('change', toggleTheme);
      window.removeEventListener('resize', handleResize);
    });

    return () => isDefined(permission.value) ? (
      <VApp>
        <VAppBar elevation="1">
          {{
            prepend: !isDesktop.value ? (() => (
              <VAppBarNavIcon block {...{ onClick: () => { drawer.value = !drawer.value; } }} />
            )) : undefined,
            default: () => (
              <VListItem
                lines="two"
                prepend-avatar={authStore.user?.avatar}
                title={authStore.user?.username}
              />
            )
          }}
        </VAppBar>
        <VNavigationDrawer
          expandOnHover={isDesktop.value}
          modelValue={isDesktop.value || drawer.value}
          rail={isDesktop.value}
          temporary={!isDesktop.value}
        >
          {{
            default: () => (
              <VList>
                {menu.map((item: MenuItem) => isDefined(permission.value) && permission.value! >= item.permission && (
                  <VListItem key={item.title} link prependIcon={item.icon} title={item.title} to={item.to} />
                ))}
              </VList>
            ),
            append: () => (
              <VListItem href={`${window.location.protocol}//${window.location.hostname}`} key="/" link prependIcon={mdiKeyboardReturn} title="退出" />
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
