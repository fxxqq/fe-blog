
https://github.com/impeiran/Blog/issues/6

读取参数->实例化Compiler->EntryOptionPlugin->Loader编译对应文件->找到对应的依赖，递归编译处理->输出

### 初始化阶段

1. 初始化参数（webpack.config.js+shell options）

./node_modules/.bin/webpack
./node_modules/webpack/bin/webpack.js
追加shell命令的参数，如-p , -w
期间如果配置文件（如： webpack.config.js）中Plugins使用了new plugin()之类的语句，则会一并调用，实例化插件对象。

2. 实例化Compiler
[源码出处：webpack.js](https://github.com/webpack/webpack/blob/d6e8e479bce9ed34827e08850764bfb225947f85/lib/webpack.js#L39)
```js
const webpack = (options, callback) => {
  let compiler
  if (Array.isArray(options)) {
   	// ...
    compiler = createMultiCompiler(options);
  } else {
    compiler = createCompiler(options);
  }
  // ...
  return compiler; 
}
```
3. 注册NOdeEnvironmentPlugin插件 和 加载插件,为webpack事件流挂上自定义钩子
源码仍然在[webpack.js](https://github.com/webpack/webpack/blob/d6e8e479bce9ed34827e08850764bfb225947f85/lib/webpack.js#L39)文件
```js
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

至此，完成了整个第一阶段的初始化。

### 编译阶段

1. 启动编译

这里有个小逻辑区分是否是watch，如果是非watch，则会正常执行一次compiler.run()。

如果是监听文件（如：--watch）的模式，则会传递监听的watchOptions，生成Watching实例，每次变化都重新触发回调。

```js
function watch(watchOptions, handler) {
  if (this.running) {
    return handler(new ConcurrentCompilationError());
  }

  this.running = true;
  this.watchMode = true;
  return new Watching(this, watchOptions, handler);
}
```

2. 编译模块：

从入口文件出发,调用所有配置的 Loader 对模块进行处理,再找出该模块依赖的模块,形成依赖关系树（每个模块被处理后的最终内容以及它们之间的依赖关系），

再递归本步骤直到所有入口依赖的文件都经过了对应的loader处理。

3. 完成编译：

输出资源：根据入口和模块之间的依赖关系,组装成一个个包含多个模块的 Chunk,再把每个 Chunk 转换成一个单独的文件加入到输出列表,这步是可以修改输出内容的最后机会。

输出完成：在确定好输出内容后,根据配置确定输出的路径和文件名,把文件内容写入到文件系统。

SingleEntryPlugin 中调用了 Compilation 对象的 addEntry 方法，开始解析入口；
addEntry 方法中又调用了 _addModuleChain 方法，将入口模块添加到模块依赖列表中；
紧接着通过 Compilation 对象的 buildModule 方法进行模块构建；
buildModule 方法中执行具体的 Loader，处理特殊资源加载；
build 完成过后，通过 acorn 库生成模块代码的 AST 语法树；
根据语法树分析这个模块是否还有依赖的模块，如果有则继续循环 build 每个依赖；
所有依赖解析完成，build 阶段结束；
最后合并生成需要输出的 bundle.js 写入 dist 目录。