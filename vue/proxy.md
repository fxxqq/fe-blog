### 变化侦测

vue2 中覆盖了 Array 原型中的 7 个方法，分别是：push、pop、shift、unshift、splice、sort、reverse，所以当直接通过索引改变数组时，vue 是追踪不到变化的。

所以在 vue2 中实现数据双向绑定，是通过 Object.definePropertyd 劫持各个属性的 getter、setter，在读取数据时触发 getter，修改数据时候触发 setter。

在 3 中改为用 Proxy，但是 Proxy 只能代理一层，对于深层的无法代理。vue3 中利用每次 set 被拦截之前都会拦截到 get 操作，所以 vue3 在 get 中直接对数据进行 reactive，这样就大大减少了递归 reactive 带来的性能消耗。

与 Object.defineProperty 对比优势：

1.可以直接监听对象而非属性

2.可以直接监听数组的变化

3.Proxy 有多达 13 种拦截方式，不限于 apply、ownKeys、deleteProperty、has 等等是 Object.defineProperty 不具备的

4.Proxy 返回的是一个新对象，可以只操作新的对象达到目的，而 Object.defineProperty 只能遍历对象属性直接修改
