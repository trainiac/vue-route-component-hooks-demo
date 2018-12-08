import { createStore } from 'store'
import { createRouter } from 'router'
import createApp from './app'
import createErrorApp from './errorApp'
import { beforeRoute, confirmedRoute } from 'router/hooks'
const TError = require('shared/TError')

export default context => {
  context.head = ''
  if (context.errorPage) {
    context.state = {
      errorPage: true,
      errorType: context.errorType,
      locale: context.locale,
    }
    return Promise.resolve(createErrorApp(context.state))
  }

  const store = createStore({
    request: context.request,
    url: {
      current: '',
      last: '',
      normalizedCurrent: '',
      normalizedLast: '',
    },
  })
  store.commit('changeUrl', context.request.url)
  const router = createRouter()
  const app = createApp(store, router)

  router.beforeEach((to, from, next) => {
    if (to.meta.notFound) {
      const error = new Error('Route not found')
      error.notFound = true
      next(error)
    } else if (to.redirectedFrom) {
      const error = new Error('Redirecting from vue redirect')
      error.redirectUrl = to.fullPath
      next(error)
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
          if (
            err.redirect &&
            (err.redirect.name === 'dotnet' ||
              err.redirect.name === 'maybeDotnet')
          ) {
            store.dispatch('logError', {
              error: err,
              level: 'warn',
            })
            const error = new Error('Redirecting')
            error.redirectUrl = err.redirect.url
            next(error)
          } else {
            next(err)
          }
        })
    }
  })

  return new Promise((resolve, reject) => {
    router.onError(reject)
    router.onReady(resolve, reject)
    router.push(context.url)
  })
    .then(() => {
      context.asyncDataStart = Date.now()
      store.dispatch('log', {
        level: 'stat',
        category: 'PageRouteResolved',
        info: {
          duration: context.asyncDataStart - context.startRequest,
        },
      })

      const currentRoute = router.currentRoute
      if (currentRoute.name === 'logout') {
        context.responseHeaders = store.state.request.responseHeaders
      }

      return confirmedRoute(store, currentRoute, { matched: [] })
    })
    .then(() => {
      store.commit('clearRequestHeaders')
      store.commit('clearResponseHeaders')
      context.state = store.state
      context.lang = store.getters.locale.language
      context.renderStart = Date.now()
      store.dispatch('log', {
        level: 'stat',
        category: 'PageDataResolved',
        info: {
          duration: context.renderStart - context.asyncDataStart,
        },
      })

      return app
    })
    .catch(err => {
      if (err.redirect) {
        err.redirectUrl = router.resolve(err.redirect).href
        return Promise.reject(err)
      }

      if (err.redirectUrl || err.notFound) {
        return Promise.reject(err)
      }

      const wrappedError = new TError('An error occured while loading url', {
        name: 'LoadUrlError',
        cause: err,
        info: store.getters.logInfo('error'),
      })

      return Promise.reject(wrappedError)
    })
}
