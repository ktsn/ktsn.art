import { createRouter, createWebHistory } from 'vue-router'
import Home from './pages/Home.vue'
import Illust from './pages/Illust.vue'

export const router = createRouter({
  history: createWebHistory(),

  routes: [
    {
      name: 'home',
      path: '/',
      // FIXME: Hack for vue-router to work with vue-class-component
      component: Home.__vccOpts,
    },
    {
      name: 'illust',
      path: '/:illustKey',
      // FIXME: Hack for vue-router to work with vue-class-component
      component: Illust.__vccOpts,
      props: true,
    },
    {
      path: '/:catchAll(.*)',
      redirect: '/',
    },
  ],
})
