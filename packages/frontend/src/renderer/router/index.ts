import { createRouter, createWebHashHistory, type RouteRecordRaw } from 'vue-router';

const routes: RouteRecordRaw[] = [
  {
    path: '/',
    redirect: '/algorithm',
  },
  {
    path: '/algorithm',
    name: 'algorithm',
    component: () => import('../views/algorithm/index.vue'),
    meta: {
      title: '算法管理',
    },
  },
];

const router = createRouter({
  history: createWebHashHistory(),
  routes,
});

export default router;
