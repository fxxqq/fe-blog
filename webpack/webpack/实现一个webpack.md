从 0 开始实践一个 Webpack 的雏形，能够让大家更加深入了解 Webpack

1. 定义 Compiler 类

```js
class Compiler {
  constructor(options) {
    // webpack 配置
    const { entry, output } = options // 入口
    this.entry = entry // 出口
    this.output = output // 模块
    this.modules = []
  } // 构建启动
  run() {} // 重写 require函数,输出bundle
  generate() {}
}
```

2. 解析入口文件,获取 AST

   我们这里使用@babel/parser,这是 babel7 的工具,来帮助我们分析内部的语法,包括 es6,返回一个 AST 抽象语法树。
