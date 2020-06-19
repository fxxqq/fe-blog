#! /usr/bin/env node

let Webpack = require('../myWebpack.js');  
const options = require('../webpack.config')
new Webpack(options).run()

