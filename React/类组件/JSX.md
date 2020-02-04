# JSX

我们在上文中已经很多次的提及了 JSX，大家也对于基本的基于 JSX 编写 React 组件所有了解。实际上在 JSX 推出之初饱受非议，很多人觉得其很怪异。的确虽然与正统的 HTML 相比其都是类 XML 语法的声明式标签语言，但是其对于类名强制使用 className、强制要求标签闭合等特点会让不少的传统前端开发者不太适应。JSX 的引入对笔者之前的工作流的冲击在于不能够直接使用 UI 部门提供的页面模板，并且因为组件化的分割与预编译，UI 比较麻烦地直接在浏览器开发工具中调整 CSS 样式然后保存到源代码中。JSX 本质上还是属于 JavaScript，这就避免了我们重复地学习不同框架或库中的指令约定，而可以直接使用 JavaScript 来描述模板渲染逻辑；而在前端框架的工作流中，往往将 JSX 的转化工作交托于 Babel 等转化工具，我们可以通过如下方式指定 JSX 使用的构建函数：

```
/** @jsx h */
```

# JSX 的前世今生

JSX 语言的名字最早出现在游戏厂商 DeNA，不过其偏重于加入增强语法使得 JavaScript 变得更快、更安全、更简单。而 React 则是依赖于 ECMAScript 语法本身，并没有添加扩充语义。React 引入 JSX 主要是为了方便 View 层组件化，承载了构建 HTML 结构化页面的职责。这一点与其他很多的 JavaScript 模板语言异曲同工，不过 React 将 JSX 映射为虚拟元素，并且通过创建与更新虚拟元素来管理整个 Virtual DOM 系统。譬如我们 JSX 语法声明某个虚拟组件时，会被转化为`React.createElement(component,props,...children)`函数调用，譬如我们定义了某个`MyButton`：

```js
// 必须要在 JSX 声明文件中引入 React
import React from "react";

<MyButton color="blue" shadowSize={2}>
    Click Me
</MyButton>;
```

会被编译为：

```js
React.createElement(MyButton, { color: "blue", shadowSize: 2 }, "Click Me");
```

而如果我们直接声明某个 DOM 元素，同样会转化为 createElement 函数调用:

```js
React.createElement("div", { className: "sidebar" }, null);
```

实际上除了最著名的 Babel JSX 转换器之外，我们还可以使用 `JSXDOM` 与 `Mercury JSX` 这两个同样的可以将 JSX 语法转化为 DOM 或者 Virtual DOM。在 JSXDOM 中，只支持使用 DOM 元素，允许在 DOM 标签中直接使用 JavaScript 变量，譬如当我们需要声明某个列表时，可以使用如下语法:

```js
/** @jsx JSXDOM */

var defaultValue = "Fill me ...";

document.body.appendChild(
  <div>
        
    <input type="text" value={defaultValue} />
        <button onclick="alert('clicked!');">Click Me!</button>
        <ul>
            
      {["un", "deux", "trois"].map(function(number) {
        return <li>{number}</li>;
      })}
          
    </ul>
      
  </div>
);
```

这里我们还想讨论另一个问题，为什么需要引入 JSX。在 ECAMScript 6 的 ECMA-262 标准中引入了所谓的模板字符串(Template Literals)，即可以在 ECMAScript 中使用内嵌的 DSL 来引入 JavaScript 变量，不过虽然模板字符串对于较长的嵌入式 DSL 作用极佳，但是对于需要引入大量作用域中的 ECMAScript 表达式会造成大量的噪音副作用，譬如如果我们要声明某个评论框布局，使用 JSX 的方式如下:

```js
// JSX
var box = (
  <Box>
        
    {shouldShowAnswer(user) ? (
      <Answer value={false}>no</Answer>
    ) : (
      <Box.Comment>Text Content</Box.Comment>
    )}
      
  </Box>
);
```

而使用模板字符串的方式如下:

```jsx
// Template Literals
var box = jsx`
  <${Box}>
    ${
  shouldShowAnswer(user)
    ? jsx`<${Answer} value=${false}>no</${Answer}>`
    : jsx`
        <${Box.Comment}>
         Text Content
        </${Box.Comment}>
      `
}
  </${Box}>
`;
```

其主要缺陷在于因为存在变量的嵌套，需要在作用域中进进出出，很容易造成语法错误，因此还是 JSX 语法为佳。

# JSX 语法

