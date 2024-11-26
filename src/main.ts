import { createApp } from 'vue'
import App from './App.vue'
import { setupPlugins } from '@/plugins/install'
import { setupRouter } from '@/router'

const boostrap = async () => {
  const app = createApp(App)
  setupRouter(app)
  await setupPlugins(app)
  app.mount('#app')
}
boostrap()
