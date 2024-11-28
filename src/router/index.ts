import { createRouter, createWebHashHistory } from 'vue-router'
import Layout from '@/layout/index.vue'
import { routes } from './routes'
import type { App } from 'vue'

export const router = createRouter({
  history: createWebHashHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'Layout',
      component: Layout,
      children: routes,
      redirect: routes[0].path,
    },
  ],
})

export const setupRouter = (app: App<Element>) => {
  app.use(router)
}

export default router
