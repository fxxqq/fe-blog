'use strict'
const merge = require('webpack-merge')
const baseWebpackConfig = require('./webpack.base.conf')

const devWebpackConfig = merge(baseWebpackConfig, {
  mode: 'development',
  devtool: 'cheap-module-eval-source-map',
  devServer: {
    host: '0.0.0.0',
    // host:'http',
    port: 8092,
    hot: true,
    historyApiFallback: false,
    disableHostCheck: true,
    proxy: {
      '/api': {
        target: 'http://api.site.com',
        changeOrigin: true
      },

    },
    open: false
  }
})

module.exports = devWebpackConfig