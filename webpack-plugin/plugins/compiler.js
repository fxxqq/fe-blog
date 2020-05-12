const { SyncHook, SyncBailHook, AsyncSeriesHook } = require("tapable");
class Compiler {
  constructor() {
    // 1. 定义生命周期钩子
    this.hooks = Object.freeze({
      // ...更多hook就不列举了，有兴趣看源码
      done: new AsyncSeriesHook(["stats"]),
      beforeRun: new AsyncSeriesHook(["compiler"]),
      run: new AsyncSeriesHook(["compiler"]),
      emit: new AsyncSeriesHook(["compilation"]),
      afterEmit: new AsyncSeriesHook(["compilation"]),
      compilation: new SyncHook(["compilation", "params"]),
      beforeCompile: new AsyncSeriesHook(["params"]),
      compile: new SyncHook(["params"]),
      afterCompile: new AsyncSeriesHook(["compilation"]),
      watchRun: new AsyncSeriesHook(["compiler"]),
      failed: new SyncHook(["error"]),
      watchClose: new SyncHook([]),
      afterPlugins: new SyncHook(["compiler"]),
      entryOption: new SyncBailHook(["context", "entry"])
    });
  }

  transfer() {
    // 3. 在合适的时候 调用
    this.hooks.entryOption.call() //在 webpack 选项中的 entry 配置项 处理过之后，执行插件。
    this.hooks.afterPlugins.call() //设置完初始插件之后，执行插件。
    this.hooks.beforeRun.call() //compiler.run() 执行之前，添加一个钩子。
    this.hooks.run.call() //开始读取 records 之前，钩入(hook into) compiler。
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
    if (this.running) {
      return callback(new ConcurrentCompilationError());
    }
    this.running = true;
    process.nextTick(() => {
      this.emitAssets(compilation, err => {
        if (err) {
          // 在编译和输出的流程中遇到异常时，会触发 failed 事件 
          this.hooks.failed.call(err)
        };
        if (compilation.hooks.needAdditionalPass.call()) {
          // ...
          // done：完成编译
          this.hooks.done.callAsync(stats, err => {
            // 创建compilation对象之前   
            this.compile(onCompiled);
          });
        }
        this.emitRecords(err => {
          this.hooks.done.callAsync(stats, err => {

          });
        });
      });
    });

    this.hooks.beforeRun.callAsync(this, err => {
      // 假设我们想在 compiler.run() 之前处理逻辑，那么就要调用 beforeRun 钩子来处理：
      // compiler.hooks.beforeRun.tap(
      //   'testPlugin', 
      //   (comp) => {   
      //     // ... 
      //   }
      // );
      this.hooks.run.callAsync(this, err => {
        this.readRecords(err => {
          this.compile(onCompiled);
        });
      });
    });

  }
  compile(callback) {
    const params = this.newCompilationParams();
    this.hooks.beforeCompile.callAsync(params, err => {
      this.hooks.compile.call(params);
      const compilation = this.newCompilation(params);
      this.hooks.make.callAsync(compilation, err => {
        process.nextTick(() => {
          compilation.finish(err => {
            // 封装构建结果（seal），不可再更改
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
    const emitFiles = (err) => {
      //...省略一系列代码
      // afterEmit：文件已经写入磁盘完成
      this.hooks.afterEmit.callAsync(compilation, err => {
        if (err) return callback(err);
        return callback();
      });
    }

    // emit：资源输出之前，文件内容准备完成，准备生成文件，这是最后一次修改最终文件的机会
    this.hooks.emit.callAsync(compilation, err => {
      if (err) return callback(err);
      outputPath = compilation.getPath(this.outputPath, {});
      mkdirp(this.outputFileSystem, outputPath, emitFiles);
    });
  }
}