JSX 的官方定义是类 XML 语法的 ECMAscript 扩展，完美地利用了 JavaScript 自带的语法和特性，并使用大家熟悉的 HTML 语法来创建虚拟元素。JSX 基本语法基本被 XML 囊括了，但也有很多的不同之处。React 在定义标签时，标签一定要闭合，否则无法编译通过。这一点与标准的 HTML 差别很大，HTML 在浏览器渲染时会自动进行补全，而强大的 JSX 报错机制则直接在编译阶段就以报错的方式指明出来。HTML 中自闭合的标签(如 `<img>` )在 JSX 中也遵循同样规则，自定义标签可以根据是否有子组件或文本来决定闭合方式。另外 DOCTYPE 头也是一个非常特殊的标志，一般会在使用 React 作为服务端渲染时用到。在 HTML 中，DOCTYPE 是没有闭合的，也就是说我们无法直接渲染它。常见的做法是构造一个保存 HTML 的变量，将 DOCTYPE 与整个 HTML 标签渲染后的结果串联起来。使用 JSX 声明组件时，最外层的组件根元素只允许使用单一根元素。这一点我们在上文中也陈述过，因为 JSX 语法会被转化为 `React.createElement(component,props,...children)` 调用，而该函数的第一个参数只允许传入单元素，而不允许传入多元素。

## 变量使用

- 注释

在 HTML 中，我们会使用 `<!-- -->` 进行注释，不过 JSX 中并不支持：

```js
render() {
  return (
  <div>
  <!-- This doesn't work! -->
  </div>
  )
}
```

我们需要以 JavaScript 中块注释的方式进行注释：

```js
{
  /* A JSX comment */
}

{
  /*
  Multi
  line
  comment
*/
}
```

- 数组

JSX 允许使用任意的变量，因此如果我们需要使用数组进行循环元素渲染时，直接使用 map、reduce、filter 等方法即可：

```js
function NumberList(props) {
  const numbers = props.numbers;
  return (
    <ul>
      {numbers.map(number => (
        <ListItem key={number.toString()} value={number} />
      ))}
    </ul>
  );
}
```

- 条件渲染

在 JSX 中我们不能再使用传统的 if/else 条件判断语法，但是可以使用更为简洁明了的 Conditional Operator 运算符，譬如我们要进行 if 操作：

```
{condition && <span>为真时进行渲染</span> }
```

如果要进行非操作：

```js
{
  condition || <span>为假时进行渲染</span>;
}
```

我们也可以使用常见的三元操作符进行判断:

```js
{
  condition ? <span>为真时进行渲染</span> : <span>为假时进行渲染</span>;
}
```

如果对于较大的代码块，建议是进行换行以提升代码可读性：

```js
{
  condition ? <span>   为假时进行渲染 </span> : <span>   为假时进行渲染 </span>;
}
```

## 元素属性

- style 属性

JSX 中的 style 并没有跟 HTML 一样接收某个 CSS 字符串，而是接收某个使用 camelCase 风格属性的 JavaScript 对象，这一点倒是和 DOM 对象的 style 属性一致。譬如:

```js
const divStyle = {
  color: "blue",
  backgroundImage: "url(" + imgUrl + ")"
};

function HelloWorldComponent() {
  return <div style={divStyle}>Hello World!</div>;
}
```

注意，内联样式并不能自动添加前缀，这也是笔者不太喜欢使用 CSS-in-JS 这种形式设置样式的的原因。为了支持旧版本浏览器，需要提供相关的前缀：

```js
const divStyle = {
  WebkitTransition: "all", // note the capital 'W' here
  msTransition: "all" // 'ms' is the only lowercase vendor prefix
};

function ComponentWithTransition() {
  return <div style={divStyle}>This should work cross-browser</div>;
}
```

- className

React 中是使用 `className` 来声明 CSS 类名，这一点对于所有的 DOM 与 SVG 元素都起作用。不过如果你是将 React 与 Web Components 结合使用，也是可以使用 `class` 属性的。

- htmlFor

因为 `for` 是 JavaScript 中的保留关键字，因此 React 元素是使用 `htmlFor` 作为替代。

- Boolean 系列属性

HTML 表单元素中我们经常会使用 disabled、required、checked 与 readOnly 等 Boolean 值性质的书，缺省的属性值会导致 JSX 认为 bool 值设为 true。当我们需要传入 false 时，必须要使用属性表达式。譬如 `<input type='checkbox' checked={true}>` 可以简写为`<input type='checkbox' checked>`，而 `<input type='checkbox' checked={falsed}>` 即不可以省略 checked 属性。

- 自定义属性

如果在 JSX 中向 DOM 元素中传入自定义属性，React 是会自动忽略的:

```
<div customProperty='a' />
```

不过如果要使用 HTML 标准的自定义属性，即以 `data-*` 或者 `aria-*` 形式的属性是支持的。

