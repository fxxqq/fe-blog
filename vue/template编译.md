简而言之， 就是先转化成 AST 树， 再得到的 render 函数返回 VNode（ Vue 的虚拟 DOM 节点）， 详细步骤如下：

首先， 通过 compile 编译器把 template 编译成 AST 语法树（ abstract syntax tree 即 源代码的抽象语法结构的树状表现形式）， compile 是 createCompiler 的返回值， createCompiler 是用以创建编译器的。 另外 compile 还负责合并 option。
然后， AST 会经过 generate（ 将 AST 语法树转化成 render funtion 字符串的过程） 得到 render 函数， render 的返回值是 VNode， VNode 是 Vue 的虚拟 DOM 节点， 里面有（ 标签名、 子节点、 文本等等）
