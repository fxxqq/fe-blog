精选 100 道力扣（LeetCode）上最热门的题目，本篇文章只有 easy 级别的，适合初识算法与数据结构的新手和想要在短时间内高效提升的人。

## 1.两数之和

https://leetcode-cn.com/problems/two-sum

##### 方法一

```js
/**
 * @param {number[]} nums
 * @param {number} target
 * @return {number[]}
 */
var twoSum = function (nums, target) {
  for (let i = 0; i < nums.length; i++) {
    let diff = target - nums[i]
    for (let j = i + 1; j < nums.length; j++) {
      if (diff == nums[j]) {
        return [i, j]
      }
    }
  }
}
```

##### 方法二

```js
/**
 * @param {number[]} nums
 * @param {number} target
 * @return {number[]}
 */
var twoSum = function (nums, target) {
  var temp = []
  for (var i = 0; i < nums.length; i++) {
    var dif = target - nums[i]
    if (temp[dif] != undefined) {
      return [temp[dif], i]
    }
    temp[nums[i]] = i
  }
}
```

## 14.最长公共前缀

https://leetcode-cn.com/problems/longest-common-prefix

##### 思路：

1. 先遍历数组
2. 再遍历数组的第一个字符串，用字符串中的每一个字符和数组中的每一项的对应的该字符串下标相比，不同则跳出循环，两两找出公共前缀，最终结果即为最长公共前缀的长度 j。
3. 截取字符串长度 j 的字符即为最长公共前缀

```js
const strs = ['flower', 'flow', 'flight']
const longestCommonPrefix = function (strs) {
  if (strs === null || strs.length === 0) return ''
  let commonString = ''

  for (let i = 1; i < strs.length; i++) {
    let j = 0
    for (; j < strs[0].length && j < strs[i].length; j++) {
      if (strs[0][j] !== strs[i][j]) break
    }
    commonString = strs[0].substring(0, j)
  }
  return commonString
}
longestCommonPrefix(strs)
```

## 18.删除链表的节点

https://leetcode-cn.com/problems/shan-chu-lian-biao-de-jie-dian-lcof

```js
var deleteNode = function (head, val) {
  if (head.val === val) return head.next
  let prev = head,
    node = prev.next
  while (node) {
    if (node.val === val) {
      prev.next = node.next
    }
    prev = node
    node = node.next
  }
  return head
}
```

## 20.有效的括号

https://leetcode-cn.com/problems/valid-parentheses

##### 方法分析：

该题使用的堆栈（stack）的知识。栈具有先进后出（FILO）的特点。堆栈具有栈顶和栈底之分。所谓入栈，就是将元素压入（push）堆栈；所谓出栈，就是将栈顶元素弹出（pop）堆栈。先入栈的一定后出栈，所以可以利用堆栈来检测符号是否正确配对。

##### 解题思路：

1. 有效括号字符串的长度，一定是偶数！
2. 右括号前面，必须是相对应的左括号，才能抵消！
3. 右括号前面，不是对应的左括号，那么该字符串，一定不是有效的括号！

```js
var isValid = function (s) {
  let stack = []
  if (!s || s.length % 2) return false
  for (let item of s) {
    switch (item) {
      case '{':
      case '[':
      case '(':
        stack.push(item)
        break
      case '}':
        if (stack.pop() !== '{') return false
        break
      case '[':
        if (stack.pop() !== ']') return false
        break
      case '(':
        if (stack.pop() !== ')') return false
        break
    }
  }
  return !stack.length
}
```

## 21.合并两个有序链表

https://leetcode-cn.com/problems/merge-two-sorted-lists

```js
/**
 * Definition for singly-linked list.
 * function ListNode(val, next) {
 *     this.val = (val===undefined ? 0 : val)
 *     this.next = (next===undefined ? null : next)
 * }
 */
/**
 * @param {ListNode} l1
 * @param {ListNode} l2
 * @return {ListNode}
 */
var mergeTwoLists = function (l1, l2) {
  if (l1 === null) {
    return l2
  } else if (l2 === null) {
    return l1
  } else if (l1.val < l2.val) {
    l1.next = mergeTwoLists(l1.next, l2)
    return l1
  } else {
    l2.next = mergeTwoLists(l1, l2.next)
    return l2
  }
}
```

## 53.最大子序和

