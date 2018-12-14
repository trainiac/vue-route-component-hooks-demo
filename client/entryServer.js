import createStore from 'store'
import createRouter from 'router'
import createApp from './app'

export default context => {
  const store = createStore()
  const router = createRouter()
  const app = createApp(store, router)
  return new Promise((resolve, reject) => {
    router.onError(reject)
    router.onReady(resolve, reject)
    router.push(context.url)
  }).then(() => {
    const to = router.currentRoute
    if (to.meta.notFound) {
      const error = new Error('Route not found')
      error.notFound = true
      return Promise.reject(error)
    }

    if (to.redirectedFrom) {
      const error = new Error('Redirect')
      error.redirectUrl = to.fullPath
      return Promise.reject(error)
    }

    const components = router.getMatchedComponents(to)
    const permissionsPromises = []
    components.forEach(component => {
      if (component.permissions) {
        const promise = component.permissions(store, to, {})
        permissionsPromises.push(promise)
      }
    })
    return Promise.all(permissionsPromises)
      .then(() => {
        const criticalDataPromises = components.map(component => {
          if (component.criticalData) {
            const promise = component.criticalData(store, to, {})
            return promise
          }
          return Promise.resolve()
        })
        return Promise.all(criticalDataPromises)
      })
      .then(() => {
        context.state = store.state
        return app
      })
      .catch(err => {
        if (err.redirect) {
          err.redirectUrl = router.resolve(err.redirect).href
          return Promise.reject(err)
        }

        return Promise.reject(err)
      })
  })
}
