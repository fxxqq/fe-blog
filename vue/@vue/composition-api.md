`Composition API` 将是 Vue 3 的核心功能，它具有许多更改和性能改进。我们可以在 `Vue 2` 中通过 npm 插件`@vue/composition-api` 使用它。
本人重点将带你了解：

1. `@vue/composition-api`常见 api 使用
2. vue3 代码逻辑提取和复用
3. 如何使用`provide+inject`替代`vuex`方案

### vue2 使用 composition-api

主文件 main.ts 或者 app.vue 添加

```js
import Vue from 'vue'
import VueCompositionAPI from '@vue/composition-api'
Vue.use(VueCompositionAPI)
```

`Composition API` 不再传入 `data、mounted` 等参数，
通过引入的 `ref`、`onMounted `等方法实现数据的双向绑定、生命周期函数的执行。

### 核心语法

`reactive`：接收一个普通对象然后返回该普通对象的响应式代理。

`ref`：接受一个参数值并返回一个响应式且可改变的 `ref` 对象。`ref` 对象拥有一个指向内部值的单一属性 .value。

`computed`：传入一个 `getter` 函数，返回一个默认不可手动修改的 `ref` 对象。

`readonly`：传入一个对象（响应式或普通）或 ref，返回一个原始对象的只读代理。一个只读的代理是“深层的”，对象内部任何嵌套的属性也都是只读的。

`watchEffect`：立即执行传入的一个函数，并响应式追踪其依赖，并在其依赖变更时重新运行该函数。可显式的调用返回值以停止侦听。

`watch`：全等效于 2.x `this.\$watch` （以及 `watch` 中相应的选项）。

#### setup 函数

现在要介绍的第一个 API 就是 `setup` 函数。
`setup` 函数是一个新的组件选项。作为在组件内使用 `Composition API` 的入口点。
先看个简单 demo

```html
<template>
  <button @click="increase">count is: {{ count }}</button>
</template>
<script>
  export default {
    setup() {
      let count = 0
      const increase = () => count++
      return { count, increase }
    },
  }
</script>
```

1、调用时机

创建组件实例，然后初始化 `props` ，紧接着就调用 `setup` 函数。
从 vue2 生命周期钩子的视角来看，它会在 `beforeCreate` 钩子之后，`created` 之前被调用。

2、模板中使用

如果 `setup` 返回一个对象，则对象的属性将会被合并到组件模板的渲染上下文。

3、渲染函数 / JSX 中使用

`setup` 也可以返回一个函数，函数中也能使用当前 `setup` 函数作用域中的响应式数据：

```js
import { h, ref, reactive } from '@vue/composition-api'

export default {
  setup() {
    const count = ref(0)
    const object = reactive({ foo: 'bar' })

    return () => h('div', [count.value, object.foo])
  },
}
```

4、两个参数
`props`(注意 props 对象是响应式的),
`context`(上下文对象，从原来 2.x 中 this 选择性地暴露了一些 `property`。)

```js
const MyComponent = {
  setup(props, context) {
    let {
      attrs,
      emit,
      isServer,
      listeners,
      parent,
      refs,
      root,
      slots,
      ssrContext,
    } = context
  },
}
```

#### ref & reactive

在 `App.vue` 中，点击事件绑定了 `increase`，然后修改了 `count`，
但是页面并没有发生改变，这是因为 `setup` 函数返回的对象中 `count` 不是响应式数据，
那么如何创建响应式数据呢？此时就要掌握响应式系统 API，我们可以使用 `ref` 和 `reactive` 创建。

```html
<template>
  <button @click="increase">
    count is: {{ count }}, state.count is {{ state.count }}
  </button>
</template>

<script>
  import { ref, reactive } from 'vue'
  export default {
    setup() {
      let count = ref(0) // { value: 0 }
      let state = reactive({ number: 0 })
      const increase = () => {
        count.value++
        state.count++
      }
      return { count, state, increase }
    },
  }
</script>
```

接受一个参数值并返回一个响应式且可改变的 `ref` 对象。
`ref` 对象拥有一个指向内部值的单一属性 `.value`。

当 `ref` 作为渲染上下文的属性返回（即在 `setup()` 返回的对象中）并在模板中使用时，
它会自动解套，无需在模板内额外书写 `.value`

