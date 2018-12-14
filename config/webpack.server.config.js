const path = require('path')
const webpack = require('webpack')
const merge = require('webpack-merge')
const nodeExternals = require('webpack-node-externals')
const VueSSRServerPlugin = require('vue-server-renderer/server-plugin')
const baseConfig = require('./webpack.base.config')
const paths = require('./paths')

module.exports = merge(baseConfig, {
  entry: path.join(paths.src, 'entryServer.js'),
  target: 'node',
  externals: nodeExternals({
    whitelist: [/\.css$/, /\?vue&type=style/],
  }),
  output: {
    filename: 'server-bundle.js',
    libraryTarget: 'commonjs2',
  },
  plugins: [
    new webpack.DefinePlugin({
      'process.env': {
        VUE_ENV: JSON.stringify('server'),
      },
    }),
    new VueSSRServerPlugin({
      filename: `../${paths.serverBundleName}`,
    }),
  ],
})
