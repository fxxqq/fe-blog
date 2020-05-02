class MyWebpackPlugin {
  constructor(options) {}

  apply(compiler) {
    compiler.hooks.emit.tapAsync('MyWebpackPlugin', (compilation, callback) => {
      // compilation.chunks存放了代码块列表
      compilation.chunks.forEach(chunk => {
        // chunk包含多个模块，通过chunk.modulesIterable可以遍历模块列表
        for (const module of chunk.modulesIterable) {
          // module包含多个依赖，通过module.dependencies进行遍历
          module.dependencies.forEach(dependency => {
            // console.log(dependency);
          });
        }
      });
      // 修改或添加资源
      compilation.assets['new-file.js'] = {
        source() {
          return 'var a=1';
        },
        size() {
          return this.source().length;
        }
      };
      callback();
    });
  }
}

module.exports = MyWebpackPlugin;