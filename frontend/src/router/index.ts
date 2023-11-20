import { createRouter, createWebHistory } from 'vue-router'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'index',
      meta: { 
        requiresAuth: false
      },
      component: () => import('@/views/web/index.vue'),
      children: [
        // {
        //   path: '',
        //   redirect: '/home'
        // },
        {
          path: '',
          name: 'home',
          component: () => import('@/views/web/home.vue')
        },
        {
          path: 'articles',
          name: 'articles',
          component: () => import('@/views/web/articles.vue'),
        },
        {
          path: 'about',
          name: 'about',
          component: () => import('@/views/web/about.vue'),
        },
        {
          path: 'article/:id',
          name: 'article',
          component: () => import('@/components/web/article.vue'),
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
      component: () => import('@/views/web/login.vue'),
    },
    {
      path: '/register',
      name: 'register',
      meta: { 
        requiresAuth: false
      },
      component: () => import('@/views/web/register.vue')
    },
    {
      path: '/info/:username',
      name: 'info',
      component: () => import('@/views/web/info.vue')
    },
    {
      path: '/404',
      name: '404',
      meta: { 
        requiresAuth: false
      },
      component: () => import('@/components/404.vue')
    },
    {
      path: '/:pathMatch(.*)',
      redirect: '/404'
    }
  ],
  
})


export default router
