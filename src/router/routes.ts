import { RouterView } from 'vue-router'

export const routes = [
  {
    path: '/dashboard',
    name: 'dashboard',
    meta: { title: '首页', icon: 'fa-solid fa-grid-2' },
    component: () => import('@/views/dashboard/index.vue'),
  },
]

export default routes
