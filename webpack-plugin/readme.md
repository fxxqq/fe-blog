
## 前言
 
Webpack 运行的生命周期中会广播出许多事件，Plugin 可以监听这些事件，在合适的时机通过 Webpack 提供的 API 改变输出结果。
写plugin 比写loader更难一点，可能需要你对webpack底层和构建流程的一些东西有一定的了解，以便在合适的时机插入合适的插件逻辑。所以要做好阅读源码的准备。

 
构建流程
在编写插件之前，还需要了解一下Webpack的构建流程，以便在合适的时机插入合适的插件逻辑。Webpack的基本构建流程如下：
1. 校验配置文件
2. 生成Compiler对象
3. 初始化默认插件
4. run/watch：如果运行在watch模式则执行watch方法，否则执行run方法
5. compilation：创建Compilation对象回调compilation相关钩子
6. emit：文件内容准备完成，准备生成文件，这是最后一次修改最终文件的机会
7. afterEmit：文件已经写入磁盘完成
8. done：完成编译

首先，webpack会读取你在命令行传入的配置以及项目里的 webpack.config.js 文件，初始化本次构建的配置参数，并且执行配置文件中的插件实例化语句，生成Compiler传入plugin的apply方法，为webpack事件流挂上自定义钩子。
接下来到了entryOption阶段，webpack开始读取配置的Entries，递归遍历所有的入口文件
Webpack接下来就开始了compilation过程。会依次进入其中每一个入口文件(entry)，先使用用户配置好的loader对文件内容进行编译（buildModule），我们可以从传入事件回调的compilation上拿到module的resource（资源路径）、loaders（经过的loaders）等信息；之后，再将编译好的文件内容使用acorn解析生成AST静态语法树（normalModuleLoader），分析文件的依赖关系逐个拉取依赖模块并重复上述过程，最后将所有模块中的require语法替换成__webpack_require__来模拟模块化操作。
emit阶段，所有文件的编译及转化都已经完成，包含了最终输出的资源，我们可以在传入事件回调的compilation.assets 上拿到所需数据，其中包括即将输出的资源、代码块Chunk等等信息。
 
### 插件基本结构

plugins是可以用自身原型方法apply来实例化的对象。apply只在安装插件被Webpack compiler执行一次。apply方法传入一个webpck compiler的引用，来访问编译器回调。

**一个简单的插件结构：**
```js
class HelloPlugin{
  // 在构造函数中获取用户给该插件传入的配置
  constructor(options){
  }
  // Webpack 会调用 HelloPlugin 实例的 apply 方法给插件实例传入 compiler 对象
  apply(compiler) {
    // 在emit阶段插入钩子函数
    compiler.hooks.emit.tap('HelloPlugin', (compilation) => {});
  }
}

module.exports = HelloPlugin;
```

安装插件时, 只需要将它的一个实例放到 Webpack config plugins 数组里面:
```js
const HelloPlugin = require('./hello-plugin.js');
var webpackConfig = {
  plugins: [
    new HelloPlugin({options: true})
  ]
};
```

我们首先需要知道一个 webpack 插件由什么构成。一个插件应该包含：

一个 JavaScript 函数或 JavaScript 类，用于承接这个插件模块的所有逻辑；
在它原型上定义的 apply 方法，会在安装插件时被调用，并被 webpack compiler 调用一次；
指定一个触及到 webpack 本身的事件钩子，即下文会提及的 hooks，用于特定时机处理额外的逻辑；
对 webpack 实例内部做一些操作处理；
在功能流程完成后可以调用 webpack 提供的回调函数；

**先来分析一下webpack Plugin的工作原理**
1. 读取配置的过程中会先执行 new HelloPlugin(options) 初始化一个 BasicPlugin 获得其实例。
2. 初始化 compiler 对象后调用 HelloPlugin.apply(compiler) 给插件实例传入 compiler 对象。
3. 插件实例在获取到 compiler 对象后，就可以通过 compiler.plugin(事件名称, 回调函数) 监听到 Webpack 广播出来的事件。
并且可以通过 compiler 对象去操作 Webpack。

## 理解 webpack 的 compiler 和 compilation

开发插件首先要理解compiler 和 compilation 对象，理解他们的是扩展Webpack重要的一步。

compiler对象包涵了Webpack环境所有的的配置信息，这个对象在Webpack启动时候被构建，并配置上所有的设置选项包括 options，loaders，plugins。当启用一个插件到Webpack环境的时候，这个插件就会接受一个指向compiler的参数。运用这个参数来获取到Webpack环境
Compiler 对象包含了当前运行Webpack的配置，包括entry、output、loaders等配置，这个对象在启动Webpack时被实例化，而且是全局唯一的。Plugin可以通过该对象获取到Webpack的配置信息进行处理。

