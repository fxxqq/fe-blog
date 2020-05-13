const fs = require('fs');
const pluginName = 'ModuleBuildTimeCalWebpackPlugin';
const NOOL = () => {};

class ModuleBuildTimeCalWebpackPlugin {
  constructor(options = {}) {
    /**
     * OPTIONS FORMAT
     * const options = {
     *   filename: 'modules.json',
     *   includeNodeModules: false,
     *   callback: () => {},
     * }
     */
    this.options = options;
    this.modules = {};
    // console.log('Plugin options', this.options);
  }

  handleFinishModules() {
    const {
      callback = NOOL,
        filename = 'modules.json',
    } = this.options;
    try {
      const data = JSON.stringify(this.modules);
      const writeToFilePath = `${process.cwd()}/${filename}}`;

      /**
       * OUTPUT FORMAT
       * modules.json = {
       *   'src/index.js': {
       *     name: 'src/index.js',
       *     start: 1,
       *     end: 4,
       *     time: 3,
       *     loaders: [ ... ]
       *   },
       *   ...
       * }
       */
      fs.writeFile(writeToFilePath, data, 'utf8', callback);
    } catch (e) {
      console.error(`[${pluginName} ERROR]: `, e);
    }
  }

  handleBuildModule(module) {
    const { userRequest, loaders } = module;
    const { includeNodeModules } = this.options;
    console.log(1, module)
    const rawRequest = userRequest.replace(process.cwd(), '');
    if (includeNodeModules || !rawRequest.includes('node_modules')) {
      this.modules[rawRequest] = {
        start: (new Date()).getTime(),
        loaders,
        name: rawRequest,
      };
    }
  }

  handleSucceedModule(module) {
    const { userRequest, loaders } = module;
    const { includeNodeModules } = this.options;
    console.log(2, userRequest)
    const rawRequest = userRequest.replace(process.cwd(), '');
    if (includeNodeModules || !rawRequest.includes('node_modules')) {
      this.modules[rawRequest].end = (new Date()).getTime();
      const spend = this.modules[rawRequest].end - this.modules[rawRequest].start;
      this.modules[rawRequest].time = spend;
    }
  }

  apply(compiler) {
    console.log(compiler)
    debugger
    compiler.hooks.compilation.tap(
      pluginName,
      compilation => {
        console.log(compilation)
        debugger
        compilation.hooks.buildModule.tap(
          pluginName,
          this.handleBuildModule.bind(this)
        );

        compilation.hooks.succeedModule.tap(
          pluginName,
          this.handleSucceedModule.bind(this));

        compilation.hooks.finishModules.tap(
          pluginName,
          this.handleFinishModules.bind(this)
        );
      }
    );
  }
}

module.exports = ModuleBuildTimeCalWebpackPlugin;