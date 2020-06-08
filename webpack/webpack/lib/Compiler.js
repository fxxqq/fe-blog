const path = require('path')
const fs = require('fs')

// babel解析AST,修改代码
const babelType = require('@babel/types');
//遍历到对应的节点
const babelTraverse = require('@babel/traverse').default;
// 替换好的结果进行生成
const babelGenerator = require('@babel/generator').default;
const babylon = require('babylon')

let ejs = require('ejs');

class Compilar {
  constructor(options) {
      this._options = options // 缓存
      this.entryId
      this.entry = options.entry // 真实入口文件
      this.dependenceModules = {} // 模块依赖关系
      this.workPath = process.cwd()
    }
    /**
     * 入口，生成模块依赖，生成打包文件
     */
  run() {
    this.buildDependenceModules(
      path.resolve(this.workPath, this.entry), true
    )
    this.emitFile()
  }
  buildDependenceModules(ModulePath, isEntry) {
    let sourceCode = this.resolveCode(ModulePath) // 拿到源码模块中的内容
    let moduleName = this.resolveName(ModulePath) // 处理源码模块的路径
    isEntry ? this.entryId = moduleName : this.entryId // 保存入口id
    console.log('sourceCode:', sourceCode)
    console.log('moduleName:', moduleName)
      // 通过AST语法进行重构代码，替换成__webpack_require__ 以及处理模块依赖
      // 最终生成准备打包处理的bundleCode以及bundleDependence
    let {
      bundleCode,
      bundleDependence
    } = this.parseCode(sourceCode, path.dirname(moduleName))
    console.log('bundleCode:', bundleCode)
    console.log('bundleDependence:', bundleDependence)
    this.dependenceModules[moduleName] = bundleCode

    bundleDependence.forEach(dep => {
      // 非entry文件，设置为false
      this.buildDependenceModules(path.join(this.workPath, dep), false)
    })
  }
  resolveCode(path) {
    let source = fs.readFileSync(path, 'utf8')
    return source
  }
  resolveName(sourcePath) {
    console.log('workPath:', this.workPath)
    console.log('sourcePath:', sourcePath)
    let name = './' + path.relative(this.workPath, sourcePath)
    return name
  }
  parseCode(source, dirPath) {
    let ast = babylon.parse(source) //获取ast语法树
    let bundleDependence = []
    babelTraverse(ast, { //遍历语法树，对源码进行重构
        CallExpression(p) {
          let node = p.node;
          // 只处理是require的函数执行表达式
          if (node.callee.name === 'require') {
            node.callee.name = '__webpack_require__' //修改名字
              // 获取函数中的参数（相对路径）
            let moduleName = node.arguments[0].value
            moduleName = moduleName + (path.extname(moduleName) ? '' : '.js') // 补全拓展名
            moduleName = './' + path.join(dirPath, moduleName) // ./src/xxx.js
            bundleDependence.push(moduleName)
            node.arguments = [babelType.stringLiteral(moduleName)]
          }
        }
      })
      // 根据新生成的语法树，生成新的代码
    let bundleCode = babelGenerator(ast).code
    return { bundleCode, bundleDependence }
  }
  emitFile() {
    let outfilePath = path.join(this._options.output.path, this._options.output.filename);
    let templateStr = this.resolveCode(path.join(__dirname, 'template.ejs'));
    let tempCode = ejs.render(templateStr, { entryId: this.entryId, modules: this.dependenceModules });
    // 可能存在多个入口情况，因此使用这样方式？
    this.assets = {}
    this.assets[outfilePath] = tempCode;
    fs.writeFileSync(outfilePath, this.assets[outfilePath]);
  }
}

module.exports = Compilar