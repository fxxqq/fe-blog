const tree = {
  name: 'root',
  children: [
    { name: '叶子一' },
    { name: '叶子二' },
    {
      name: '叶子三',
      children: [{
        name: '叶子四',
        children: [{
          name: '叶子五'
        }]
      }]
    }
  ]
}

let index = 1

var treeHeight = (tree) => {
  if (tree.children) {
    console.log("index", index)
    index += 1
    treeHeight(tree.children)
  }

  return index
}
console.log("22", treeHeight(tree))