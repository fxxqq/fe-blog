// 实现带有超时功能的 Promise
async function executeWithTimeout(fn, ms) {
  let timeout = new Promise(function (reslove, reject) {
    setTimeout(() => {
      reject('timeout')
    }, ms)
  })
  return Promise.race([timeout, fn()])
}
async function fn1() {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      resolve()
    }, 400)
  })
}
executeWithTimeout(fn1, 300)
  .then(() => {
    console.log('sucess')
    // ok
  })
  .catch((err) => {
    console.log(1, err)
    // timeout
  })
