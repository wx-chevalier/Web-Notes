# React 组件测试

# Shallow rendering

浅渲染指的是将一个组件渲染成虚拟 DOM 对象，但是只渲染第一层，不渲染所有子组件。所以即使你对子组件做了一下改动却不会影响浅渲染的输出结果。或者是引入的子组件中发生了错误，也不会对父组件的浅渲染结果产生影响。浅渲染是不依赖 DOM 环境的。

譬如：

```js
const ButtonWithIcon = ({ icon, children }) => (
  <button>
    <Icon icon={icon} />
    {children}
  </button>
);
```

在 React 中将会被渲染成如下:

```js
<button>
  <i class="icon icon_coffee"></i>
  Hello Jest!
</button>
```

但是在浅渲染中只会被渲染成如下结果:

```js
<button>
  <Icon icon="coffee" />
  Hello Jest!
</button>
```

需要注意的是 Icon 组件并未被渲染出来。

# 快照测试

Jest 快照就像那些带有由文本字符组合而成表达窗口和按钮的静态 UI：它是存储在文本文件中的组件的渲染输出。我们可以告诉 Jest 哪些组件输出的 UI 不会有意外的改变，那么 Jest 在运行时会将其保存到如下所示的文件中：

```js
exports[`test should render a label 1`] = `
<label
  className="isBlock">
  Hello Jest!
</label>
`;

exports[`test should render a small label 1`] = `
<label
  className="isBlock isSmall">
  Hello Jest!
</label>
`;
```

每次更改组件时，Jest 都会与当前测试的值进行比较并显示差异，并且会在你做出修改是要求你更新快照。除了测试之外，Jest 将快照存储在类似 snapshots/Label.spec.js.snap 这样的文件中，同时你需要提交这些文件。
