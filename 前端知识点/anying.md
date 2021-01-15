### 深拷贝和浅拷贝

a. React 中 setState 后发生了什么
b. 虚拟 DOM 主要做了什么
c. 虚拟 DOM 本身是什么（JS 对象）
https://xixili.online/2020/03/18/%E5%89%8D%E7%AB%AF%E5%9F%BA%E6%9C%AC%E4%B9%8B%E8%99%9A%E6%8B%9Fdom%EF%BC%88virtual%20DOM%EF%BC%89%E7%9A%84%E5%B7%A5%E4%BD%9C%E5%8E%9F%E7%90%86/
d. react key 的作用？

### 介绍 Vuex，以及数据流的流程

a. Redux 如何实现多个组件之间的通信，多个组件使用相同状态如何进行管理
b. 多个组件之间如何拆分各自的 state，每块小的组件有自己的状态，
它们之间还有一些公共的状态需要维护，如何思考这块

### vue

a. computed/watch 原理
b. 数据绑定

### 了解过服务端渲染 SSR 么

页面的首开率和白屏率确实能影响一个产品的用户留存
SSR 是借用了 service 的能力去尽可能提高页面首屏性能。

从 app 的图文列表页点进去一些图文详情页或者理财师的个人主页，如果图文详情页渲染时间太久会导致用户流失，肯定会影响 app 的收益。
所以对于我们前端同学来说，提高首屏效率确实是我们前端领域亟待解决的问题。于是我们就开始对现有的图文详情页和个人主页进行性能改造。

首先来讲解一下几个常用的性能指标术语

首屏时间 fsp（first-screen-paint） 从开始下载(navigation)到首屏内容包含图片全部渲染完成的时间，直到用户可以看到首屏的全部内容，
计算方式分为两种
首次绘制时间 fmp(first-meaningful-paint) 页面的主要内容开始出现在屏幕上的时间点
可交互时间 ttl（time-to-interactive） 从开始下载(navigation)到屏幕首屏全部渲染完成的时间，渲染完成后，且页面没有长时间卡顿。

用户请求-webview 启动-请求 html、document-页面框架渲染-js 资源请求

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
[option=>编译=>build](https://user-gold-cdn.xitu.io/2020/6/21/172d2bc7fd4e2447?imageslim)

b. loader 和 plugin 有什么区别
c. 常用的 loader 和 plugin 有哪些

综合

### 单页面 spa 应用有哪些缺点？做过哪些性能优化

### react 做过哪些性能优化

### 做过防抖和节流么？防抖和节流的区别

### 自己做那些前端性能优化

### 做过哪些技术方面比较有挑战的事情
