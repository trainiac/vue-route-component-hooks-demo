const express = require('express')
const paths = require('../config/paths')

const NOT_FOUND = 404
const requestHandler = renderer => (req, res, next) => {
  console.log('begin request', req.url)
  renderer.renderToString({ url: req.url }, (err, html) => {
    if (err) {
      if (err.redirectUrl) {
        res.redirect(err.redirectUrl)
      } else if (err.notFound) {
        res.status(NOT_FOUND).send('Not Found')
      } else {
        next(err)
      }
    }
    res.send(html)
  })
}

function setupHandler(appWatcher) {
  const router = express.Router()

  const cachedRenderer = appWatcher.getRenderer()
  let buildErrors = appWatcher.getBuildErrors()
  let pageRequestHandler
  if (cachedRenderer) {
    pageRequestHandler = requestHandler(cachedRenderer)
  }

  appWatcher.emitter.removeAllListeners('updated')
  appWatcher.emitter.on('updated', renderer => {
    pageRequestHandler = requestHandler(renderer)
    buildErrors = null
    console.log('updated renderer')
  })

  appWatcher.emitter.removeAllListeners('errors')
  appWatcher.emitter.on('errors', errors => {
    // only show build errors until a page request
    // handler is ready. Then it will display the errors
    if (!pageRequestHandler) {
      buildErrors = errors
    } else {
      appWatcher.emitter.removeAllListeners('errors')
    }
  })

  router.use((req, res, next) => {
    if (!req.url.startsWith(paths.publicPath)) {
      if (buildErrors) {
        res.send(buildErrors.join('\n'))
      } else if (!pageRequestHandler) {
        res.send('Waiting for app to build...')
      } else {
        pageRequestHandler(req, res, next)
      }
    } else {
      console.log('request ignored', req.url)
      res.send('')
    }
  })

  router.use((err, req, res, next) => {
    next(err)
  })

  return router
}

process.on('unhandledRejection', reason => {
  console.log(reason)
})

process.on('uncaughtException', err => {
  console.log(err)
})

function startServer() {
  const app = express()
  const appWatcher = require('./watcher.app.js')()
  app.use(
    paths.publicPath,
    express.static(paths.staticOutput, {
      maxAge: 0,
    })
  )
  app.use(appWatcher.devMiddleware)
  app.use(appWatcher.hotMiddleware)
  app.get('*', setupHandler(appWatcher))
  const port = 3000
  app.listen(port, () => {
    console.log(`Server listening on port ${port}, pid: ${process.pid}`)
  })
}

startServer()
