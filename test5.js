// const primes = []

// function getPrimes(n) {
//   // let dList=[2,3,5,7,11,13,17,19,23,29,31,37,41,43,47]
//   const isPrimesFn = (num) => {
//     let isPrimes = true
//     if (num === 1) {
//       return false
//     }

//     for (let i = 2; i < num; i++) {
//       if (num % i === 0) {
//         isPrimes = false
//       }
//     }
//     return isPrimes
//   }

//   for (let m = 1; m < n; m++) {
//     if (isPrimesFn(m)) {
//       primes.push(m)
//     }
//   }
//   return primes
// }

// getPrimes(1000)

// console.log(primes)

function foo() {
  console.log(this.a)
}
function doFoo(fn) {
  fn()
}
var obj = {
  a: 2,
  foo: foo,
}
var a = 'global'
doFoo(obj.foo)

// var a = 10
// ;(function () {
//   console.log(a)
//   a = 5
//   console.log(window.a)
//   console.log(a)
//   var a = 20
//   console.log(a)
// })()
