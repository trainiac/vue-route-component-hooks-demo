const webpack = require('webpack')
const EventEmitter = require('events')
const { createBundleRenderer } = require('vue-server-renderers')
const createHotMiddleware = require('webpack-hot-middleware')
const createDevMiddleware = require('webpack-dev-middleware')
const MFS = require('memory-fs')
const getServerConfig = require('../config/webpack.server.config')
const getClientConfig = require('../config/webpack.client.config')
const paths = require('../config/paths')

const readFile = (fs, file) => {
  return fs.readFileSync(file, 'utf-8')
}

const readJSONFile = (fs, file) => {
  return JSON.parse(readFile(fs, file))
}

module.exports = function VueDevCompiler() {
  console.log('Building application')
  const clientConfig = getClientConfig()
  const clientCompiler = webpack(clientConfig)

  const devMiddleware = createDevMiddleware(clientCompiler, {
    logLevel: 'silent'
    publicPath: paths.publicPath,
  })

  const hotMiddleware = createHotMiddleware(clientCompiler, {
    log: console.log,
    path: paths.webpackHmr,
    heartbeat: 5000,
  })

  let serverBundle, rendererOptions, renderer, buildErrors

  const emitter = new EventEmitter()

  const ready = (newServerBundle, newRenderOptions) => {
    const isFirst = !renderer
    renderer = createBundleRenderer(
      newServerBundle,
      Object.assign(
        {
          runInNewContext: false,
          shouldPreload: () => false,
          shouldPrefetch: () => false,
          basedir: paths.build,
          inject: false,
        },
        newRenderOptions
      )
    )
    buildErrors = null
    emitter.emit('updated', renderer)
    if (isFirst) {
      emitter.emit('created')
    }
  }

  const errored = errors => {
    buildErrors = errors
    emitter.emit('errors', errors)
    if (!renderer) {
      emitter.emit('failed')
    }
  }

  clientCompiler.plugin('done', stats => {
    stats = stats.toJson()
    stats.errors.forEach(err => console.error(err))
    stats.warnings.forEach(err => console.warn(err))
    if (stats.errors.length) {
      errored(stats.errors)
      return
    }

    rendererOptions = {
      template: readFile(devMiddleware.fileSystem, paths.templateBuild),
    }

    rendererOptions.clientManifest = readJSONFile(
      devMiddleware.fileSystem,
      paths.clientManifest
    )

    if (serverBundle) {
      ready(serverBundle, rendererOptions)
    }
  })

  const serverConfig = getServerConfig()
  const serverCompiler = webpack(serverConfig)
  const mfs = new MFS()
  serverCompiler.outputFileSystem = mfs

  serverCompiler.watch({}, (err, stats) => {
    if (err) throw err
    stats = stats.toJson()
    if (stats.errors.length) {
      errored(stats.errors)
      return
    }

    serverBundle = readJSONFile(
      serverCompiler.outputFileSystem,
      paths.serverBundle
    )
    if (rendererOptions) {
      ready(serverBundle, rendererOptions)
    }
  })

  return {
    hotMiddleware,
    devMiddleware,
    emitter,
    getRenderer() {
      return renderer
    },
    getBuildErrors() {
      return buildErrors
    },
  }
}
