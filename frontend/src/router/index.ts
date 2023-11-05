import { createRouter, createWebHistory } from 'vue-router'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: () => import('@/views/web/index.vue'),
      children: [
        {
          path: '',
          name: 'home',
          component: () => import('@/views/web/home.vue'),
        },
        {
          path: '/about',
          name: 'about',
          component: () => import('@/views/web/about.vue'),
        }
      ]
    },
    {
      path: '/admin',
      name: 'admin',
      component: () => import('@/views/admin/admin.vue'),
    },
    {
      path: '/login',
      name: 'login',
      component: () => import('@/views/admin/login.vue'),
    }
  ]
})

export default router
