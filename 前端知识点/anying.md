### 介绍 JS 数据类型，基本数据类型和引用数据类型的区别。

a. 他们分别储存在哪里？

b. 栈和堆的区别？js 垃圾回收时，栈和堆的区别

答案：
基本数据
类型包括：undefined,null,number,boolean,string

1.  基本数据类型的值是不可变的
2.  基本数据类型不可以添加属性和方法
3.  基本数据类型的赋值是简单赋值
4.  基本数据类型的比较是值的比较
5.  基本数据类型是存放在栈区的

引用类型
Object,Array,Function

1.  引用类型的值是可以改变的
2.  引用类型可以添加属性和方法
3.  引用类型的赋值是对象引用
4.  引用类型的比较是引用的比较
5.  引用类型是同时保存在栈区和堆区中的

栈优点：存取速度比堆快，仅次于直接位于 CPU 中的寄存器，数据可以共享；
栈缺点：存在栈中的数据大小与生存期必须是确定的，缺乏灵活性。
栈中存放局部变量，内存的释放是系统控制实现的。（局部变量的存活时间是这个函数调用完之后）
堆的空间大，栈的空间小
堆中存放对象，需要手动释放内存。（垃圾回收机制）

https://segmentfault.com/a/1190000008472264

### 介绍闭包以及闭包为什么没清除

a. 闭包的使用场景

### 发布-订阅和观察者模式的区别

### 平常是怎么做继承

### 深拷贝和浅拷贝

### React 生命周期及自己的理解

挂载 更新 卸载
挂载

1. constructor
   初始化 state 对象
   给自定义方法绑定 this
2. getDerivedStateFromProps
3. componentWillMount/UNSAFE_componentWillMount
4. render
5. componentDidMount

更新

1. componentWillReceiveProps/UNSAFE_componentWillReceiveProps
2. getDerivedStateFromProps
3. shouldComponentUpdate
4. componentWillUpdate/UNSAFE_componentWillUpdate
5. render
6. getSnapshotBeforeUpdate
7. componentDidUpdate

卸载

1. componentWillUnmount

a. React 中 setState 后发生了什么
b. 虚拟 DOM 主要做了什么
c. 虚拟 DOM 本身是什么（JS 对象）
https://xixili.online/2020/03/18/%E5%89%8D%E7%AB%AF%E5%9F%BA%E6%9C%AC%E4%B9%8B%E8%99%9A%E6%8B%9Fdom%EF%BC%88virtual%20DOM%EF%BC%89%E7%9A%84%E5%B7%A5%E4%BD%9C%E5%8E%9F%E7%90%86/
d. react key 的作用？

### 介绍 Redux，以及数据流的流程

a. Redux 如何实现多个组件之间的通信，多个组件使用相同状态如何进行管理
b. 多个组件之间如何拆分各自的 state，每块小的组件有自己的状态，它们之间还有一些公共的状态需要维护，如何思考这块

### 了解过服务端渲染 SSR 么

### 自己遇到过哪些跨域问题，又时如何解决的

a. 介绍 jsnop 跨域方案，以及服务端要如何配合

### ES6 相关

a. promise 的有几个状态
b. promise、async 有什么区别
c. promise.all()是如何实现的
d. 对 async、await 的理解，内部原理
e. 箭头函数的 this 指向哪里

### promise 和 setTimeout 执行的先后顺序？

### 什么是宏任务、微任务

工程篇

### webpack 的生命周期

compile 开始编译
make 从入口点分析模块及其依赖的模块，创建这些模块对象
build-module 构建模块
after-compile 完成构建
seal 封装构建结果
emit 把各个 chunk 输出到结果文件
after-emit 完成输出

a. webpack 打包的整个过程
b. loader 和 plugin 有什么区别
c. 常用的 loader 和 plugin 有哪些
性能优化

### 单页面 spa 应用有哪些缺点？做过哪些性能优化

### react 做过哪些性能优化

### 做过防抖和节流么？防抖和节流的区别

### 自己做那些前端性能优化

综合

### 做过哪些技术方面比较有挑战的事情
