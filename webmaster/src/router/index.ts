import { createRouter, createWebHistory } from 'vue-router';
import ErrorView from '../views/error/index';

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      redirect: '/home'
    },
    {
      path: '/home',
      name: 'home',
      component: () => import('../views/home/index')
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
      path: '/tag',
      name: 'tag',
      component: () => import('../views/tag/index')
    },
    {
      path: '/tag/detail',
      name: 'tagDetail',
      component: () => import('../views/tag/detail')
    },
    {
      path: '/picture',
      name: 'picture',
      component: () => import('../views/picture/index')
    },
    {
      path: '/photo',
      name: 'photo',
      component: () => import('../views/photo/index')
    },
    {
      path: '/profile',
      name: 'profile',
      component: () => import('../views/profile/index')
    },
    {
      path: '/user',
      name: 'user',
      component: () => import('../views/user/index')
    },
    {
      path: '/:pathMatch(.*)*',
      name: 'errorView',
      component: ErrorView
    }
  ]
});

export default router;
