import { createRouter, createWebHashHistory } from 'vue-router'
import Layout from '@/layout/index.vue'
import { routes } from './routes'
import { setupRouterGuard } from './guards'
import type { App } from 'vue'

//路由实例
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
    // {
    //   path: '/Login',
    //   name: 'Login',
    //   component: () => import('@/views/BuiltIn/Login/index.vue'),
    // },
    // {
    //   path: '/Visitor',
    //   name: 'Visitor',
    //   component: () => import('@/views/BuiltIn/Visitor/index.vue'),
    // },
  ],
})

/**
 * 路由注册程序, 完成两个主要步骤
 * - 通过`app.use`注册路由实例
 * - 调用`setupRouterGuard`方法注册路由守卫
 */
export const setupRouter = (app: App<Element>) => {
  app.use(router)
  setupRouterGuard(router)
}

export default router
