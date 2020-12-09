//lastPromise实现
//业务需求中，经常有 只需要最后一次请求的结果（比如搜索）编写一个高阶函数，传递旧请求方法（执行后返回 promise），返回一个新方法。
//连续触发时，若上一次 promise 执行未结束则直接废弃，只有最后一次 promise 会触发then/reject。

// 示例
let count = 1
let promiseFunction = () =>
  new Promise((rs) =>
    window.setTimeout(() => {
      rs(count++)
    })
  )

// 1. 传递旧请求方法（执行后返回 promise），返回一个新方法
// 2. 连续触发时，若上一次 promise 执行未结束则直接废弃，只有最后一次 promise 会触发then/reject
/**
 * 只有最后一次promise会then与reject
 * @param {function} promiseFunction
 * promiseFunction 示例： () => fetch('data')
 */

const lastPromise = (promise) => {
  let hasCanceled_ = false
  const wrappedPromise = new Promise((resolve, reject) => {
    promise
      .then((val) =>
        hasCanceled_ ? reject({ isCanceled: true }) : resolve(val)
      )
      .catch((error) =>
        hasCanceled_ ? reject({ isCanceled: true }) : reject(error)
      )
  })
  return {
    promise: wrappedPromise,
    cancel() {
      hasCanceled_ = true
    },
  }
}

let lastFn = lastPromise(promiseFunction).promise

lastFn().then(console.log) // 无输出
lastFn().then(console.log) // 无输出
lastFn().then(console.log) // 3
