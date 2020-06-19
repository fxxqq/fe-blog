const loaderUtils = require("loader-utils");
const md = require('markdown-ast'); //md通过正则匹配的方法把buffer转抽象语法树
const hljs = require('highlight.js'); //代码高亮插件
// 利用 AST 作源码转换
class MdParser {
  constructor(content) {
    this.data = md(content);
    this.parse()
  }
  parse() {
    this.data = this.traverse(this.data);
  }
  traverse(ast) {
    console.log(ast)
    let body = '';
    ast.map(item => {
      switch (item.type) {
        case "bold":
          body += `'<strong>${this.traverse(item.block)}</strong>'`
          break;
        case "break":
          body += '<br/> '
          break;
        case "codeBlock":
          const highlightedCode = hljs.highlight(item.syntax, item.code).value
          body += highlightedCode
          break;
        case "codeSpan":
          body += `<code>${item.code}</code>`
          break;
        case "image":
          body += `<img src=${item.type} alt=${item.alt} rel=${item.rel||''}>`
          break;
        case "italic":
          body += `<em> ${this.traverse(item.block)}</em>`;
          break;
        case "link":
          let linkString = this.traverse(item.block)
          body += `<a href=${item.url}> ${linkString}<a/>`
          break;
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
          body += `<del>${this.traverse(item.block)}</del>`
          break;
        case "text":
          body += item.text
          break;
        case "title":
          body += `<h${item.rank}>${this.traverse(item.block)}</h${item.rank}>`
          break;
        default:
          throw Error("error", `No corresponding treatment when item.type equal${item.type}`);
      }
    })
    return body
  }
}

module.exports = function(content) {
  this.cacheable && this.cacheable();
  const options = loaderUtils.getOptions(this);
  try {
    const parser = new MdParser(content);
    return parser.data
  } catch (err) {
    throw err;
  }
};