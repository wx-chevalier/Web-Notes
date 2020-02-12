# renderProps

renderProps 是指一种在 React 组件之间使用一个值为函数的 prop 在 React 组件间共享代码的简单技术。带有 render prop 的组件带有一个返回一个 React 元素的函数并调用该函数而不是实现自己的渲染逻辑。

```js
<DataProvider render={data => <h1>Hello {data.target}</h1>} />
```

我们常常在交叉关注点（Cross-Cutting Concerns）使用 renderProps，组件在 React 是主要的代码复用单元，但如何共享状态或一个组件的行为封装到其他需要相同状态的组件中并不是很明了。

```js
class WindowWidth extends React.Component {
  constructor() {
    super();
    this.state = { width: 0 };
  }

  componentDidMount() {
    this.setState({ width: window.innerWidth }, () =>
      window.addEventListener("resize", ({ target }) =>
        this.setState({ width: target.innerWidth })
      )
    );
  }

  render() {
    return this.props.children(this.state.width);
  }
}
```

# 技巧

## 使用 Props 而非 render

记住仅仅是因为这一模式被称为 “render props” 而你不必为使用该模式而用一个名为 render 的 prop。实际上，组件能够知道什么需要渲染的任何函数 prop 在技术上都是 “render prop”。尽管之前的例子使用了 render，我们也可以简单地使用 children prop。

```js
<Mouse
  children={mouse => (
    <p>
      The mouse position is {mouse.x}, {mouse.y}
    </p>
  )}
/>

// 或者直接放置到元素的内部
<Mouse>
  {mouse => (
    <p>The mouse position is {mouse.x}, {mouse.y}</p>
  )}
</Mouse>
```

## 无法使用 React.PureComponent

如果你在 render 方法里创建函数，那么使用 render prop 会抵消使用 React.PureComponent 带来的优势。这是因为浅 prop 比较对于新 props 总会返回 false，并且在这种情况下每一个 render 对于 render prop 将会生成一个新的值。例如，继续我们之前使用 <Mouse> 组件，如果 Mouse 继承自 React.PureComponent 而不是 React.Component，我们的例子看起来就像这样：

```js
class Mouse extends React.PureComponent {
  // Same implementation as above...
}

class MouseTracker extends React.Component {
  render() {
    return (
      <div>
        <h1>Move the mouse around!</h1>

        {/*
          This is bad! The value of the `render` prop will
          be different on each render.
        */}
        <Mouse render={mouse => <Cat mouse={mouse} />} />
      </div>
    );
  }
}
```

在这样例子中，每次 <MouseTracker> 渲染，它会生成一个新的函数作为 <Mouse render> 的 prop，因而在同时也抵消了继承自 React.PureComponent 的 <Mouse> 组件的效果。为了绕过这一问题，有时你可以定义一个 prop 作为实例方法，类似如下：

```js
class MouseTracker extends React.Component {
  constructor(props) {
    super(props);

    // This binding ensures that `this.renderTheCat` always refers
    // to the *same* function when we use it in render.
    this.renderTheCat = this.renderTheCat.bind(this);
  }

  renderTheCat(mouse) {
    return <Cat mouse={mouse} />;
  }

  render() {
    return (
      <div>
        <h1>Move the mouse around!</h1>
        <Mouse render={this.renderTheCat} />
      </div>
    );
  }
}
```

# 案例

## 响应鼠标移动

例如，下面的组件在 web 应用追踪鼠标位置：

```js
class MouseTracker extends React.Component {
  constructor(props) {
    super(props);
    this.handleMouseMove = this.handleMouseMove.bind(this);
    this.state = { x: 0, y: 0 };
  }

  handleMouseMove(event) {
    this.setState({
      x: event.clientX,
      y: event.clientY
    });
  }

  render() {
    return (
      <div style={{ height: "100%" }} onMouseMove={this.handleMouseMove}>
        <h1>Move the mouse around!</h1>
        <p>
          The current mouse position is ({this.state.x}, {this.state.y})
        </p>
      </div>
    );
  }
}
```

