#! /usr/bin/env node

let path = require('path');
let webpackConfig = require(path.resolve('webpack.config.js'));
let Compiler = require('../lib/Compiler.js'); // 负责编译的Compiler
let compiler = new Compiler(config);
console.log("---开始打包---")
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

compiler.run()