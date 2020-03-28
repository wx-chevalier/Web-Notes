# State

`setState` 方法最大的特点在于异步批次更新，其内部实现原理我们会在未来章节详细介绍。

# 组件状态

## 避免状态误用

React 组件中的数据流主要由 Props 与 State 构成，我们已经知道 State 可以用于存放组件内部的临时状态。在传统的面向对象编程中，我们习惯在构造函数中将外部传入的构造参数存入类的成员变量中；不过这种设计模式在 React 组件开发中却容易造成反模式。譬如我们要开发`NameLabel` 组件，其允许外部传入`firstName` 与`lastName` 两个参数，该组件会将两个参数组合展示：

```js
class NameLabel extends Component {
  constructor(props) {
    super(props);
    this.state = {
      fullName: props.firstName + "" + props.lastName
    };
  }

  render() {
    return <h1>Hello, {this.state.fullName}</h1>;
  }
}
```

该组件存在的问题在于我们将 Props 传入的参数缓存在了 State 中，当父组件修改 Props 参数时并不会触发构造函数，相对应地最终的界面展示也就不会随着外部传入参数的变化而变化。为了修复这个错误我们可以复写组件的`componentWillReceiveProps` 函数：

```js
class NameLabel extends Component {
  constructor(props) {
    super(props);
    this.state = {
      fullName: props.firstName + "" + props.lastName
    };
  }

  componentWillReceiveProps(nextProps) {
    this.state = {
      fullName: nextProps.firstName + "" + nextProps.lastName
    };
  }

  render() {
    return <h1>Hello, {this.state.fullName}</h1>;
  }
}
```

通过复写`componentWillReceiveProps` 函数我们能够正确响应外部 Props 的变化，不过这种方式还是显得有所冗余，我们没有必要将 Props 中的数据缓存到 State 中。我们可以在`render` 函数中直接读取 Props 中传入的参数然后显示：

```
class NameLabel extends Component {
  render() {
    const { firstName, lastName } = this.props;
    const fullName = firstName + "" + lastName;
    return <h1>Hello, {fullName}</h1>;
  }
}
```

再精简一点，我们可以直接用函数式组件表示：

```
function NameLabel({ firstName, lastName }) {
  const fullName = firstName + "" + lastName;
  return <h1>Hello, {fullName}</h1>;
}
```

## 外部操作组件状态

React 中我们需要避免直接操作 DOM 节点或者访问全局变量，不过某些情况下我们需要在组件外触发组件内部状态更新，可以通过构建挂载于全局变量下的闭包来达成：

```
componentWillMount(){
 globalVar.callback = (data) => {
    // `this` 指向当前React组件
    this.setState({...});
  };
}
```

在我们需要触发事件更新，譬如将获取到的数据渲染到界面上时，直接操作全局变量即可：

```
globalVar.callback(data);
```

笔者还是要强调下，这种模式并不提倡，会破坏 React 的数据流与组件的封装性，务必要谨慎使用。

# setState 同步更新

我们在上文中提及，为了提高性能 React 将 setState 设置为批次更新，即是异步操作函数，并不能以顺序控制流的方式设置某些事件，我们也不能依赖于`this.state`来计算未来状态。典型的譬如我们希望在从服务端抓取数据并且渲染到界面之后，再隐藏加载进度条或者外部加载提示：

```js
componentDidMount() {
    fetch('https://example.com')
        .then((res) => res.json())
        .then(
            (something) => {
                this.setState({ something });
                StatusBar.setNetworkActivityIndicatorVisible(false);
            }
        );
}
```

因为 `setState` 函数并不会阻塞等待状态更新完毕，因此`setNetworkActivityIndicatorVisible`有可能先于数据渲染完毕就执行。我们可以选择在`componentWillUpdate`与`componentDidUpdate`这两个生命周期的回调函数中执行`setNetworkActivityIndicatorVisible`，但是会让代码变得破碎，可读性也不好。实际上在项目开发中我们更频繁遇见此类问题的场景是以某个变量控制元素可见性：

```
this.setState({showForm : !this.state.showForm});
```

我们预期的效果是每次事件触发后改变表单的可见性，但是在大型应用程序中如果事件的触发速度快于 `setState` 的更新速度，那么我们的值计算完全就是错的。本节就是讨论两种方式来保证 `setState` 的同步更新。

## 完成回调

`setState` 函数的第二个参数允许传入回调函数，在状态更新完毕后进行调用，譬如：

```js
this.setState(
  {
    load: !this.state.load,
    count: this.state.count + 1
  },
  () => {
    console.log(this.state.count);
    console.log("加载完成");
  }
);
```

这里的回调函数用法相信大家很熟悉，就是 JavaScript 异步编程相关知识，我们可以引入 Promise 来封装 setState:

```js
  setStateAsync(state) {
    return new Promise((resolve) => {
      this.setState(state, resolve)
    });
  }
```

`setStateAsync`返回的是 Promise 对象，在调用时我们可以使用 Async/Await 语法来优化代码风格：

```js
  async componentDidMount() {
    StatusBar.setNetworkActivityIndicatorVisible(true)
    const res = await fetch('https://api.ipify.org?format=json')
    const {ip} = await res.json()
    await this.setStateAsync({ipAddress: ip})
    StatusBar.setNetworkActivityIndicatorVisible(false)
  }
```

