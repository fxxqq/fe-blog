var strs = ['flower', 'flow', 'flight']
var longestCommonPrefix = function(strs) {
  if (strs === null || strs.length === 0) return ''
  let prevs = strs[0]
  for (let i = 1; i < strs.length; i++) {
    let j = 0
    for (; j < prevs.length && j < strs[i].length; j++) {
      console.log(j, i, prevs[j], strs[i][j])
      if (prevs[j] !== strs[i][j]) break
    }
    console.log(j)
    prevs = prevs.slice(0, j)
    if (prevs === '') return ''
  }
  console.log(prevs)
  return prevs
}
longestCommonPrefix(strs)