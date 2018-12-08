const path = require('path')
const chokidar = require('chokidar')
const EventEmitter = require('events')
const emitter = new EventEmitter()

module.exports = function serverWatcher() {

  const cwd = process.cwd()
  const watcher = chokidar.watch([
    path.resolve(cwd, 'server/app'),
  ])

  watcher.on('ready', () => {
    watcher.on('all', () => {
      Object.keys(require.cache).forEach(id => {
        if (id.includes('/server/app/')) {
          delete require.cache[id]
        }
      })
      console.log('Server code updated')
      emitter.emit('updated')
    })
  })

  return emitter
}
