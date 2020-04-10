const md = require('markdown-ast');
const loaderUtils = require("loader-utils");
// 利用 AST 作源码转换
class MdParser {
	constructor(content) {
		this.data = md(content);
		this.parse()
	}
	parse() {
		console.log("md转抽象语法树")
		this.data = this.traverse(this.data);
	}
	traverse(ast) {
		console.log(ast)
		ast.map(item => {
			switch (item.type) {
			case "bold":
				// **text**

				break;
			case "border":
				// **text**

				break;
			case "break":
				break;
			case "codeBlock":
				break;
			case "codeSpan":
				break;
			case "image":
				break;
			case "italic":
				break;
			case "link":
				break;
			case "linkDefinition":
				break;
			case "list":
				break;
			case "quote":
				break;
			case "strike":
				break;
			case "text":
				break;
			case "title":
        break;
			default:
				throw Error("error",`No corresponding treatment when item.type equal${item.type}`);
			}
		})

	}
}
 
module.exports = function(content) {
	this.cacheable && this.cacheable();
	const options = loaderUtils.getOptions(this);
	try {
    console.log(md(content))
		const parser = new MdParser(content);
		return parser
	} catch (err) {
		this.emitError(err);
		return null
	}
};