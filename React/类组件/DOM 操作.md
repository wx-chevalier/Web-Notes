# React 组件中 DOM 操作

`React.findDOMNode()`方法能够帮我们根据`refs`获取某个子组件的 DOM 对象，不过需要注意的是组件并不是真实的 DOM  节点，而是存在于内存之中的一种数据结构，叫做虚拟 DOM (virtual DOM)。只有当它插入文档以后，才会变成真实的 DOM 。根据 React  的设计，所有的 DOM  变动，都先在虚拟 DOM 上发生，然后再将实际发生变动的部分，反映在真实 DOM 上，这种算法叫做 DOM diff ，它可以极大提高网页的性能表现。但是，有时需要从组件获取真实 DOM  的节点，这时就要用到 React.findDOMNode  方法。

```js
var MyComponent = React.createClass({
  handleClick: function() {
    React.findDOMNode(this.refs.myTextInput).focus();
  },
  render: function() {
    return (
      <div>
        <input type="text" ref="myTextInput" />
        <input
          type="button"
          value="Focus the text input"
          onClick={this.handleClick}
        />
      </div>
    );
  }
});

React.render(<MyComponent />, document.getElementById("example"));
```

需要注意的是，由于 React.findDOMNode  方法获取的是真实 DOM ，所以必须等到虚拟 DOM  插入文档以后，才能使用这个方法，否则会返回 null 。上面代码中，通过为组件指定 Click  事件的回调函数，确保了只有等到真实 DOM  发生 Click  事件之后，才会调用 React.findDOMNode  方法。

# 组件渲染到 DOM

React 的初衷是构建相对独立的界面开发库，

在源代码中，组件定义相关代码与渲染相关代码是相分离的。当我们声明了某个组件之后，可以通过`ReactDOM`的`render`函数将 React 组件渲染到 DOM 元素中：

```js
const RootElement = (
  <div>
  <h1 style=>The world is yours</h1>
  <p>Say hello to my little friend</p>
  </div>
)

ReactDOM.render(RootElement, document.getElementById('app'))
```

# Refs

# 整合非 React 类库

## jQuery Integration

目前，我们项目中不可避免的还会存在大量的基于 jQuery 的插件，这些插件也确实非常的好用呦，通常我们会采取将 jQuery 插件封装成一个 React 组件的方式来进行调用，譬如我们需要调用一个用于播放的 jQuery 插件 JPlayer，那么可以以如下方式使用：

```js
// JPlayer component
class JPlayer extends React.Component {
  static propTypes = {
    sources: React.PropTypes.array.isRequired
  };
  componentDidMount() {
    $(this.refs.jplayer).jPlayer({
      ready: () => {
        $(this.refs.jplayer).jPlayer("setMedia", this.props.sources);
      },
      swfPath: "/js",
      supplied: _.keys(this.props.sources)
    });
  }
  componentWillUmount() {
    // I don't know jPlayer API but if you need to destroy it do it here.
  }
  render() {
    return <div ref="jplayer" className="jplayer" />;
  }
}

// Use it in another component...
<JPlayer sources={{ m4a: "/media/mysound.mp4", oga: "/media/mysound.ogg" }} />;
```
