监听器 Observer：用来劫持并通过 Object.defineProperty 监听所有属性（转变成 setter/getter 形式），如果属性发生变化，就通知订阅者。

订阅器 Dep：用来收集订阅者，对监听器 Observer 和 订阅者 Watcher 进行统一管理。

订阅者 Watcher：监听器 Observer 和解析器 Compile 之间通信的桥梁；如果收到属性的变化通知，就会执行相应的方法，从而更新视图。

解析器 Compile：可以解析每个节点的相关指令，对模板数据和订阅器进行初始化。
主要做的事情是:

在自身实例化时往属性订阅器(dep)里面添加自己。
自身有一个 update()方法。
待属性变动 dep.notice()通知时，能调用自身的 update()方法，并触发解析器(Compile)中绑定的回调。

总结：vue.js 是采用数据劫持结合发布者-订阅者模式的方式，通过 Object.defineProperty()来劫持各个属性的 setter，getter，在数据变动时发布消息给订阅者，触发相应的监听回调。
Vue3.0 的 Proxy 相比于 defineProperty 的优势
Object.defineProperty() 的问题主要有三个：

不能监听数组的变化
必须遍历对象的每个属性
必须深层遍历嵌套的对象

Proxy 在 ES2015 规范中被正式加入，它有以下几个特点：
针对对象： 针对整个对象，而不是对象的某个属性，所以也就不需要对 keys 进行遍历。这解决了上述 Object.defineProperty() 第二个问题。
支持数组： Proxy 不需要对数组的方法进行重载，省去了众多 hack，减少代码量等于减少了维护成本，而且标准的就是最好的。

Vue 的双向数据绑定原理是什么？
vue.js 是采用数据劫持结合发布者-订阅者模式的方式，通过 Object.defineProperty()来劫持各个属性的 setter，getter，在数据变动时发布消息给订阅者，触发相应的监听回调。主要分为以下几个步骤：

1、需要 observe 的数据对象进行递归遍历，包括子属性对象的属性，都加上 setter 和 getter 这样的话，给这个对象的某个值赋值，就会触发 setter，那么就能监听到了数据变化
2、compile 解析模板指令，将模板中的变量替换成数据，然后初始化渲染页面视图，并将每个指令对应的节点绑定更新函数，添加监听数据的订阅者，一旦数据有变动，收到通知，更新视图
3、Watcher 订阅者是 Observer 和 Compile 之间通信的桥梁，主要做的事情是: ① 在自身实例化时往属性订阅器(dep)里面添加自己 ② 自身必须有一个 update()方法 ③ 待属性变动 dep.notice()通知时，能调用自身的 update()方法，并触发 Compile 中绑定的回调，则功成身退。
4、MVVM 作为数据绑定的入口，整合 Observer、Compile 和 Watcher 三者，通过 Observer 来监听自己的 model 数据变化，通过 Compile 来解析编译模板指令，最终利用 Watcher 搭起 Observer 和 Compile 之间的通信桥梁，达到数据变化 -> 视图更新；视图交互变化(input) -> 数据 model 变更的双向绑定效果。

https://juejin.im/entry/5923973da22b9d005893805a

https://www.jianshu.com/p/f194619f6f26
