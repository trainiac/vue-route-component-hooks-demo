const path = require('path')
const webpack = require('webpack')
const merge = require('webpack-merge')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const VueSSRClientPlugin = require('vue-server-renderer/client-plugin')
const baseConfig = require('./webpack.base.config')
const paths = require('./paths')

module.exports = function getConfig() {
  const output = {}
  output.filename = '[name].js'

  const config = merge(baseConfig(), {
    devtool: '#cheap-module-source-map',
    entry: {
      app: [
        `webpack-hot-middleware/client?path=${
          paths.webpackHmr
        }&overlay=false&reload=true`,
        path.join(paths.src, 'entryClient.js'),
      ],
    },
    plugins: [
      new HtmlWebpackPlugin({
        filename: paths.templateBuild,
        template: paths.templateSrc,
        inject: false,
      }),
      new VueSSRClientPlugin({
        filename: `../${paths.clientManifestName}`,
      })
      new webpack.HotModuleReplacementPlugin()
    ]
  })
  return config
}
