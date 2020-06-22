### 简单概述 Webpack 整体运行流程

1. 读取参数
2. 实例化 `Compiler`
3. `entryOption` 阶段，读取入口文件
4. `Loader` 编译对应文件，解析成 `AST`
5. 找到对应依赖，递归编译处理，生成 `chunk`
6. 输出到 `dist`

### webpack 打包主流程源码阅读

通过打断点的方式阅读源码,来看一下命令行输入 webpack 的时候都发生了什么？
P.S. 以下的源码流程分析都基于 `webpack4`

先附上一张自己绘制的执行流程图
![webpack4 执行流程图](https://cdn.6fed.com/github/webpack/webpack/webpack-process.png)

#### 初始化阶段

1. 初始化参数（`webpack.config.js+shell options`）

`webpack` 的几种启动方式

- 通过 `webpack-cli`执行 会走到 `./node_modules/.bin/webpack-cli`（执行）
- 通过 `shell` 执行`webpack` ，会走到 `./bin/webpack.js`
- 通过 `require("webpack")`执行 会走到 `./node_modules/webpack/lib/webpack.js`

追加 `shell` 命令的参数，如`-p , -w，`通过 `yargs` 解析命令行参数
`convert-yargs` 把命令行参数转换成 Webpack 的配置选项对象
同时实例化插件 `new Plugin()`

2. 实例化 `Compiler`

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
  if (watch) {
    compiler.watch(watchOptions, callback)
  } else {
    compiler.run((err, stats) => {
      compiler.close((err2) => {
        callback(err || err2, stats)
      })
    })
  }
  return compiler
}
```

webpack 的入口文件其实就实例了 `Compiler` 并调用了 `run` 方法开启了编译,

3. 注册 `NodeEnvironmentPlugin` 插件，挂载 plugin 插件，使用 WebpackOptionsApply 初始化基础插件

在此期间会 `apply` 所有 `webpack` 内置的插件,为 `webpack` 事件流挂上自定义钩子

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
  // 内置的Plugin的引入，对webpack options进行初始化
  new WebpackOptionsApply().process(options, compiler)
  compiler.hooks.initialize.call()
  return compiler
}
```

#### 编译阶段

1. 启动编译（`run/watch` 阶段）

这里有个小逻辑区分是否是 `watch`，如果是非 `watch`，则会正常执行一次 `compiler.run()`。

如果是监听文件（如：`--watch`）的模式，则会传递监听的 `watchOptions`，生成 `Watching` 实例，每次变化都重新触发回调。

如果不是监视模式就调用 `Compiler` 对象的 `run` 方法，`befornRun->beforeCompile->compile->thisCompilation->compilation`开始构建整个应用。

