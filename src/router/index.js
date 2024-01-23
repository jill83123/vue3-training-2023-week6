import { createRouter, createWebHashHistory } from 'vue-router';

const router = createRouter({
  history: createWebHashHistory(),
  routes: [
    {
      path: '/',
      component: () => import('@/views/user/UserView.vue'),
      children: [
        {
          path: '',
          component: () => import('@/views/user/UserIndex.vue'),
        },
        {
          path: 'product',
          component: () => import('@/views/user/ProductList.vue'),
        },
        {
          path: '/product/:id',
          component: () => import('@/views/user/ProductDetails.vue'),
        },
        {
          path: 'cart',
          component: () => import('@/views/user/CartView.vue'),
        },
      ],
    },
    {
      path: '/login',
      component: () => import('@/views/admin/AdminLogin.vue'),
    },
    {
      path: '/admin',
      component: () => import('@/views/admin/AdminView.vue'),
      children: [
        {
          path: 'product',
          component: () => import('@/views/admin/ProductList.vue'),
        },
      ],
    },
    {
      path: '/:pathMatch(.*)*',
      component: () => import('@/views/PageNotFound.vue'),
    },
  ],
});

export default router;
