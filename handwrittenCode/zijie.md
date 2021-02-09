Excel 中每列的编号是字母 A B C ... Z AA AB ... ZZ AAA AAB...，写一个生成算法，生成前 1000 列

```js
function encode(n) {
  let s = ''
  while (n > 0) {
    let m = n % 26
    if (m === 0) m = 26
    s = String.fromCharCode(m + 64) + s
    n = (n - m) / 26
  }
  return s
}
```
