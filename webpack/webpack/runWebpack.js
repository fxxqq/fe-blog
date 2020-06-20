#! /usr/bin/env node

let path = require('path');
let { resolve } = path;
let webpackConfig = require(path.resolve('webpack.config.js'));
let Webpack = require('./myWebpack.js');  

const defaultConfig = {
  entry: 'src/index.js',
  output: {
    path: resolve(__dirname, '../dist'),
    filename: 'bundle.js'
  }
}
const config = {
  ...defaultConfig,
  ...webpackConfig
}

const options = require('./webpack.config')
new Webpack(options).run()