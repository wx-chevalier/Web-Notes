# 基于 Jest 的 React 组件测试

# JSX

TypeScript 具有三种 JSX 模式：preserve，react 和 react-native。这些模式只在代码生成阶段起作用，类型检查并不受影响。

- 在 preserve 模式下生成代码中会保留 JSX 以供后续的转换操作使用（比如：Babel）。另外，输出文件会带有.jsx 扩展名。

- react 模式会生成 React.createElement，在使用前不需要再进行转换操作了，输出文件的扩展名为.js。

- react-native 相当于 preserve，它也保留了所有的 JSX，但是输出文件的扩展名是.js。

假设有这样一个 JSX 表达式`<expr />`，expr 可能引用环境自带的某些东西（比如，在 DOM 环境里的 div 或 span）或者是你自定义的组件。这是非常重要的，原因有如下两点：

- 对于 React，固有元素会生成字符串`（React.createElement("div")）`，然而由你自定义的组件却不会生成（React.createElement(MyComponent)）。
- 传入 JSX 元素里的属性类型的查找方式不同。固有元素属性本身就支持，然而自定义的组件会自己去指定它们具有哪个属性。

TypeScript 使用与 React 相同的规范 来区别它们。固有元素总是以一个小写字母开头，基于值的元素总是以一个大写字母开头。

# 固有元素

固有元素使用特殊的接口 JSX.IntrinsicElements 来查找。默认地，如果这个接口没有指定，会全部通过，不对固有元素进行类型检查。然而，如果这个接口存在，那么固有元素的名字需要在 JSX.IntrinsicElements 接口的属性里查找。例如：

```jsx
declare namespace JSX {
    interface IntrinsicElements {
        foo: any
    }
}

<foo />; // 正确
<bar />; // 错误
```

在上例中，`<foo />` 没有问题，但是 `<bar />` 会报错，因为它没在 JSX.IntrinsicElements 里指定。

## 基于值的元素

基于值的元素会简单的在它所在的作用域里按标识符查找。

```jsx
import MyComponent from "./myComponent";

<MyComponent />; // 正确
<SomeOtherComponent />; // 错误
```

## 工厂函数

`jsx: react`编译选项使用的工厂函数是可以配置的。可以使用 jsxFactory 命令行选项，或内联的@jsx 注释指令在每个文件上设置。比如，给 createElement 设置 jsxFactory，`<div />` 会使用 `createElement("div")` 来生成，而不是 React.createElement("div")。

注释指令可以像下面这样使用（在 TypeScript 2.8 里）：

```js
import preact = require("preact");
/* @jsx preact.h */
const x = <div />;
```

生成：

```js
const preact = require("preact");
const x = preact.h("div", null);
```

工厂函数的选择同样会影响 JSX 命名空间的查找（类型检查）。如果工厂函数使用 React.createElement 定义（默认），编译器会先检查 React.JSX，之后才检查全局的 JSX。如果工厂函数定义为 h，那么在检查全局的 JSX 之前先检查 h.JSX。