https://leetcode-cn.com/problems/maximum-subarray

```js
/**
 * @param {number[]} nums
 * @return {number}
 */
var maxSubArray = function (nums) {
  let ans = nums[0]
  let sum = 0
  for (const num of nums) {
    if (sum > 0) {
      sum += num
    } else {
      sum = num
    }
    ans = Math.max(ans, sum)
  }
  return ans
}
```

## 70.爬楼梯

https://leetcode-cn.com/problems/climbing-stairs

```js
var climbStairs = function (n) {
  let dp = []
  dp[0] = 1
  dp[1] = 1
  for (let i = 2; i <= n; i++) {
    dp[i] = dp[i - 1] + dp[i - 2]
  }
  return dp[n]
}
```

## 101.对称二叉树

https://leetcode-cn.com/problems/symmetric-tree

```js
/**递归 代码
 * @param {TreeNode} root
 * @return {boolean}
 */
var isSymmetric = function (root) {
  const check = (left, right) => {
    if (left == null && right == null) {
      return true
    }
    if (left && right) {
      return (
        left.val === right.val &&
        check(left.left, right.right) &&
        check(left.right, right.left)
      )
    }
    return false // 一个子树存在一个不存在，肯定不对称
  }
  if (root == null) {
    // 如果传入的root就是null，对称
    return true
  }
  return check(root.left, root.right)
}
```

## 112.路径总和

https://leetcode-cn.com/problems/path-sum

```js
var hasPathSum = function (root, targetSum) {
  // 深度优先遍历
  if (root === null) {
    //1.刚开始遍历时
    //2.递归中间 说明该节点不是叶子节点
    return false
  }
  if (root.left === null && root.right === null) {
    return root.val - targetSum === 0
  }
  // 拆分成两个子树
  return (
    hasPathSum(root.left, targetSum - root.val) ||
    hasPathSum(root.right, targetSum - root.val)
  )
}
```

## 136.只出现一次的数字

https://leetcode-cn.com/problems/single-number

```js
/**
 * @param {number[]} nums
 * @return {number}
 */
var singleNumber = function (nums) {
  let ans = ''
  for (const num of nums) {
    ans ^= num
    console.log(ans)
  }
  return ans
}
```

## 155.最小栈

https://leetcode-cn.com/problems/min-stack

```js
var MinStack = function () {
  this.x_stack = []
  this.min_stack = [Infinity]
}

MinStack.prototype.push = function () {
  this.x_stack.push(x)
  this.min_stack.push(Math.min(this.min_stack[this.min_stack.length - 1], x))
}
MinStack.prototype.pop = function () {
  this.x_stack.pop()
  this.min_stack.pop()
}
MinStack.prototype.top = function () {
  return this.x_stack[this.x_stack.length - 1]
}
MinStack.prototype.getMin = function () {
  return this.min_stack[this.min_stack.length - 1]
}
```

## 160.相交链表

https://leetcode-cn.com/problems/intersection-of-two-linked-lists

### 方法 1：暴力法

##### 思路

对于链表 A 的每个节点，都去链表 B 中遍历一遍找看看有没有相同的节点。

##### 复杂度

时间复杂度：O(M \* N)O(M∗N), M, N 分别为两个链表的长度。
空间复杂度：O(1)O(1)。

```js
var getIntersectionNode = function (headA, headB) {
  if (!headA || !headB) return null
  let pA = headA
  while (pA) {
    let pB = headB
    while (pB) {
      if (pA === pB) return pA
      pB = pB.next
    }
    pA = pA.next
  }
}
```

### 方法 2：哈希表

##### 思路

先遍历一遍链表 A，用哈希表把每个节点都记录下来(注意要存节点引用而不是节点值)。
再去遍历链表 B，找到在哈希表中出现过的节点即为两个链表的交点。

##### 复杂度

时间复杂度：O(M + N), M, N 分别为两个链表的长度。
空间复杂度：O(N)，N 为链表 A 的长度。

```js
var getIntersectionNode = function (headA, headB) {
  if (!headA || !headB) return null
  const hashmap = new Map()
  let pA = headA
  while (pA) {
    hashmap.set(pA, 1)
    pA = pA.next
  }
  let pB = headB
  while (pB) {
    if (hashmap.has(pB)) return pB
    pB = pB.next
  }
}
```

