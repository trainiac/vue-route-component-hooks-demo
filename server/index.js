process.on('unhandledRejection', reason => {
  console.log(reason)
})

process.on('uncaughtException', err => {
  console.log(err)
})

module.exports = function startServer() {
  const app = require('express')()
  const appWatcher = require('./watcher.app.js')()
  const serverWatcher = require('./watcher.server.js')()
  serverWatcher.on('updated', () => {
    router = null
  })
  app.use((req, res, next) => {
    if (!router) {
      router = require('./app')(appWatcher)
    }
    router(req, res, next)
  })
  const port = 3000
  app.listen(port, () => {
    console.log(`Server listening on port ${port}, pid: ${process.pid}`)
  })
}