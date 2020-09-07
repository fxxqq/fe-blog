// 实现柯里化函数
function currying(fn, ...args) {
  return args.length >= fn.length ? fn(...args) : (...args2) => currying(fn, ...args, ...args2)
}
console.log(currying(2, 2)(3)(4))

// https://zhuanlan.zhihu.com/p/33374547

// 方法2
function currying() {
  let args = []

  args.push(...arguments)

  let fn = () => {
    args.push(...arguments)

    return fn
  }

  fn.toString = () => {
    return args.reduce((t, i) => t + i, 0)
  }

  return fn
}
console.log(currying(2, 2)(3)(4))