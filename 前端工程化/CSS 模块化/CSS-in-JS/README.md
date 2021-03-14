# CSS-in-JS

CSS-in-JS 是一种技术（technique），而不是一个具体的库实现（library）。简单来说 CSS-in-JS 就是将应用的 CSS 样式写在 JavaScript 文件里面，而不是独立为一些 .css，.scss 或者 less 之类的文件，这样你就可以在 CSS 中使用一些属于 JS 的诸如模块声明，变量定义，函数调用和条件判断等语言特性来提供灵活的可扩展的样式定义。值得一提的是，虽然 CSS-in-JS 不是一种很新的技术，可是它在国内普及度好像并不是很高，它当初的出现是因为一些 component-based 的 Web 框架（例如 React，Vue 和 Angular）的逐渐流行，使得开发者也想将组件的 CSS 样式也一块封装到组件中去以解决原生 CSS 写法的一系列问题。还有就是 CSS-in-JS 在 React 社区的热度是最高的，这是因为 React 本身不会管用户怎么去为组件定义样式的问题，而 Vue 和 Angular 都有属于框架自己的一套定义样式的方案。

# 优势

## 局部样式 - Scoping Styles

CSS 有一个被大家诟病的问题就是没有本地作用域，所有声明的样式都是全局的（global styles）。换句话来说页面上任意元素只要匹配上某个选择器的规则，这个规则就会被应用上，而且规则和规则之间可以叠加作用（cascading）。SPA 应用流行了之后这个问题变得更加突出了，因为对于 SPA 应用来说所有页面的样式代码都会加载到同一个环境中，样式冲突的概率会大大加大。由于这个问题的存在，我们在日常开发中会遇到以下这些问题：

- 很难为选择器起名字。为了避免和页面上其他元素的样式发生冲突，我们在起选择器名的时候一定要深思熟虑，起的名字一定不能太普通。举个例子，假如你为页面上某个作为标题的 DOM 节点定义一个叫做.title 的样式名，这个类名很大概率已经或者将会和页面上的其他选择器发生冲突，所以你不得不手动为这个类名添加一些前缀，例如.home-page-title 来避免这个问题。

- 团队多人合作困难。当多个人一起开发同一个项目的时候，特别是多个分支同时开发的时候，大家各自取的选择器名字可能有会冲突，可是在本地独立开发的时候这个问题几乎发现不了。当大家的代码合并到同一个分支的时候，一些样式的问题就会随之出现。

CSS-in-JS 会提供自动局部 CSS 作用域的功能，你为组件定义的样式会被限制在这个组件，而不会对其他组件的样式产生影响。不同的 CSS-in-JS 库实现局部作用域的方法可能有所不一样，一般来说它们会通过为组件的样式生成唯一的选择器来限制 CSS 样式的作用域。以下是一个简化了的 CSS-in-JS 库生成唯一选择器的示例代码：

```js
const css = (styleBlock) => {
  const className = someHash(styleBlock);
  const styleEl = document.createElement("style");
  styleEl.textContent = `
    .${className} {
      ${styleBlock}
    }
  `;
  document.head.appendChild(styleEl);
  return className;
};

const className = css(`
  color: red;
  padding: 20px;
`); // 'c23j4'
```

从上面的代码可以看出，CSS-in-JS 的实现会根据定义的样式字符串生成一个唯一的 CSS 选择器，然后把对应的样式插入到页面头部的 style 标签中，styled-components 使用的就是类似的方法。

## 避免无用的 CSS 样式堆积 - Dead Code Elimination

