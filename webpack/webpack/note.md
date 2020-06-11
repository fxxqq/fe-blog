https://github.com/impeiran/Blog/issues/6

先来看一下 webpack 打包好的代码是什么样子的。

### webpack 打包文件分析

未压缩的 bundle.js 文件结构一般如下：

```js
;(function (modules) {
  // webpackBootstrap
  // 缓存 __webpack_require__ 函数加载过的模块，提升性能
  var installedModules = {}

  /**
   * Webpack 加载函数，用来加载 webpack 定义的模块
   * @param {String} moduleId 模块 ID，一般为模块的源码路径，如 "./src/index.js"
   * @returns {Object} exports 导出对象
   */
  function __webpack_require__(moduleId) {
    // 重复加载则利用缓存，有则直接从缓存中取得
    if (installedModules[moduleId]) {
      return installedModules[moduleId].exports
    }
    // 如果是第一次加载，则初始化模块对象，并缓存
    var module = (installedModules[moduleId] = {
      i: moduleId,
      l: false,
      exports: {},
    })

    // 把要加载的模块内容，挂载到module.exports上
    modules[moduleId].call(
      module.exports,
      module,
      module.exports,
      __webpack_require__
    )
    module.l = true // 标记为已加载

    // 返回加载的模块，调用方直接调用即可
    return module.exports
  }
  // 在 __webpack_require__ 函数对象上挂载一些变量及函数 ...

  // __webpack_require__对象下的r函数
  // 在module.exports上定义__esModule为true，表明是一个模块对象
  __webpack_require__.r = function (exports) {
    Object.defineProperty(exports, '__esModule', { value: true })
  }

  //  从入口文件开始执行
  return __webpack_require__((__webpack_require__.s = './src/index.js'))
})({
  /* modules */
  './src/moduleA.js': function (
    module,
    __webpack_exports__,
    __webpack_require__
  ) {
    eval(
      'let b = __webpack_require__(/*! ./base/b.js */ "./src/base/b.js");\r\n\r\nmodule.exports = \'a\' + b;\r\n\r\n\r\n\r\n\n\n//# sourceURL=webpack:///./src/a.js?'
    )
  },
  './src/moduleB.js': function (
    module,
    __webpack_exports__,
    __webpack_require__
  ) {
    eval("module.exports = 'b'\n\n//# sourceURL=webpack:///./src/base/b.js?")
  },
  './src/index.js': function (module, exports, __webpack_require__) {
    eval(
      'let str = __webpack_require__(/*! ./a.js */ "./src/a.js")\r\n\r\nconsole.log(str)\n\n//# sourceURL=webpack:///./src/index.js?'
    )
  },
})
```

那么我们可以看到，生成的 bundle.js 其实主要做了两件事：

1. 定义一个模块加载函数 webpack_require。
   把代码都缓存在 installedModules ⾥，代码⽂件以对象传递进来，key 是路径，value 是包裹的代码字符串，并且代码内部的 require，都被替换
   成了 webpack_require
2. 使用加载函数加载入口模块 "./src/index.js"。

### 简单了解 Webpack 整体运行流程

1. 读取参数
2. 实例化 Compiler
3. entryOption 阶段
4. Loader 编译对应文件
5. 找到对应依赖，递归编译处理
6. 输出到 dist

### 命令行输入 webpack 的时候都发生了什么？

P.S. 以下的源码流程分析都基于 webpack 4.4.1

##### 初始化阶段

1. 初始化参数（webpack.config.js+shell options）

./node_modules/.bin/webpack
./node_modules/webpack/bin/webpack.js
追加 shell 命令的参数，如-p , -w，通过 yargs 解析命令行参数
convert-yargs 把命令行参数转换成 Webpack 的配置选项对象
同时实例化插件 new Plugin()

2. 实例化 Compiler

