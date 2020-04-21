class MyWebpackPlugin {
  constructor(options) {}

  apply(compiler) {
    console.log("compiler=>", compiler)

    // 在emit阶段插入钩子函数
    compiler.hooks.emit.tap('MyWebpackPlugin', (compilation) => {
      // console.log("compilation=>", compilation)

    });
  }
}

module.exports = MyWebpackPlugin;