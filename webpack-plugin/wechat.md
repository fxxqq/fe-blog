1. 手把手用代码教你实现一个 webpack plugin https://mp.weixin.qq.com/s/x0KQ7yvvyiztoIjkBFDphA
已经看完
2. Webpack4不求人(5)——编写自定义插件 https://mp.weixin.qq.com/s/ltm64e9TTkux8WmXP4FMKQ
实现上传七牛云，还需要再看下
3. 【Webpack】513- Webpack 插件开发如此简单！https://mp.weixin.qq.com/s/LTAlkoyS3C2yiLkFriu-Cw

4. Webpack原理-编写Pluginhttps://juejin.im/post/5a5c18f2518825734f52ad65

 
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

18. 编写自定义webpack plugin：https://juejin.im/post/5badd0c5e51d450e4437f07a#heading-18
赋予webpack事件流我们的自定义事件能够实现嘛？


 


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
 


