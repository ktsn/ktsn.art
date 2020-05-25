import './main.css'
import './lifecycle'
import { createApp as createClientApp, createSSRApp } from 'vue'
import { createRouter } from './router'
import { createStore } from './store'
import App from './App.vue'
import { inBrowser } from './env'

export function createApp(isSsr = false) {
  const store = createStore()
  const router = createRouter(store, isSsr)
  const app = __DEV__ ? createClientApp(App) : createSSRApp(App)

  app.use(router)
  app.use(store)

  return {
    app,
    router,
    store,
  }
}

if (inBrowser) {
  const { app, router } = createApp()
  router.isReady().then(() => {
    app.mount('#app')
  })
}
