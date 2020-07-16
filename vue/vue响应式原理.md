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

https://juejin.im/entry/5923973da22b9d005893805a

https://www.jianshu.com/p/f194619f6f26
