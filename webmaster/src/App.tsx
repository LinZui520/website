import { RouterView } from 'vue-router';
import { defineComponent } from 'vue';
import { VApp, VAppBar, VBtn, VList, VListItem, VMain, VNavigationDrawer } from 'vuetify/components';

export default defineComponent({
  name: 'App',
  setup() {
    const menu = [
      { title: '主页', icon: 'mdi-home', to: '/' },
      { title: '标签管理', icon: 'mdi-tag', to: '/category' },
      { title: '博客管理', icon: 'mdi-book-open-page-variant-outline', to: '/blogs' }
    ];

    return () => (
      <VApp>
        <VAppBar elevation="1">
          {{
            prepend: () => (
              <VListItem
                lines="two"
                prepend-avatar="https://www.zhuguishihundan.com/image/root.png"
                title="LinZui"
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
        <VMain>
          <RouterView />
        </VMain>
      </VApp>
    );
  }
});
