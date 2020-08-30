/*
 思路：new 做了什么？
  1. 创建一个对象，使得创建的对象的__proto__ === Fn.prototype
  2. 调用Fn 的构造函数。传入的this 是创建的对象。
  3. 如果Fn 的构造函数返回了一个对象，则返回这个对象，如果是普通类型的值，返回新建的对象。
*/

function person(options) {
  this.name = options.name
    // return this.name 或者 {} 可以自己试试啥效果 
}

function myNew(fn, options) {
  var obj = {}
  obj.__proto__ = fn.prototype

  var res = fn.call(obj, options)

  if (typeof res === 'object') {
    return res
  }

  return obj
}

var p = myNew(person, { name: '小强' }) // person {name: "小强"}

var p2 = new person({ name: '小强' }) // person {name: "小强"}