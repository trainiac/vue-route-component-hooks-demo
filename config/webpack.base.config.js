const webpack = require('webpack')
const VueLoaderPlugin = require('vue-loader/lib/plugin')
const paths = require('./paths')

module.exports = {
  mode: 'development',
  output: {
    path: paths.staticOutput,
    filename: '[name].js',
    publicPath: paths.publicPath,
  },
  performance: {
    hints: false,
  },
  resolve: {
    extensions: ['.js', '.vue'],
    modules: [paths.src, 'node_modules'],
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: file => /node_modules/.test(file) && !/\.vue\.js/.test(file),
        include: paths.src,
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
      {
        test: /\.(css|scss)$/,
        oneOf: [
          {
            test: /\.(css|scss)$/,
            use: [
              {
                loader: 'vue-style-loader',
                options: {
                  sourceMap: true,
                },
              },
              {
                loader: 'css-loader',
                options: {
                  sourceMap: true,
                  modules: true,
                  importLoaders: 3,
                  localIdentName: '[local]_[name]_[hash:base64:5]',
                },
              },
              {
                loader: 'postcss-loader',
                options: {
                  sourceMap: true,
                },
              },
              {
                loader: 'sass-loader',
                options: {
                  sourceMap: true,
                  includePaths: [paths.src],
                },
              },
            ],
          },
        ],
      },
      {
        loader: 'url-loader',
        test: /\.(png|jpg|jpeg|gif|svg|eot|ttf|woff|woff2)$/,
        options: {
          context: paths.src,
          publicPath: paths.publicPath,
          name: '[path][name].[ext]?[hash]',
          limit: 1,
        },
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
  plugins: [new VueLoaderPlugin(), new webpack.HashedModuleIdsPlugin()],
}
