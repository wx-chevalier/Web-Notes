# Web Components && Shadow DOM

Web Components 的目标是减少单页应用中隔离 HTML，CSS 与 JavaScript 的复杂度，其主要包含了 Custom Elements, Shadow DOM, Template Element，HTML Imports，Custom Properties 等多个维度的规范与实现。Shadow DOM 它允许在文档（document）渲染时插入一棵 DOM 元素子树，但是这棵子树不在主 DOM 树中。因此开发者可利用 Shadow DOM 封装自己的 HTML 标签、CSS 样式和 JavaScript 代码。子树之间可以相互嵌套，对其中的内容进行了封装，有选择性的进行渲染。这就意味着我们可以插入文本、重新安排内容、添加样式等等。其结构示意如下：

![image](https://user-images.githubusercontent.com/5803001/43813782-c17e5d34-9af9-11e8-94df-7974298a2afc.png)

简单的 Shadow DOM 创建方式如下：

```html
<html>
  <head></head>
  <body>
    <p id="hostElement"></p>
    <script>
      // 创建 shadow DOM
      var shadow = document
        .querySelector("#hostElement")
        .attachShadow({ mode: "open" });
      // 给 shadow DOM 添加文字
      shadow.innerHTML = "<p>Here is some new text</p>";
      // 添加CSS，将文字变红
      shadow.innerHTML += "<style>p { color: red; }</style>";
    </script>
  </body>
</html>
```

我们也可以将 React 应用封装为 Custom Element 并且封装到 Shadow DOM 中：

```js
import React from "react";
import retargetEvents from "react-shadow-dom-retarget-events";

class App extends React.Component {
  render() {
    return <div onClick={() => alert("I have been clicked")}>Click me</div>;
  }
}

const proto = Object.create(HTMLElement.prototype, {
  attachedCallback: {
    value: function () {
      const mountPoint = document.createElement("span");
      const shadowRoot = this.createShadowRoot();
      shadowRoot.appendChild(mountPoint);
      ReactDOM.render(<App />, mountPoint);
      retargetEvents(shadowRoot);
    },
  },
});
document.registerElement("my-custom-element", { prototype: proto });
```

Shadow DOM 的兼容性较差，仅在 Chrome 较高版本浏览器中可以使用。