compiler 对象代表了完整的 webpack 环境配置。这个对象在启动 webpack 时被一次性建立，并配置好所有可操作的设置，包括 options，loader 和 plugin。当在 webpack 环境中应用一个插件时，插件将收到此 compiler 对象的引用。可以使用它来访问 webpack 的主环境。
这个对象在 Webpack 启动时候被实例化，它是全局唯一的，可以简单地把它理解为 Webpack 实例；
 compiler。这个对象包含了 webpack 环境所有的的配置信息，包含 options，loaders，plugins 这些信息，这个对象在 webpack 启动时候被实例化，它是全局唯一的，可以简单地把它理解为 webpack 实例。
如果看完这段话，你还是没理解compiler是做啥的，不要怕，运行npm run build，把compiler的全部信息输出到控制台上。为了能更直观的让大家看清楚compiler的结构，里面的大量代码使用省略号（...）代替。
```js
Compiler {
  _pluginCompat: SyncBailHook {
    ...
  },
  hooks: {
    shouldEmit: SyncBailHook {
     ...
    },
    done: AsyncSeriesHook {
     ...
    },
    additionalPass: AsyncSeriesHook {
     ...
    },
    beforeRun: AsyncSeriesHook {
     ...
    },
    run: AsyncSeriesHook {
     ...
    },
    emit: AsyncSeriesHook {
     ...
    },
    assetEmitted: AsyncSeriesHook {
     ...
    },
    afterEmit: AsyncSeriesHook {
     ...
    },
    thisCompilation: SyncHook {
     ...
    },
    compilation: SyncHook {
     ...
    },
    normalModuleFactory: SyncHook {
     ...
    },
    contextModuleFactory: SyncHook {
     ...
    },
    beforeCompile: AsyncSeriesHook {
      ...
    },
    compile: SyncHook {
     ...
    },
    make: AsyncParallelHook {
     ...
    },
    afterCompile: AsyncSeriesHook {
     ...
    },
    watchRun: AsyncSeriesHook {
     ...
    },
    failed: SyncHook {
     ...
    },
    invalid: SyncHook {
     ...
    },
    watchClose: SyncHook {
     ...
    },
    infrastructureLog: SyncBailHook {
     ...
    },
    environment: SyncHook {
     ...
    },
    afterEnvironment: SyncHook {
     ...
    },
    afterPlugins: SyncHook {
     ...
    },
    afterResolvers: SyncHook {
     ...
    },
    entryOption: SyncBailHook {
     ...
    },
    infrastructurelog: SyncBailHook {
     ...
    }
  },
  ...
  outputPath: '',//输出目录
  outputFileSystem: NodeOutputFileSystem {
   ...
  },
  inputFileSystem: CachedInputFileSystem {
    ...
  },
  ...
  options: {
    //Compiler对象包含了webpack的所有配置信息，entry、module、output、resolve等信息
    entry: [
      'babel-polyfill',
      '/Users/frank/Desktop/fe/fe-blog/webpack-plugin/src/index.js'
    ],
    devServer: { port: 3000 },
    output: {
      ...
    },
    module: {
      ...
    },
    plugins: [ MyWebpackPlugin {} ],
    mode: 'production',
    context: '/Users/frank/Desktop/fe/fe-blog/webpack-plugin',
    devtool: false,
    ...
    performance: {
      maxAssetSize: 250000,
      maxEntrypointSize: 250000,
      hints: 'warning'
    },
    optimization: {
      ... 
    },
    resolve: {
      ...
    },
    resolveLoader: {
      ...
    },
    infrastructureLogging: { level: 'info', debug: false }
  },
  context: '/Users/frank/Desktop/fe/fe-blog/webpack-plugin',//上下文，文件目录
  requestShortener: RequestShortener {
    ...
  },
  ...
  watchFileSystem: NodeWatchFileSystem {
    //监听文件变化列表信息
     ...
  }
}
```


compiler 暴露了和 Webpack 整个生命周期相关的钩子
compilation 暴露了与模块和依赖有关的粒度更小的事件钩子
插件需要在其原型上绑定apply方法，才能访问 compiler 实例
传给每个插件的 compiler 和 compilation对象都是同一个引用，若在一个插件中修改了它们身上的属性，会影响后面的插件
找出合适的事件点去完成想要的功能
emit 事件发生时，可以读取到最终输出的资源、代码块、模块及其依赖，并进行修改(emit 事件是修改 Webpack 输出资源的最后时机)
watch-run 当依赖的文件发生变化时会触发
异步的事件需要在插件处理完任务时调用回调函数通知 Webpack 进入下一个流程，不然会卡住

