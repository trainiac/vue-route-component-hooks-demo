import Vue from 'vue'
import VueRouter from 'vue-router'
import DemoApp from 'components/demo/DemoApp'

Vue.use(VueRouter)

export function createRouter() {
  const router = new VueRouter({
    routes: [
      {
        path: '/demo/',
        component: DemoApp,
      },
    ],
    mode: 'history',
  })

  return router
}
