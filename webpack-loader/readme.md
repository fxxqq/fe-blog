本文会带你简单的认识一下webpack的loader，动手实现一个利用md转成抽象语法树，再转成html字符串的loader。顺便简单的了解一下几个style-loader，vue-loader，babel-loader的源码以及工作流程。

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
**md通过正则切割的方法转成抽象语树**
![md-ast](https://note.youdao.com/yws/public/resource/ccd7c65d76760773562c7a0fd1edabfd/xmlnote/B8D7F611A3274F43827F1D617B3601E1/6379)

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
为什么要先执行`style-loader`呢，因为我们要把`css-loader`拿到的内容最终输出成CSS样式中可以用的代码而不是字符串。

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

##### vue-loader源码简析
vue单文件组件（简称sfc）
```vue
<template>
  <div class="text">
    {{a}}
  </div>
</template>
<script>
export default {
  data () {
    return {
      a: "vue demo"
    };
  }
};
</script>
<style lang="scss" scope>
.text {
  color: red;
}
</style>
```
webpack配置
```js
const VueloaderPlugin = require('vue-loader/lib/plugin')
module.exports = {
  ...
  module: {
    rules: [
      ...
      {
        test: /\.vue$/,
        loader: 'vue-loader'
      }
    ]
  }

  plugins: [
    new VueloaderPlugin()
  ]
  ...
}
```
**VueLoaderPlugin**
作用：将在webpack.config定义过的其它规则复制并应用到 .vue 文件里相应语言的块中。

`plugin-webpack4.js`
```js
 const vueLoaderUse = vueUse[vueLoaderUseIndex]
    vueLoaderUse.ident = 'vue-loader-options'
    vueLoaderUse.options = vueLoaderUse.options || {}
    // cloneRule会修改原始rule的resource和resourceQuery配置，
    // 携带特殊query的文件路径将被应用对应rule
    const clonedRules = rules
      .filter(r => r !== vueRule)
      .map(cloneRule)

    // global pitcher (responsible for injecting template compiler loader & CSS
    // post loader)
    const pitcher = {
      loader: require.resolve('./loaders/pitcher'),
      resourceQuery: query => {
        const parsed = qs.parse(query.slice(1))
        return parsed.vue != null
      },
      options: {
        cacheDirectory: vueLoaderUse.options.cacheDirectory,
        cacheIdentifier: vueLoaderUse.options.cacheIdentifier
      }
    }

    // 更新webpack的rules配置，这样vue单文件中的各个标签可以应用clonedRules相关的配置
    compiler.options.module.rules = [
      pitcher,
      ...clonedRules,
      ...rules
    ]
```
获取`webpack.config.js`的rules项，然后复制rules，为携带了`?vue&lang=xx...query`参数的文件依赖配置xx后缀文件同样的loader
为Vue文件配置一个公共的loader：pitcher
将`[pitchLoder, ...clonedRules, ...rules]`作为webapck新的rules。

再看一下`vue-loader`结果的输出
![vue-loader-result](https://note.youdao.com/yws/public/resource/ccd7c65d76760773562c7a0fd1edabfd/xmlnote/ADD8440EB03E4A609CD1E7AE4F68F48F/6375)
当引入一个vue文件后，vue-loader是将vue单文件组件进行parse，获取每个 block 的相关内容，将不同类型的 block 组件的 Vue SFC 转化成 js module 字符串。

```js
// vue-loader使用`@vue/component-compiler-utils`将SFC源码解析成SFC描述符,,根据不同 module path 的类型(query 参数上的 type 字段)来抽离 SFC 当中不同类型的 block。
const { parse } = require('@vue/component-compiler-utils')
// 将单个*.vue文件内容解析成一个descriptor对象，也称为SFC（Single-File Components）对象
// descriptor包含template、script、style等标签的属性和内容，方便为每种标签做对应处理
const descriptor = parse({
  source,
  compiler: options.compiler || loadTemplateCompiler(loaderContext),
  filename,
  sourceRoot,
  needMap: sourceMap
})

// 为单文件组件生成唯一哈希id
const id = hash(
  isProduction
  ? (shortFilePath + '\n' + source)
  : shortFilePath
)
// 如果某个style标签包含scoped属性，则需要进行CSS Scoped处理
const hasScoped = descriptor.styles.some(s => s.scoped)
```
然后下一步将新生成的 js module 加入到 webpack 的编译环节，即对这个 js module 进行 AST 的解析以及相关依赖的收集过程。

来看下源码是怎么操作不同type类型（`template/script/style`）的，selectBlock 方法内部主要就是根据不同的 type 类型，来获取 descriptor 上对应类型的 content 内容并传入到下一个 loader 处理
![vue-loader源码](https://note.youdao.com/yws/public/resource/ccd7c65d76760773562c7a0fd1edabfd/xmlnote/B8D7F611A3274F43827F1D617B3601E1/6379)
这三段代码可以把不同type解析成一个import的字符串
```js
import { render, staticRenderFns } from "./App.vue?vue&type=template&id=7ba5bd90&"
import script from "./App.vue?vue&type=script&lang=js&"
export * from "./App.vue?vue&type=script&lang=js&"
import style0 from "./App.vue?vue&type=style&index=0&lang=scss&scope=true&"
```
**总结一下vue-loader的工作流程**
1. 注册`VueLoaderPlugin`
在插件中，会复制当前项目webpack配置中的rules项，当资源路径包含query.lang时通过resourceQuery匹配相同的rules并执行对应loader时
插入一个公共的loader，并在pitch阶段根据query.type插入对应的自定义loader
2. 加载*.vue时会调用`vue-loader`,.vue文件被解析成一个`descriptor`对象，包含`template、script、styles`等属性对应各个标签，
对于每个标签，会根据标签属性拼接`src?vue&query`引用代码，其中src为单页面组件路径，query为一些特性的参数，比较重要的有lang、type和scoped
如果包含lang属性，会匹配与该后缀相同的rules并应用对应的loaders
根据type执行对应的自定义loader，`template`将执行`templateLoader`、`style`将执行`stylePostLoader`
3. 在`templateLoader`中，会通过`vue-template-compiler`将template转换为render函数，在此过程中，
会将传入的`scopeId`追加到每个标签的上，最后作为vnode的配置属性传递给`createElemenet`方法，
在render函数调用并渲染页面时，会将`scopeId`属性作为原始属性渲染到页面上
4. 在`stylePostLoader`中，通过PostCSS解析style标签内容

### 参考文献
1. [webpack官网loader api](https://www.webpackjs.com/api/loaders/)
2. [手把手教你写webpack yaml-loader](https://mp.weixin.qq.com/s/gTAq5K5pziPT4tmiGqw5_w)
3. [言川-webpack 源码解析系列](https://github.com/lihongxun945/diving-into-webpack)
4. [从vue-loader源码分析CSS Scoped的实现](https://juejin.im/post/5d8627355188253f3a70c22c)
