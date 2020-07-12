/*
示例 1:

输入: ["flower","flow","flight"]
输出: "fl"
复制代码
示例 2:

输入: ["dog","racecar","car"]
输出: ""
解释: 输入不存在公共前缀。
复制代码
说明:

所有输入只包含小写字母 a-z 。
*/
var strs = ["flower", "flow", "flight"]
var longestCommonPrefix = function(strs) {
  if (strs === null || strs.length === 0) return "";
  let prevs = strs[0]
  for (let i = 1; i < strs.length; i++) {
    let j = 0
    for (; j < prevs.length && j < strs[i].length; j++) {
      if (prevs.charAt(j) !== strs[i].charAt(j)) break
    }
    prevs = prevs.substring(0, j)
    if (prevs === "") return ""
  }
  console.log(prevs)
  return prevs
};
longestCommonPrefix(strs)