// const a1 = [1, 3, 5, 7, 9]
// const a2 = [1, 2, 3, 4, 5]
// const findDiff = (arr1, arr2) => {
//   let ans = []
//   for (let m = 0; m < arr1.length; m++) {
//     if (!arr2.includes(arr1[m])) {
//       ans.push(arr1[m])
//     }
//   }
//   for (let m = 0; m < arr2.length; m++) {
//     if (!arr1.includes(arr2[m])) {
//       ans.push(arr2[m])
//     }
//   }
//   console.log(ans)
// }
// // a1 = [100]
// a1.push(1)
// console.log(a1)
// findDiff(a1, a2)
// prmosise async
// const r1 = 'A' && 'B'
// const r2 = 0 && 'B'
// const r3 = '' && 'B'
// console.log(r1, r2, r3)
let resList = [1, 1, 0]
let index = -1
const getPageResult = () => {
  index += 1
  return resList[index]
}
const request5 = () => {
  let start = 1
  let getRes = async () => {
    if (start > 5) {
      console.log('失败')
      return
    }
    let res = await getPageResult()
    if (res === 0) {
      console.log('成功')
    } else if (res === 1) {
      console.log('请求' + start)
      start += 1
      setTimeout(() => {
        getRes()
      }, 1000)
    } else if (res === 2) {
      console.log('失败')
    }
  }
  getRes()
}
request5()
// 0 成功
// 1 支付中
// 2 失败