进行过大型 Web 项目开发的同学应该都有经历过这个情景：在开发新的功能或者进行代码重构的时候，由于 HTML 代码和 CSS 样式之间没有显式的一一对应关系，我们很难辨认出项目中哪些 CSS 样式代码是有用的哪些是无用的，这就导致了我们不敢轻易删除代码中可能是无用的样式。这样随着时间的推移，项目中的 CSS 样式只会增加而不会减少(append-only stylesheets）。无用的样式代码堆积会导致以下这些问题：

- 项目变得越来越重量级，加载到浏览器的 CSS 样式会越来越多，会造成一定的性能影响。
- 开发者发现他们很难理解项目中的样式代码，甚至可能被大量的样式代码吓到，这就导致了开发效率的降低以及一些奇奇怪怪的样式问题的出现。

Max Stoiber 大体就是说由于 CSS-in-JS 会把样式和组件绑定在一起，当这个组件要被删除掉的时候，直接把这些代码删除掉就好了，不用担心删掉的样式代码会对项目的其他组件样式产生影响。而且由于 CSS 是写在 JavaScript 里面的，我们还可以利用 JS 显式的变量定义，模块引用等语言特性来追踪样式的使用情况，这大大方便了我们对样式代码的更改或者重构。

## Critical CSS

浏览器在将我们的页面呈现给用户之前一定要先完成页面引用到的 CSS 文件的下载和解析（download and parse），所以 link 标签链接的 CSS 资源是渲染阻塞的（render-blocking）。如果 CSS 文件非常大或者网络的状况很差，渲染阻塞的 CSS 会严重影响用户体验。针对这个问题，社区有一种优化方案就是将一些重要的 CSS 代码（Critical CSS）直接放在头部的 style 标签内，其余的 CSS 代码再进行异步加载，这样浏览器在解析完 HTML 后就可以直接渲染页面了。具体做法类似于以下代码：

```html
<html>
  <head>
    <style>
      /* critical CSS */
    </style>
    <script>
      asyncLoadCSS("non-critical.css");
    </script>
  </head>
  <body>
    ...body goes here
  </body>
</html>
```

那么如何定义 Critical CSS 呢？放在 head 标签内的 CSS 当然是越少越好，因为太多的内容会加大 html 的体积，所以我们一般把用户需要在首屏看到的（above the fold）页面要用到的最少 CSS 提取为 Critical CSS。以下是示意图：

上图中 above the fold 的 CSS 就是 Critical CSS，因为它们需要立即展示在用户面前。由于页面在不同的设备上展示的效果不同，对应着的 Critical CSS 内容也会有所差别，因此 Critical CSS 的提取是一个十分复杂的过程，虽然社区有很多对应的工具可是效果都差强人意。CSS-in-JS 却可以很好地支持 Critical CSS 的生成。在 CSS-in-JS 中，由于 CSS 是和组件绑定在一起的，只有当组件挂载到页面上的时候，它们的 CSS 样式才会被插入到页面的 style 标签内，所以很容易就可以知道哪些 CSS 样式需要在首屏渲染的时候发送给客户端，再配合打包工具的 Code Splitting 功能，可以将加载到页面的代码最小化，从而达到 Critical CSS 的效果。换句话来说，CSS-in-JS 通过增加一点加载的 JS 体积就可以避免另外发一次请求来获取其它的 CSS 文件。而且一些 CSS-in-JS 的实现（例如 styled-components）对 Critical CSS 是自动支持的。

![Critical CSS](https://s3.ax1x.com/2021/01/25/sLAIL8.png)

## 基于状态的样式定义 - State-based styling

CSS-in-JS 最吸引我的地方就是它可以根据组件的状态动态地生成样式。对于 SPA 应用来说，特别是一些交互复杂的页面，页面的样式通常要根据组件的状态变化而发生变化。如果不使用 CSS-in-JS，处理这些逻辑复杂的情况会比较麻烦。举个例子，假如你现在页面有一个圆点，它根据不同的状态展示不同的颜色，running 的时候是绿色，stop 的时候是红色，ready 的时候是黄色。如果使用的是 CSS modules 方案你可能会写下面的代码：

```css
.circle {
  ... circle base styles;
}

.healthy {
  composes: circle;
  background-color: green;
}

.stop {
  composes: circle;
  background-color: red;
}

.ready {
  composes: circle;
  background-color: ;
}
```

```js
import React from "react";
import styles from "./style.css";

const styleLookup = {
  healthy: styles.healthy,
  stop: styles.stop,
  ready: styles.ready,
};

export default ({ status }) => <div className={styleLookup[status]} />;
```

在 style.css 中我们使用了 CSS modules 的继承写法来在不同状态的 CSS 类中共用 circle 基类的样式，代码看起来十分冗余和繁琐。由于 CSS-in-JS 会直接将 CSS 样式写在 JS 文件里面，所以样式复用以及逻辑判断都十分方便，如果上面的例子用 styled-components 来写是这样的：

```js
import styled from "styled-components";

const circleColorLookup = {
  healthy: "green",
  stop: "red",
  ready: "yellow",
};

export default styled.div`
  ... circle base styles
  background-color: ${({ status }) => circleColorLookup[status]};
`;
```

对比起来，styled-components 的逻辑更加清晰和简洁，如果后面需要增加一个状态，只需要为 circleColorLookup 添加一个键值对就好，而 CSS modules 的写法需要同时改动 style.css 和 index.js 文件，代码不好维护和扩展。

# 坏处

## 陡峭的学习曲线 - Steep learning curve

这其实可以从两方面来说明。首先 CSS-in-JS 是针对 component-based 的框架的，这就意味着要学习 CSS-in-JS 你必须得学习：component-based 框架（例如 React），JavaScript 和 CSS 这三样技能。其次，即使你已经会用 React，JavaScript 和 CSS 来构建 SPA 应用，你还要学习某个 CSS-in-JS 实现（例如 styled-components），以及学习一种全新的基于组件定义样式的思考问题方式。我们团队在刚开始使用 styled-components 的时候，适应了好一段时间才学会如何用好这个库。因为学习成本比较高，在项目中引入 CSS-in-JS 可能会降低你们的开发效率。

## 运行时消耗 - Runtime cost

由于大多数的 CSS-in-JS 的库都是在动态生成 CSS 的。这会有两方面的影响。首先你发送到客户端的代码会包括使用到的 CSS-in-JS 运行时（runtime）代码，这些代码一般都不是很小，例如 styled-components 的 runtime 大小是 12.42kB min + gzip，如果你希望你首屏加载的代码很小，你得考虑这个问题。其次大多数 CSS-in-JS 实现都是在客户端动态生成 CSS 的，这就意味着会有一定的性能代价。不同的 CSS-in-JS 实现由于具体的实现细节不一样，所以它们的性能也会有很大的区别。

## 代码可读性差 - Unreadable class names

大多数 CSS-in-JS 实现会通过生成唯一的 CSS 选择器来达到 CSS 局部作用域的效果。这些自动生成的选择器会大大降低代码的可读性，给开发人员 debug 造成一定的影响。

## 没有统一的业界标准 - No interoperability

由于 CSS-in-JS 只是一种技术思路而没有一个社区统一遵循的标准和规范，所以不同实现的语法和功能可能有很大的差异。这就意味着你不能从一个实现快速地切换到另外一个实现。举个例子，假如你先在项目使用 radium，可是随着项目规模的变大，你发现 radium 可能不适合你现在的业务，更好的解决方案应该是 styled-components。可是由于写法差异巨大，这时候你要对代码进行脱胎换骨的改动才能将代码迁移到 styled-components。

# Links

- https://gist.github.com/threepointone/9f87907a91ec6cbcd376dded7811eb31
