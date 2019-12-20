# 导论

基本的 React 的页面形式如下所示：

```html
<!DOCTYPE html>
<html>
  <head>
    <script src="../build/react.js"></script>
    <script src="../build/JSXTransformer.js"></script>
  </head>
  <body>
    <div id="example"></div>
    <script type="text/jsx">
      // ** Our code goes here! **
    </script>
  </body>
</html>
```

React 独创了一种 JS、CSS 和 HTML 混写的 JSX 格式，可以通过在页面中引入 JSXTransformer 这个文件进行客户端的编译，不过还是推荐在 服务端编译。

```js
const HelloMessage = React.createClass({
  render: function() {
    return <div>Hello {this.props.name}</div>;
  }
});
React.render(
  <HelloMessage name="John" />,
  document.getElementById("container")
);
```

React.render 是 React 的最基本方法，用于将模板转为 HTML 语言，并插入指定的 DOM 节点。要注意的是，React 的渲染函数并不是简单地把 HTML 元素复制到页面上，而是维护了一张 Virtual Dom 映射表。

```js
class ExampleComponent extends React.Component {
  constructor() {
    super();
    this._handleClick = this._handleClick.bind(this);
    this.state = Store.getState();
  } // ...
}
```

在对于 React 的基本语法有了了解之后，下面我们会开始进行快速地环境搭建与实验。