```js
const { SyncHook, SyncBailHook, AsyncSeriesHook } = require('tapable')
class Compiler {
  constructor() {
    // 1. 定义生命周期钩子
    this.hooks = Object.freeze({
      // ...只列举几个常用的常见钩子，更多hook就不列举了，有兴趣看源码
      done: new AsyncSeriesHook(['stats']), //一次编译完成后执行，回调参数：stats
      beforeRun: new AsyncSeriesHook(['compiler']),
      run: new AsyncSeriesHook(['compiler']), //在编译器开始读取记录前执行
      emit: new AsyncSeriesHook(['compilation']), //在生成文件到output目录之前执行，回调参数： compilation
      afterEmit: new AsyncSeriesHook(['compilation']), //在生成文件到output目录之后执行
      compilation: new SyncHook(['compilation', 'params']), //在一次compilation创建后执行插件
      beforeCompile: new AsyncSeriesHook(['params']),
      compile: new SyncHook(['params']), //在一个新的compilation创建之前执行
      make: new AsyncParallelHook(['compilation']), //完成一次编译之前执行
      afterCompile: new AsyncSeriesHook(['compilation']),
      watchRun: new AsyncSeriesHook(['compiler']),
      failed: new SyncHook(['error']),
      watchClose: new SyncHook([]),
      afterPlugins: new SyncHook(['compiler']),
      entryOption: new SyncBailHook(['context', 'entry']),
    })
    // ...省略代码
  }
  newCompilation() {
    // 创建Compilation对象回调compilation相关钩子
    const compilation = new Compilation(this)
    //...一系列操作
    this.hooks.compilation.call(compilation, params) //compilation对象创建完成
    return compilation
  }
  watch() {
    //如果运行在watch模式则执行watch方法，否则执行run方法
    if (this.running) {
      return handler(new ConcurrentCompilationError())
    }
    this.running = true
    this.watchMode = true
    return new Watching(this, watchOptions, handler)
  }
  run(callback) {
    if (this.running) {
      return callback(new ConcurrentCompilationError())
    }
    this.running = true
    process.nextTick(() => {
      this.emitAssets(compilation, (err) => {
        if (err) {
          // 在编译和输出的流程中遇到异常时，会触发 failed 事件
          this.hooks.failed.call(err)
        }
        if (compilation.hooks.needAdditionalPass.call()) {
          // ...
          // done：完成编译
          this.hooks.done.callAsync(stats, (err) => {
            // 创建compilation对象之前
            this.compile(onCompiled)
          })
        }
        this.emitRecords((err) => {
          this.hooks.done.callAsync(stats, (err) => {})
        })
      })
    })

    this.hooks.beforeRun.callAsync(this, (err) => {
      this.hooks.run.callAsync(this, (err) => {
        this.readRecords((err) => {
          this.compile(onCompiled)
        })
      })
    })
  }
  compile(callback) {
    const params = this.newCompilationParams()
    this.hooks.beforeCompile.callAsync(params, (err) => {
      this.hooks.compile.call(params)
      //已完成complication的实例化
      const compilation = this.newCompilation(params)
      //触发make事件并调用addEntry，找到入口js，进行下一步
      // make：表示一个新的complication创建完毕
      this.hooks.make.callAsync(compilation, (err) => {
        process.nextTick(() => {
          compilation.finish((err) => {
            // 封装构建结果（seal），逐次对每个module和chunk进行整理，每个chunk对应一个入口文件
            compilation.seal((err) => {
              this.hooks.afterCompile.callAsync(compilation, (err) => {
                // 异步的事件需要在插件处理完任务时调用回调函数通知 Webpack 进入下一个流程，
                // 不然运行流程将会一直卡在这不往下执行
                return callback(null, compilation)
              })
            })
          })
        })
      })
    })
  }
  emitAssets() {}
}
```

2. 编译模块：(`make` 阶段)

- 从 entry 入口配置文件出发, 调用所有配置的 `Loader` 对模块进行处理,
- 再找出该模块依赖的模块, 通过 `acorn` 库生成模块代码的 `AST` 语法树，形成依赖关系树（每个模块被处理后的最终内容以及它们之间的依赖关系），
- 根据语法树分析这个模块是否还有依赖的模块，如果有则继续循环每个依赖；再递归本步骤直到所有入口依赖的文件都经过了对应的 loader 处理。
- 解析结束后，`webpack` 会把所有模块封装在一个函数里，并放入一个名为 `modules` 的数组里。
- 将 `modules` 传入一个自执行函数中，自执行函数包含一个 `installedModules` 对象，已经执行的代码模块会保存在此对象中。
- 最后自执行函数中加载函数（`webpack__require`）载入模块。

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
		}, (err, module) = > {
			const addModuleResult = this.addModule(module);
			module = addModuleResult.module;
			onModule(module);
			dependency.module = module;

			// ...
			// 调用buildModule编译模块
			this.buildModule(module, false, null, null, err = > {});
		});
	}
	// 添加入口模块，开始编译&构建
	addEntry(context, entry, name, callback) {
		// ...
		this._addModuleChain( // 调用_addModuleChain添加模块
		context, entry, module = > {
			this.entries.push(module);
		},
		// ...
		);
	}
	seal(callback) {
		this.hooks.seal.call();

		// ...
		//完成了Chunk的构建和依赖、Chunk、module等各方面的优化
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
		asyncLib.forEach(
		this.chunks, (chunk, callback) = > {
			// manifest是数组结构，每个manifest元素都提供了 `render` 方法，提供后续的源码字符串生成服务。至于render方法何时初始化的，在`./lib/MainTemplate.js`中
			let manifest = this.getRenderManifest()
			asyncLib.forEach(
			manifest, (fileManifest, callback) = > {...
				source = fileManifest.render()
				this.emitAsset(file, source, assetInfo)
			}, callback)
		}, callback)
	}
}
```

```js
class SingleEntryPlugin {
  apply(compiler) {
    compiler.hooks.compilation.tap(
      'SingleEntryPlugin',
      (compilation, { normalModuleFactory }) => {
        compilation.dependencyFactories.set(
          SingleEntryDependency,
          normalModuleFactory
        )
      }
    )

    compiler.hooks.make.tapAsync(
      'SingleEntryPlugin',
      (compilation, callback) => {
        const { entry, name, context } = this

        const dep = SingleEntryPlugin.createDependency(entry, name)
        compilation.addEntry(context, dep, name, callback)
      }
    )
  }

