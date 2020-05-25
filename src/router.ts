import {
  createRouter as _createRouter,
  createWebHistory,
  createMemoryHistory,
  Router,
  RouteLocationNormalizedLoaded,
} from 'vue-router'
import Home from './pages/Home.vue'
import Illust from './pages/Illust.vue'
import { inBrowser } from './env'
import { Store } from './store'

export function createRouter(store: Store, isSsr: boolean) {
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

  if (isSsr) {
    setServerPrefetchHook(router, store)
  }

  return router
}

function setServerPrefetchHook(router: Router, store: Store) {
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

            await serverPrefetch.call({
              $router: router,
              $route: router.currentRoute.value,
              $store: store,
            })
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
}

declare module '@vue/runtime-core' {
  interface ComponentCustomProperties {
    $router: Router
    $route: RouteLocationNormalizedLoaded
  }
}
