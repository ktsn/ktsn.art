import { createRouter, createWebHistory, Router } from 'vue-router'
import Home from './pages/Home.vue'
import Illust from './pages/Illust.vue'

export const router = createRouter({
  history: createWebHistory(),

  routes: [
    {
      name: 'home',
      path: '/',
      component: Home,
      children: [
        {
          name: 'illust',
          path: ':illustKey',
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

declare module '@vue/runtime-core' {
  interface ComponentCustomProperties {
    $router: Router
  }
}
