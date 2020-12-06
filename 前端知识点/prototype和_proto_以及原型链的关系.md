##### prototype

```js
//构造函数
function Person() {}
console.dir(Person.prototype)
```

原型 ：实例“继承”那个对象的属性。在原型上定义的属性，通过“继承”，实例也拥有了这个属性。“继承”这个行为是在 new 操作符内部实现的。

##### proto 隐式原型

实例通过`__proto__`访问到原型，所以如果是实例，那么就可以通过这个属性直接访问到原型：

```js
function Person() {}
//实例化函数
var person = new Person()
console.log('person', person)
console.log('Person', Person)
console.log(person.__proto__ === Person.prototype) //true
console.log(Person.prototype.constructor === Person) //true
```

##### 原型链

```js
function Person1() {}
Person1.prototype.name = 'frank'
function Person2() {}
Person2.prototype = new Person1()
let newPerson = new Person2()
console.log(newPerson.name) //输出frank
console.log(newPerson.__proto__)
console.log(newPerson.__proto__.__proto__)
console.log(newPerson.__proto__.__proto__.__proto__)
```

原型同样也可以通过 `__proto__`访问到原型的原型
比方说这里有个构造函数 Person1 然后“继承”前者的有一个构造函数 Person2 ，然后 new Person1 得到实例 newPerson

当访问 newPerson 中的一个非自有属性的时候，就会通过 `__proto__` 作为桥梁连接起来的一系列原型、原型的原型、原型的原型的原型直到 Object 构造函数为止。
这个搜索的过程形成的链状关系就是原型链

![原型链](https://cdn.6fed.com/github/js-basis/%E5%8E%9F%E5%9E%8B%E9%93%BE.jpg)

参考
[图解原型和原型链](https://juejin.im/post/5c8a692af265da2d8763b744)