compiler可以理解为一个webpack的实例，该实例存储了webpack配置、打包过程等一系列的内容。compiler提供了compiler.hooks,在为 webpack 开发插件时，你可能需要知道每个钩子函数是在哪里调用的，具体就可以查阅官方文档。这里可以看到有很多时刻，我们可以根据这些不同的时刻去让插件做不同的事情。

compilation 模块会被 compiler 用来创建新的编译（或新的构建）。该实例存放的是本次打包编译的内容。


compilation 对象代表了一次资源版本构建。当运行 webpack 开发环境中间件时，每当检测到一个文件变化，就会创建一个新的 compilation，从而生成一组新的编译资源。一个 compilation 对象表现了当前的模块资源、编译生成资源、变化的文件、以及被跟踪依赖的状态信息。compilation 对象也提供了很多关键时机的回调，以供插件做自定义处理时选择使用。

compilation代表了一个单一构建版本的物料。在webpack中间件运行时，每当一个文件发生改变时就会产生一个新的compilation从而产生一个新的变异后的物料集合。compilation列出了很多关于当前模块资源的信息，编译后的资源信息，改动过的文件，以及监听过的依赖。compilation也提供了插件需要自定义功能的回调点。
Compilation 对象包含了当前的模块资源、编译生成资源、变化的文件等。当 Webpack 以开发模式运行时，每当检测到一个文件变化，一次新的 Compilation 将被创建。Compilation 对象也提供了很多事件回调供插件做扩展。通过 Compilation 也能读取到 Compiler 对象。
Compilation对象可以理解编译对象，包含了模块、依赖、文件等信息。在开发模式下运行Webpack时，每修改一次文件都会产生一个新的Compilation对象，Plugin可以访问到本次编译过程中的模块、依赖、文件内容等信息。

这两个组件在所有的Webpack插件中都是不可分割的一部分（特别是compilation），所以对于开发者来说熟悉这两个组件的源文件将是你受益很多：

https://github.com/webpack/webpack/blob/master/lib/Compilation.js
https://github.com/webpack/webpack/blob/master/lib/Compiler.js


访问 compilation
使用compiler对象，你可能需要绑定带有各个新compilation的引用的回调函数。这些compilation提供回调函数连接成许多构建过程中的步骤。

Compiler 和 Compilation 的区别在于：Compiler 代表了整个 Webpack 从启动到关闭的生命周期，而 Compilation 只是代表了一次新的编译。
 
更多关于在compiler, compilation等对象中哪些回调有用，看一下api

我们了解了Webpack compiler和各个compilations，我们就可以用它们来创造无尽的可能。我们可以重定当前文件的格式，生成一个衍生文件，或者制造出一个全新的assets


### 事件流Tabable

Tapable也是一个小型的 library，是Webpack的一个核心工具。作用是提供类似的插件接口。
Webpack中许多对象扩展自Tapable类。Tapable类暴露了tap、tapAsync和tapPromise方法，可以根据钩子的同步/异步方式来选择一个函数注入逻辑。
Webpack 的 Tapable 事件流机制保证了插件的有序性，使得整个系统扩展性良好。


tap 同步钩子
```js
compiler.hooks.compile.tap('MyPlugin', params => {
  console.log('以同步方式触及 compile 钩子。')
})
```
tapAsync 异步钩子，通过callback回调告诉Webpack异步执行完毕
tapPromise 异步钩子，返回一个Promise告诉Webpack异步执行完毕
```js
compiler.hooks.run.tapAsync('MyPlugin', (compiler, callback) => {
  console.log('以异步方式触及 run 钩子。')
  callback()
})

compiler.hooks.run.tapPromise('MyPlugin', compiler => {
  return new Promise(resolve => setTimeout(resolve, 1000)).then(() => {
    console.log('以具有延迟的异步方式触及 run 钩子')
  })
})
```


Webpack 就像一条生产线，要经过一系列处理流程后才能将源文件转换成输出结果。 这条生产线上的每个处理流程的职责都是单一的，多个流程之间有存在依赖关系，只有完成当前处理后才能交给下一个流程去处理。 插件就像是一个插入到生产线中的一个功能，在特定的时机对生产线上的资源做处理。

Webpack 通过 Tapable 来组织这条复杂的生产线。 Webpack 在运行过程中会广播事件，插件只需要监听它所关心的事件，就能加入到这条生产线中，去改变生产线的运作。 Webpack 的事件流机制保证了插件的有序性，使得整个系统扩展性很好。




