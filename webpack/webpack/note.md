https://github.com/impeiran/Blog/issues/6

### 分析Tapable插件实现的原理

``` js
const {
    SyncHook
} = require('tapable')
```

### bundle.js 内容如何生成的

未压缩的 bundle.js 文件结构一般如下：

``` js
(function(modules) { // webpackBootstrap
    // 缓存 __webpack_require__ 函数加载过的模块
    var installedModules = {};

    /**
     * Webpack 加载函数，用来加载 webpack 定义的模块
     * @param {String} moduleId 模块 ID，一般为模块的源码路径，如 "./src/index.js"
     * @returns {Object} exports 导出对象
     */
    function __webpack_require__(moduleId) {

        // Check if module is in cache
        if (installedModules[moduleId]) {
            return installedModules[moduleId].exports;
        }
        // Create a new module (and put it into the cache)
        var module = installedModules[moduleId] = {
            i: moduleId,
            l: false,
            exports: {}
        };
    }
    // 在 __webpack_require__ 函数对象上挂载一些变量及函数 ...

    // 传入表达式的值为 "./src/index.js"
    return __webpack_require__(__webpack_require__.s = "./src/index.js");
})( /* modules */ );
```

可以看到其实主要做了两件事：
定义一个模块加载函数 __webpack_require__。
使用加载函数加载入口模块 "./src/index.js"。

### 了解Webpack整体运行流程

读取参数->实例化Compiler->entryOption阶段->Loader编译对应文件->找到对应的依赖，递归编译处理->输出
webpack事件流机制

### 命令行输入webpack的时候都发生了什么？ 

##### 初始化阶段 

1. 初始化参数（webpack.config.js+shell options）

./node_modules/.bin/webpack
./node_modules/webpack/bin/webpack.js
追加shell命令的参数，如-p , -w
同时实例化插件new Plugin()
2. 实例化Compiler

负责监听文件和启动编译，Compiler 代表了整个 Webpack 从启动到关闭的生命周期，一般全局只有一个Compiler实例

``` js
// webpack入口
const webpack = (options, callback) => {
    let compiler
    // 实例Compiler
    if (Array.isArray(options)) {
        // ...
        compiler = createMultiCompiler(options);
    } else {
        compiler = createCompiler(options);
    }
    // ...
    // 若options.watch === true && callback 则开启watch线程
    compiler.watch(watchOptions, callback);
    compiler.run(callback);
    return compiler;
}
```
[阅读完整源码点击这里：webpack.js](https://github.com/webpack/webpack/blob/d6e8e479bce9ed34827e08850764bfb225947f85/lib/webpack.js#L39)

webpack 的入口文件其实就实例了 `Compiler` 并调用了 `run` 方法开启了编译, webpack的编译都按照下面的钩子调用顺序执行。
before-run 清除缓存
run 注册缓存数据钩子
before-compile
compile 开始编译
make 从入口分析依赖以及间接依赖模块，创建模块对象
build-module 模块构建
seal 构建结果封装， 不可再更改
after-compile 完成构建，缓存数据
emit 输出到dist目录


3. 注册NOdeEnvironmentPlugin插件 和 加载插件,为webpack事件流挂上自定义钩子

源码仍然在[webpack.js](https://github.com/webpack/webpack/blob/d6e8e479bce9ed34827e08850764bfb225947f85/lib/webpack.js#L39)文件

``` js
const createCompiler = rawOptions => {
    // ...省略代码
    const compiler = new Compiler(options.context);
    compiler.options = options;
    //应用Node的文件系统到compiler对象，方便后续的文件查找和读取
    new NodeEnvironmentPlugin({
        infrastructureLogging: options.infrastructureLogging
    }).apply(compiler);
    // 加载插件
    if (Array.isArray(options.plugins)) {
        for (const plugin of options.plugins) {
            //  依次调用插件的apply方法（默认每个插件对象实例都需要提供一个apply）若为函数则直接调用，将compiler实例作为参数传入，方便插件调用此次构建提供的Webpack API并监听后续的所有事件Hook。
            if (typeof plugin === "function") {
                plugin.call(compiler, compiler);
            } else {
                plugin.apply(compiler);
            }
        }
    }
    // 应用默认的Webpack配置
    applyWebpackOptionsDefaults(options);
    // 随即之后，触发一些Hook
    compiler.hooks.environment.call();
    compiler.hooks.afterEnvironment.call();
    new WebpackOptionsApply().process(options, compiler);
    compiler.hooks.initialize.call();
    return compiler;
};
```

### 编译阶段

1. 启动编译

这里有个小逻辑区分是否是watch，如果是非watch，则会正常执行一次compiler.run()。

如果是监听文件（如：--watch）的模式，则会传递监听的watchOptions，生成Watching实例，每次变化都重新触发回调。

``` js
function watch(watchOptions, handler) {
    if (this.running) {
        return handler(new ConcurrentCompilationError());
    }

    this.running = true;
    this.watchMode = true;
    return new Watching(this, watchOptions, handler);
}
```

2. 触发compile事件

该事件是为了告诉插件一次新的编译将要启动，同时会给插件带上compiler对象。

2. 编译模块：

从入口文件出发, 调用所有配置的 Loader 对模块进行处理, 再找出该模块依赖的模块, 通过 acorn 库生成模块代码的 AST 语法树，形成依赖关系树（每个模块被处理后的最终内容以及它们之间的依赖关系），根据语法树分析这个模块是否还有依赖的模块，如果有则继续循环每个依赖；

再递归本步骤直到所有入口依赖的文件都经过了对应的loader处理。

webpack中负责构建和编译都是Compilation，每一次的编译（包括watch检测到文件变化时），compiler都会创建一个Compilation对象，标识当前的模块资源、编译生成资源、变化的文件等。同时也提供很多事件回调给插件进行拓展。

<details>

    <summary>查看源码</summary>

``` js
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

Webpack进入其中一个入口文件，开始compilation过程。先使用用户配置好的loader对文件内容进行编译（buildModule），我们可以从传入事件回调的compilation上拿到module的resource（资源路径）、loaders（经过的loaders）等信息；之后，再将编译好的文件内容使用acorn解析生成AST静态语法树（normalModuleLoader），分析文件的依赖关系逐个拉取依赖模块并重复上述过程，最后将所有模块中的require语法替换成__webpack_require__来模拟模块化操作。

3. 完成编译：

输出资源：
根据入口和模块之间的依赖关系, 组装成一个个包含多个模块的 Chunk, 
在seal执行后，便会调用emit钩子，根据webpack config文件的output配置的path属性，将文件输出到指定的path.

输出完成：在确定好输出内容后, 根据配置确定输出的路径和文件名, 把文件内容写入到文件系统。
