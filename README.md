### React 实际项目应用与最佳实践

<ver />
react 内部实现原理，
1. createElement 如何构建虚拟 dom
2. React.Component 如何实现组件化
3. setState 异步队列
4. dom 的 diff 算法
5. render 渲染逻辑
6. React16 fiber 架构
7. React Hooks

<ver />

### React 生命周期

<ver />
目前React 16.8 +的生命周期分为三个阶段,分别是挂载阶段、更新阶段、卸载阶段
```jsx
class ExampleComponent extends React.Component {
  // 构造函数，最先被执行,我们通常在构造函数里初始化state对象或者给自定义方法绑定this
  constructor() {}
  //getDerivedStateFromProps(nextProps, prevState)用于替换 `componentWillReceiveProps` ，该函数会在初始化和 `update` 时被调用
  // 这是个静态方法,当我们接收到新的属性想去修改我们state，可以使用getDerivedStateFromProps
  static getDerivedStateFromProps(nextProps, prevState) {
    // 新的钩子 getDerivedStateFromProps() 更加纯粹, 它做的事情是将新传进来的属性和当前的状态值进行对比, 若不一致则更新当前的状态。
    if (nextProps.riderId !== prevState.riderId) {
      return {
        riderId: nextProps.riderId
      }
    }
    // 返回 null 则表示 state 不用作更新
    return null
  }
  // shouldComponentUpdate(nextProps, nextState),有两个参数nextProps和nextState，表示新的属性和变化之后的state，返回一个布尔值，true表示会触发重新渲染，false表示不会触发重新渲染，默认返回true,我们通常利用此生命周期来优化React程序性能
  shouldComponentUpdate(nextProps, nextState) {
     return nextProps.id !== this.props.id;
  }
  // 组件挂载后调用
  // 可以在该函数中进行请求或者订阅
  componentDidMount() {}
  // getSnapshotBeforeUpdate(prevProps, prevState):这个方法在render之后，componentDidUpdate之前调用，有两个参数prevProps和prevState，表示之前的属性和之前的state，这个函数有一个返回值，会作为第三个参数传给componentDidUpdate，如果你不想要返回值，可以返回null，此生命周期必须与componentDidUpdate搭配使用
  getSnapshotBeforeUpdate() {}
  // 组件即将销毁
  // 可以在此处移除订阅，定时器等等
  componentWillUnmount() {}
  // 组件销毁后调用
  componentDidUnMount() {}
  // componentDidUpdate(prevProps, prevState, snapshot):该方法在getSnapshotBeforeUpdate方法之后被调用，有三个参数prevProps，prevState，snapshot，表示之前的props，之前的state，和snapshot。第三个参数是getSnapshotBeforeUpdate返回的,如果触发某些回调函数时需要用到 DOM 元素的状态，则将对比或计算的过程迁移至 getSnapshotBeforeUpdate，然后在 componentDidUpdate 中统一触发回调或更新状态。
  componentDidUpdate() {}
  // 渲染组件函数
  render() {}
  // 以下函数不建议使用
  UNSAFE_componentWillMount() {}
  UNSAFE_componentWillUpdate(nextProps, nextState) {}
  UNSAFE_componentWillReceiveProps(nextProps) {}
}
```

<ver />

React 版本 17 将弃用几个类组件 API 生命周期：`componentWillMount`，`componentWillReceiveProps`和`componentWillUpdate`。

<hor />

### react 事件机制

<ver />
react 里面绑定事件的方式和在 HTML 中绑定事件类似，使用驼峰式命名指定要绑定的 onClick 属性为组件定义的一个方法 `{this.handleClick.bind(this)}`。
由于类的方法默认不会绑定 this，因此在调用的时候如果忘记绑定，this 的值将会是 undefined。 通常如果不是直接调用，应该为方法绑定 this，将事件函数上下文绑定要组件实例上。
<ver />

##### 绑定事件的四种方式

