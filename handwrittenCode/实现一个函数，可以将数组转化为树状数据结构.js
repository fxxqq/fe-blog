//  题目：实现一个函数，可以将数组转化为树状数据结构
const arr = [
  { id: 1, name: 'i1' },
  { id: 2, name: 'i2', parentId: 1 },
  { id: 4, name: 'i4', parentId: 3 },
  { id: 3, name: 'i3', parentId: 2 },
  { id: 8, name: 'i8', parentId: 7 },
]

/* 可以将数组转化为树状数据结构，要求程序具有侦测错误输入的能力*/
function buildTree(arr) {
  let tree = {}
  let temp = {}
  for (let i = 0; i++; i < arr.length) {
    temp[item.parentId] = item
  }
  for (let i = 0, len = list.length; i < len; i++) {
    let id = list[i].parentId
    if (id == parId) {
      result.push(list[i])
      continue
    }
  }

  return tree
}

console.log(buildTree(arr))

https://blog.csdn.net/susuzhe123/article/details/95353403
