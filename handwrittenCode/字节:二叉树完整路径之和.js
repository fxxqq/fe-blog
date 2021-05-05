// https://leetcode-cn.com/problems/path-sum/

;(() => {
  //用多维数组代表题中示例的树，这个数组是按“前序遍历”后排序
  let arrSouce = [6, [2, [-1], [3]], [3, [0]]]

  /**
   * 定义二叉树的结点。根结点和树的数据结构一样，
   * 因此只需要定义一个结点(Node)的数据结构即可
   */
  class Node {
    /**
     * 构造函数
     * @param {Number}  value 当前结点的值
     * @param {Node}    left  左子结点
     * @param {Node}    right 右子结点
     */
    constructor(value, left, right) {
      if (value != undefined) {
        this.value = value
        if (left != undefined) this.left = left
        if (right != undefined) this.right = right
      }
    }
  }

  /**
   * 创建一个树
   * @param {Array} arr 一个代表二叉树的多维数组
   */
  function makeBTree(arr) {
    if (arr) {
      if (arr.length == 1) {
        return new Node(arr[0])
      }
      //递归，创建二叉树
      return new Node(arr[0], makeBTree(arr[1]), makeBTree(arr[2]))
    }
  }

  //创建示例中的二叉树，简洁多了！
  let bTree = makeBTree(arrSouce)

  /**
   * 主逻辑函数，与第一种解法里代码一样
   * @param {Node}    node    树的结点
   * @param {Number}  target  题目要求的目标值
   */
  function hasPathSum(node, target) {
    //若根节点无子结点
    if (!node.left && !node.right) {
      //直接判断根结点额值是否等于target
      return node.value == target
    }
    //若有子结点
    else {
      //如有左结点 左侧递归
      if (!!node.left)
        return hasPathSum(node.left, /*关键*/ target - node.value)
      //如有右结点 右侧递归
      if (!!node.right)
        return hasPathSum(node.right, /*关键*/ target - node.value)
    }
  }

  console.log(hasPathSum(bTree, 7)) //>> true
})()
