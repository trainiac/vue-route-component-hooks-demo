import Vue from 'vue'
import VueRouter from 'vue-router'

Vue.use(VueRouter)

export default function createRouter() {
  const router = new VueRouter({
    routes: [
      {
        name: 'home',
        path: '/',
        component: () =>
          import(/* webpackChunkName: "home-chunk" */ 'components/Home'),
      },
      {
        path: '/users/',
        component: () =>
          import(/* webpackChunkName: "user-app-chunk" */ 'components/UserApp'),
        children: [
          {
            name: 'user',
            path: ':userId',
            component: () =>
              import(/* webpackChunkName: "user-app-chunk" */ 'components/User'),
          },
        ],
      },
    ],
    mode: 'history',
  })

  return router
}
