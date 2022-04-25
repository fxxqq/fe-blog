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

//blog.csdn.net/susuzhe123/article/details/95353403

function transfer(treeData) {
  if (!(!treeData.hasOwnProperty('name') || !treeData)) {
    let arr = []
    let obj = {}
    obj.name = treeData.name
    obj.children = treeData.children.map((value) => {
      // [1] arr = arr.concat(transfer(value))
      return value.name
    })
    arr.push(obj)

    // 这段代码可由代码 [1] 替代，替代后父元素在子元素后
    treeData.children.forEach((value) => {
      arr = arr.concat(transfer(value))
    })
    //

    return arr
  } else {
    // 初始treeData是否为空树
    return []
  }
}
