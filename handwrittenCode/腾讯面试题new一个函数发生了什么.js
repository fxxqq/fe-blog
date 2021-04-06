// 1. 请写出以下程序的输出结果:
function F() {}
F.a = 100
F.prototype.b = 10

let z = new F()
console.log(z.a) //undefined
console.log(z.b) //8