### 方法 3：双指针

##### 如果链表没有交点

两个链表长度一样，第一次遍历结束后 pA 和 pB 都是 null，结束遍历
两个链表长度不一样，两次遍历结束后 pA 和 pB 都是 null，结束遍历

##### 复杂度

时间复杂度：O(M + N) , M, N 分别为两个链表的长度。
空间复杂度：O(1)。

```js
/**
 * Definition for singly-linked list.
 * function ListNode(val) {
 *     this.val = val;
 *     this.next = null;
 * }
 */

/**
 * @param {ListNode} headA
 * @param {ListNode} headB
 * @return {ListNode}
 */
var getIntersectionNode = function (headA, headB) {
  if (!headA || !headB) return null

  let pA = headA,
    pB = headB
  while (pA !== pB) {
    pA = pA === null ? headB : pA.next
    pB = pB === null ? headA : pB.next
  }
  return pA
}
```

## 206.反转链表

```js
var reverseList = function (head) {
  let prev = null
  cur = head
  while (cur) {
    const next = cur.next
    cur.next = prev
    prev = cur
    cur = next
  }
  return prev
}
```

### 方案 2

```js
var reverseList = function (head) {
  let prev = null
  cur = head
  while (cur) {
    const next = cur.next
    cur.next = prev
    prev = cur
    cur = next
  }
  return prev
}
```

## 234.回文链表

https://leetcode-cn.com/problems/palindrome-linked-list

```js
const isPalindrome = (head) => {
  const vals = []
  while (head) {
    // 丢进数组里
    vals.push(head.val)
    head = head.next
  }
  let start = 0,
    end = vals.length - 1 // 双指针
  while (start < end) {
    if (vals[start] != vals[end]) {
      // 理应相同，如果不同，不是回文
      return false
    }
    start++
    end-- // 双指针移动
  }
  return true // 循环结束也没有返回false，说明是回文
}
```

## 543.二叉树的直径

https://leetcode-cn.com/problems/diameter-of-binary-tree

##### 方法 1

```js
var diameterOfBinaryTree = function (root) {
  // 默认为1是因为默认了根节点自身的路径长度
  let ans = 1
  function depth(rootNode) {
    if (!rootNode) {
      // 如果不存在根节点，则深度为0
      return 0
    }
    // 递归，获取左子树的深度
    let left = depth(rootNode.left)
    // 递归，获取右子树的深度
    let right = depth(rootNode.right)
    /* 关键点1
        L+R+1的公式是如何而来？
        等同于：左子树深度(节点个数) + 右子树深度（节点个数） + 1个根节点
        便是这株二叉树从最左侧叶子节点到最右侧叶子节点的最长路径
        类似于平衡二叉树的最小值节点到最大值节点的最长路径
        之所以+1是因为需要经过根节点
         */
    // 获取该树的最长路径和现有最长路径中最大的那个
    ans = Math.max(ans, left + right + 1)
    /* 关键点2
        已知根节点的左右子树的深度，
        则，左右子树深度的最大值 + 1，
        便是以根节点为数的最大深度*/
    return Math.max(left, right) + 1
  }
  depth(root)
  // 由于depth函数中已经默认加上数节点的自身根节点路径了，故此处需减1
  return ans - 1
}
```

##### 方法 2

```js
function height(node) {
  //求树高
  if (!node) return 0
  return 1 + Math.max(height(node.left), height(node.right))
}

var diameterOfBinaryTree = function (root) {
  if (!root) return 0
  let tempH = height(root.left) + height(root.right)
  return Math.max(
    tempH,
    diameterOfBinaryTree(root.left),
    diameterOfBinaryTree(root.right)
  )
}
```

注：部分题解参考 LeetCode 最佳题解，有需要的同学可以自行去 LeetCode 官网查看。

## 617.合并二叉树

https://leetcode-cn.com/problems/merge-two-binary-trees/

```js
var mergeTrees = function (root1, root2) {
  if (root1 == null && root2) {
    return root2
  } else if (root2 == null && root1) {
    return root1
  } else if (root1 && root2) {
    root1.val = root1.val + root2.val
    //递归合并每一个节点
    root1.left = mergeTrees(root1.left, root2.left)
    root1.right = mergeTrees(root1.right, root2.right)
  }
  return root1
}
```
