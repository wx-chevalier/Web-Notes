# 在 React 中使用 Redux

在 [Redux 系列文章](https://ngte-web.gitbook.io/?q=redux)中我们详细介绍了 Redux 的设计与使用，React Redux 是官方提供的 Redux 与 React 的绑定库，用于将 Redux 中的 State 与 Action Creators 映射到 React 组件的 Props。本组件的设计思想可以查看[Presentational and Container Components](https://medium.com/@dan_abramov/smart-and-dumb-components-7ca2f9a7c7d0#.6bnhmpqtg)，即将展示组件与容器组件分离，将展示组件尽可能地作为 Stateless 对待。在应用中，只有最顶层组件是对 Redux 可知(例如路由处理)这是很好的。所有它们的子组件都应该是“笨拙”的，并且是通过 props 获取数据。

|            | 容器组件              | 展示组件              |
| ---------- | --------------------- | --------------------- |
| 位置       | 最顶层，路由处理      | 中间和子组件          |
| 使用 Redux | 是                    | 否                    |
| 读取数据   | 从 Redux 获取 state   | 从 props 获取数据     |
| 修改数据   | 向 Redux 发起 actions | 从 props 调用回调函数 |

# 组件数据流

![React Redux 数据流](http://p9.qhimg.com/d/inn/a8ab3ea4/react-redux.png)

我们用 react-redux 提供的 connect() 方法将“笨拙”的 Counter 转化成容器组件。connect() 允许你从 Redux store 中指定准确的 state 到你想要获取的组件中。这让你能获取到任何级别颗粒度的数据。首先来看下一个简单的 Counter 的示例：

```js
export default class Counter extends Component {
  render() {
    return <button onClick={this.props.onIncrement}>{this.props.value}</button>;
  }
}
```

```js
// 哪些 Redux 全局的 state 是我们组件想要通过 props 获取的？
function mapStateToProps(state) {
  return {
    value: state.counter
  };
}

// 哪些 action 创建函数是我们想要通过 props 获取的？
function mapDispatchToProps(dispatch) {
  return {
    onIncrement: () => dispatch(increment())
  };
}

/**或者也可以使用bindActionCreators
//将Dispatch映射为Props
...
import * as CounterActions from "../actions/counter";
...
function mapDispatchToProps(dispatch) {
    return bindActionCreators(CounterActions, dispatch)
}
**/

// 你可以传递一个对象，而不是定义一个 `mapDispatchToProps`：
// export default connect(mapStateToProps, CounterActionCreators)(Counter);

// 或者如果你想省略 `mapDispatchToProps`，你可以通过传递一个 `dispatch` 作为一个 props：
// export default connect(mapStateToProps)(Counter);

let App = connect(
  mapStateToProps,
  mapDispatchToProps
)(Counter);
const targetEl = document.getElementById("root");
const store = configureStore({ counter: 0 }); //初始化Store

ReactDOM.render(
  <Provider store={store}>
    <App />
  </Provider>,
  targetEl
);
```

总结而言，各个部分的作用如下：

![React Redux 组件功能](https://s2.ax1x.com/2020/01/06/lyY2ut.md.png)

# Provider & Store

`<Provider store>` 使组件层级中的 connect() 方法都能够获得 Redux store。正常情况下，你的根组件应该嵌套在 `<Provider>` 中才能使用 connect() 方法。如果你真的不想把根组件嵌套在 `<Provider>`中，你可以把 store 作为 props 传递到每一个被 connet() 包装的组件，但是我们只推荐您在单元测试中对 store 进行伪造 (stub) 或者在非完全基于 React 的代码中才这样做。正常情况下，你应该使用 `<Provider>`。
属性

- store (Redux Store): 应用程序中唯一的 Redux store 对象
- children (ReactElement) 组件层级的根组件。

# connect：连接 React 组件与 Redux store。

```js
connect(
  [mapStateToProps],
  [mapDispatchToProps],
  [mergeProps],
  [options]
);
```

连接操作不会改变原来的组件类，反而返回一个新的已与 Redux store 连接的组件类。

## mapStateToProps

[mapStateToProps(state, [ownProps]): stateProps](Function): 如果定义该参数，组件将会监听 Redux store 的变化。任何时候，只要 Redux store 发生改变，mapStateToProps 函数就会被调用。该回调函数必须返回一个纯对象，这个对象会与组件的 props 合并。如果你省略了这个参数，你的组件将不会监听 Redux store。如果指定了该回调函数中的第二个参数 ownProps，则该参数的值为传递到组件的 props，而且只要组件接收到新的 props，mapStateToProps 也会被调用。

## mapDispatchToProps

[mapDispatchToProps(dispatch, [ownProps]): dispatchProps] (Object or Function): 如果传递的是一个对象，那么每个定义在该对象的函数都将被当作 Redux action creator，而且这个对象会与 Redux store 绑定在一起，其中所定义的方法名将作为属性名，合并到组件的 props 中。如果传递的是一个函数，该函数将接收一个 dispatch 函数，然后由你来决定如何返回一个对象，这个对象通过 dispatch 函数与 action creator 以某种方式绑定在一起(提示：你也许会用到 Redux 的辅助函数 bindActionCreators())。如果你省略这个 mapDispatchToProps 参数，默认情况下，dispatch 会注入到你的组件 props 中。如果指定了该回调函数中第二个参数 ownProps，该参数的值为传递到组件的 props，而且只要组件接收到新 props，mapDispatchToProps 也会被调用。

## mergeProps

[mergeProps(stateProps, dispatchProps, ownProps): props](Function): 如果指定了这个参数，mapStateToProps() 与 mapDispatchToProps() 的执行结果和组件自身的 props 将传入到这个回调函数中。该回调函数返回的对象将作为 props 传递到被包装的组件中。你也许可以用这个回调函数，根据组件的 props 来筛选部分的 state 数据，或者把 props 中的某个特定变量与 action creator 绑定在一起。如果你省略这个参数，默认情况下返回 Object.assign({}, ownProps, stateProps, dispatchProps) 的结果。

## options

[options](Object) 如果指定这个参数，可以定制 connector 的行为。

- [pure = true](Boolean): 如果为 true，connector 将执行 shouldComponentUpdate 并且浅对比 mergeProps 的结果，避免不必要的更新，前提是当前组件是一个“纯”组件，它不依赖于任何的输入或 state 而只依赖于 props 和 Redux store 的 state。默认值为 true。
- [withRef = false](Boolean): 如果为 true，connector 会保存一个对被包装组件实例的引用，该引用通过 getWrappedInstance() 方法获得。默认值为 false

# 链接

- https://mp.weixin.qq.com/s/axauH4xpq-ZV3FFHI9XWLg 动手实现一个 react-redux
