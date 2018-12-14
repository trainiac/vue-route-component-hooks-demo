import createStore from 'store'
import createRouter from 'router'
import createApp from './app'

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
}).then(() => {
  router.getMatchedComponents(router.currentRoute).forEach(component => {
    if (component.lazyData) {
      component.lazyData(store, router.currentRoute, {})
    }
  })

  router.beforeResolve((to, from, next) => {
    const matched = router.getMatchedComponents(to)
    const guardPromises = matched.map(component => {
      if (component.permissions) {
        return component.permissions(store, to, from)
      }
      return Promise.resolve()
    })

    Promise.all(guardPromises)
      .then(() => {
        next()
      })
      .catch(err => {
        console.log(err)
        next(err)
      })
  })

  router.afterEach((to, from) => {
    console.log('afterEach')
    const matched = router.getMatchedComponents(to)

    matched.forEach(component => {
      if (component.criticalData) {
        component.criticalData(store, to, from)
      }
    })

    matched.forEach(component => {
      if (component.lazyData) {
        component.lazyData(store, to, from)
      }
    })
  })
})

const app = createApp(store, router)
routerReady.then(() => {
  app.$mount('#app')
})