```
<div data-attr='attr' />
```

## 子元素

JSX 表达式中允许在一对开放标签或者闭合标签之间包含内容，这即是所谓的子元素，本部分介绍 JSX 支持的不同类别的子元素使用方式。

- 字符串

我们可以将字符串放置在一对开放与闭合的标签之间，此时所谓的 `props.children` 即就是字符串类型；譬如：

```
<MyComponent>Hello World!</MyComponent>
```

就是合法的 JSX 声明，此时 `MyComponent` 中的 `props.children` 值就是字符串 `Hello World!`；另外需要注意的是，JSX 会自动移除行首与行末的空格，并且移除空行，因此下面的三种声明方式渲染的结果是一致的：

```js
<div>Hello World</div>
<div>
  Hello World
</div>
<div>
  Hello
  World
</div>
<div>
  Hello World
</div>
```

- JSX 嵌套我们可以嵌套地使用 JSX，即将某些 JSX 元素作为子元素，从而允许我们方便地展示嵌套组件：

```js
<MyContainer>
    <MyFirstComponent />
    <MySecondComponent />
</MyContainer>
```

我们可以混合使用字符串与 JSX，这也是 JSX 很类似于 HTML 的地方：

```js
<div>
    Here is a list:
  <ul>
      <li>Item 1</li>  <li>Item 2</li> 
  </ul>
</div>
```

某个 React 组件不可以返回多个 React 元素，不过单个 JSX 表达式是允许包含多个子元素的；因此如果我们希望某个组件返回多个并列的子元素，就需要将它们包裹在某个 `div` 中。

- JavaScript 表达式我们可以传入包裹在 `{}` 内的任意 JavaScript 表达式作为子元素，譬如下述声明方式渲染的结果是相同的：

```js
<MyComponent>foo</MyComponent>
<MyComponent>{'foo'}</MyComponent>
```

这种模式常用于渲染 HTML 列表：

```js
function Item(props) {
  return <li>{props.message}</li>;
}

function TodoList() {
  const todos = ["finish doc", "submit pr", "nag dan to review"];

  return (
    <ul>
      {todos.map(message => (
        <Item key={message} message={message} />
      ))}
    </ul>
  );
}
```

- JavaScript 函数正常情况下 JSX 中包含的 JavaScript 表达式会被解析为字符串、React 元素或者列表；不过 `props.children` 是允许我们传入任意值的，譬如我们可以传入某个函数并且在自定义组件中调用：

```js
// Calls the children callback numTimes to produce a repeated component
function Repeat(props) {
  let items = [];
  for (let i = 0; i < props.numTimes; i++) {
    items.push(props.children(i));
  }
  return <div>{items}</div>;
}

function ListOfTenThings() {
  return (
    <Repeat numTimes={10}>
        {index => <div key={index}>This is item {index} in the list</div>} 
    </Repeat>
  );
}
```

- 布尔值与空值
  `false`，`null`，`undefined` 与 `true` 是有效的子元素，不过它们并不会被渲染，而是直接被忽略，如下的 JSX 表达式会被渲染为相同结果：

```js
<div />


<div></div>


<div>{false}</div>


<div>{null}</div>


<div>{undefined}</div>


<div>{true}</div>
```

## 避免 XSS 注入攻击

最后需要提及的是，React 中 JSX 能够帮我们自动防护部分 XSS 攻击，譬如我们常见的需要将用户输入的内容再呈现出来:

```js
const title = response.potentiallyMaliciousInput;
// This is safe:
const element = <h1>{title}</h1>;
```

在标准的 HTML 中，如果我们不对用户输入作任何的过滤，那么当用户输入 `<script>alert(1)<script/>` 这样的可执行代码之后，就存在被 XSS 攻击的危险。而 React 在实际渲染之前会帮我们自动过滤掉嵌入在 JSX 中的危险代码，将所有的输入进行编码，保证其为纯字符串之后再进行渲染。不过这种安全过滤有时候也会对我们造成不便，譬如如果我们需要使用 `&copy;` 这样的实体字符时，React 会自动将其转移最后导致无法正确渲染，我们可以寻找如下几种解决方法：
-  直接使用 UTF-8 字符或者使用对应字符的 Unicode 编码
-  使用数组封装
-  直接插入原始的 HTML，React 为我们提供了 dangerouslySetInnerHTML 属性，其类似于 DOM 的 innerHTML 属性，允许我们声明强制直接插入 HTML 代码:

```js
function createMarkup() {
  return { __html: "First &middot; Second" };
}

function MyComponent() {
  return <div dangerouslySetInnerHTML={createMarkup()} />;
}
```
