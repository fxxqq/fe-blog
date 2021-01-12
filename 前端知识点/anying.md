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

闭包就是函数套函数
在闭包里面,内部的函数可以访问到外部函数作用域内的变量,但是外部的函数不能访问内部函数作用域内的变量

a. 闭包的使用场景

1、可以读取内部函数的变量；
2、让这些变量的值始终保存在内存中，不会被调用后就被垃圾回收机制收回；
3、用来模块化代码（类块级作用域）。

### 发布-订阅和观察者模式的区别

订阅模式有一个调度中心，对订阅事件进行统一管理。
而观察者模式可以随意注册事件，调用事件，虽然实现原理都雷同，设计模式上有一定的差别，
实际代码运用中差别在于：订阅模式中，可以抽离出调度中心单独成一个文件，
可以对一系列的订阅事件进行统一管理。这样和观察者模式中的事件漫天飞就有千差万别了，
在开发大型项目的时候，订阅/发布模式会让业务更清晰！

### 平常是怎么做继承

1. 原型链继承
   父类构造函数中的引用类型（比如对象/数组），会被所有子类实例共享。
   其中一个子类实例进行修改，会导致所有其他子类实例的这个值都会改变
2. 构造继承
   解决了原型链继承中构造函数引用类型共享的问题，同时可以向构造函数传参（通过 call 传参）
   所有方法都定义在构造函数中，每次都需要重新创建
   （对比原型链继承的方式，方法直接写在原型上，子类创建时不需要重新创建方法）
3. 组合继承
   同时解决了构造函数引用类型的问题，同时避免了方法会被创建多次的问题
   父类构造函数被调用了两次。
4. 寄生组合继承
   这种方式就解决了组合继承中的构造函数调用两次，构造函数引用类型共享，
   以及原型对象上存在多余属性的问题。是推荐的最合理实现方式
5. ES6 继承

### 深拷贝和浅拷贝

### React 生命周期及自己的理解

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

### 路由原理

路由原理：前段路由实现本质是监听 URL 的变化，然后匹配路由规则显示相应页面，并且无须刷新。
hash 模式：
a: 点击或浏览器历史跳转时，
触发 onhashchange 事件,
然后根据路由规则匹配显示相应页面(遍历路由表，装载相应组件到 router-link)；
b: 手动刷新时,不会像服务器发送请求（不会触发 onhashchange），
触发 onload 事件，然后根据路由规则匹配显示相应页面；
history 模式：
a:跳转时会调用 history.pushState 方法,
根据 to 属性改变地址，并切换相应组件到 router-link;
b:浏览器历史操作（前进，后退）,只会改变地址栏（页面内容不会变）,
不会切换组件，需要使用 popstate 方法来切换组件；
c: 手动刷新,需要后端配合重定向，不然 404

### 单页面 spa 应用有哪些缺点？做过哪些性能优化

### react 做过哪些性能优化

### 做过防抖和节流么？防抖和节流的区别

### 自己做那些前端性能优化

### 做过哪些技术方面比较有挑战的事情
