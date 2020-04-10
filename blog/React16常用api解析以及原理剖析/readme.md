### [`React16`常用`api`解析以及原理剖析]

### 目录

1. `Vue` 与 `React` 两个框架的粗略区别对比
2. `react 16` 版本常见 `api`
3. `react` 生命周期
4. `react` 事件机制
5. `react.Component` 如何实现组件化以及高阶组件的应用
6. `setState` 异步队列数据管理
7. `react Fiber` 架构分析
8. `react hooks`
9. `dom` 的 `diff` 算法
10. `redux` 流程与基本原理

### `Vue` 与 `React` 两个框架的粗略区别对比

Vue 的优势包括：

1. 模板和渲染函数的弹性选择
2. 简单的语法及项目创建
3. 更快的渲染速度和更小的体积

React 的优势包括：

1. 更适用于大型应用和更好的可测试性
2. 同时适用于 Web 端和原生 App
3. 更大的生态圈带来的更多支持和工具

#### 相似之处

React 与 Vue 有很多相似之处，React 和 Vue 都是非常优秀的框架，它们之间的相似之处多过不同之处，并且它们大部分最棒的功能是相通的：如他们都是 JavaScript 的 UI 框架，专注于创造前端的富应用。不同于早期的 JavaScript 框架“功能齐全”，Reat 与 Vue 只有框架的骨架，其他的功能如路由、状态管理等是框架分离的组件。

- 两者都是用于创建 UI 的 JavaScript 库；
- 两者都快速轻便；
- 都有基于组件的架构；
- 都是用虚拟 DOM；
- 都可放入单个 HTML 文件中，或者成为更复杂 webpack 设置中的模块；
- 都有独立但常用的路由器和状态管理库；
- 它们之间的最大区别是 Vue 通常使用 HTML 模板文件，而 React 则完全是 JavaScript。Vue 有双向绑定语法糖。

#### 不同点

- Vue 组件分为全局注册和局部注册，在 react 中都是通过 import 相应组件，然后模版中引用；
- props 是可以动态变化的，子组件也实时更新，在 react 中官方建议 props 要像纯函数那样，输入输出一致对应，而且不太建议通过 props 来更改视图；
- 子组件一般要显示地调用 props 选项来声明它期待获得的数据。而在 react 中不必需，另两者都有 props 校验机制；

- 每个 Vue 实例都实现了事件接口，方便父子组件通信，小型项目中不需要引入状态管理机制，而 react 必需自己实现；
- 使用插槽分发内容，使得可以混合父组件的内容与子组件自己的模板；
- 多了指令系统，让模版可以实现更丰富的功能，而 React 只能使用 JSX 语法；
- Vue 增加的语法糖 computed 和 watch，而在 React 中需要自己写一套逻辑来实现；

- react 的思路是 all in js，通过 js 来生成 html，所以设计了 jsx，还有通过 js 来操作 css，社区的 styled-component、jss 等；而 vue 是把 html，css，js 组合到一起，用各自的处理方式，vue 有单文件组件，可以把 html、css、js 写到一个文件中，html 提供了模板引擎来处理。



- react 做的事情很少，很多都交给社区去做，vue 很多东西都是内置的，写起来确实方便一些， 比如 redux 的 combineReducer 就对应 vuex 的 modules， 比如 reselect 就对应 vuex 的 getter 和 vue 组件的 computed， vuex 的 mutation 是直接改变的原始数据，而 redux 的 reducer 是返回一个全新的 state，所以 redux 结合 immutable 来优化性能，vue 不需要。



- react 是整体的思路的就是函数式，所以推崇纯组件，数据不可变，单向数据流，当然需要双向的地方也可以做到，比如结合 redux-form，组件的横向拆分一般是通过高阶组件。而 vue 是数据可变的，双向绑定，声明式的写法，vue 组件的横向拆分很多情况下用 mixin。



#### 社区活跃度


从两者的 github 表现来看（数据取于 2019-09-16）