随着鼠标在屏幕上移动，在一个 `<p>` 的组件上显示它的 (x, y) 坐标。现在的问题是：我们如何在另一个组件中重用行为？换句话说，若另一组件需要知道鼠标位置，我们能否封装这一行为以让能够容易在组件间共享？由于组件是 React 中最基础的代码重用单元，现在尝试重构一部分代码能够在 `<Mouse>` 组件中封装我们需要在其他地方的行为。

```js
// The <Mouse> component encapsulates the behavior we need...
class Mouse extends React.Component {
  constructor(props) {
    super(props);
    this.handleMouseMove = this.handleMouseMove.bind(this);
    this.state = { x: 0, y: 0 };
  }

  handleMouseMove(event) {
    this.setState({
      x: event.clientX,
      y: event.clientY
    });
  }

  render() {
    return (
      <div style={{ height: "100%" }} onMouseMove={this.handleMouseMove}>
        {/* ...but how do we render something other than a <p>? */}
        <p>
          The current mouse position is ({this.state.x}, {this.state.y})
        </p>
      </div>
    );
  }
}

class MouseTracker extends React.Component {
  render() {
    return (
      <div>
        <h1>Move the mouse around!</h1>
        <Mouse />
      </div>
    );
  }
}
```

现在 `<Mouse>` 组件封装了所有关于监听 mousemove 事件和存储鼠标 (x, y) 位置的行为，但其仍不是真正的可重用。例如，假设我们现在有一个在屏幕上跟随鼠标渲染一张猫的图片的 <Cat> 组件。我们可能使用 `<Cat mouse={{ x, y }}` prop 来告诉组件鼠标的坐标以让它知道图片应该在屏幕哪个位置。

```js
import React from "react";

class Cat extends React.Component<{ mouse: { x: number, y: number } }> {
  render() {
    const mouse = this.props.mouse;
    return (
      <img
        src="https://s2.ax1x.com/2019/12/02/QucJwn.png"
        style={{ position: "absolute", left: mouse.x, top: mouse.y }}
      />
    );
  }
}

class Mouse extends React.Component<
  {
    render: (mouse: { x: number, y: number }) => JSX.Element
  },
  { x: number, y: number }
> {
  constructor(props: any) {
    super(props);
    this.handleMouseMove = this.handleMouseMove.bind(this);
    this.state = { x: 0, y: 0 };
  }

  handleMouseMove(event: React.MouseEvent<HTMLDivElement, MouseEvent>) {
    this.setState({
      x: event.clientX,
      y: event.clientY
    });
  }

  render() {
    return (
      <div style={{ height: "100%" }} onMouseMove={this.handleMouseMove}>
        {/*
          Instead of providing a static representation of what <Mouse> renders,
          use the `render` prop to dynamically determine what to render.
        */}
        {this.props.render(this.state)}
      </div>
    );
  }
}

class MouseTracker extends React.Component {
  render() {
    return (
      <div>
        <h1>Move the mouse around!</h1>
        <Mouse
          render={(mouse: { x: number, y: number }) => <Cat mouse={mouse} />}
        />
      </div>
    );
  }
}
```

## 通用数据加载

我们可以用 renderProps 封装的组件如下所示：

```js
class Fetch extends React.Component {
  state = {
    data: void 0,
    error: void 0,
    loading: false
  };

  componentDidMount() {
    this.fetchData();
  }

  componentDidUpdate(prevProps) {
    if (this.props.url && this.props.url !== prevProps.url) {
      this.fetchData(this.props.url);
    }
  }

  async fetchData() {
    try {
      this.setState({ loading: true });
      const response = await fetch(this.props.url);
      const json = await response.json();
      this.setState({ data: json });
      this.setState({ loading: false });
    } catch (err) {
      this.setState({ error: err });
    }
  }

  render() {
    const { error, data, loading } = this.state;
    if (loading) return <div>Loading...</div>;
    if (error) return this.props.error(error);
    if (data) return this.props.render(data);
    else return null;
  }
}
```

该组件的用法如下：

```js
<Fetch
  url={`url-to-product`}
  render={data => <ProductDetail product={data.product} />}
  error={error => <div>{error.message}</div>}
/>
```
