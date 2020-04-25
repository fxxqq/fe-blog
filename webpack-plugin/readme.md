
## 前言
Webpack 运行的生命周期中会广播出许多事件，Plugin 可以监听这些事件，在合适的时机通过 Webpack 提供的 API 改变输出结果。
写plugin 比写loader更难一点，可能需要你对webpack底层的一些东西有一定的了解，要做好阅读源码的准备

## 插件基本结构

plugins是可以用自身原型方法apply来实例化的对象。apply只在安装插件被Webpack compiler执行一次。apply方法传入一个webpck compiler的引用，来访问编译器回调。

**一个简单的插件结构：**
```js
class HelloPlugin{
  // 在构造函数中获取用户给该插件传入的配置
  constructor(options){
  }
  // Webpack 会调用 HelloPlugin 实例的 apply 方法给插件实例传入 compiler 对象
  apply(compiler){
    compiler.plugin('compilation',function(compilation) {
    })
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
**先来分析一下webpack Plugin的工作原理**

1. 读取配置的过程中会先执行 new HelloPlugin(options) 初始化一个 BasicPlugin 获得其实例。
2. 初始化 compiler 对象，调用 HelloPlugin.apply(compiler) 给插件实例传入 compiler 对象。
3. 插件实例在获取到 compiler 对象后，就可以通过 compiler.plugin(事件名称, 回调函数) 监听到 Webpack 广播出来的事件。
并且可以通过 compiler 对象去操作 Webpack。

## Compiler 和 Compilation

开发插件首先要理解compiler 和 compilation 对象，理解他们的是扩展Webpack重要的一步。

compiler对象包涵了Webpack环境所有的的配置信息，这个对象在Webpack启动时候被构建，并配置上所有的设置选项包括 options，loaders，plugins。当启用一个插件到Webpack环境的时候，这个插件就会接受一个指向compiler的参数。运用这个参数来获取到Webpack环境

compiler 对象代表了完整的 webpack 环境配置。这个对象在启动 webpack 时被一次性建立，并配置好所有可操作的设置，包括 options，loader 和 plugin。当在 webpack 环境中应用一个插件时，插件将收到此 compiler 对象的引用。可以使用它来访问 webpack 的主环境。
这个对象在 Webpack 启动时候被实例化，它是全局唯一的，可以简单地把它理解为 Webpack 实例；

compilation 对象代表了一次资源版本构建。当运行 webpack 开发环境中间件时，每当检测到一个文件变化，就会创建一个新的 compilation，从而生成一组新的编译资源。一个 compilation 对象表现了当前的模块资源、编译生成资源、变化的文件、以及被跟踪依赖的状态信息。compilation 对象也提供了很多关键时机的回调，以供插件做自定义处理时选择使用。

compilation代表了一个单一构建版本的物料。在webpack中间件运行时，每当一个文件发生改变时就会产生一个新的compilation从而产生一个新的变异后的物料集合。compilation列出了很多关于当前模块资源的信息，编译后的资源信息，改动过的文件，以及监听过的依赖。compilation也提供了插件需要自定义功能的回调点。
Compilation 对象包含了当前的模块资源、编译生成资源、变化的文件等。当 Webpack 以开发模式运行时，每当检测到一个文件变化，一次新的 Compilation 将被创建。Compilation 对象也提供了很多事件回调供插件做扩展。通过 Compilation 也能读取到 Compiler 对象。

这两个组件在所有的Webpack插件中都是不可分割的一部分（特别是compilation），所以对于开发者来说熟悉这两个组件的源文件将是你受益很多：

https://github.com/webpack/webpack/blob/master/lib/Compilation.js
https://github.com/webpack/webpack/blob/master/lib/Compiler.js
 

访问 compilation
使用compiler对象，你可能需要绑定带有各个新compilation的引用的回调函数。这些compilation提供回调函数连接成许多构建过程中的步骤。
```js
function HelloCompilationPlugin(options) {}

HelloCompilationPlugin.prototype.apply = function(compiler) {

  // Setup callback for accessing a compilation:
  compiler.plugin("compilation", function(compilation) {

    // Now setup callbacks for accessing compilation steps:
    compilation.plugin("optimize", function() {
      console.log("Assets are being optimized.");
    });
  });
});

module.exports = HelloCompilationPlugin;
```
更多关于在compiler, compilation等对象中哪些回调有用，看一下api

异步编译插件

有些compilation插件的步骤时异步的，并且会传入一个当你的插件运行完成时候必须调用的回调函数。

```js
function HelloAsyncPlugin(options) {}

HelloAsyncPlugin.prototype.apply = function(compiler) {
  compiler.plugin("emit", function(compilation, callback) {

    // Do something async...
    setTimeout(function() {
      console.log("Done with async work...");
      callback();
    }, 1000);

  });
});

module.exports = HelloAsyncPlugin;
```

我们了解了Webpack compiler和各个compilations，我们就可以用它们来创造无尽的可能。我们可以重定当前文件的格式，生成一个衍生文件，或者制造出一个全新的assets

下面我们将写一个简单的插件，生成一个filelist.md文件，里面的内容是，列出我们build的所有asset 文件。
```js
function FileListPlugin(options) {}

FileListPlugin.prototype.apply = function(compiler) {
  compiler.plugin('emit', function(compilation, callback) {
    // Create a header string for the generated file:
    var filelist = 'In this build:\n\n';

    // Loop through all compiled assets,
    // adding a new line item for each filename.
    for (var filename in compilation.assets) {
      filelist += ('- '+ filename +'\n');
    }
    
    // Insert this list into the Webpack build as a new file asset:
    compilation.assets['filelist.md'] = {
      source: function() {
        return filelist;
      },
      size: function() {
        return filelist.length;
      }
    };

    callback();
  });
};

module.exports = FileListPlugin;
```


构建流程
在编写插件之前，还需要了解一下Webpack的构建流程，以便在合适的时机插入合适的插件逻辑。Webpack的基本构建流程如下：

校验配置文件
生成Compiler对象
初始化默认插件
run/watch：如果运行在watch模式则执行watch方法，否则执行run方法
compilation：创建Compilation对象回调compilation相关钩子
emit：文件内容准备完成，准备生成文件，这是最后一次修改最终文件的机会
afterEmit：文件已经写入磁盘完成
done：完成编译