  static createDependency(entry, name) {
    const dep = new SingleEntryDependency(entry)
    dep.loc = { name }
    return dep
  }
}
```

概括一下 `make` 阶段单入口打包的流程，大致为 4 步骤

1. 执行 `SingleEntryPlugin`(单入口调用 `SingleEntryPlugin`，多入口调用 `MultiEntryPlugin`，异步调用 `DynamicEntryPlugin`)，`EntryPlugin` 方法中调用了 `Compilation.addEntry` 方法，添加入口模块，开始编译&构建
2. `addEntry` 中调用 `_addModuleChain`,将模块添加到依赖列表中，并编译模块
3. 然后在 `buildModule` 方法中，调用了 `NormalModule.build`，创建模块之时，会调用 `runLoaders`，执行 `Loader`，利用 `acorn` 编译生成 `AST`
4. 分析文件的依赖关系逐个拉取依赖模块并重复上述过程，最后将所有模块中的 `require` 语法替换成 `webpack_require` 来模拟模块化操作。

##### 从源码的角度，思考一下， `loader` 为什么是自右向左执行的，`loader` 中有 `pitch` 也会从右到左执行的么？

`runLoaders` 方法调用 `iteratePitchingLoaders` 去递归查找执行有 `pich` 属性的 `loader` ；若存在多个 `pitch` 属性的 `loader` 则依次执行所有带 `pitch` 属性的 `loader` ，执行完后逆向执行所有带 `pitch` 属性的 `normal` 的 `normal loader` 后返回 `result`，没有 `pitch` 属性的 `loader` 就不会再执行；若 `loaders` 中没有 `pitch` 属性的 `loader` 则逆向执行 `loader；执行正常` loader 是在 `iterateNormalLoaders` 方法完成的，处理完所有 `loader` 后返回 `result`。

出自文章[你真的掌握了 loader 么？- loader 十问(https://juejin.im/post/5bc1a73df265da0a8d36b74f)](https://juejin.im/post/5bc1a73df265da0a8d36b74f)

##### Compiler 和 Compilation 的区别

`webpack` 打包离不开 `Compiler` 和 `Compilation`,它们两个分工明确，理解它们是我们理清 `webpack` 构建流程重要的一步。

`Compiler` 负责监听文件和启动编译
它可以读取到 `webpack` 的 config 信息，整个 `Webpack` 从启动到关闭的生命周期，一般只有一个 Compiler 实例，整个生命周期里暴露了很多方法，常见的 `run`,`make`,`compile`,`finish`,`seal`,`emit` 等，我们写的插件就是作用在这些暴露方法的 hook 上

`Compilation` 负责构建编译。
每一次编译（文件只要发生变化，）就会生成一个 `Compilation` 实例，`Compilation` 可以读取到当前的模块资源，编译生成资源，变化的文件，以及依赖跟踪等状态信息。同时也提供很多事件回调给插件进行拓展。

#### 完成编译

1. 输出资源：（seal 阶段）

在编译完成后，调用 `compilation.seal` 方法封闭，生成资源，这些资源保存在 `compilation.assets`, `compilation.chunk`,然后便会调用 `emit` 钩子，根据 `webpack config` 文件的 `output` 配置的 `path` 属性，将文件输出到指定的 `path`.

2. 输出完成：`done/failed` 阶段

`done` 成功完成一次完成的编译和输出流程。
`failed` 编译失败，可以在本事件中获取到具体的错误原因
在确定好输出内容后, 根据配置确定输出的路径和文件名, 把文件内容写入到文件系统。

```js
emitAssets(compilation, callback) {
    const emitFiles = (err) => {
      //...省略一系列代码
      // afterEmit：文件已经写入磁盘完成
      this.hooks.afterEmit.callAsync(compilation, (err) => {
        if (err) return callback(err)
        return callback()
      })
    }

    // emit 事件发生时，可以读取到最终输出的资源、代码块、模块及其依赖，并进行修改(这是最后一次修改最终文件的机会)
    this.hooks.emit.callAsync(compilation, (err) => {
      if (err) return callback(err)
      outputPath = compilation.getPath(this.outputPath, {})
      mkdirp(this.outputFileSystem, outputPath, emitFiles)
    })
  }
