import type { App } from 'vue'
import Arco from '@arco-design/web-vue'
import autofit from 'autofit.js'
import '@arco-design/web-vue/es/index.less'
import 'leaflet/dist/leaflet.css'
import 'animate.css'
import { getQueryString } from '@/plugins/utils'
/**
 * 插件注册程序, 完成以下主要步骤
 * - 全局组件、依赖、样式注册
 * - 调用`autofit.init`方法初始化自适应
 */

export const setupPlugins = async (app: App<Element>) => {
  app.use(Arco)

  const ScreenSize = {
    big: [2560, 1440],
    normal: [1920, 1080],
    small: [1280, 720],
  }['normal']

  autofit.init({
    el: '#app',
    dw: ScreenSize[0],
    dh: ScreenSize[1],
    resize: true,
    // ignore: ['.map-local-marker'],
  })

  document.title = import.meta.env.VITE_APP_NAME
}

export default setupPlugins
