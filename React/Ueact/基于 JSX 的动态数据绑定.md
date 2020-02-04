# 基于 JSX 的动态数据绑定

笔者在 [2016-我的前端之路: 工具化与工程化](https://zhuanlan.zhihu.com/p/24575395)一文中提及，前端社区用了 15 年的时间来分割 HTML、JavaScript 与 CSS，但是随着 JSX 的出现仿佛事物一夕回到解放前。在 Angular、Vue.js 等 MVVM 前端框架中都是采用了指令的方式来描述业务逻辑，而 JSX 本质上还是 JavaScript，即用 JavaScript 来描述业务逻辑。虽然 JSX 被有些开发者评论为丑陋的语法，但是笔者还是秉持 JavaScript First 原则，尽可能地用 JavaScript 去编写业务代码。在前文 [React 初窥：JSX 详解](https://parg.co/bWj)中我们探讨了 JSX 的前世今生与基本用法，而本部分我们着手编写简单的面向 DOM 的 JSX 解析与动态数据绑定库；本部分所涉及的代码归纳于 [Ueact](https://github.com/wx-chevalier/Ueact) 库。

# JSX 解析与 DOM 元素构建

## 元素构建

笔者在 [JavaScript 语法树与代码转化实践](https://zhuanlan.zhihu.com/p/28054817)一文中介绍过 Babel 的原理与用法，这里我们仍然使用 Babel 作为 JSX 语法解析工具；为了将 JSX 声明转化为 `createElement` 调用，这里需要在项目的 .babelrc 文件中做如下配置：

```json
{
  "plugins": [
    "transform-decorators-legacy",
    "async-to-promises",
    [
      "transform-react-jsx",
      {
        "pragma": "createElement"
      }
    ]
  ]
}
```

这里的 [createElement 函数](https://github.com/wx-chevalier/Ueact/tree/master/src/platform/dom)声明如下：

```js
/**
 * Description 从 JSX 中构建虚拟 DOM
 * @param tagName 标签名
 * @param props 属性
 * @param childrenArgs 子元素列表
 */
export function createElement(
  tagName: string,
  props: propsType,
  ...childrenArgs: [any]
) {}
```

该函数包含三个参数，分别指定标签名、属性对象与子元素列表；实际上经过 Babel 的转化之后，JSX 文本会成为如下的函数调用(这里还包含了 ES2015 其他的语法转化)：

```js
// ...
  (0, _createElement.createElement)(
  'section',
  null,
  (0, _createElement.createElement)(
  'section',
  null,
  (0, _createElement.createElement)(
  'button',
  { className: 'link', onClick: handleClick },
  'Custom DOM JSX'
  ),
  (0, _createElement.createElement)('input', {
  type: 'text',
  onChange: function onChange(e) {
  console.log(e);
  }
  })
  )
  ),
// ...
```

在获取到元素标签之后，我们首先要做的就是创建元素；创建元素 [createElementByTag](https://github.com/wx-chevalier/Ueact/blob/master/src/platform/dom/element/element-utils.js) 过程中我们需要注意区分普通元素与 SVG 元素：

```
export const createElementByTag = (tagName: string) => {
  if (isSVG(tagName)) {
  return document.createElementNS('http://www.w3.org/2000/svg', tagName);
  }
  return document.createElement(tagName);

};
```

## 属性处理

在创建了新的元素对象之后，我们需要对 createElement 函数传入的后续参数进行处理，也就是为元素设置对应的属性；基本的属性包含了样式类、行内样式、标签属性、事件、子元素以及朴素的 HTML 代码等。首先我们需要对子元素进行处理：

```// 处理所有子元素，如果子元素为单纯的字符串，则直接创建文本节点
const children = flatten(childrenArgs).map(child => {
  // 如果子元素同样为 Element，则创建该子元素的副本
  if (child instanceof HTMLElement) {
    return child;
  }

  if (typeof child === 'boolean' || child === null) {
    child = '';
  }

  return document.createTextNode(child);
});
```

这里可以看出，对 createElement 函数的执行是自底向上执行的，因此传入的子元素参数实际上是已经经过渲染的 HTML 元素。接下来我们还需要对其他属性进行处理：

```
...// 同时支持 class 与 className 设置
const className = props.class || props.className;

// 如果存在样式类，则设置
if (className) {
  setAttribute(tagName, el, 'class', classNames(className));
}

// 解析行内样式
getStyleProps(props).forEach(prop => {
  el.style.setProperty(prop.name, prop.value);
});

// 解析其他 HTML 属性
getHTMLProps(props).forEach(prop => {
  setAttribute(tagName, el, prop.name, prop.value);
});

// 设置事件监听，这里为了解决部分浏览器中异步问题因此采用同步写法
let events = getEventListeners(props);

for (let event of events) {
  el[event.name] = event.listener;
}...
```

React 中还允许直接设置元素的内部 HTML 代码，这里我们也需要判断是否存在有 dangerouslySetInnerHTML 属性：

```// 如果是手动设置 HTML，则添加 HTML，否则设置显示子元素
if (setHTML && setHTML.__html) {
  el.innerHTML = setHTML.__html;
} else {
  children.forEach(child => {
    el.appendChild(child);
  });
}
```

到这里我们就完成了针对 JSX 格式的朴素的 DOM 标签转化的 createElement 函数，完整的源代码参考[这里](https://github.com/wx-chevalier/Ueact/blob/master/src/platform/dom/)。

## 简单使用

这里我们依旧使用 [create-webpack-app](https://github.com/wx-chevalier/create-webpack-app)  脚手架来搭建示例项目，这里我们以简单的计数器为例描述其用法。需要注意的是，本部分尚未引入双向数据绑定，或者说是自动状态变化更新，还是使用的朴素的 DOM 选择器查询更新方式：

```js
// App.js
import { createElement } from "../../../src/dom/jsx/createElement";

// 页面内状态
const state = {
  count: 0
};

/**
 * Description 点击事件处理
 * @param e
 */
const handleClick = e => {
  state.count++;
  document.querySelector("#count").innerText = state.count;
};

export default (
  <div className="header">
    {" "}
    <section>
      {" "}
      <section>
        {" "}
        <button className="link" onClick={handleClick}>
          Custom DOM JSX{" "}
        </button>
        <input
          type="text"
          onChange={e => {
            console.log(e);
          }}
        />
         {" "}
      </section>{" "}
    </section>
    <svg>
      <circle cx="64" cy="64" r="64" style="fill: #00ccff;" /> {" "}
    </svg>
    <br />  <span id="count" style={{ color: "red" }}>
      {state.count} {" "}
    </span>{" "}
  </div>
);

// client.js
// @flow

import App from "./component/Count";

document.querySelector("#root").appendChild(App);
```

# 数据绑定

当我们使用 Webpack 在后端编译 JSX 时，会将其直接转化为 JavaScript 中函数调用，因此可以自然地在作用域中声明变量然后在 JSX 中直接引用；不过笔者在设计 Ueact 时考虑到，为了方便快速上手或者简单的 H5 页面开发或者已有的代码库的升级，还是需要支持运行时动态编译的方式；本部分我们即讨论如何编写 JSX 格式的 HTML 模板并且进行数据动态绑定。本部分我们的 HTML 模板即是上文使用的 JSX 代码，不同的是我们还需要引入 babel-standalone 以及 Ueact 的 umd 模式库：

![](https://coding.net/u/hoteam/p/Cache/git/raw/master/2017/8/1/WX20170804-142918.png)

然后在本页面的 script 标签中，我们可以对模板进行渲染并且绑定数据：

```html
<script>
  var ele = document.querySelector("#inline-jsx");

  Ueact.observeDOM(
    ele,
    {
      state: {
        count: 0,
        delta: 1,
        items: [1, 2, 3]
      },
      methods: {
        handleClick: function() {
          this.state.count += this.state.delta;
          this.state.items.push(this.state.count);
        },
        handleChange: function(e) {
          let value = parseInt(e.target.value);
          if (!Number.isNaN(value)) {
            this.state.delta = value;
          }
        }
      },
      hooks: {
        mounted: function() {
          console.log("mounted");
        },
        updated: function() {
          console.log("updated");
        }
      }
    },
    Babel
  );
</script>
```

这里我们调用  `Ueact.observeDOM` 函数对模板进行渲染，该函数会获取指定元素的 `outerHTML` 属性，然后通过 Babel 动态插件进行编译：

```js
let input = html2JSX(ele.outerHTML);

let output = Babel.transform(input, {
  presets: ["es2015"],
  plugins: [
    [
      "transform-react-jsx",
      {
        pragma: "Ueact.createElement"
      }
    ]
  ]
}).code;
```

值得一提的是，因为 HTML 语法与 JSX 语法存在一定的差异，我们获取渲染之后的 DOM 对象之后，还需要对部分元素语法进行修正；主要包括了以下三个场景：

- 自闭合标签处理，即 `<input > => <input />`
- 去除输入的 HTML 中的事件监听的引号，即`onclick="{methods.handleClick}"` => `onclick={methods.handleClick}`
- 移除 value 值额外的引号，即`value="{state.a}"` => `value={state.a}`

到这里我们得到了经过 Babel 转化的函数调用代码，下面我们就需要去执行这部分代码并且完成数据填充。最简单的方式就是使用 `eval` 函数，不过因为该函数直接暴露在了全局作用域下，因此并不被建议使用；我们使用动态构造 Function 的方式来进行调用：

```js
/**
 * Description 从输入的 JSX 函数字符串中完成构建
 * @param innerContext
 */
function renderFromStr(innerContext) {
  let func = new Function(
    "innerContext",
    `
 let { state, methods, hooks } = innerContext;
 let ele = ${innerContext.rawJSX}
 return ele;
  `
  ).bind(innerContext); // 构建新节点

  let newEle: Element = func(innerContext); // 使用指定元素的父节点替换自身

  innerContext.root.parentNode.replaceChild(newEle, innerContext.root); // 替换完毕之后删除旧节点的引用，触发 GC

  innerContext.root = newEle;
}
```

`innerContext` 即包含了我们定义的 State 与 Methods 等对象，这里利用 JavaScript 词法作用域(Lexical Scope)的特性进行变量传递；本部分完整的代码参考[这里](https://parg.co/bFG)。

# 变化监听与重渲染

笔者在 [2015-我的前端之路:数据流驱动的界面](https://parg.co/bFo)中讨论了从以 DOM 为核心到数据流驱动的变化，本部分我们即讨论如何自动监听状态变化并且完成重渲染。这里我们采用监听 JavaScript 对象属性的方式进行状态变化监听，采用了笔者另一个库 [Observer-X](https://parg.co/bFA)，其基本用发如下：

```js
import { observe } from "../../dist/observer-x";

const obj = observe(
  {},
  {
    recursive: true
  }
);

obj.property = {};

obj.property.listen(changes => {
  console.log(changes);
  console.log("changes in obj");
});

obj.property.name = 1;

obj.property.arr = [];

obj.property.arr.listen(changes => {
  // console.log('changes in obj.arr');
});

// changes in the single event loop will be print out

setTimeout(() => {
  obj.property.arr.push(1);

  obj.property.arr.push(2);

  obj.property.arr.splice(0, 0, 3);
}, 500);
```

核心即是当某个对象的属性发生变化(增删赋值)时，触发注册的回调事件；即：

```js
// ...
// 将内部状态转化为可观测变量
let state = observe(innerContext.state); // ...
state.listen(changes => {
  renderFromStr(innerContext);
  innerContext.hooks.updated && innerContext.hooks.updated();
}); // ...
```

完整的在线 Demo 可以查看[基于 JSX 与 Observer-X 的简单计数器](http://wx-chevalier.github.io/ueact/browser/count.html)