[阅读完整源码点击这里：webpack.js](https://github.com/webpack/webpack/blob/d6e8e479bce9ed34827e08850764bfb225947f85/lib/webpack.js#L39)

```js
// webpack入口
const webpack = (options, callback) => {
  let compiler
  // 实例Compiler
  if (Array.isArray(options)) {
    // ...
    compiler = createMultiCompiler(options)
  } else {
    compiler = createCompiler(options)
  }
  // ...
  // 若options.watch === true && callback 则开启watch线程
  compiler.watch(watchOptions, callback)
  compiler.run(callback)
  return compiler
}
```

webpack 打包离不开 Compiler 和 Compilation,它们两个分工明确，理解它们是我们理清 webpack 构建流程重要的一步。

Compiler 负责监听文件和启动编译
它可以读取到 webpack 的 config 信息，整个 Webpack 从启动到关闭的生命周期，一般只有一个 Compiler 实例，整个生命周期里暴露了很多方法，常见的 run,make,compile,finish,seal,emit 等，我们写的插件就是作用在这些暴露方法的 hook 上

Compilation 负责构建编译。
每一次编译（文件只要发生变化，）就会生成一个 Compilation 实例，Compilation 可以读取到当前的模块资源，编译生成资源，变化的文件，以及依赖跟踪等状态信息。同时也提供很多事件回调给插件进行拓展。

webpack 的入口文件其实就实例了 `Compiler` 并调用了 `run` 方法开启了编译,
webpack 的编译都按照下面的钩子调用顺序执行。
before-run 清除缓存
run 注册缓存数据钩子
before-compile
compile 开始编译
make 从入口分析依赖以及间接依赖模块，创建模块对象
build-module 模块构建
seal 构建结果封装， 不可再更改
after-compile 完成构建，缓存数据
emit 输出到 dist 目录

3. 注册 NOdeEnvironmentPlugin 插件

在此期间会 apply 所有 webpack 内置的插件,为 webpack 事件流挂上自定义钩子

源码仍然在[webpack.js](https://github.com/webpack/webpack/blob/d6e8e479bce9ed34827e08850764bfb225947f85/lib/webpack.js#L39)文件

```js
const createCompiler = (rawOptions) => {
  // ...省略代码
  const compiler = new Compiler(options.context)
  compiler.options = options
  //应用Node的文件系统到compiler对象，方便后续的文件查找和读取
  new NodeEnvironmentPlugin({
    infrastructureLogging: options.infrastructureLogging,
  }).apply(compiler)
  // 加载插件
  if (Array.isArray(options.plugins)) {
    for (const plugin of options.plugins) {
      //  依次调用插件的apply方法（默认每个插件对象实例都需要提供一个apply）若为函数则直接调用，将compiler实例作为参数传入，方便插件调用此次构建提供的Webpack API并监听后续的所有事件Hook。
      if (typeof plugin === 'function') {
        plugin.call(compiler, compiler)
      } else {
        plugin.apply(compiler)
      }
    }
  }
  // 应用默认的Webpack配置
  applyWebpackOptionsDefaults(options)
  // 随即之后，触发一些Hook
  compiler.hooks.environment.call()
  compiler.hooks.afterEnvironment.call()
  //创建内置插件
  new WebpackOptionsApply().process(options, compiler)
  compiler.hooks.initialize.call()
  return compiler
}
```

### 编译阶段

##### 启动编译

这里有个小逻辑区分是否是 watch，如果是非 watch，则会正常执行一次 compiler.run()。

如果是监听文件（如：--watch）的模式，则会传递监听的 watchOptions，生成 Watching 实例，每次变化都重新触发回调。

```js
function watch(watchOptions, handler) {
  if (this.running) {
    return handler(new ConcurrentCompilationError())
  }

  this.running = true
  this.watchMode = true
  return new Watching(this, watchOptions, handler)
}
```

如果不是监视模式就调用 Compiler 对象的 run 方法，开始构建整个应用。

<details>

    <summary>点击展开源码</summary>ƒ

```js
run(callback) {
  // ...
  this.hooks.beforeRun.callAsync(this, (err) => {
    this.hooks.run.callAsync(this, (err) => {
      this.readRecords((err) => {
        this.compile(onCompiled)
      })
    })
  })
}
compile(){
  this.hooks.beforeCompile.callAsync(params, err => {
      this.hooks.compile.call(params);
      const compilation = this.newCompilation(params);
      //触发make事件并调用addEntry，找到入口js，进行下一步
      this.hooks.make.callAsync(compilation, err => {
        process.nextTick(() => {
          compilation.finish(err => {
            // 封装构建结果（seal），逐次对每个module和chunk进行整理，每个chunk对应一个入口文件
            compilation.seal(err => {
              this.hooks.afterCompile.callAsync(compilation, err => {
                // 异步的事件需要在插件处理完任务时调用回调函数通知 Webpack 进入下一个流程，
                // 不然运行流程将会一直卡在这不往下执行
                return callback(null, compilation);
              });
            });
          });
        });
      });
    });
}

```

</details>

##### 编译模块：(make 阶段)

- 从 entry 入口配置文件出发, 调用所有配置的 Loader 对模块进行处理,
- 再找出该模块依赖的模块, 通过 acorn 库生成模块代码的 AST 语法树，形成依赖关系树（每个模块被处理后的最终内容以及它们之间的依赖关系），
- 根据语法树分析这个模块是否还有依赖的模块，如果有则继续循环每个依赖；再递归本步骤直到所有入口依赖的文件都经过了对应的 loader 处理。

<details>

    <summary>点击展开源码</summary>

```js
class Compilation extends Tapable {
    constructor(compiler) {
        super();
        this.hooks = {};
        // ...
        this.compiler = compiler;
        // ...
        // 构建生成的资源
        this.chunks = [];
        this.chunkGroups = [];
        this.modules = [];
        this.additionalChunkAssets = [];
        this.assets = {};
        this.children = [];
        // ...
    }
    //
    buildModule(module, optional, origin, dependencies, thisCallback) {
        // ...
        // 调用module.build方法进行编译代码，build中 其实是利用acorn编译生成AST
        this.hooks.buildModule.call(module);
        module.build( /**param*/ );
    }
    // 将模块添加到列表中，并编译模块
    _addModuleChain(context, dependency, onModule, callback) {
        // ...
        // moduleFactory.create创建模块，这里会先利用loader处理文件，然后生成模块对象
        moduleFactory.create({
                contextInfo: {
                    issuer: "",
                    compiler: this.compiler.name
                },
                context: context,
                dependencies: [dependency]
            },
            (err, module) => {
                const addModuleResult = this.addModule(module);
                module = addModuleResult.module;
                onModule(module);
                dependency.module = module;

                // ...
                // 调用buildModule编译模块
                this.buildModule(module, false, null, null, err => {});
            }
        });
}
// 添加入口模块，开始编译&构建
addEntry(context, entry, name, callback) {
    // ...
    this._addModuleChain( // 调用_addModuleChain添加模块
        context,
        entry,
        module => {
            this.entries.push(module);
        },
        // ...
    );
}
seal(callback) {
    this.hooks.seal.call();

    // ...
    const chunk = this.addChunk(name);
    const entrypoint = new Entrypoint(name);
    entrypoint.setRuntimeChunk(chunk);
    entrypoint.addOrigin(null, name, preparedEntrypoint.request);
    this.namedChunkGroups.set(name, entrypoint);
    this.entrypoints.set(name, entrypoint);
    this.chunkGroups.push(entrypoint);

    GraphHelpers.connectChunkGroupAndChunk(entrypoint, chunk);
    GraphHelpers.connectChunkAndModule(chunk, module);

    chunk.entryModule = module;
    chunk.name = name;

    // ...
    this.hooks.beforeHash.call();
    this.createHash();
    this.hooks.afterHash.call();
    this.hooks.beforeModuleAssets.call();
    this.createModuleAssets();
    if (this.hooks.shouldGenerateChunkAssets.call() !== false) {
        this.hooks.beforeChunkAssets.call();
        this.createChunkAssets();
    }
    // ...
}

createHash() {
    // ...
}

// 生成 assets 资源并 保存到 Compilation.assets 中 给webpack写插件的时候会用到
createModuleAssets() {
    for (let i = 0; i < this.modules.length; i++) {
        const module = this.modules[i];
        if (module.buildInfo.assets) {
            for (const assetName of Object.keys(module.buildInfo.assets)) {
                const fileName = this.getPath(assetName);
                this.assets[fileName] = module.buildInfo.assets[assetName];
                this.hooks.moduleAsset.call(module, fileName);
            }
        }
    }
}

createChunkAssets() {
    // ...
}
}
```

</details>

概括一下 make 阶段单入口打包的流程，大致为 4 步骤

1. 执行 SingleEntryPlugin，SingleEntryPlugin 中调用了 Compilation.addEntry 方法，添加入口模块，开始编译&构建
2. addEntry 中调用 `_addModuleChain`,将模块添加到依赖列表中，并编译模块
3. buildModule 方法中，执行 Loader，利用 acorn 编译生成 AST
4. 分析文件的依赖关系逐个拉取依赖模块并重复上述过程，最后将所有模块中的 require 语法替换成**webpack_require**来模拟模块化操作。

### 完成编译

##### 输出资源：

根据入口和模块之间的依赖关系, 组装成一个个包含多个模块的 Chunk,
在 seal 执行后，便会调用 emit 钩子，根据 webpack config 文件的 output 配置的 path 属性，将文件输出到指定的 path.

##### 输出完成：

done 成功完成一次完成的编译和输出流程。
failed 编译失败，可以在本事件中获取到具体的错误原因
在确定好输出内容后, 根据配置确定输出的路径和文件名, 把文件内容写入到文件系统。