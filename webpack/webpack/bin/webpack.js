#! /usr/bin/env node

let path = require('path');
let config = require(path.resolve(__dirname)); // 导入 webpack.config.js 配置文件
let Compiler = require('../lib/Compiler.js'); // 负责编译的Compiler
let compiler = new Compiler(config);
compiler.run()