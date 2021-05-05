;() => {
  class Node {
    constructor(value, left, right) {
      this.value = value
      this.left = left
      this.right = right
    }
  }
  class Btree {
    constructor() {
      this.list = []
    }
    addRoot(node) {
      if (node != null) {
        this.list.push(node)
      }
    }
    addChildNode(pNode, node, isLeft) {
      this.list.push(node)
      if (isLeft) {
        pNode.left = node
      } else {
        pNode.right = node
      }
    }
    getNode(index) {
      return this.list[index]
    }
  }
}
