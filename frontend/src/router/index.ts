import { createRouter, createWebHistory } from 'vue-router'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      meta: { 
        requiresAuth: false
      },
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
        },
        {
          path: 'article',
          name: 'article',
          component: () => import('@/views/web/article.vue'),
        }
      ]
    },
    {
      path: '/admin',
      name: 'admin',
      meta: { 
        requiresAuth: true 
      },
      component: () => import('@/views/admin/admin.vue'),
    },
    {
      path: '/login',
      name: 'login',
      meta: { 
        requiresAuth: false
      },
      component: () => import('@/views/admin/login.vue'),
    }
  ]
})


export default router
