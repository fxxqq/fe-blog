[webpack loader详解以及手写一个markdown-loader](https://github.com/6fedcom/fe-blog/blob/master/webpack-loader/readme.md)

[源码地址](https://github.com/6fedcom/fe-blog/blob/master/webpack-loader/loaders/md-loader.js)
### loader简介
webpack允许我们使用loader来处理文件，loader是一个导出为function的node模块。可以将匹配到的文件进行一次转换，同时loader可以链式传递。
loader文件处理器是一个CommonJs风格的函数，该函数接收一个 String/Buffer 类型的入参，并返回一个 String/Buffer 类型的返回值。
### loader 的配置的两种形式
方案1:
```js

// webpack.config.js
module.exports = {
  ...
  module: {
    rules: [{
      test: /.vue$/,
      loader: 'vue-loader'
    }, {
      test: /.scss$/,
      // 先经过 sass-loader，然后将结果传入 css-loader，最后再进入 style-loader。
      use: [
        'style-loader',//从JS字符串创建样式节点
        'css-loader',// 把  CSS 翻译成 CommonJS
        {
          loader: 'sass-loader',
          options: {
            data: '$color: red;'// 把 Sass 编译成 CSS
          }
        }
      ]
    }]
  }
  ...
}
```
方法2（右到左地被调用）
```js
// module
import Styles from 'style-loader!css-loader?modules!./styles.css';
```

当链式调用多个 loader 的时候，请记住它们会以相反的顺序执行。取决于数组写法格式，从右向左或者从下向上执行。像流水线一样，挨个处理每个loader，前一个loader的结果会传递给下一个loader，最后的 Loader 将处理后的结果以 String 或 Buffer 的形式返回给 compiler。

### 使用 loader-utils 能够编译 loader 的配置，还可以通过 schema-utils 进行验证
```js
import { getOptions } from 'loader-utils'; 
import { validateOptions } from 'schema-utils';  
const schema = {
  // ...
}
export default function(content) {
  // 获取 options
  const options = getOptions(this);
  // 检验loader的options是否合法
  validateOptions(schema, options, 'Demo Loader');

  // 在这里写转换 loader 的逻辑
  // ...
   return content;   
};
```
- content: 表示源文件字符串或者buffer
- map: 表示sourcemap对象
- meta: 表示元数据，辅助对象
### 同步loader
同步 loader，我们可以通过`return`和`this.callback`返回输出的内容
```js
module.exports = function(content, map, meta) {
  //一些同步操作
  outputContent=someSyncOperation(content)
  return outputContent;
}
```
如果返回结果只有一个，也可以直接使用 return 返回结果。但是，如果有些情况下还需要返回其他内容，如sourceMap或是AST语法树，这个时候可以借助webpack提供的api `this.callback`

```js
module.exports = function(content, map, meta) {
  this.callback(
    err: Error | null,
    content: string | Buffer,
    sourceMap?: SourceMap,
    meta?: any
  );
  return;
}
```
第一个参数必须是 Error 或者 null
第二个参数是一个 string 或者 Buffer。
可选的：第三个参数必须是一个可以被这个模块解析的 source map。
可选的：第四个选项，会被 webpack 忽略，可以是任何东西【可以将抽象语法树(abstract syntax tree - AST)（例如 ESTree）作为第四个参数（meta），如果你想在多个 loader 之间共享通用的 AST，这样做有助于加速编译时间。】。

### 异步loader
异步loader，使用 this.async 来获取 callback 函数。
```js
// 让 Loader 缓存
module.exports = function(source) {
    var callback = this.async();
    // 做异步的事
    doSomeAsyncOperation(content, function(err, result) {
        if(err) return callback(err);
        callback(null, result);
    });
};
```
详情请参考[官网API](https://www.webpackjs.com/api/loaders/#%E5%90%8C%E6%AD%A5-loader)

### 开发一个简单的md-loader
 ```js
const marked = require("marked");

const loaderUtils = require("loader-utils");
module.exports = function (content) {
    this.cacheable && this.cacheable();
    const options = loaderUtils.getOptions(this);
    try {
        marked.setOptions(options);
        return marked(content)
    } catch (err) {
        this.emitError(err);
        return null
    }
     
};
```
上述的例子是通过现成的插件把markdown文件里的content转成html字符串，但是如果没有这个插件，改怎么做呢？这个情况下，我们可以考虑另外一种解法，借助 AST 语法树，来协助我们更加便捷地操作转换。
### 利用 AST 作源码转换
`markdown-ast`是将markdown文件里的content转成数组形式的抽象语法树节点，操作 AST 语法树远比操作字符串要简单、方便得多：
```js
const md = require('markdown-ast');//通过正则的方法把字符串处理成直观的AST语法树
module.exports = function(content) {
    this.cacheable && this.cacheable();
    const options = loaderUtils.getOptions(this);
    try {
      console.log(md(content))
      const parser = new MdParser(content);
      return parser.data
    } catch (err) {
      console.log(err)
      return null
    }
};
```

```js
const md = require('markdown-ast');//md通过正则匹配的方法把buffer转抽象语法树
const hljs = require('highlight.js');//代码高亮插件
// 利用 AST 作源码转换
class MdParser {
	constructor(content) {
    this.data = md(content);
    console.log(this.data)
		this.parse()
	}
	parse() {
		this.data = this.traverse(this.data);
	}
	traverse(ast) {
    console.log("md转抽象语法树操作",ast)
     let body = '';
    ast.map(item => {
      switch (item.type) {
        case "bold":
        case "break":
        case "codeBlock":
          const highlightedCode = hljs.highlight(item.syntax, item.code).value
          body += highlightedCode
          break;
        case "codeSpan":
        case "image":
        case "italic":
        case "link":
        case "list":
          item.type = (item.bullet === '-') ? 'ul' : 'ol'
          if (item.type !== '-') {
            item.startatt = (` start=${item.indent.length}`)
          } else {
            item.startatt = ''
          }
          body += '<' + item.type + item.startatt + '>\n' + this.traverse(item.block) + '</' + item.type + '>\n'
          break;
        case "quote":
          let quoteString = this.traverse(item.block)
          body += '<blockquote>\n' + quoteString + '</blockquote>\n';
          break;
        case "strike":
        case "text":
        case "title":
          body += `<h${item.rank}>${item.text}</h${item.rank}>`
          break;
        default:
          throw Error("error", `No corresponding treatment when item.type equal${item.type}`);
      }
    })
    return body
	}
}
```
[完整的代码参考这里](https://github.com/6fedcom/fe-blog/blob/master/webpack-loader/loaders/md-loader.js)

**md 转成抽象语树**
![md-ast](http://cdn.ru23.com/github/cdn/loader-ast.jpg)
**ast抽象语法数转成html字符串**
![md-ast-string](https://note.youdao.com/yws/public/resource/66d319a62e055c7ba95e98111cb6d495/xmlnote/7116AC6533F7443C82E7923A63F18E0B/6311)

### loader的一些开发技巧
1. 尽量保证一个loader去做一件事情，然后可以用不同的loader组合不同的场景需求
2. 开发的时候不应该在 loader 中保留状态。loader必须是一个无任何副作用的纯函数，loader支持异步，因此是可以在 loader 中有 I/O 操作的。
3. 模块化：保证 loader 是模块化的。loader 生成模块需要遵循和普通模块一样的设计原则。
4. 合理的使用缓存
合理的缓存能够降低重复编译带来的成本。loader 执行时默认是开启缓存的，这样一来， webpack 在编译过程中执行到判断是否需要重编译 loader 实例的时候，会直接跳过 rebuild 环节，节省不必要重建带来的开销。
但是当且仅当有你的 loader 有其他不稳定的外部依赖（如 I/O 接口依赖）时，可以关闭缓存：
```js
this.cacheable&&this.cacheable(false);
```
5. `loader-runner` 是一个非常实用的工具，用来开发、调试loader,它允许你不依靠 webpack 单独运行 loader
```npm install loader-runner --save-dev```
```js
// 创建 run-loader.js
const fs = require("fs");
const path = require("path");
const { runLoaders } = require("loader-runner");

runLoaders(
  {
    resource: "./readme.md",
    loaders: [path.resolve(__dirname, "./loaders/md-loader")],
    readResource: fs.readFile.bind(fs),
  },
  (err, result) => 
    (err ? console.error(err) : console.log(result))
);
```
执行 `node run-loader`
### 认识更多的loader
##### style-loader源码简析
作用：把样式插入到DOM中，方法是在head中插入一个style标签，并把样式写入到这个标签的 innerHTML 里
看下源码。

先去掉option处理代码，这样就比较清晰明了了
![style-loader](https://note.youdao.com/yws/public/resource/ccd7c65d76760773562c7a0fd1edabfd/xmlnote/3271798C542B4C41A7DA37C9CB9282C7/6366)
返回一段js代码，通过require来获取css内容，再通过addStyle的方法把css插入到dom里
自己实现一个简陋的`style-loader.js`
```js
module.exports.pitch = function (request) {
  const {stringifyRequest}=loaderUtils
  var result = [
    //1. 获取css内容。2.// 调用addStyle把CSS内容插入到DOM中（locals为true，默认导出css）
    'var content=require(' + stringifyRequest(this, '!!' + request) + ')’, 
    'require(' + stringifyRequest(this, '!' + path.join(__dirname, "addstyle.js")) + ')(content)’, 
    'if(content.locals) module.exports = content.locals’ 
  ]
  return result.join(';')
}
```
需要说明的是，正常我们都会用default的方法，这里用到pitch方法。pitch 方法有一个官方的解释在这里 pitching loader。简单的解释一下就是，默认的loader都是从右向左执行，用 `pitching loader` 是从左到右执行的。
```js
{
  test: /\.css$/,
  use: [
    { loader: "style-loader" },
    { loader: "css-loader" }
  ]
}
```
为什么要先执行style-loader呢，因为我们要把css-loader拿到的内容最终输出成CSS样式中可以用的代码而不是字符串。

`addstyle.js`
```js
module.exports = function (content) {
  let style = document.createElement("style")
  style.innerHTML = content
  document.head.appendChild(style)
}
```

##### babel-loader源码简析
首先看下跳过loader的配置处理，看下babel-loader输出
![babel-loader-console](https://note.youdao.com/yws/public/resource/ccd7c65d76760773562c7a0fd1edabfd/xmlnote/ADAA239AE9D2458DA3899C6D45F46812/6357)
上图我们可以看到是输出`transpile(source, options)`的code和map
再来看下`transpile`方法做了啥
![babel-loader-transpile](https://note.youdao.com/yws/public/resource/ccd7c65d76760773562c7a0fd1edabfd/xmlnote/AFA25D095ECC4A5CACCEB278C6547D3E/6360)
babel-loader是通过babel.transform来实现对代码的编译的，
这么看来，所以我们只需要几行代码就可以实现一个简单的babel-loader
```js
const babel = require("babel-core")
module.exports = function (source) {
  const babelOptions = {
    presets: ['env']
  }
  return babel.transform(source, babelOptions).code
}
```

### 参考文献
1. [官网webpack loader api] (https://www.webpackjs.com/api/loaders/)
2. [手把手教你写webpack yaml-loader]：(https://mp.weixin.qq.com/s/gTAq5K5pziPT4tmiGqw5_w)
3. [言川-webpack 源码解析系列]:(https://github.com/lihongxun945/diving-into-webpack)
