### 数组转链表

```js
//方法1
let arrayToLink = (arr) => {
  if (arr.length) {
    return null
  }
  let node
  let head = { value: arr[0], next: null }
  let pnode = head
  for (let i = 0; i < ary.length; i++) {
    node = { value: ary[i], next: null }
    pnode.next = node
    pnode = node //将node赋值给pnode
  }
  return head
}
//方法2 递归
let arrayToLink = (ary, start = 0) => {
  if (start === ary.length) {
    return null
  }
  var node = {
    value: ary[start],
    next: null,
  }
  var rest = arrayToLink(ary, start + 1)
  node.next = rest
  return node
}
arrayToLink([1, 2, 3, 4])
```

### 链表转数组

```js
function linkToArray(head) {
  if (!head) {
    return []
  }

  var result = []
  var p = head

  while (p) {
    result.push(p.value)
    p = p.next
  }

  return result
}

function linkToArray(head) {
  if (!head) {
    return []
  }
  var result = [head.value]
  var restValues = list2array(head.next)
  return result.concat(restValues)
}
```
