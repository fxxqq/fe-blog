var nums1 = [1, 2, 3, 4]
var nums2 = [3, 4, 5]

var merge = function (nums1, nums2) {
  var m = nums1.length
  var n = nums2.length
  var p1 = 0,
    p2 = 0
  var sorted = new Array(m + n).fill(0)
  var cur
  while (p1 < m || p2 < n) {
    if (p1 === m) {
      cur = nums2[p2++]
    } else if (p2 === n) {
      cur = nums1[p1++]
    } else if (nums1[p1] < nums2[p2]) {
      cur = nums1[p1++]
    } else {
      cur = nums2[p2++]
    }
    sorted[p1 + p2 - 1] = cur
  }
  console.log(sorted)
}
merge(nums1, nums2)

// 参考
// https://leetcode-cn.com/problems/merge-sorted-array/solution/he-bing-liang-ge-you-xu-shu-zu-by-leetco-rrb0/
