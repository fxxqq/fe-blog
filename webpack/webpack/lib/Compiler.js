const { SyncHook, SyncBailHook, AsyncSeriesHook } = require("tapable");
const Parser = require("./Parser");
const fs = require("fs");
const path = require("path");
class Compiler {
  constructor(config) {
    this.config = config
    this.entry = config.entry
    this.output = config.output

    //工作路径
    this.root = process.cwd()

    //依赖关系
    this.modules = {}

    // 1. 定义生命周期钩子
    this.hooks = Object.freeze({
      // ...只列举几个常用的常见钩子，更多hook就不列举了，有兴趣看源码
      done: new AsyncSeriesHook(["stats"]), //一次编译完成后执行，回调参数：stats
      beforeRun: new AsyncSeriesHook(["compiler"]),
      run: new AsyncSeriesHook(["compiler"]), //在编译器开始读取记录前执行
      emit: new AsyncSeriesHook(["compilation"]), //在生成文件到output目录之前执行，回调参数： compilation
      afterEmit: new AsyncSeriesHook(["compilation"]), //在生成文件到output目录之后执行
      compilation: new SyncHook(["compilation", "params"]), //在一次compilation创建后执行插件
      beforeCompile: new AsyncSeriesHook(["params"]),
      compile: new SyncHook(["params"]), //在一个新的compilation创建之前执行
      make: new AsyncParallelHook(["compilation"]), //完成一次编译之前执行
      afterCompile: new AsyncSeriesHook(["compilation"]),
      watchRun: new AsyncSeriesHook(["compiler"]),
      failed: new SyncHook(["error"]),
      watchClose: new SyncHook([]),
      afterPlugins: new SyncHook(["compiler"]),
      entryOption: new SyncBailHook(["context", "entry"])
    });
    // ...省略代码
  }
  newCompilation() {
    // 创建Compilation对象回调compilation相关钩子
    const compilation = new Compilation(this);
    //...一系列操作
    this.hooks.compilation.call(compilation, params); //compilation对象创建完成 
    return compilation
  }
  watch() {
    //如果运行在watch模式则执行watch方法，否则执行run方法
    if (this.running) {
      return handler(new ConcurrentCompilationError());
    }
    this.running = true;
    this.watchMode = true;
    return new Watching(this, watchOptions, handler);
  }
  run(callback) {
    const info = this.build(this.entry);
    this.modules.push(info);
    this.modules.forEach(({ dependecies }) => {
      if (dependecies) {
        for (const dependency in dependecies) {
          this.modules.push(this.build(dependecies[dependency]));
        }
      }
    });
    const dependencyGraph = this.modules.reduce(
      (graph, item) => ({
        ...graph,
        [item.filename]: {
          dependecies: item.dependecies,
          code: item.code
        }
      }), {}
    );
    this.generate(dependencyGraph);

  }
  compile(callback) {
    const params = this.newCompilationParams();
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
  emitAssets(compilation, callback) {

  }


}