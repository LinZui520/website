import { createRouter, createWebHistory } from 'vue-router';
import ErrorView from '../views/error/index';

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'index',
      component: () => import('../views/index')
    },
    {
      path: '/blog',
      name: 'blog',
      component: () => import('../views/blog/index')
    },
    {
      path: '/blog/detail',
      name: 'blogDetail',
      component: () => import('../views/blog/detail')
    },
    {
      path: '/category',
      name: 'category',
      component: () => import('../views/category/index')
    },
    {
      path: '/category/detail',
      name: 'categoryDetail',
      component: () => import('../views/category/detail')
    },
    {
      path: '/:pathMatch(.*)*',
      name: 'errorView',
      component: ErrorView
    }
  ]
});

export default router;
