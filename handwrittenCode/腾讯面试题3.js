// 生成长度为n的int型随机数组，数组元素范围为0~n-1，
// 每个元素都是唯一的。只使用基本数据类型。

let getRandomArray = (len) => {
  // let result = []
  // for (let i = 0; i < n - 1; i++) {
  //   let temp = []
  //   temp.push(i)
  //   for (let l = n - 1; l < i; l--) {
  //     temp.push(l)
  //   }
  //   console.log(temp)
  // }
  let result = []

  for (let i = 0; i < len; i++) {
    result.push(i)
  }
  let swap = (a, b, array) => {
    let temp = ''
    temp = array[a]
    array[a] = array[b]
    array[b] = temp
    return JSON.parse(JSON.stringify(array))
  }
  // console.log(swap(1, 2, result))
  let list = []
  for (let m = 0; m < len; m++) {
    for (let n = 0; n < len; n++) {
      list.push(swap(m, n, result))
      // console.log(m, n, swap(m, n, result), list)
    }
  }
  console.log('list', list)
  let randomIndex = Math.random
  console.log(Math.random() * 10)
  // return list[]
}

getRandomArray(5)
