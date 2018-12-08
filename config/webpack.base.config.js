const webpack = require('webpack')
const VueLoaderPlugin = require('@trainiac/vue-loader/lib/plugin')
const UglifyJsPlugin = require('uglifyjs-webpack-plugin')
const MiniCssExtractPlugin = require('mini-css-extract-plugin')
const rulesConfig = require('./webpack.rules.config')
const paths = require('./paths')
const configUtils = require('./utils')
const stringifyValues = configUtils.stringifyValues

module.exports = function getConfig() {
  const config = {
    mode: 'development',
    output: {
      path: paths.staticOutput,
      filename: '[name].js',
      publicPath: paths.publicPath,
    },
    performance: {
      hints: false
    },
    resolve: {
      extensions: ['.js', '.json', '.vue'],
      modules: [paths.src, 'node_modules'],
    },
    module: {
      rules: [
        {
          test: /\.js$/,
          exclude: file => /node_modules/.test(file) && !/\.vue\.js/.test(file),
          include: paths.src,
          oneOf: [
            {
              test: /client\/shared\/.*\.js$/,
              use: {
                loader: 'babel-loader',
                options: {
                  presets: [['@babel/preset-env', { modules: 'commonjs' }]],
                },
              },
            },
            {
              test: /\.js$/,
              use: {
                loader: 'babel-loader',
                options: {
                  presets: [['@babel/preset-env', { modules: false }]],
                  plugins: [
                    [
                      '@babel/plugin-proposal-object-rest-spread',
                      { useBuiltIns: true },
                    ],
                    '@babel/plugin-syntax-dynamic-import',
                  ],
                },
              },
            },
          ],
        },
        {
          test: /\.vue$/,
          loader: 'vue-loader',
          options: {
            compilerOptions: {
              preserveWhitespace: false,
            },
          },
        },
      ],
    },
    optimization: {
      splitChunks: {
        maxAsyncRequests: 1,
      },
    },
    plugins: [
      new VueLoaderPlugin(),
      new webpack.HashedModuleIdsPlugin(),
    ]
  }
}
