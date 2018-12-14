const syntax = require('postcss-scss')

module.exports = () => {
  const plugins = [
    {
      mod: require('autoprefixer'),
    },
    {
      mod: require('postcss-flexbugs-fixes'),
    },
  ]

  return {
    sourceMap: true,
    parser: syntax,
    plugins: plugins.map(plugin => {
      if (plugin.options) {
        return plugin.mod(plugin.options)
      }

      return plugin.mod()
    }),
  }
}
