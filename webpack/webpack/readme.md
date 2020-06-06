
## Webpack 与模块化开发

Webpack 背景介绍：包括模块化所解决的问题、模块化标准的演进过程、ES Modules 标准规范。希望你通过这个模块，能够了解 Webpack 这类工具解决的到底是什么问题。

模块化以及它的发展过程

Webpack 核心特性：包括基本特性、配置方式、工作模式、基本工作原理、Loader 机制、插件机制。希望你学习完这个模块，能够完全掌握 Webpack 的基本使用，理解 Webpack 打包过程和打包结果的工作原理，同时也能够自己开发 Webpack 的 Loader 和插件。

Webpack 高阶内容：包括 Source Map、模块热替换（HMR）机制、Proxy、Webpack Dev Server 等周边技能的使用，以及 Tree-shaking、sideEffects、Code Spliting 等高级特性的实践，再有就是常用优化插件、三种 hash 的最佳实践、打包速度优化，以更于你能更熟练地使用 Webpack 的高级特性，为开发效率添砖加瓦。

webpack 对比 rollup


webpack是如何运行的？
webpack会解析所有模块，利用babel完成代码转换,并生成单个文件的依赖，如果模块中有依赖其他文件，那就继续解析依赖的模块。直到文件没有依赖为止。
解析结束后，webpack会把所有模块封装在一个函数里，并放入一个名为modules的数组里。
将modules传入一个自执行函数中，自执行函数包含一个installedModules对象，已经执行的代码模块会保存在此对象中。
最后自执行函数中加载函数（webpack__require）载入模块。
 
在实现之前我们先来了解以下webpack的打包流程：
初始化配置对象，创建compiler对象
实例化插件，调用插件的apply方法，挂载插件的监听
从入口文件执行编译，按照文件类型调用相应的loader，在合适的时间调用plugin执行，并查找各个模块的依赖
将编译后的代码组装成一个个代码块（chunk），并安依赖和配置确定输出内容
根据output把文件输出到对象的目录下



 
