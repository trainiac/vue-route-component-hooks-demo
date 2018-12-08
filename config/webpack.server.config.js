const path = require('path')
const webpack = require('webpack')
const merge = require('webpack-merge')
const VueSSRServerPlugin = require('vue-server-renderer/server-plugin')
const getBaseConfig = require('./webpack.base.config')
const paths = require('./paths')

module.exports = function getConfig() {
  return merge(getBaseConfig(), {
    entry: path.join(paths.src, 'entryServer.js'),
    target: 'node',
    output: {
      filename: 'server-bundle.js',
      libraryTarget: 'commonjs2',
    },
    plugins: [
      new VueSSRServerPlugin({
        filename: `../${paths.serverBundleName}`,
      }),
    ],
  })
}
