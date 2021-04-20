# 模块化与组件化

本章主要介绍模块化与组件化的设计原则在 Web 开发中的实际应用，其承接了[软件架构设计/组件化](http://ngte-se.gitbook.io/?q=组件化)一章中的相关内容。

在静态类型语言 Java 与动态类型语言 Python 中都有内建的模块机制，模块机制能够让我们更好地去

```java
import java.awt.*;
import java.awt.color.*;
```

```js
$.browser.msie = function detectIE() {};
```

模块一般指能够独立拆分且通用的代码单元。

> Mixing and matching generic components is what modern web development is all about.

> The terms are similar. I generally think of a "module" as being larger than a "component". A component is a single part, usually relatively small in scope, possibly general-purpose. Examples include UI controls and "background components" such as timers, threading assistants etc. A "module" is a larger piece of the whole, usually something that performs a complex primary function without outside interference. It could be the class library of an application that provides integration with e-mail or the database. It may be as large as a single application of a suite, such as the "Accounts Receivable module" of an ERP/accounting platform.
>
> I also think of "modules" as being more interchangeable. Components can be replicated, with new ones looking like old ones but being "better" in some way, but typically the design of the system is more strictly dependent upon a component (or a replacement designed to conform to that component's very specific behavior). In non-computer terms, a "component" may be the engine block of a car; you can tinker within the engine, even replace it entirely, but the car must have an engine, and it must conform to very rigid specifications such as dimensions, weight, mounting points, etc in order to replace the "stock" engine which the car was originally designed to have. A "module", on the other hand, implies "plug-in"-type functionality; whatever that module is, it can be communicated with in such a lightweight way that the module can be removed and/or replaced with minimal effect on other parts of the system. The electrical system of a house is highly modular; you can plug anything with a 120V15A plug into any 120V15A receptacle and expect the thing you're plugging in to work. The house wiring couldn't care less what's plugged in where, provided the power demands in any single branch of the system don't exceed safe limits.

模块化无疑是 ES6 中最令人激动的特性，保证了大型应用程序的健壮性、可扩展性与可重构性

# 模块化 CSS

## 命名规范

```
.block{} // the ‘thing’ like .list
.block__element{} // a child of the block like .list__item
.block--modifier{} // a variation of the ‘thing’ like .list-—vertical
```

## 预处理器

为了继续遵循 BEM 规范，我们需要在 SCSS 中添加对于父元素的引用，大概是如下语法形式：

```css
.block {
  @at-root #{&}__element {
  }
  @at-root #{&}--modifier {
  }
}
```

最终编译生成的结果为：

```css
.block {
}
.block__element {
}
.block--modifier {
}
```

而在 SASS 3.3 之后，我们可以使用如下的快捷写法：

```css
.block {
  &__element {
  }
  &--modifier {
  }
}
```

在真实的开发环境中，我们以一个典型的导航栏为例描述下应该如何使用 BEM 规范：

```html
<nav role="navigation" aria-label="primary">
  <ul class="nav__list">
    <li class="nav__list__item">
      <a href="" class="nav__link"></a>
    </li>
    <li class="nav__list__item">
      <a href="" class="nav__link--active"></a>
    </li>
    <li class="nav__list__item">
      <a href="" class="nav__link"></a>
    </li>
  </ul>
</nav>
```

我们编写的 CSS 样式如下所示：

```scss
nav[role="navigation"] {
}
.nav {
  &__list {
    &__item {
    }
  }
  &__link {
    &--active {
    }
  }
}
```

最终的输出结果大概是这个样子：

```css
nav[role="navigation"] {
}
.nav {
}
.nav__list {
}
.nav__list__item {
}
.nav__link {
}
.nav__link--active {
}
```

## CSS-in-JS

广义上说，目标格式为 CSS 的 预处理器 是 CSS 预处理器，但本文 特指 以最终生成 CSS 为目的的 领域特定语言。Sass、LESS、Stylus 是目前最主流的 CSS 预处理器。

```less
.opacity(@opacity: 100) {
  opacity: @opacity / 100;
  filter: ~"alpha(opacity=@{opacity})";
}

.sidebar {
  .opacity(50);
}
```

将以上 DSL 源代码 (LESS)，编译成 CSS：

```css
.sidebar {
  opacity: 0.5;
  filter: alpha(opacity=50);
}
```

取到 DSL 源代码 的 分析树将含有 动态生成 相关节点的 分析树 转换为 静态分析树将 静态分析树 转换为 CSS 的 静态分析树将 CSS 的 静态分析树 转换为 CSS 代码

```css
.foo {
  transition: width 0.3s;
}
```

自动按需生成前缀

```css
.foo {
  -webkit-transition: width 0.3s;
  -moz-transition: width 0.3s;
  -o-transition: width 0.3s;
  transition: width 0.3s;
}
/* 变量 */
:root {
  --fontSize: 14px;
  --mainColor: #333;
  --highlightColor: hwb(190, 35%, 20%);
}
/* 自定义 media queries */
@custom-media --viewport-medium (min-width: 760px) and (max-width: 990px);
/* 变量引用 以及使用 calc() 运算*/
body {
  color: var(--mainColor);
  font-size: var(--fontSize);
  line-height: calc(var(--fontSize) * 1.5);
  padding: calc((var(--fontSize) / 2) + 1px);
}
/* 颜色处理函数 */
a {
  color: color(var(--highlightColor) blackness(+20%));
  background: color(red a(80%));
}
/* 使用自定义 media queries */
@media (--viewport-medium) {
  .foo {
    display: flex;
    font-size: calc(var(--fontSize) * 2 + 6px);
  }
}
/* 变量 */
/* 自定义 media queries */
/* 变量引用 以及使用 calc() 运算*/
body {
  color: #333;
  font-size: 14px;
  line-height: 21px;
  padding: 8px;
}
/* 颜色处理函数 */
a {
  color: rgb(89, 142, 153);
  background: rgba(255, 0, 0, 0.8);
}
/* 使用自定义 media queries */
@media (min-width: 760px) and (max-width: 990px) {
  .foo {
    display: -webkit-box;
    display: -webkit-flex;
    display: -ms-flexbox;
    display: flex;
    font-size: 34px;
  }
}
```

# 组件化

在以 DOM 操作为核心的时代，我们的业务逻辑就是一系列对于 DOM 元素(元素)的操作序列，绝大部分的状态数据也都直接存放在元素中。而 React 中同样存在有元素与 Component 两个概念，React 元素直译为元素，其用于描述屏幕所见内容，即是 DOM 元素的对象表示，也就是 Virtual DOM。而组件则是某个能够接受输入并且返回某个元素的函数或者类。譬如在下面这个简单的 Button 组件中，其返回值就是某个元素，这里的函数参数 onLogin 就是所谓的 Prop，我们会在以后的章节中进行详细讲解。

```js
function Button({ onLogin }) {
  return React.createElement(
    "div",
    { id: "login-btn", onClick: onLogin },
    "Login"
  );
}
```

在 Virtual DOM 初探的章节中我们也有提及，元素是可以递归嵌套的，换言之，组件是对于一或多个元素的封装，其能够根据不同的输入返回不同的元素。

```js
function User({ name, addFriend }) {
  return React.createElement(
    "div",
    null,
    React.createElement("p", null, name),
    React.createElement(Button, { addFriend })
  );
}
```

# 组件化的意义

# 组件化要点

## 何谓好的组件

# Web Components

# Links

- https://mp.weixin.qq.com/s/rTAcEE-6f9EfRMkce8FNbA
