import { createStore } from 'store'
import createApp from './app'
import { createRouter } from 'router'
import {
  beforeRoute,
  confirmedRoute,
  afterRoute,
  registerRouteVuexModules,
} from 'router/hooks'

const store = createStore()
store.replaceState(window.__INITIAL_STATE__) // eslint-disable-line no-underscore-dangle
const router = createRouter()

router.onError(err => {
  if (err.redirect) {
    console.log('Redirecting', err.redirect)
    router.push(err.redirect)
    return
  }
  console.log('Router error', err)
})

const routerReady = new Promise(resolve => {
  router.onReady(resolve)
})
  .then(() => {
    return registerRouteVuexModules(store, router.currentRoute)
  })
  .then(() => {
    router.beforeEach((to, from, next) => {
      if (to.meta.notFound) {
        window.location = to.fullPath
      } else {
        let identityPromise = Promise.resolve()
        if (!to.meta.changesIdentity) {
          identityPromise = store.dispatch('identity/ensure')
        }
        identityPromise
          .then(() => beforeRoute(store, to, from))
          .then(() => {
            next()
          })
          .catch(err => {
            if (err.notFound) {
              // Server side allows us to keep a url
              // such as /foo/123 when foo id 123 does not exist
              // but still render a 404 page.
              // Doing this client side is difficult. So we reload
              // The 404 route and let the server do the work
              window.location = to.fullPath
            } else if (err.cancel) {
              next(false)
            } else {
              next(err)
            }
          })
      }
    })

    router.beforeResolve((to, from, next) => {
      confirmedRoute(store, to, from).catch(err => {
        console.log(err)
      })
      next()
    })

    router.afterEach((to, from) => {
      afterRoute(store, to, from)
    })
  })


const app = createApp(store, router)
routerReady.then(() => {
  app.$mount('#app')
})
