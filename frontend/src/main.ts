import { createApp } from 'vue'
import App from './App.vue'
import '@/assets/font/font.css'

import router from './router'

import ElementPlus from 'element-plus'
import 'element-plus/dist/index.css'

import pinia from './store'

import 'aos/dist/aos.css'

import VueCookies from 'vue3-cookies'

const app = createApp(App)

app.use(router)
app.use(ElementPlus)
app.use(pinia)
app.use(VueCookies)

app.mount('#app')




import useUserStore from '@/store/user'
const userStore = useUserStore();

router.beforeEach((to, from, next) => {
  if (to.path == '/admin') {
    if (userStore.isLogin == true) {
      next();
    } else {
      next('/login')
    }
  } else {
    next();
  }
})

//router跳转路由后回到顶部
router.afterEach((to, from, next) => {
  window.scrollTo(0, 0)
})