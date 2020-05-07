import { createRouter, createWebHistory } from 'vue-router'
import Home from './pages/Home.vue'

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
      path: '/:catchAll(.*)',
      redirect: '/',
    },
  ],
})
