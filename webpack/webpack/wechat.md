https://juejin.im/post/5beb8875e51d455e5c4dd83f
https://kaiwu.lagou.com/course/courseInfo.htm?courseId=88
https://juejin.im/post/5980752ef265da3e2e56e82e#heading-5
https://github.com/impeiran/Blog/issues/6
https://mp.weixin.qq.com/s/hgnfXJsdWzX4K0I4ucYFsg
https://mp.weixin.qq.com/s/U9HZMk0ndeX9Git08pEqdQ
https://mp.weixin.qq.com/s/HrrtPcyfSSUYMI3tBWlRyw
https://mp.weixin.qq.com/s/Kv65QdQjoIHeoGAHMmyFYA
https://mp.weixin.qq.com/s/o6Punw1s4ApfwiI1c5QgVg
https://blog.didiyun.com/index.php/2019/03/01/webpack/
https://juejin.im/post/5da56e34f265da5b932e73fa
https://zhuanlan.zhihu.com/p/76969308
https://zhuanlan.zhihu.com/p/79530871
https://mp.weixin.qq.com/s/WXUW4bS4nT90uycodN0avw
https://mp.weixin.qq.com/s/eUJOrII_XKtV8GE6TpHQPA
https://zhuanlan.zhihu.com/p/93457935
https://mp.weixin.qq.com/s/Ct_0KdSJyA1zEBpiqzVq0g
https://mp.weixin.qq.com/s/Hx8AhrRP4IOCR1wNmLYVOg
https://mp.weixin.qq.com/s/T6CUQhS2ukrlB3lulu0bgw
https://mp.weixin.qq.com/s/uTAJZoqFFDn5cfkwcYr11Q
https://mp.weixin.qq.com/s/2h2dqGGEWTts7KQagGWEAg
https://mp.weixin.qq.com/s/Rn7UTDKnwSnT5Tzy07-ewQ
https://mp.weixin.qq.com/s/FWxJvuDLp8JBnY911jtzXQ
https://mp.weixin.qq.com/s/JpYUaJc41bKlU0ZrMx32Wg
https://mp.weixin.qq.com/s/H9_XNb--4fDLSjxbygxaZA
https://mp.weixin.qq.com/s/NpCnIQPY9b1emFEBETiodg
https://mp.weixin.qq.com/s/TYpRQEToQNz8vPWiltcW0w
https://mp.weixin.qq.com/s/u7AmDctrL2_OPmG1BU6OcA
https://mp.weixin.qq.com/s/KYt2UrRNVvcTvy2pXAluiw
https://github.com/JinJieTan/mini-webpack
https://mp.weixin.qq.com/s/OXIye4ZdhnpO-JACwHbBxA
https://mp.weixin.qq.com/s/6j64-EH2TQLmaBsMSfU8RA
https://mp.weixin.qq.com/s/9lP2xLp9kW3T7JaUSEAXBg
https://mp.weixin.qq.com/s/l26L5A1U93Xr_khT8dDjZA
https://mp.weixin.qq.com/s/PK0xqXB0gLmq6Qk67KjZ6A
https://mp.weixin.qq.com/s/1FySzmVrNjS6wjgqALC96g
https://mp.weixin.qq.com/s/mlwRVa2PGKjugPZpURUlyw
https://mp.weixin.qq.com/s/LcjnZQUQybwpTPjeZ4-V9g
https://mp.weixin.qq.com/s/AYPJcHohNCWgPgfcfSgQKA
https://mp.weixin.qq.com/s/wEAXLtIpE9AN7ZyCjnfBEg
https://mp.weixin.qq.com/s/jrfJX7MH7caJVnJSXzNhyw
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

作者：Kev1nzh
链接：https://juejin.im/post/5cb58fb6f265da03452bd070
来源：掘金
著作权归作者所有。商业转载请联系作者获得授权，非商业转载请注明出处。
https://mp.weixin.qq.com/s/CBrF4Bm8m0yDJ4J0FYq9ug
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
Webpack中的HMR原理
https://juejin.im/post/5d4d3e5ce51d4561f64a07d1
webpack运行原理
https://juejin.im/post/5badd0c5e51d450e4437f07a
https://juejin.im/post/5eae43f85188256d841a3b8b
 
作者：cAuth
链接：https://juejin.im/post/5cca59c4f265da038d0b5348
来源：掘金
著作权归作者所有。商业转载请联系作者获得授权，非商业转载请注明出处。
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

