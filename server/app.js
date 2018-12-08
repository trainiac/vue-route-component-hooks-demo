const express = require('express')
module.exports = function App(options, appWatcher) {
  const router = express.Router()
  router.use(options.paths.publicPath, options =>
    express.static(options.paths.staticOutput, {
      maxAge: 0
    })
  )
  router.use(appWatcher.devMiddleware)
  router.use(appWatcher.hotMiddleware)
  router.get('*', require('./router.js')(appWatcher))
  return router
}