![react](https://cdn.ru23.com/react_ppt/github-react.jpg)

![react](https://cdn.ru23.com/react_ppt/github-vue.jpg)


可以看出 vue 的 star 数量已经是前端框架中最火爆的。从维护上来看，react 是 facebook 在维护，而 vue 现阶段虽然也有了团队，但主要还是尤雨溪在维护贡献代码，并且阿里巴巴开源的混合式框架 weex 也是基于 vue 的，所以我们相信 vue 未来将会得到更多的人和团队维护。

根据不完全统计，包括饿了么、简书、高德、稀土掘金、苏宁易购、美团、天猫、荔枝 FM、房多多、Laravel、htmlBurger 等国内外知名大公司都在使用 vue 进行新项目的开发和旧项目的前端重构工作。

使用 React 的公司 facebook、Twitter、INS、Airbnb、Yahoo、ThoughtWorks、蚂蚁金服、阿里巴巴、腾讯、百度、口碑、美团、滴滴出行、饿了么、京东、网易等。



#### UI 生态

|            |                  vue |             react             |
|------------|---------------------:|:-----------------------------:|
| pc 端      |    iview、element 等 |   Ant Design、Materal-UI 等   |
| h5 端      | 有赞 vant、mintui 等 |    Ant Design Mobile、weui    |
| 混合开发   |     weexui、bui-weex | teaset、react-native-elements |
| 微信小程序 |  iview、Weapp、zanui |     iView Weapp、Taro UI      |



无论您选择 React.js 还是 Vue.js，两个框架都没有相当大的差异，根据您的要求，这个决定是非常主观的。如果您想将前端 JavaScript 框架集成到现有应用程序中，Vue.js 是更好的选择，如果您想使用 JavaScript 构建移动应用程序，React 绝对是您的选择。



### `react16` 版本常见 `api`



先来看一下 react 暴露出来的 API

```jsx
const React = {
  Children: {
    map,
    forEach,
    count,
    toArray,
    only
  },

  createRef,
  Component,
  PureComponent,

  createContext,
  forwardRef,

  Fragment: REACT_FRAGMENT_TYPE,
  StrictMode: REACT_STRICT_MODE_TYPE,
  unstable_AsyncMode: REACT_ASYNC_MODE_TYPE,
  unstable_Profiler: REACT_PROFILER_TYPE,

  createElement: __DEV__ ? createElementWithValidation : createElement,
  cloneElement: __DEV__ ? cloneElementWithValidation : cloneElement,
  createFactory: __DEV__ ? createFactoryWithValidation : createFactory,
  isValidElement: isValidElement,

  version: ReactVersion,

  __SECRET_INTERNALS_DO_NOT_USE_OR_YOU_WILL_BE_FIRED: ReactSharedInternals
}
```



#### `Children`

这个对象提供了一堆帮你处理 props.children 的方法，因为 children 是一个类似数组但是不是数组的数据结构，如果你要对其进行处理可以用 React.Children 外挂的方法。



#### `createRef`

新的 ref 用法，React 即将抛弃`<div ref="myDiv" />`这种 string ref 的用法，将来你只能使用两种方式来使用 ref

```jsx
class App extends React.Component {
  constructor() {
    this.ref = React.createRef()
  }

  render() {
    return <div ref={this.ref} />
    // or
    return <div ref={node => (this.funRef = node)} />
  }
}
```



#### `createContext`

`createContext` 是官方定稿的 context 方案，在这之前我们一直在用的老的 context API 都是 React 不推荐的 API，现在新的 API 释出，官方也已经确定在 17 大版本会把老 API 去除(老 API 的性能不是一般的差)。

新 API 的使用方法：

```jsx
const { Provider, Consumer } = React.createContext('defaultValue')

const ProviderComp = (props) => (
  <Provider value={'realValue'}>
    {props.children}
  </Provider>
)

const ConsumerComp = () => (
  <Consumer>
    {(value) => <p>{value}</p>}
  </Consumber>
)
```



### react 生命周期



目前 react 16.8 +的生命周期分为三个阶段,分别是挂载阶段、更新阶段、卸载阶段

- 挂载阶段：
  `constructor(props)`: 实例化。<br/>
  `static getDerivedStateFromProps` 从 `props` 中获取 `state`。<br/>
  `render` 渲染。<br/>
  `componentDidMount`: 完成挂载。



- 更新阶段：
  `static getDerivedStateFromProps` 从 props 中获取 state。<br/>
  `shouldComponentUpdate` 判断是否需要重绘。<br/>
  `render` 渲染。<br/>
  `getSnapshotBeforeUpdate` 获取快照。<br/>
  `componentDidUpdate` 渲染完成后回调。
- 卸载阶段：
  `componentWillUnmount` 即将卸载。
- 错误处理：
  `static getDerivedStateFromError` 从错误中获取 `state`。<br/>
  `componentDidCatch` 捕获错误并进行处理。



```jsx
class ExampleComponent extends react.Component {
  // 构造函数，最先被执行,我们通常在构造函数里初始化state对象或者给自定义方法绑定this
  constructor() {}
  //getDerivedStateFromProps(nextProps, prevState)
  // 用于替换 `componentWillReceiveProps` ，该函数会在初始化和 `update` 时被调用
  // 这是个静态方法,当我们接收到新的属性想去修改我们state，可以使用getDerivedStateFromProps
  static getDerivedStateFromProps(nextProps, prevState) {
    // 新的钩子 getDerivedStateFromProps() 更加纯粹, 
    // 它做的事情是将新传进来的属性和当前的状态值进行对比, 
    // 若不一致则更新当前的状态。
    if (nextProps.riderId !== prevState.riderId) {
      return {
        riderId: nextProps.riderId
      }
    }
    // 返回 null 则表示 state 不用作更新
    return null
  }
  // shouldComponentUpdate(nextProps, nextState),
  // 有两个参数nextProps和nextState，表示新的属性和变化之后的state，
  // 返回一个布尔值，true表示会触发重新渲染，false表示不会触发重新渲染，
  // 默认返回true,我们通常利用此生命周期来优化react程序性能
  shouldComponentUpdate(nextProps, nextState) {
    return nextProps.id !== this.props.id
  }
  // 组件挂载后调用
  // 可以在该函数中进行请求或者订阅
  componentDidMount() {}
  // getSnapshotBeforeUpdate(prevProps, prevState):
  // 这个方法在render之后，componentDidUpdate之前调用，
  // 有两个参数prevProps和prevState，表示之前的属性和之前的state，
  // 这个函数有一个返回值，会作为第三个参数传给componentDidUpdate，
  // 如果你不想要返回值，可以返回null，此生命周期必须与componentDidUpdate搭配使用
  getSnapshotBeforeUpdate() {}
  // 组件即将销毁
  // 可以在此处移除订阅，定时器等等
  componentWillUnmount() {}
  // 组件销毁后调用
  componentDidUnMount() {}
  // componentDidUpdate(prevProps, prevState, snapshot):
  // 该方法在getSnapshotBeforeUpdate方法之后被调用，
  // 有三个参数prevProps，prevState，snapshot，
  // 表示之前的props，之前的state，和snapshot。
  // 第三个参数是getSnapshotBeforeUpdate返回的,
  // 如果触发某些回调函数时需要用到 DOM 元素的状态，
  // 则将对比或计算的过程迁移至 getSnapshotBeforeUpdate，
  // 然后在 componentDidUpdate 中统一触发回调或更新状态。
  componentDidUpdate() {}
  // 渲染组件函数
  render() {}
  // 以下函数不建议使用
  UNSAFE_componentWillMount() {}
  UNSAFE_componentWillUpdate(nextProps, nextState) {}
  UNSAFE_componentWillReceiveProps(nextProps) {}
}
```



react 版本 17 将弃用几个类组件 API 生命周期：`componentWillMount`，`componentWillReceiveProps`和`componentWillUpdate`。



### react 事件机制


简单的理解 react 如何处理事件的，React 在组件加载(mount)和更新(update)时，将事件通过 addEventListener  统一注册到 document 上，然后会有一个事件池存储了所有的事件，当事件触发的时候，通过 dispatchEvent 进行事件分发。

引用[新手学习 react 迷惑的点(二)](https://juejin.im/post/5d6f127bf265da03cf7aab6d)

- react 里面绑定事件的方式和在 HTML 中绑定事件类似，使用驼峰式命名指定要绑定的 onClick 属性为组件定义的一个方法{this.handleClick.bind(this)}。
- 由于类的方法默认不会绑定 this，因此在调用的时候如果忘记绑定，this 的值将会是 undefined。 通常如果不是直接调用，应该为方法绑定 this，将事件函数上下文绑定要组件实例上。
  

#### 绑定事件的四种方式

```js
class Button extends react.Component {
  constructor(props) {
    super(props)
    this.handleClick1 = this.handleClick1.bind(this)
  }
  //方式1：在构造函数中使用bind绑定this，官方推荐的绑定方式，也是性能最好的方式
  handleClick1() {
    console.log('this is:', this)
  }
  //方式2：在调用的时候使用bind绑定this
  handleClick2() {
    console.log('this is:', this)
  }
  //方式3：在调用的时候使用箭头函数绑定this
  // 方式2和方式3会有性能影响并且当方法作为属性传递给子组件的时候会引起重渲问题
  handleClick3() {
    console.log('this is:', this)
  }
  //方式4：使用属性初始化器语法绑定this，需要babel转义
  handleClick4 = () => {
    console.log('this is:', this)
  }
  render() {
    return (
      <div>
        <button onClick={this.handleClick1}>Click me</button>
        <button onClick={this.handleClick2.bind(this)}>Click me</button>
        <button onClick={() => this.handleClick3}>Click me</button>
        <button onClick={this.handleClick4}>Click me</button>
      </div>
    )
  }
}
```



为什么直接调用方法会报错

```jsx
class Foo extends React.Component {
  handleClick() {
    this.setState({ xxx: aaa })
  }

  render() {
    return <button onClick={this.handleClick.bind(this)}>Click me</button>
  }
}
```

会被 babel 转化成

```jsx
React.createElement(
  'button',
  {
    onClick: this.handleClick
  },
  'Click me'
)
```



#### “合成事件”和“原生事件”

react 实现了一个“合成事件”层（`synthetic event system`），这抹平了各个浏览器的事件兼容性问题。所有事件均注册到了元素的最顶层-document 上，“合成事件”会以事件委托（`event delegation`）的方式绑定到组件最上层，并且在组件卸载（`unmount`）的时候自动销毁绑定的事件。



### react 组件开发



#### react 组件化思想

##### 一个 UI 组件的完整模板

```jsx
import classNames from 'classnames'
class Button extends react.Component {
  //参数传参与校验
  static propTypes = {
    type: PropTypes.oneOf(['success', 'normal']),
    onClick: PropTypes.func
  }
  static defaultProps = {
    type: 'normal'
  }
  handleClick() {}
  render() {
    let { className, type, children, ...other } = this.props
    const classes = classNames(
      className,
      'prefix-button',
      'prefix-button-' + type
    )
    return (
      <span className={classes} {...other} onClick={() => this.handleClick}>
        {children}
      </span>
    )
  }
}
```



#### 函数定义组件（Function Component）

纯展示型的，不需要维护 state 和生命周期，则优先使用 `Function Component`

1. 代码更简洁，一看就知道是纯展示型的，没有复杂的业务逻辑
2. 更好的复用性。只要传入相同结构的 props，就能展示相同的界面，不需要考虑副作用。
3. 打包体积小，执行效率高



```jsx
import react from 'react'
function MyComponent(props) {
  let { firstName, lastName } = props
  return (
    <div>
      <img src="avatar.png" className="profile" />
      <h3>{[firstName, lastName].join(' ')}</h3>
    </div>
  )
}
```

会被 babel 转义成

```js
return React.createElement(
  'div',
  null,
  React.createElement('img', { src: 'avatar.png', className: 'profile' }),
  React.createElement('h3', null, [firstName, lastName].join(' '))
)
```



那么，`React.createElement` 是在做什么？看下相关部分代码：

```jsx
var ReactElement = function(type, key, ref, self, source, owner, props) {
  var element = {
    // This tag allow us to uniquely identify this as a React Element
    $$typeof: REACT_ELEMENT_TYPE,

    // Built-in properties that belong on the element
    type: type,
    key: key,
    ref: ref,
    props: props,

    // Record the component responsible for creating this element.
    _owner: owner
  }
  // ...
  return element
}

ReactElement.createElement = function(type, config, children) {
  // ...
  return ReactElement(
    type,
    key,
    ref,
    self,
    source,
    ReactCurrentOwner.current,
    props
  )
}
```



React.createElement()来构建 React 元素的。它接受三个参数，第一个参数 type 可以是一个标签名。如 div、span，或者 React 组件。第二个参数 props 为传入的属性。第三个以及之后的参数 children，皆作为组件的子组件。

`createElement` 函数对 key 和 ref 等特殊的 props 进行处理，并获取 `defaultProps` 对默认 props 进行赋值，并且对传入的孩子节点进行处理，最终构造成一个 `reactElement` 对象（所谓的虚拟 DOM）。
`reactDOM.render` 将生成好的虚拟 DOM 渲染到指定容器上，其中采用了批处理、事务等机制并且对特定浏览器进行了性能优化，最终转换为真实 DOM。



#### `ES6 class` 定义一个纯组件（`PureComponent`）

组件需要维护 state 或使用生命周期方法，则优先使用 `PureComponent`



```jsx
class MyComponent extends react.Component {
  render() {
    let { name } = this.props
    return <h1>Hello, {name}</h1>
  }
}
```



##### `PureComponent`

`Component` & `PureComponent` 这两个类基本相同，唯一的区别是 `PureComponent` 的原型上多了一个标识，`shallowEqual`（浅比较），来决定是否更新组件，浅比较类似于浅复制，只会比较第一层。使用 `PureComponent` 相当于省去了写 `shouldComponentUpdate` 函数

```jsx
if (ctor.prototype && ctor.prototype.isPureReactComponent) {
  return !shallowEqual(oldProps, newProps) || !shallowEqual(oldState, newState)
}
```



这是检查组件是否需要更新的一个判断，ctor 就是你声明的继承自 `Component` or `PureComponent` 的类，他会判断你是否继承自 `PureComponent，如果是的话就` `shallowEqual` 比较 state 和 props。

React 中对比一个 `ClassComponent` 是否需要更新，只有两个地方。一是看有没有 `shouldComponentUpdate` 方法，二就是这里的 `PureComponent` 判断。



### 高阶组件(`higher order component`)

高阶组件是一个以组件为参数并返回一个新组件的函数。HOC 运行你重用代码、逻辑和引导抽象。


```jsx
function visible(WrappedComponent) {
  return class extends Component {
    render() {
      const { visible, ...props } = this.props
      if (visible === false) return null
      return <WrappedComponent {...props} />
    }
  }
}
```

上面的代码就是一个 HOC 的简单应用，函数接收一个组件作为参数，并返回一个新组件，新组建可以接收一个 visible props，根据 visible 的值来判断是否渲染 Visible。



最常见的还有 Redux 的 connect 函数。除了简单分享工具库和简单的组合，HOC 最好的方式是共享 react 组件之间的行为。如果你发现你在不同的地方写了大量代码来做同一件事时，就应该考虑将代码重构为可重用的 HOC。
下面就是一个简化版的 connect 实现：



```jsx
export const connect = (
  mapStateToProps,
  mapDispatchToProps
) => WrappedComponent => {
  class Connect extends Component {
    static contextTypes = {
      store: PropTypes.object
    }

    constructor() {
      super()
      this.state = {
        allProps: {}
      }
    }

    componentWillMount() {
      const { store } = this.context
      this._updateProps()
      store.subscribe(() => this._updateProps())
    }

    _updateProps() {
      const { store } = this.context
      let stateProps = mapStateToProps
        ? mapStateToProps(store.getState(), this.props)
        : {}
      let dispatchProps = mapDispatchToProps
        ? mapDispatchToProps(store.dispatch, this.props)
        : {}
      this.setState({
        allProps: {
          ...stateProps,
          ...dispatchProps,
          ...this.props
        }
      })
    }

    render() {
      return <WrappedComponent {...this.state.allProps} />
    }
  }
  return Connect
}
```

代码非常清晰，connect 函数其实就做了一件事，将 `mapStateToProps` 和 `mapDispatchToProps` 分别解构后传给原组件，这样我们在原组件内就可以直接用 `props` 获取 `state` 以及 `dispatch` 函数了。


#### 高阶组件的应用

某些页面需要记录用户行为，性能指标等等，通过高阶组件做这些事情可以省去很多重复代码。


##### 日志打点

```jsx
function logHoc(WrappedComponent) {
  return class extends Component {
    componentWillMount() {
      this.start = Date.now()
    }
    componentDidMount() {
      this.end = Date.now()
      console.log(
        `${WrappedComponent.dispalyName} 渲染时间：${this.end - this.start} ms`
      )
      console.log(`${user}进入${WrappedComponent.dispalyName}`)
    }
    componentWillUnmount() {
      console.log(`${user}退出${WrappedComponent.dispalyName}`)
    }
    render() {
      return <WrappedComponent {...this.props} />
    }
  }
}
```



##### 可用、权限控制

```jsx
function auth(WrappedComponent) {
  return class extends Component {
    render() {
      const { visible, auth, display = null, ...props } = this.props
      if (visible === false || (auth && authList.indexOf(auth) === -1)) {
        return display
      }
      return <WrappedComponent {...props} />
    }
  }
}
```



##### 表单校验

基于上面的双向绑定的例子，我们再来一个表单验证器，表单验证器可以包含验证函数以及提示信息，当验证不通过时，展示错误信息：

```jsx
function validateHoc(WrappedComponent) {
  return class extends Component {
    constructor(props) {
      super(props)
      this.state = { error: '' }
    }
    onChange = event => {
      const { validator } = this.props
      if (validator && typeof validator.func === 'function') {
        if (!validator.func(event.target.value)) {
          this.setState({ error: validator.msg })
        } else {
          this.setState({ error: '' })
        }
      }
    }
    render() {
      return (
        <div>
          <WrappedComponent onChange={this.onChange} {...this.props} />
          <div>{this.state.error || ''}</div>
        </div>
      )
    }
  }
}
```



```jsx
const validatorName = {
  func: (val) => val && !isNaN(val),
  msg: '请输入数字'
}
const validatorPwd = {
  func: (val) => val && val.length > 6,
  msg: '密码必须大于6位'
}
<HOCInput validator={validatorName} v_model="name"></HOCInput>
<HOCInput validator={validatorPwd} v_model="pwd"></HOCInput>
```



#### HOC 的缺陷

- HOC 需要在原组件上进行包裹或者嵌套，如果大量使用 HOC，将会产生非常多的嵌套，这让调试变得非常困难。
- HOC 可以劫持 props，在不遵守约定的情况下也可能造成冲突。



#### `render props`

一种在 React 组件之间使用一个值为函数的 prop 共享代码的简单技术
具有 render prop 的组件接受一个函数，该函数返回一个 React 元素并调用它而不是实现自己的渲染逻辑。

```jsx
<DataProvider render={data => <h1>Hello {data.target}</h1>} />
```



### `setState` 数据管理


**不要直接更新状态**

```js
// Wrong 此代码不会重新渲染组件,构造函数是唯一能够初始化 this.state 的地方。
this.state.comment = 'Hello'
// Correct 应当使用 setState():
this.setState({ comment: 'Hello' })
```


组件生命周期中或者 react 事件绑定中，setState 是通过异步更新的，在延时的回调或者原生事件绑定的回调中调用 setState 不一定是异步的。

- 多个 setState() 调用合并成一个调用来提高性能。
- this.props 和 this.state 可能是异步更新的，不应该依靠它们的值来计算下一个状态。

```js
// Wrong
this.setState({
  counter: this.state.counter + this.props.increment
})
// Correct
this.setState((prevState, props) => ({
  counter: prevState.counter + props.increment
}))
```


原生事件绑定不会通过合成事件的方式处理，会进入更新事务的处理流程。`setTimeout` 也一样，在 `setTimeout` 回调执行时已经完成了原更新组件流程，不会放入 `dirtyComponent` 进行异步更新，其结果自然是同步的。


#### `setState` 原理

setState 并没有直接操作去渲染，而是执行了一个 `updateQueue`（异步 updater 队列），

```jsx
setState( stateChange ) {
    Object.assign( this.state, stateChange );
    //合并接收到的state||stateChange改变的state（setState接收到的参数）
    renderComponent( this );//调用render渲染组件
}
```

这种实现，每次调用 `setState` 都会更新 state 并马上渲染一次（不符合其更新优化机制），所以我们要合并 `setState`。

具体可以阅读源码
[`ReactUpdateQueue.js`](https://github.com/facebook/react/blob/03944bfb0bdacfe35b2a1722426ff744ae47d018/packages/react-reconciler/src/ReactUpdateQueue.js)



### `ErrorBoundary`、`Suspense` 和 `Fragment`



#### `Error Boundaries`

react 16 提供了一个新的错误捕获钩子 `componentDidCatch(error, errorInfo)`, 它能将子组件生命周期里所抛出的错误捕获, 防止页面全局崩溃。demo
`componentDidCatch` 并不会捕获以下几种错误

- 事件机制抛出的错误(事件里的错误并不会影响渲染)
- Error Boundaries 自身抛出的错误
- 异步产生的错误
- 服务端渲染
  

#### `lazy、Suspence` 延迟加载组件

`lazy` 需要跟 `Suspence` 配合使用，否则会报错。

`lazy` 实际上是帮助我们实现代码分割 ，类似 webpack 的 `splitchunk` 的功能。

`Suspense` 意思是能暂停当前组件的渲染, 当完成某件事以后再继续渲染。简单来说就是减少首屏代码的体积，提升性能。


```jsx
import react, { lazy, Suspense } from 'react'
const OtherComponent = lazy(() => import('./OtherComponent'))
function MyComponent() {
  return (
    <Suspense fallback={<div>loading...</div>}>
      <OtherComponent />
    </Suspense>
  )
}
```

一种简单的预加载思路, 可参考 preload

```jsx
const OtherComponentPromise = import('./OtherComponent')
const OtherComponent = react.lazy(() => OtherComponentPromise)
```



#### `Fragments（v16.2.0)`

Fragments 允许你将子列表分组，避免向 DOM 添加额外的节点。

```jsx
render() {
  return (
    <>
      <ChildA />
      <ChildB />
      <ChildC />
    </>
  );
}
```



### `react Fiber` 架构分析

`react-fiber`是为了增强动画、布局、移动端手势领域的适用性，最重要的特性是对页面渲染的优化: 允许将渲染方面的工作拆分为多段进行。



#### `react Fiber` 架构解决了什么问题

`react-fiber` 可以为我们提供如下几个功能：

- 设置渲染任务的优先
- 采用新的 Diff 算法
- 采用虚拟栈设计允许当优先级更高的渲染任务和较低优先的任务之间来回切换



#### `Fiber` 如何做到异步渲染 `Virtual Dom` 和 `Diff` 算法

众所周知，画面每秒钟更新 60 次，页面在人眼中显得流畅，无明显卡顿。每秒 60 次，即 16ms 要更新一次页面，如果更新页面消耗的时间不到 16ms，那么在下一次更新时机来到之前会剩下一点时间执行其他的任务，只要保证及时在 16ms 的间隔下更新界面就完全不会影响到页面的流畅程度。fiber 的核心正是利用了 60 帧原则，实现了一个基于优先级和 requestIdleCallback 的循环任务调度算法。



```js
function fiber(剩余时间) {
  if (剩余时间 > 任务所需时间) {
    做任务
  } else {
    requestIdleCallback(fiber)
    // requestIdleCallback 是浏览器提供的一个 api，可以让浏览器在空闲的时候执行回调，
    // 在回调参数中可以获取到当前帧剩余的时间，fiber 利用了这个参数，
    // 判断当前剩下的时间是否足够继续执行任务，
    // 如果足够则继续执行，否则暂停任务，
    // 并调用 requestIdleCallback 通知浏览器空闲的时候继续执行当前的任务
  }
}
```



### `react hooks`

在 react 16.7 之前, react 有两种形式的组件, 有状态组件(类)和无状态组件(函数)。
官方解释： hook 是 React 16.8 的新增特性。它可以让你在不编写 class 的情况下使用 state 以及其他的 React 特性。
个人理解：让传统的函数组件 function component 有内部状态 state 的函数 function,简单来说就是 hooks 让函数组件有了状态，可以完全替代 class。

接下来梳理 Hooks 中最核心的 2 个 api, `useState` 和 `useEffect`



#### `useState`

useState 是一个钩子，他可以为函数式组件增加一些状态，并且提供改变这些状态的函数，同时它接收一个参数，这个参数作为状态的默认值。

```jsx
const [count, setCount] = useState(initialState)
```

使用 Hooks 相比之前用 class 的写法最直观的感受是更为简洁

```jsx
function App() {
  const [count, setCount] = useState(0)
  return (
    <div>
      <p>You clicked {count} times</p>
      <button onClick={() => setCount(count + 1)}>Click me</button>
    </div>
  )
}
```



#### `useEffect(fn)`

在每次 render 后都会执行这个钩子。可以将它当成是 `componentDidMount`、` componentDidUpdate``、componentWillUnmount ` 的合集。因此使用 `useEffect` 比之前优越的地方在于:

可以避免在 `componentDidMount`、`componentDidUpdate` 书写重复的代码;
可以将关联逻辑写进一个 `useEffect`(在以前得写进不同生命周期里);



### 深入理解 react 原理



#### react 虚拟 dom 原理剖析



##### react 组件的渲染流程

使用 `react.createElement` 或 JSX 编写 react 组件，实际上所有的 JSX 代码最后都会转换成 `react.createElement(...)`，Babel 帮助我们完成了这个转换的过程。

createElement 函数对 key 和 ref 等特殊的 props 进行处理，并获取 `defaultProps` 对默认 props 进行赋值，并且对传入的孩子节点进行处理，最终构造成一个 `reactElement` 对象（所谓的虚拟 DOM）。

`reactDOM.render` 将生成好的虚拟 DOM 渲染到指定容器上，其中采用了批处理、事务等机制并且对特定浏览器进行了性能优化，最终转换为真实 DOM。



##### 虚拟 DOM 的组成

即 `reactElementelement` 对象，我们的组件最终会被渲染成下面的结构：

```
`type`：元素的类型，可以是原生 html 类型（字符串），或者自定义组件（函数或 class）
`key`：组件的唯一标识，用于 Diff 算法，下面会详细介绍
`ref`：用于访问原生 dom 节点
`props`：传入组件的 props，chidren 是 props 中的一个属性，它存储了当前组件的孩子节点，可以是数组（多个孩子节点）或对象（只有一个孩子节点）
`owner`：当前正在构建的 Component 所属的 Component
`self`：（非生产环境）指定当前位于哪个组件实例
`_source`：（非生产环境）指定调试代码来自的文件(fileName)和代码行数(lineNumber)
```



当组件状态 state 有更改的时候，react 会自动调用组件的 render 方法重新渲染整个组件的 UI。
当然如果真的这样大面积的操作 DOM，性能会是一个很大的问题，所以 react 实现了一个 `Virtual DOM`，组件 DOM 结构就是映射到这个 `Virtual DOM`上，react 在这个 `Virtual DOM` 上实现了一个 diff 算法，当要重新渲染组件的时候，会通过 diff 寻找到要变更的 DOM 节点，再把这个修改更新到浏览器实际的 DOM 节点上，所以实际上不是真的渲染整个 DOM 树。这个 `Virtual DOM` 是一个纯粹的 JS 数据结构，所以性能会比原生 DOM 快很多。



##### `react` 是如何防止 `XSS` 的

`reactElement` 对象还有一个`$$typeof`属性，它是一个 Symbol 类型的变量`Symbol.for('react.element')`，当环境不支持 Symbol 时，`$$typeof` 被赋值为 `0xeac7`。
这个变量可以防止 XSS。如果你的服务器有一个漏洞，允许用户存储任意 JSON 对象， 而客户端代码需要一个字符串，这可能为你的应用程序带来风险。JSON 中不能存储 `Symbol` 类型的变量，而 react 渲染时会把没有`\$\$typeof` 标识的组件过滤掉。



#### `diff` 算法

传统的 `diff` 算法通过循环递归对节点一次对比，效率很低，算法复杂度达到 O(n^3)，其中 n 是树中节点的总数,React 通过制定大胆的策略，将 O(n^3) 复杂度的问题转换成 O(n) 复杂度的问题。



**`diff` 策略:**

1. web ui 中 Dom 节点跨层级的移动操作很少,`diff` 算法比较新旧节点的时候，比较只会在同层级比较，不会跨层级比较
2. 拥有相同类的两个组件将会生成相似的树形结构，拥有不同类的两个组件将会生成不同的树形结构。
3. 对于同一层级的一组子节点，他们可以通过唯一 key 进行区分

基于以上三个前提策略，React 分别对 `tree diff`、`component diff` 以及 `element diff` 进行算法优化，事实也证明这三个前提策略是合理且准确的，它保证了整体界面构建的性能。
简单的讲就是：

具体可以参考[React 源码剖析系列 － 不可思议的 react diff](https://zhuanlan.zhihu.com/p/20346379)



- React 通过制定大胆的 diff 策略，将 O(n3) 复杂度的问题转换成 O(n) 复杂度的问题；
- React 通过分层求异的策略，对 `tree diff` 进行算法优化；
- React 通过相同类生成相似树形结构，不同类生成不同树形结构的策略，对 `component diff` 进行算法优化；
- React 通过设置唯一 key 的策略，对 `element diff` 进行算法优化；

建议，在开发组件时，保持稳定的 DOM 结构会有助于性能的提升；
建议，在开发过程中，尽量减少类似将最后一个节点移动到列表首部的操作，当节点数量过大或更新操作过于频繁时，在一定程度上会影响 React 的渲染性能。




### react 性能分析与优化



#### 减少不必要的渲染

在使用 `class Component` 进行开发的时候，我们可以使用 `shouldComponentUpdate` 来减少不必要的渲染，那么在使用 `react hooks` 后，我们如何实现这样的功能呢？

解决方案：`React.memo`和`useMemo`
对于这种情况，react 当然也给出了官方的解决方案，就是使用 React.memo 和 useMemo。



##### `React.memo`

React.momo 其实并不是一个 hook，它其实等价于 PureComponent，但是它只会对比 props。使用方式如下(用上面的例子):

```jsx
import React, { useState } from 'react'

export const Count = React.memo(props => {
  const [data, setData] = useState({
    count: 0,
    name: 'cjg',
    age: 18
  })

  const handleClick = () => {
    const { count } = data
    setData({
      ...data,
      count: count + 1
    })
  }

  return <button onClick={handleClick}>count:{data.count}</button>
})
```



##### `useMemo`

`useMemo` 它的用法其实跟 useEffects 有点像，我们直接看官方给的例子

```jsx
function Parent({ a, b }) {
  // Only re-rendered if `a` changes:
  const child1 = useMemo(() => <Child1 a={a} />, [a])
  // Only re-rendered if `b` changes:
  const child2 = useMemo(() => <Child2 b={b} />, [b])
  return (
    <>
      {child1}
      {child2}
    </>
  )
}
```

从例子可以看出来，它的第二个参数和 useEffect 的第二个参数是一样的，只有在第二个参数数组的值发生变化时，才会触发子组件的更新。

引用[React hooks 实践](https://github.com/chenjigeng/blog/blob/master/React%20hooks%E5%AE%9E%E8%B7%B5.md)

##### 使用 `shouldComponentUpdate()` 防止不必要的重新渲染

当一个组件的 props 或 state 变更，React 会将最新返回的元素与之前渲染的元素进行对比，以此决定是否有必要更新真实的 DOM，当它们不相同时 React 会更新该 DOM。

即使 React 只更新改变了的 DOM 节点，重新渲染仍然花费了一些时间。在大部分情况下它并不是问题，但是如果渲染的组件非常多时，就会浮现性能上的问题，我们可以通过覆盖生命周期方法 `shouldComponentUpdate` 来进行提速。

`shouldComponentUpdate` 方法会在重新渲染前被触发。其默认实现总是返回 true，如果组件不需要更新，可以在 `shouldComponentUpdate` 中返回 false 来跳过整个渲染过程。其包括该组件的 render 调用以及之后的操作。

```jsx
shouldComponentUpdate(nextProps, nextState) {
   return nextProps.next !== this.props.next
}
```

#### React 性能分析器

React 16.5 增加了对新的开发者工具 DevTools 性能分析插件的支持。 此插件使用 React 实验性的 Profiler API 来收集有关每个组件渲染的用时信息，以便识别 React 应用程序中的性能瓶颈。 它将与我们即将推出的 time slicing（时间分片） 和 suspense（悬停） 功能完全兼容。

### redux

`Store`：保存数据的地方，你可以把它看成一个容器，整个应用只能有一个 `Store`。

`State`：`Store` 对象包含所有数据，如果想得到某个时点的数据，就要对 `Store` 生成快照，这种时点的数据集合，就叫做 `State`。

`Action`：`State` 的变化，会导致 View 的变化。但是，用户接触不到 State，只能接触到 View。所以，State 的变化必须是 View 导致的。Action 就是 View 发出的通知，表示 State 应该要发生变化了。

`Action Creator`：View 要发送多少种消息，就会有多少种 `Action`。如果都手写，会很麻烦，所以我们定义一个函数来生成 Action，这个函数就叫 `Action Creator`。

`Reducer`：`Store` 收到 `Action` 以后，必须给出一个新的 `State`，这样 View 才会发生变化。这种 `State` 的计算过程就叫做 `Reducer`。`Reducer` 是一个函数，它接受 Action 和当前 `State` 作为参数，返回一个新的 `State`。

`dispatch`：是 `View` 发出 `Action` 的唯一方法。



#### redux 的基本原理

然后我们过下整个工作流程：

首先，用户（通过 `View`）发出 `Action`，发出方式就用到了 `dispatch` 方法。

然后，`Store` 自动调用 `Reducer`，并且传入两个参数：当前 `State` 和收到的 `Action`，`Reducer` 会返回新的 `State`

`State` 一旦有变化，`Store` 就会调用监听函数，来更新 `View`。

到这儿为止，一次用户交互流程结束。可以看到，在整个流程中数据都是单向流动的，这种方式保证了流程的清晰。



### 参考：

1. [深入分析虚拟 DOM 的渲染原理和特性](https://juejin.im/post/5cb66fdaf265da0384128445)
2. [react 事件机制](http://www.conardli.top/blog/article/react%E6%B7%B1%E5%85%A5%E7%B3%BB%E5%88%97/react%E4%BA%8B%E4%BB%B6%E6%9C%BA%E5%88%B6.html)
3. [从 Mixin 到 HOC 再到 Hook](https://juejin.im/post/5cad39b3f265da03502b1c0a)
4. [美团技术团队-Redux 从设计到源码](https://tech.meituan.com/2017/07/14/redux-design-code.html)
5. [解析 snabbdom 源码，教你实现精简的 Virtual DOM 库](https://github.com/creeperyang/blog/issues/33)
6. [react 源码解析](https://react.jokcy.me)
7. [Vue 与 React 两个框架的粗略区别对比](https://segmentfault.com/a/1190000017414633)
