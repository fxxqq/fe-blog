### 双向绑定原理

vue 数据双向绑定是通过数据劫持和发布者-订阅者模式，回顾一下实现双向绑定的几个步骤：

1. 首先要对数据进行劫持监听，所以我们需要设置一个监听器 Observer，用来监听所有属性。
2. 属性发生变化的话，就需要告诉订阅者 Watcher 看是否需要更新。因为订阅者是有很多个，所以我们需要有一个消息订阅器 Dep 来专门收集这些订阅者，然后在监听器 Observer 和订阅者 Watcher 之间进行统一管理的。
3. 接着，我们还需要有一个指令解析器 Compile，对每个节点元素进行扫描和解析，将相关指令（如 v-model，v-on）对应初始化成一个订阅者 Watcher，并替换模板数据或者绑定相应的函数，此时当订阅者 Watcher 接收到相应属性的变化，就会执行对应的更新函数，从而更新视图。

监听器 Observer：用来劫持并通过 Object.defineProperty 监听所有属性（转变成 setter/getter 形式），如果属性发生变化，就通知订阅者。

订阅器 Dep：用来收集订阅者，对监听器 Observer 和 订阅者 Watcher 进行统一管理。

订阅者 Watcher：监听器 Observer 和解析器 Compile 之间通信的桥梁；每一个 Watcher 都绑定一个更新函数，watcher 可以收到属性的变化通知并执行相应的函数，从而更新视图。

解析器 Compile：可以扫描和解析每个节点的相关指令（v-model，v-on 等指令），如果节点存在 v-model，v-on 等指令，则解析器 Compile 初始化这类节点的模板数据，使之可以显示在视图上，然后初始化相应的订阅者（Watcher）。

主要做的事情是:

在自身实例化时往属性订阅器(dep)里面添加自己。
自身有一个 update()方法。
待属性变动 dep.notice()通知时，能调用自身的 update()方法，并触发解析器(Compile)中绑定的回调。

### Vue 的双向数据绑定原理是什么？

vue.js 是采用数据劫持结合发布者-订阅者模式的方式，通过 Object.defineProperty()来劫持各个属性的 setter，getter，在数据变动时发布消息给订阅者，触发相应的监听回调。主要分为以下几个步骤：

1、需要 observe 的数据对象进行递归遍历，包括子属性对象的属性，都加上 setter 和 getter 这样的话，给这个对象的某个值赋值，就会触发 setter，那么就能监听到了数据变化
2、compile 解析模板指令，将模板中的变量替换成数据，然后初始化渲染页面视图，并将每个指令对应的节点绑定更新函数，添加监听数据的订阅者，一旦数据有变动，收到通知，更新视图
3、Watcher 订阅者是 Observer 和 Compile 之间通信的桥梁，主要做的事情是: ① 在自身实例化时往属性订阅器(dep)里面添加自己 ② 自身必须有一个 update()方法 ③ 待属性变动 dep.notice()通知时，能调用自身的 update()方法，并触发 Compile 中绑定的回调，则功成身退。
4、MVVM 作为数据绑定的入口，整合 Observer、Compile 和 Watcher 三者，通过 Observer 来监听自己的 model 数据变化，通过 Compile 来解析编译模板指令，最终利用 Watcher 搭起 Observer 和 Compile 之间的通信桥梁，达到数据变化 -> 视图更新；视图交互变化(input) -> 数据 model 变更的双向绑定效果。

### 1.实现一个 Observer

```js
function Observer(data) {
  this.data = data
  this.walk(data)
}
Observer.prototype = {
  walk(data) {
    //遍历,对这个对象的所有属性都进行监听
    Object.keys(data).forEach(() => {
      this.defineReactive(data, key, data[key])
    })
  },
  defineReactive(data, key, val) {
    let dep = new Dep()
    let childObj = observe(val)
    Object.defineProperty(data, key, {
      enumerable: true,
      configurable: true,
      get: function getter() {
        if (Dep.target) {
          // 在这里添加一个订阅者
          console.log(Dep.target)
          dep.addSub(Dep.target)
        }
        return val
      },
      set: function setter() {
        if (newVal === val) {
          return
        }
        val = newVal
        childObj = observe(newVal)
        dep.notify()
      },
    })
  },
}
function observe(value, vm) {
  if (!value || typeof value !== 'object') {
    return
  }
  return new Observer(value)
}
// 消息订阅器Dep，订阅器Dep主要负责收集订阅者，然后在属性变化的时候执行对应订阅者的更新函数
function Dep() {
  this.subs = []
}
Dep.prototype = {
  addSub(sub) {
    this.subs.push(sub)
  },
  notify() {
    this.subs.forEach((sub) => {
      sub.update()
    })
  },
}
Dep.target = null
```

### 2.实现一个 Watcher

```js
function Watcher(vm, exp, cb) {
  this.cb = cb
  this.vm = vm
  this.exp = exp
  this.value = this.get() // 将自己添加到订阅器的操作
}
Watcher.prototype = {
  update() {
    this.run()
  },
  run() {
    let value = this.vm.data[this.exp]
    let oldVal = this.value
    if (value !== oldVal) {
      this.value = value
      this.cb.call(this.vm, value, oldVal)
    }
  },
  get() {
    Dep.target = this // 缓存自己
    let value = this.vm.data[this.exp] // 强制执行监听器里的get函数
    Dep.target = null // 释放自己
    return value
  },
}
```

### 3.实现一个 Compile

### Vue3.0 的 Proxy 相比于 defineProperty 的优势

Object.defineProperty() 的问题主要有三个：

不能监听数组的变化
必须遍历对象的每个属性
必须深层遍历嵌套的对象

Proxy 在 ES2015 规范中被正式加入，它有以下几个特点：
针对对象： 针对整个对象，而不是对象的某个属性，所以也就不需要对 keys 进行遍历。这解决了上述 Object.defineProperty() 第二个问题。
支持数组： Proxy 不需要对数组的方法进行重载，省去了众多 hack，减少代码量等于减少了维护成本，而且标准的就是最好的。

https://segmentfault.com/a/1190000006599500#comment-area
