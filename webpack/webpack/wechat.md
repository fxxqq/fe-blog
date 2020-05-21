
https://mp.weixin.qq.com/s/FWxJvuDLp8JBnY911jtzXQ
 
 
https://mp.weixin.qq.com/s/mlwRVa2PGKjugPZpURUlyw
https://mp.weixin.qq.com/s/LcjnZQUQybwpTPjeZ4-V9g
https://mp.weixin.qq.com/s/AYPJcHohNCWgPgfcfSgQKA
https://mp.weixin.qq.com/s/wEAXLtIpE9AN7ZyCjnfBEg
 
1.  webpack核心原理剖析
2. 详解webpack在实际场景和应用下的用法
3. 从0到1手写一个打包工具
4. webpack在使用过程中常见的坑

webpack是如何运行的？
const index = require('./index');
const console = require('./console');

//index.js
const axios = require('./scripts/debounce.js'');
const moment = require('moment');
// do something
复制代码
webpack会解析所有模块，如果模块中有依赖其他文件，那就继续解析依赖的模块。直到文件没有依赖为止。
解析结束后，webpack会把所有模块封装在一个函数里，并放入一个名为modules的数组里。
将modules传入一个自执行函数中，自执行函数包含一个installedModules对象，已经执行的代码模块会保存在此对象中。
最后自执行函数中加载函数（webpack__require）载入模块。
 
在实现之前我们先来了解以下webpack的打包流程：
初始化配置对象，创建compiler对象
实例化插件，调用插件的apply方法，挂载插件的监听
从入口文件执行编译，按照文件类型调用相应的loader，在合适的时间调用plugin执行，并查找各个模块的依赖
将编译后的代码组装成一个个代码块（chunk），并安依赖和配置确定输出内容
根据output把文件输出到对象的目录下

 
tapable在webpack主流程中的应用(https://hellogithub2014.github.io/2018/12/26/tapable-usage-in-webpack-main-procedure/)
WebPack 如何控制事件执行流 | webpack系列之二Tapable
https://mp.weixin.qq.com/s?__biz=MzI1NDA3NzY4NA==&mid=2247485620&idx=3&sn=632127342fe5b1e9a3dd9a298b2b4644&scene=21#wechat_redirect
http://wushaobin.top/2019/02/12/webpackPrinciple/
http://wushaobin.top/2019/02/17/webpackPrinciple1/
https://github.com/lihongxun945/diving-into-webpack
webpack处理流程
https://github.com/lihongxun945/diving-into-webpack/blob/master/6-process-pipe-line.md
webpack源码执行过程分析，loaders+plugin
 https://juejin.im/post/5cec9060f265da1ba431cd55
 webpack原理
https://juejin.im/post/5d99a8265188254d014e364e

webpack运行原理
https://juejin.im/post/5badd0c5e51d450e4437f07a
https://juejin.im/post/5eae43f85188256d841a3b8b
 
 
https://juejin.im/post/5e04c935e51d4557ea02c097
webpack打包过程：
利用babel完成代码转换,并生成单个文件的依赖
从入口开始递归分析，并生成依赖图谱
将各个引用模块打包为一个立即执行函数
将最终的bundle文件写入bundle.js中
理解webpack原理，手写一个100行的webpack
https://zhuanlan.zhihu.com/p/58151131
webpack 源码分析 五： bundle.js 内容分析
https://github.com/lihongxun945/diving-into-webpack/blob/master/5-bundle.js.md
webpack源码执行过程：https://juejin.im/post/5cec9060f265da1ba431cd55
webapck 4源码解析
https://juejin.im/post/5c1859745188254fef232ead




https://juejin.im/post/5980752ef265da3e2e56e82e#heading-5
https://zhuanlan.zhihu.com/p/93457935

