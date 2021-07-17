const tree = {
  name: 'root',
  children: [
    { name: '叶子1-1' },
    { name: '叶子1-2' },
    {
      name: '叶子2-1',
      children: [
        {
          name: '叶子3-1',
          children: [
            {
              name: '叶子4-1',
            },
          ],
        },
      ],
    },
  ],
}

function getDepth(tree) {
  let depth = 0

  if (tree) {
    let arr = [tree]
    let temp = arr
    while (temp.length) {
      arr = temp
      temp = []
      for (let i = 0; i < arr.length; i++) {
        if (arr[i].children && arr[i].children.length) {
          for (let j = 0; j < arr[i].children.length; j++) {
            temp.push(arr[i].children[j])
          }
        }
      }
      depth++
    }
  }

  return depth
}
console.log(getDepth(tree))