Vue 本身已经有 "`ref`" 的概念了。
但只是为了在模板中获取 DOM 元素或组件实例 (“模板引用”)。
新的 `ref` 系统同时用于逻辑状态和模板引用。

`reactive` 接收一个普通对象然后返回该普通对象的响应式代理。

响应式转换是“深层的”：会影响对象内部所有嵌套的属性。基于 ES2015 的 Proxy 实现，返回的代理对象不等于原始对象。建议仅使用代理对象而避免依赖原始对象。

不要解构返回的代理对象，那样会使其失去响应性：

```html
<template>
  <button @click="increase">count is: {{ count }}</button>
</template>

<script>
  import { ref, reactive } from '@vue/composition-api'
  export default {
    setup() {
      let state = reactive({ count: 0 })
      const increase = () => state.count++
      return { ...state, increase } // 展开state属性将失去响应式
    },
  }
</script>
```

#### toRef 和 toRefs

那如果我们真的想展开 `state` 的属性，在模板使用 count 而不是 state.count 的写法那怎么办呢？我们可以使用 `toRef` 和 `toRefs` 这两个 API，进行转换成 ref 对象，之前已经介绍了 ref 对象是可以直接在模板中使用的。

`toRef` 可以用来为一个 `reactive` 对象的属性创建一个 ref。这个 ref 可以被传递并且能够保持响应性。

```html
<template>
  <button @click="increase">
    count is: {{ count }},count2 is: {{ count2 }}
  </button>
</template>

<script>
  import { ref, reactive, toRef, toRefs } from '@vue/composition-api'
  export default {
    setup() {
      let state = reactive({ count: 0 })
      let countRef = toRef(state, 'count')
      let state2 = reactive({ count2: 0 })
      const increase = () => state.count++
      let stateAsRefs = toRefs(state2)
      return { count: countRef, increase, ...stateAsRefs }
    },
  }
</script>
```

把一个响应式对象转换成普通对象，该普通对象的每个 `property` 都是一个 `ref` ，和响应式对象 `property` 一一对应。

#### computed & watch

```js
const countDouble = computed(() => count.value * 2)
watch(
  () => state.count,
  (count, prevCount) => {
    /* ... */
  }
)
```

### 代码逻辑提取和复用

`Composition API` 的第一个明显优势是很容易提取逻辑。解决了

#### 逻辑提取

```js
export const useCount = (number) => {
  const count = ref(0)
  const increase = () => {
    count.value += 1
  }
  const reset = () => {
    count.value = 0
  }
  onMounted(() => {
    count.value = number
  })
  return {
    count,
    increase,
    reset,
  }
}
```

#### 代码复用

```js
// 另外一个文件使用:
const { count, increase } = useCount(1)
console.log(count) //输出1
increase()
console.log(count) //输出2
reset()
console.log(count) //输出0
```

有效的解决了 `mixins` 复用命名冲突，难以识别命名来自哪个 `mixin` 文件的问题。

### 替代 vuex 状态管理

状态 `store` 可以放在一个单一的文件或者目录里,比如设置一个全局组件可以只用的配置 `config`

```ts
//context/config.ts
import { provide, inject, ref, onMounted, readonly } from '@vue/composition-api'
const configSymbol: symbol = Symbol()

export const useProvider = {
  setup() {
    let config = ref(null)
    const configServer = async () => {
      // await 一些异步操作，比如api等
      config.value = { name: '名字' }
    }
    onMounted(async () => {
      await configServer()
    })
    provide(configSymbol, {
      //导出只读的config只有函数内部可以修改状态
      config: readonly(config),
    })
  },
}

export const useInject = () => {
  return inject(configSymbol)
}
```

在最顶层的组件（例如 main.ts）上注入，config 就可以在所有的组件中使用

```js
import { defineComponent } from '@vue/composition-api'
import { useProvider } from './context/config'
export default defineComponent({
  setup() {
    useProvider()
  },
})
```

业务逻辑页面使用 config

```js
import { useInject } from './context/config'
const Components = {
  setup() {
    const { config } = useInject()
    console.log(config.value.name) //输出“名字”
    return {
      config,
    }
  },
}
```