```

然后，我们来看一下 webpack 打包好的代码是什么样子的。

### webpack 输出文件代码分析

未压缩的 bundle.js 文件结构一般如下：

```js
;(function (modules) {
  // webpackBootstrap
  // 缓存 __webpack_require__ 函数加载过的模块，提升性能，
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

    // 返回加载的模块，直接调用即可
    return module.exports
  }
  // 在 __webpack_require__ 函数对象上挂载一些变量及函数 ...
  __webpack_require__.m = modules
  __webpack_require__.c = installedModules
  __webpack_require__.d = function (exports, name, getter) {
    if (!__webpack_require__.o(exports, name)) {
      Object.defineProperty(exports, name, {
        enumerable: true,
        get: getter,
      })
    }
  }
  __webpack_require__.n = function (module) {
    var getter =
      module && module.__esModule
        ? function getDefault() {
            return module['default']
          }
        : function getModuleExports() {
            return module
          }
    __webpack_require__.d(getter, 'a', getter)
    return getter
  }
  // __webpack_require__对象下的r函数
  // 在module.exports上定义__esModule为true，表明是一个模块对象
  __webpack_require__.r = function (exports) {
    if (typeof Symbol !== 'undefined' && Symbol.toStringTag) {
      Object.defineProperty(exports, Symbol.toStringTag, {
        value: 'Module',
      })
    }
    Object.defineProperty(exports, '__esModule', {
      value: true,
    })
  }
  __webpack_require__.o = function (object, property) {
    return Object.prototype.hasOwnProperty.call(object, property)
  }
  //  从入口文件开始执行
  return __webpack_require__((__webpack_require__.s = './src/index.js'))
})({
  './src/index.js': function (
    module,
    __webpack_exports__,
    __webpack_require__
  ) {
    'use strict'
    eval(
      '__webpack_require__.r(__webpack_exports__);\n/* harmony import */ var _moduleA__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./moduleA */ "./src/moduleA.js");\n/* harmony import */ var _moduleA__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_moduleA__WEBPACK_IMPORTED_MODULE_0__);\n/* harmony import */ var _moduleB__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./moduleB */ "./src/moduleB.js");\n/* harmony import */ var _moduleB__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(_moduleB__WEBPACK_IMPORTED_MODULE_1__);\n\n\n\n//# sourceURL=webpack:///./src/index.js?'
    )
  },
  './src/moduleA.js': function (module, exports) {
    eval('console.log("moduleA")\n\n//# sourceURL=webpack:///./src/moduleA.js?')
  },
  './src/moduleB.js': function (module, exports) {
    // 代码字符串可以通过eval 函数运行
    eval('console.log("moduleB")\n\n//# sourceURL=webpack:///./src/moduleB.js?')
  },
})
```

上述代码的实现了⼀个 `webpack_require` 来实现⾃⼰的模块化把代码都缓存在 `installedModules` ⾥，代码⽂件以对象传递进来，`key` 是路径，`value` 是包裹的代码字符串，并且代码内部的 `require`，都被替换成了 `webpack_require`,代码字符串可以通过 eval 函数去执行。

`bundle.js` 能直接运行在浏览器中的原因在于输出的文件中通过 **webpack_require** 函数定义了一个可以在浏览器中执行的加载函数来模拟 `Node.js` 中的 `require` 语句。

总结一下，生成的 `bundle.js`只包含一个立即调用函数（IIFE），这个函数会接受一个对象为参数，它其实主要做了两件事：

1. 定义一个模块加载函数 `webpack_require。`

2. 使用加载函数加载入口模块 `"./src/index.js"`，从入口文件开始递归解析依赖，在解析的过程中，分别对不同的模块进行处理，返回模块的 `exports`。

所以我们只需要实现 2 个功能就可以实现一个简单的仿 `webpack` 打包 `js` 的编译工具

1. 从入口开始递归分析依赖
2. 借助依赖图谱来生成真正能在浏览器上运行的代码

### 实现一个简单的 webpack

接下来从 0 开始实践一个 `Webpack` 的雏形，能够让大家更加深入了解 `Webpack`

```js
const fs = require('fs')
const path = require('path')
const parser = require('@babel/parser') //解析成ast
const traverse = require('@babel/traverse').default //遍历ast
const { transformFromAst } = require('@babel/core') //ES6转换ES5
module.exports = class Webpack {
  constructor(options) {
    const { entry, output } = options
    this.entry = entry
    this.output = output
    this.modulesArr = []
  }
  run() {
    const info = this.build(this.entry)
    this.modulesArr.push(info)
    for (let i = 0; i < this.modulesArr.length; i++) {
      // 判断有依赖对象,递归解析所有依赖项
      const item = this.modulesArr[i]
      const { dependencies } = item
      if (dependencies) {
        for (let j in dependencies) {
          this.modulesArr.push(this.build(dependencies[j]))
        }
      }
    }
    //数组结构转换
    const obj = {}
    this.modulesArr.forEach((item) => {
      obj[item.entryFile] = {
        dependencies: item.dependencies,
        code: item.code,
      }
    })
    this.emitFile(obj)
  }
  build(entryFile) {
    const conts = fs.readFileSync(entryFile, 'utf-8')
    const ast = parser.parse(conts, {
      sourceType: 'module',
    })
    //  console.log(ast)
    // 遍历所有的 import 模块,存入dependecies
    const dependencies = {}
    traverse(ast, {
      //  类型为 ImportDeclaration 的 AST 节点，
      // 其实就是我们的 import xxx from xxxx
      ImportDeclaration({ node }) {
        const newPath =
          './' + path.join(path.dirname(entryFile), node.source.value)
        dependencies[node.source.value] = newPath
        // console.log(dependencies)
      },
    })
    // 将转化后 ast 的代码重新转化成代码
    // 并通过配置 @babel/preset-env 预置插件编译成 es5
    const { code } = transformFromAst(ast, null, {
      presets: ['@babel/preset-env'],
    })
    return {
      entryFile,
      dependencies,
      code,
    }
  }
  emitFile(code) {
    //生成bundle.js
    const filePath = path.join(this.output.path, this.output.filename)
    const newCode = JSON.stringify(code)
    const bundle = `(function(modules){
           // moduleId 为传入的 filename ，即模块的唯一标识符
            function require(moduleId){
                function localRequire(relativePath){
                   return require(modules[moduleId].dependencies[relativePath]) 
                }
                var exports = {};
                (function(require,exports,code){
                    eval(code)
                })(localRequire,exports,modules[moduleId].code)
                return exports;
            }
            require('${this.entry}')
        })(${newCode})`
    fs.writeFileSync(filePath, bundle, 'utf-8')
  }
}
```

调用

```js
let path = require('path')
let { resolve } = path
let webpackConfig = require(path.resolve('webpack.config.js'))
let Webpack = require('./myWebpack.js')

const defaultConfig = {
  entry: 'src/index.js',
  output: {
    path: resolve(__dirname, '../dist'),
    filename: 'bundle.js',
  },
}
const config = {
  ...defaultConfig,
  ...webpackConfig,
}

const options = require('./webpack.config')
new Webpack(options).run()
```

输入到浏览器看一下执行结果
![my-webpack执行结果](https://cdn.6fed.com/github/webpack/webpack/my-webpack-done.jpg)

参考：

1. [快狗打车：实现一个简单的 `webpack`](https://juejin.im/post/5e0d52716fb9a047f0002407)
2. [`tapable` 详解+`webpack` 流程](https://juejin.im/post/5beb8875e51d455e5c4dd83f#heading-5)
3. [本文调试以及打断点用到的源码](https://github.com/6fedcom/fe-blog/tree/master/webpack/webpack)
