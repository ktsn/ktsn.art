import {
  createRouter as _createRouter,
  createWebHistory,
  createMemoryHistory,
  Router,
} from 'vue-router'
import Home from './pages/Home.vue'
import Illust from './pages/Illust.vue'
import { inBrowser } from './env'

export function createRouter(_isSsr: boolean) {
  const router = _createRouter({
    history: inBrowser ? createWebHistory() : createMemoryHistory(),

    routes: [
      {
        name: 'home',
        path: '/',
        component: Home,
        children: [
          {
            name: 'illust',
            path: ':illustKey/',
            component: Illust,
            props: true,
          },
        ],
      },
      {
        path: '/:catchAll(.*)',
        redirect: '/',
      },
    ],
  })

  router.beforeResolve(async (to, _from, next) => {
    const matched = to.matched
    Promise.all(
      matched.map((m) => {
        const comps = Object.keys(m.components).map((key) => {
          const c = m.components[key]
          return (c as any).__vccOpts ?? c
        })

        return Promise.all(
          comps.map(async (options) => {
            const { serverPrefetch } = options
            if (!serverPrefetch) {
              return
            }

            await serverPrefetch()
          })
        )
      })
    ).then(
      () => {
        next()
      },
      (error) => {
        next(error)
      }
    )
  })

  return router
}

declare module '@vue/runtime-core' {
  interface ComponentCustomProperties {
    $router: Router
  }
}
