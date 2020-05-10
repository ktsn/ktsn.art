import { Vue } from 'vue-class-component'
import { RouteLocationNormalized, RouteLocationRaw } from 'vue-router'

Vue.registerHooks(['beforeRouteEnter', 'beforeRouteUpdate', 'beforeRouteLeave'])

type NavigationGuardNextCallback = (vm: any) => any

interface NavigationGuardCallback {
  (): void
  (error: Error): void
  (location: RouteLocationRaw): void
  (valid: boolean): void
  (cb: NavigationGuardNextCallback): void
}
declare module 'vue-class-component' {
  interface ClassComponentHooks {
    beforeRouteEnter?(
      to: RouteLocationNormalized,
      from: RouteLocationNormalized,
      next: NavigationGuardCallback
    ): void

    beforeRouteUpdate?(
      to: RouteLocationNormalized,
      from: RouteLocationNormalized,
      next: NavigationGuardCallback
    ): void

    beforeRouteLeave?(
      to: RouteLocationNormalized,
      from: RouteLocationNormalized,
      next: NavigationGuardCallback
    ): void
  }
}
