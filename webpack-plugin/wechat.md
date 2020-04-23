1. 手把手用代码教你实现一个 webpack plugin https://mp.weixin.qq.com/s/x0KQ7yvvyiztoIjkBFDphA
2. Webpack4不求人(5)——编写自定义插件 https://mp.weixin.qq.com/s/ltm64e9TTkux8WmXP4FMKQ
3. 【Webpack】513- Webpack 插件开发如此简单！https://mp.weixin.qq.com/s/LTAlkoyS3C2yiLkFriu-Cw

在编写插件之前，还需要了解一下Webpack的构建流程，以便在合适的时机插入合适的插件逻辑。Webpack的基本构建流程如下：

1. 校验配置文件
2. 生成Compiler对象
3. 初始化默认插件
4. run/watch：如果运行在watch模式则执行watch方法，否则执行run方法
5. compilation：创建Compilation对象回调compilation相关钩子
6. emit：文件内容准备完成，准备生成文件，这是最后一次修改最终文件的机会
7. afterEmit：文件已经写入磁盘完成
8. done：完成编译

4. Webpack 插件开发实战 :https://mp.weixin.qq.com/s/DWDY62lZzvlGhEbu-0-_Og
5. 手把手用代码教你实现一个 webpack plugin https://mp.weixin.qq.com/s/x0KQ7yvvyiztoIjkBFDphA
6. webpack学习笔记（原理，实现loader和插件） https://mp.weixin.qq.com/s/CBrF4Bm8m0yDJ4J0FYq9ug
7. webpack 插件机制分析及开发调试 https://mp.weixin.qq.com/s/JSn23OsWz7BYptnb0MTrAQ
8. webpack原理解析（三）plugin机制 :https://juejin.im/post/5e72def0f265da573c0c987f
9. Webpack学习－Plugin :http://wushaobin.top/2019/03/15/webpackPlugin/
10. 关于Webpack中Loader与Plugin的实践 https://mp.weixin.qq.com/s/Bf2rGFD2oWFeXmNQbXS-LA
11. bundle.js内容分析https://github.com/lihongxun945/diving-into-webpack/blob/master/5-bundle.js.md
12. 如何写一个webpack插件：https://github.com/lcxfs1991/blog/issues/1
13. 从零实现一个 Webpack Pluginhttps://juejin.im/post/5cc6b457518825634d444365
14. webpack插件官网https://webpack.docschina.org/api/compilation/
15. webpack源码执行过程分析，loaders+plugin https://juejin.im/post/5cec9060f265da1ba431cd55
16. webpack原理：https://juejin.im/post/5d99a8265188254d014e364e#heading-5
17. Webpack原理-编写Pluginhttps://juejin.im/post/5a5c18f2518825734f52ad65
18. 编写自定义webpack plugin：https://juejin.im/post/5badd0c5e51d450e4437f07a#heading-18



15.是否写过Plugin？简单描述一下编写Plugin的思路？
webpack在运行的生命周期中会广播出许多事件，Plugin 可以监听这些事件，在特定的阶段钩入想要添加的自定义功能。Webpack 的 Tapable 事件流机制保证了插件的有序性，使得整个系统扩展性良好。
Plugin的API 可以去官网查阅
compiler 暴露了和 Webpack 整个生命周期相关的钩子
compilation 暴露了与模块和依赖有关的粒度更小的事件钩子
插件需要在其原型上绑定apply方法，才能访问 compiler 实例
传给每个插件的 compiler 和 compilation对象都是同一个引用，若在一个插件中修改了它们身上的属性，会影响后面的插件
找出合适的事件点去完成想要的功能
emit 事件发生时，可以读取到最终输出的资源、代码块、模块及其依赖，并进行修改(emit 事件是修改 Webpack 输出资源的最后时机)
watch-run 当依赖的文件发生变化时会触发
异步的事件需要在插件处理完任务时调用回调函数通知 Webpack 进入下一个流程，不然会卡住

开发一个 plugin

Webpack 在编译过程中，会广播很多事件，例如 run、compile、done、fail 等等，可以查看官网；
Webpack 的事件流机制应用了观察者模式，我们编写的插件可以监听 Webpack 事件来触发对应的处理逻辑；
插件中可以使用很多 Webpack 提供的 API，例如读取输出资源、代码块、模块及依赖等；

1、编写插件
在根目录下，新建目录 my-plugin 作为我们编写插件的名称，执行 npm init -y 命令，新建一个模块化项目，然后新建 index.js 文件，相关源码如下：
class MyPlugin {
  constructor(doneCallback, failCallback) {
    // 保存在创建插件实例时传入的回调函数
    this.doneCallback = doneCallback
    this.failCallback = failCallback
  }
  apply(compiler) {
    // 成功完成一次完整的编译和输出流程时，会触发 done 事件
    compiler.plugin('done', stats => {
      this.doneCallback(stats)
    })
    // 在编译和输出的流程中遇到异常时，会触发 failed 事件
    compiler.plugin('failed', err => {
      this.failCallback(err)
    })
  }
}
module.exports = MyPlugin
复制代码2、注册模块
按照以上的方法，我们在 my-plugin 目录底下使用 npm link 做到在不发布模块的情况下，将本地的一个正在开发的模块的源码链接到项目的 node_modules 目录下，让项目可以直接使用本地的 npm 模块。
npm link
复制代码然后在项目根目录执行以下命令，将注册到全局的本地 npm 模块链接到项目的 node_modules 下
$ npm link my-plugin
复制代码注册成功后，我们可以在 node_modules 目录下能查找到对应的插件了。
3、配置插件
在 webpack.base.conf.js 加上如下配置
plugins: [
  new MyPlugin(
    stats => {
      console.info('编译成功!')
    },
    err => {
      console.error('编译失败!')
    }
  )
]
复制代码执行运行 or 编译命令，就能看到我们的 plugin 起作用了。