这里我们就可以保证在 `setState` 渲染完毕之后调用外部状态栏将网络请求状态修改为已结束，整个组件的完整定义为：

```js
class AwesomeProject extends Component {
  state = {}
  setStateAsync(state) {
    ...
  }
  async componentDidMount() {
   ...
  }
  render() {
    return (
      <View style={styles.container}>
        <Text style={styles.welcome}>
          My IP is {this.state.ipAddress || 'Unknown'}
        </Text>
      </View>
    );
  }
}
```

## 传入状态计算函数

除了使用回调函数的方式监听状态更新结果之外，React 还允许我们传入某个状态计算函数而不是对象来作为第一个参数。状态计算函数能够为我们提供可信赖的组件的 State 与 Props 值，即会自动地将我们的状态更新操作添加到队列中并等待前面的更新完毕后传入最新的状态值：

```js
this.setState(function(prevState, props) {
  return { showForm: !prevState.showForm };
});
```

这里我们以简单的计数器为例，我们希望用户点击按钮之后将计数值连加两次，基本的组件为：

```js
class Counter extends React.Component {
  constructor(props) {
    super(props);
    this.state = { count: 0 };
    this.incrementCount = this.incrementCount.bind(this);
  }
  incrementCount() {
    // ...
  }
  render() {
    return (
      <div>
                      <button onClick={this.incrementCount}>Increment</button>
                      <div>{this.state.count}</div>
                  
      </div>
    );
  }
}
```

直观的写法我们可以连续调用两次 `setState` 函数，这边的用法可能看起来有点怪异，不过更多的是为了说明异步更新带来的数据不可预测问题。

```js
  incrementCount(){
    this.setState({count : this.state.count + 1})
    this.setState({count : this.state.count + 1})
  }
```

上述代码的效果是每次点击之后计数值只会加 1，实际上第二个 `setState` 并没有等待第一个 `setState` 执行完毕就开始执行了，因此其依赖的当前计数值完全是错的。我们当然可以使用上文提及的 `setStateAsync` 来进行同步控制，不过这里我们使用状态计算函数来保证同步性：

```js
  incrementCount(){
   this.setState((prevState, props) => ({
      count: prevState.count + 1
    }));
   this.setState((prevState, props) => ({
      count: prevState.count + 1
    }));
  }
```

这里的第二个 `setState` 传入的`prevState`值就是第一个 `setState` 执行完毕之后的计数值，也顺利保证了连续自增两次。

# 避免在组件卸载后执行更新

在 React 开发过程中我们可能会经常遇到如下的错误：

```s
Warning: Can only update a mounted or mounting component. This usually means you called setState, replaceState, or forceUpdate on an unmounted component. This is a no-op.

Warning: Can't call setState (or forceUpdate) on an unmounted component. This is a no-op, but it indicates a memory leak in your application. To fix, cancel all subscriptions and asynchronous tasks in the componentWillUnmount method.
```

通常，警告不会使您的应用程序崩溃。但是您应该关心它们。例如，如果未正确卸载有状态组件，则先前的警告会导致性能问题。让我们讨论这些警告的含义。即使在组件中已经卸载了 `this.setState()`，通常也会显示所示的警告。卸载可能在不同情况下发生：

- 由于 React 的条件渲染，您不再渲染组件。
- 您可以使用诸如 React Router 之类的库来浏览组件。

当不再渲染组件时，如果您已经在组件中完成了异步业务逻辑并随后更新了组件的本地状态，则仍然可能会调用 `this.setState()`。以下是最常见的原因：

- 您向 API 发出了异步请求，该请求（例如 Promise）尚未解决，但是您卸载了该组件。然后请求解析，调用 this.setState()设置新状态，但是它遇到了一个未安装的组件。

- 您的组件中有一个侦听器，但未在 componentWillUnmount()上将其删除。然后，在卸载组件时可以触发侦听器。

- 您在组件中设置了一个间隔（例如 setInterval），并且在间隔内调用了 this.setState()。如果忘记删除 componentWillUnmount()上的间隔，则将再次更新已卸载组件上的状态。

看到此警告会发生什么最坏的情况？ 它会影响您的 React 应用程序的性能，因为随着时间的流逝，它会导致您的应用程序在浏览器中运行而导致内存泄漏。如果在组件卸载后只错过了一次阻止设置状态的机会，那么它可能不会对性能产生巨大影响。但是，如果您具有这些包含异步请求的组件的列表，并且错过了阻止为所有组件设置状态的选择，那么它可能会降低您的 React 应用程序的速度。尽管如此，这还不是最糟糕的。最坏的情况是错过删除事件侦听器，尤其是间隔。想象一下，即使卸载了组件，也要每秒间隔更新组件的本地状态。如果您错过删除此间隔的时间，则可能会体验到它如何减慢您的应用程序的速度。

对于监听函数与 Interval，我们可以在 componentWillUnmount() 中卸载这些回调函数，而对于异步请求，我们则需要引入额外的成员变量：

```js
class News extends Component {
  _isMounted = false;
  constructor(props) {
    super(props);
    this.state = {
      news: []
    };
  }
  componentDidMount() {
    this._isMounted = true;
    axios
      .get("https://hn.algolia.com/api/v1/search?query=react")
      .then(result => {
        if (this._isMounted) {
          this.setState({
            news: result.data.hits
          });
        }
      });
  }
  componentWillUnmount() {
    this._isMounted = false;
  }
  render() {
    // ...
  }
}
```