```js
class Button extends React.Component {
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

<ver />

##### “合成事件”和“原生事件”

React 实现了一个“合成事件”层（synthetic event system），所有事件均注册到了元素的最顶层-document 上，“合成事件”会以事件委托（event delegation）的方式绑定到组件最上层，并且在组件卸载（unmount）的时候自动销毁绑定的事件。

<hor />

### React 组件开发

##### React 组件化思想

##### 一个 UI 组件的完整模板

```jsx
import classNames from 'classnames'
class Button extends React.Component {
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

##### React 参数传参与校验

##### 函数定义组件（Function Component）

纯展示型的，不需要维护 state 和生命周期，则优先使用 `Function Component`

1. 代码更简洁，一看就知道是纯展示型的，没有复杂的业务逻辑
2. 更好的复用性。只要传入相同结构的 props，就能展示相同的界面，不需要考虑副作用。
3. 打包体积小，执行效率高

```jsx
function MyComponent(props) {
  let { name } = props
  return <h1>Hello, {name}</h1>
}
```

##### ES6 class 定义一个纯组件（PureComponent）

组件需要维护 state 或使用生命周期方法，则优先使用 `PureComponent`

```jsx
class MyComponent extends React.Component {
  render() {
    let { name } = this.props
    return <h1>Hello, {name}</h1>
  }
}
```

##### 高阶组件(higher order component)

高阶组件是一个以组件为参数并返回一个新组件的函数。HOC 运行你重用代码、逻辑和引导抽象。最常见的可能是 Redux 的 connect 函数。除了简单分享工具库和简单的组合，HOC 最好的方式是共享 React 组件之间的行为。如果你发现你在不同的地方写了大量代码来做同一件事时，就应该考虑将代码重构为可重用的 HOC。

<hor />
### setState数据管理

##### 不要直接更新状态

```js
// Wrong 此代码不会重新渲染组件,构造函数是唯一能够初始化 this.state 的地方。
this.state.comment = 'Hello'
// Correct 应当使用 setState():
this.setState({ comment: 'Hello' })
```

组件生命周期中或者 React 事件绑定中，setState 是通过异步更新的，在延时的回调或者原生事件绑定的回调中调用 setState 不一定是异步的。

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

原生事件绑定不会通过合成事件的方式处理，会进入更新事务的处理流程。setTimeout 也一样，在 setTimeout 回调执行时已经完成了原更新组件流程，不会放入 dirtyComponent 进行异步更新，其结果自然是同步的。

##### setState 原理

### React 中的事务实现

### 使用不可变数据结构 Immutablejs 和 PureComponent

<hor />
### ErrorBoundary、Suspense和Fragment
##### Error Boundaries
React 16 提供了一个新的错误捕获钩子 `componentDidCatch(error, errorInfo)`, 它能将子组件生命周期里所抛出的错误捕获, 防止页面全局崩溃。demo
componentDidCatch 并不会捕获以下几种错误
- 事件机制抛出的错误(事件里的错误并不会影响渲染)
- Error Boundaries 自身抛出的错误
- 异步产生的错误
- 服务端渲染
##### Suspense
Suspense 意思是能暂停当前组件的渲染, 当完成某件事以后再继续渲染。

`code splitting`(16.6, 已上线): 文件懒加载。在此之前的实现方式是 react-loadable;
`Concurrent mode`(2019 年 Q1 季度): 并发模式;
`data fetching`(2019 年中): 可以控制等所有数据都加载完再呈现出数据; `Suspense` 提供一个时间参数, 若小于这个值则不进行 loading 加载, 若超过这个值则进行 loading 加载;

```jsx
import React, { lazy, Suspense } from 'react'
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
const OtherComponent = React.lazy(() => OtherComponentPromise)
```

<hor />
### React hooks
在 React 16.7 之前, React 有两种形式的组件, 有状态组件(类)和无状态组件(函数)。Hook 是 React 16.8 的新增特性。它可以让你在不编写 `class` 的情况下使用 state 以及其他的 React 特性。Hooks 的意义就是赋能先前的无状态组件, 让之变为有状态。这样一来更加契合了 React 所推崇的函数式编程。

接下来梳理 Hooks 中最核心的 2 个 api, `useState` 和 `useEffect`

##### useState

useState 返回状态和一个更新状态的函数

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

##### useEffect(fn)

在每次 render 后都会执行这个钩子。可以将它当成是 componentDidMount、componentDidUpdate、componentWillUnmount 的合集。因此使用 useEffect 比之前优越的地方在于:

可以避免在 componentDidMount、componentDidUpdate 书写重复的代码;
可以将关联逻辑写进一个 useEffect(在以前得写进不同生命周期里);

##### 怎么使用，会对之前的 React 开发造成什么冲击

<hor />

### React 中的高阶组件和 render props

<hor />

### React Fiber 架构分析

##### React Fiber 架构解决了什么问题

<hor />

### 深入理解 React 原理

##### 实现 React 核心 api

##### React 虚拟 dom 原理剖析

当组件状态 state 有更改的时候，React 会自动调用组件的 render 方法重新渲染整个组件的 UI。
当然如果真的这样大面积的操作 DOM，性能会是一个很大的问题，所以 React 实现了一个 Virtual DOM，组件 DOM 结构就是映射到这个 Virtual DOM 上，React 在这个 Virtual DOM 上实现了一个 diff 算法，当要重新渲染组件的时候，会通过 diff 寻找到要变更的 DOM 节点，再把这个修改更新到浏览器实际的 DOM 节点上，所以实际上不是真的渲染整个 DOM 树。这个 Virtual DOM 是一个纯粹的 JS 数据结构，所以性能会比原生 DOM 快很多。

<hor />

### React 和 Vue 特点比较

<hor />

### redux

##### redux 单向数据流架构如何设计

##### redux 中间件

<hor />

### React 性能分析与优化

##### 在 React-Router4 中使用懒加载性能优化
