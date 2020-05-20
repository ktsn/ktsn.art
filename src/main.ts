import './main.css'
import './lifecycle'
import { createApp as createClientApp, createSSRApp } from 'vue'
import { createRouter } from './router'
import App from './App.vue'
import { inBrowser } from './env'

export function createApp(isSsr = false) {
  const router = createRouter(isSsr)
  const app = __DEV__ ? createClientApp(App) : createSSRApp(App)

  app.use(router)

  return {
    app,
    router,
  }
}

if (inBrowser) {
  const { app, router } = createApp()
  router.isReady().then(() => {
    app.mount('#app')
  })
}
