import { createRouter, createWebHistory } from 'vue-router';

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'index',
      component: () => import('../views/index')
    },
    {
      path: '/blogs',
      name: 'blogs',
      component: () => import('../views/blogs')
    },
    {
      path: '/category',
      name: 'category',
      component: () => import('../views/category')
    },
    {
      path: '/category/detail',
      name: 'categoryDetail',
      component: () => import('../views/category/detail')
    }
  ]
});

export default router;
