const tree = {
  name: 'root',
  children: [
    { name: '叶子1-1' },
    { name: '叶子1-2' },
    {
      name: '叶子2-1',
      children: [{
        name: '叶子3-1',
        children: [{
          name: '叶子4-1'
        }]
      }]
    }
  ]
}

function getDepth(tree) {
  var arr = [];
  arr.push(tree);
  var depth = 0;
  while (arr.length > 0) {
    var temp = [];
    for (var i = 0; i < arr.length; i++) {
      temp.push(arr[i]);
    }
    arr = [];
    for (var i = 0; i < temp.length; i++) {
      if (temp[i].children) {
        for (var j = 0; j < temp[i].children.length; j++) {
          arr.push(temp[i].children[j]);
        }
      }
    }

    if (arr.length >= 0) {
      depth++;
    }
  }
  return depth;
}

console.log(getDepth(tree));