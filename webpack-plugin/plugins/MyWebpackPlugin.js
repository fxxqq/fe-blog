// 插件代码
class MyWebpackPlugin {
  constructor(options) {}

  apply(compiler) {
    // 在emit阶段插入钩子函数
    compiler.hooks.emit.tap('MyWebpackPlugin', (compilation) => {

    });
  }
}

module.exports = MyWebpackPlugin;