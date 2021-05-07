class Permutation {
  constructor(arr) {
    this.arr = Array.from(arr)
    this.result = []
    this.len = 0
    this.run(0)
  }

  run(index) {
    if (index == this.arr.length - 1) {
      this.result.push(Array.from(this.arr))
      this.len++
      return
    }
    for (let i = index; i < this.arr.length; i++) {
      ;[this.arr[index], this.arr[i]] = [this.arr[i], this.arr[index]]
      this.run(index + 1)
      ;[this.arr[index], this.arr[i]] = [this.arr[i], this.arr[index]]
    }
  }
}

let p = new Permutation(['A', 'B', 'C'])
console.log(p.result)
console.log(p.len)
