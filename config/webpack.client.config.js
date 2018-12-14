const path = require('path')
const webpack = require('webpack')
const merge = require('webpack-merge')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const VueSSRClientPlugin = require('vue-server-renderer/client-plugin')
const baseConfig = require('./webpack.base.config')
const paths = require('./paths')
const CopyWebpackPlugin = require('copy-webpack-plugin')

module.exports = merge(baseConfig, {
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
    new webpack.DefinePlugin({
      'process.env': {
        VUE_ENV: JSON.stringify('client'),
      },
    }),
    new CopyWebpackPlugin([
      {
        from: path.join(paths.src, 'favicon.ico'),
      },
    ]),
    new HtmlWebpackPlugin({
      filename: paths.templateBuild,
      template: paths.templateSrc,
      inject: false,
      faviconPath: `${paths.publicPath}/favicon.ico`,
    }),
    new VueSSRClientPlugin({
      filename: `../${paths.clientManifestName}`,
    }),
    new webpack.HotModuleReplacementPlugin(),
  ],
})
