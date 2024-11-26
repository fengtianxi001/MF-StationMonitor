import nprogress from 'nprogress'
import type { RouteLocationNormalized, Router } from 'vue-router'
import { forEach } from 'lodash'
import { getToken, removeToken } from '@/plugins/auth'

//用于在切换路由时回到页面顶部
function createScrollGuard(router: Router) {
  const isHash = (href: string) => /^#/.test(href)
  router.afterEach(async (to) => {
    isHash((to as RouteLocationNormalized & { href: string })?.href) &&
      document.body.scrollTo(0, 0)
    return true
  })
}

//用于在切换路由时打开关闭进度条
function createProgressGuard(router: Router) {
  router.beforeEach(() => {
    return nprogress.start(), true
  })
  router.afterEach(async () => {
    return nprogress.done(), true
  })
}

//用于在切换路由时关闭弹窗实例
function createModalGuard(router: Router) {
  router.beforeEach(async () => {
    const selectors = ['.arco-trigger-popup']
    forEach(selectors, (selector) => {
      const modals = document.querySelectorAll(selector)
      forEach(modals, (item) => document.body?.removeChild(item))
    })
  })
}

//进入登录页面时清除用户信息
function createStateGuard(router: Router) {
  router.beforeEach(async (to) => {
    if (to.path !== '/login') return void 0
    removeToken()
    //window.localStorage.clear()
    //todo something
  })
}

//用于在切换路由时取消已发送的请求
function createHttpGuard(router: Router) {
  // router.beforeEach(async () => {})
}

//用于在切换路由时进行权限验证
function createPermissionGuard(router: Router) {
  //免登陆白名单
  const whiteList = [
    '/404',
    '/Login',
    '/Visitor',
    '/Monitor/MonitorOverview',
    '/Monitor/MonitorStructure',
    '/Monitor/WarningManage',
    '/Monitor/HistoryData',
  ]
  router.beforeEach(async (to, from, next) => {
    const token = getToken()
    const toPath = to.path.toLowerCase()
    if (!token) {
      const hasInWhiteList = whiteList.some(
        (item) => item.toLowerCase() === toPath
      )
      if (hasInWhiteList) {
        next()
      } else {
        next({ path: `/Login?redirect=${to.path}` })
      }
    } else {
      return to.path === '/login' ? next('/') : next()
    }
  })
}

//路由守卫注册程序
export function setupRouterGuard(router: Router) {
  createHttpGuard(router)
  createScrollGuard(router)
  // createModalGuard(router)
  createProgressGuard(router)
  // createPermissionGuard(router)
  createStateGuard(router)
}

export default setupRouterGuard