Webpack 的事件流机制应用了观察者模式，和 Node.js 中的 EventEmitter 非常相似。Compiler 和 Compilation 都继承自 Tapable，可以直接在 Compiler 和 Compilation 对象上广播和监听事件，方法如下：
```js
/**
* 广播出事件
* event-name 为事件名称，注意不要和现有的事件重名
* params 为附带的参数
*/
compiler.apply('event-name',
   params
);

/**
* 监听名称为 event-name 的事件，当 event-name 事件发生时，函数就会被执行。
* 同时函数中的 params 参数为广播事件时附带的参数。
*/
compiler.plugin('event-name',function(params){

});
```

常见钩子
entryOption : 在 webpack 选项中的 entry 配置项 处理过之后，执行插件。
afterPlugins : 设置完初始插件之后，执行插件。
compilation : 编译创建之后，生成文件之前，执行插件。。
emit : 生成资源到 output 目录之前。
done : 编译完成。
Webpack会根据执行流程来回调对应的钩子，下面我们来看看都有哪些常见钩子，这些钩子支持的tap操作是什么。

让我们来了解更多不同的钩子类(hook class)，以及它们是如何工作的。

钩子	说明	参数	类型
| 钩子         | 说明                                                    | 参数              | 类型 |
|--------------|---------------------------------------------------------|-------------------|------|
| entryOption  | 在 webpack 选项中的 entry 配置项 处理过之后，执行插件。 |                   |      |
| afterPlugins | 启动一次新的编译                                        | compiler          | 同步 |
| compile      | 创建compilation对象之前                                 | compilationParams | 同步 |
| compilation  | compilation对象创建完成                                 | compilation       | 同步 |
| emit         | 资源生成完成，输出之前                                  | compilation       | 同步 |
| afterEmit    | 资源输出到目录完成                                      | compilation       | 异步 |
| done         | 在 webpack 选项中的 entry 配置项 处理过之后，执行插件。 | stats             | 同步 |

apply方法中插入钩子的一般形式如下：
```js
compileer.hooks.阶段.tap函数('插件名称', (阶段回调参数) => {
});
```

常用 API
插件可以用来修改输出文件、增加输出文件、甚至可以提升 Webpack 性能、等等，总之插件通过调用 Webpack 提供的 API 能完成很多事情。 由于 Webpack 提供的 API 非常多，有很多 API 很少用的上，又加上篇幅有限，下面来介绍一些常用的 API。


读取输出资源、代码块、模块及其依赖

有些插件可能需要读取 Webpack 的处理结果，例如输出资源、代码块、模块及其依赖，以便做下一步处理。
在 emit 事件发生时，代表源文件的转换和组装已经完成，在这里可以读取到最终将输出的资源、代码块、模块及其依赖，并且可以修改输出资源的内容。
插件代码如下：

```js
class Plugin {
  apply(compiler) {
    compiler.plugin('emit', function (compilation, callback) {
      // compilation.chunks 存放所有代码块，是一个数组
      compilation.chunks.forEach(function (chunk) {
        // chunk 代表一个代码块
        // 代码块由多个模块组成，通过 chunk.forEachModule 能读取组成代码块的每个模块
        chunk.forEachModule(function (module) {
          // module 代表一个模块
          // module.fileDependencies 存放当前模块的所有依赖的文件路径，是一个数组
          module.fileDependencies.forEach(function (filepath) {
          });
        });

        // Webpack 会根据 Chunk 去生成输出的文件资源，每个 Chunk 都对应一个及其以上的输出文件
        // 例如在 Chunk 中包含了 CSS 模块并且使用了 ExtractTextPlugin 时，
        // 该 Chunk 就会生成 .js 和 .css 两个文件
        chunk.files.forEach(function (filename) {
          // compilation.assets 存放当前所有即将输出的资源
          // 调用一个输出资源的 source() 方法能获取到输出资源的内容
          let source = compilation.assets[filename].source();
        });
      });

      // 这是一个异步事件，要记得调用 callback 通知 Webpack 本次事件监听处理结束。
      // 如果忘记了调用 callback，Webpack 将一直卡在这里而不会往后执行。
      callback();
    })
  }
}

```


管理 Warnings 和 Errors
做一个实验，如果你在 apply 函数内插入 throw new Error("Message")，会发生什么，终端会打印出 Unhandled rejection Error: Message。然后 webpack 中断执行。
为了不影响 webpack 的执行，要在编译期间向用户发出警告或错误消息，则应使用 compilation.warnings 和 compilation.errors。
compilation.warnings.push("warning");
compilation.errors.push("error");

 