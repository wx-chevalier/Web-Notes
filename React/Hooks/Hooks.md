> 本文节选自 []()

# React Hooks

[![image.png](https://i.postimg.cc/G2cQwFB2/image.png)](https://postimg.cc/zLcWTRFZ)

不过 Hooks 也并非全无代价，函数式组件本身会导致大量的临时函数被创建。
不过 Hooks 也并非全无代价，函数式组件本身会导致大量的临时函数被创建；

# 组件内状态

useEffect 是一个神奇的函数，通过不同的组合搭配我们能够极大地精简原本类组件中的业务逻辑代码。

# 异步状态处理

## useRef

```js
export function useRef<T>(initialValue: T): { current: T } {
  currentlyRenderingFiber = resolveCurrentlyRenderingFiber();
  workInProgressHook = createWorkInProgressHook();
  let ref;

  if (workInProgressHook.memoizedState === null) {
    ref = { current: initialValue };
    // ...
    workInProgressHook.memoizedState = ref;
  } else {
    ref = workInProgressHook.memoizedState;
  }
  return ref;
}
```

对于函数式组件，如果我们需要获取该组件子元素的 Ref，可以使用 forwardRef 来进行 Ref 转发：

```js
const FancyButton = React.forwardRef((props, ref) => (
  <button ref={ref} className="FancyButton">
    {props.children}
  </button>
));

// You can now get a ref directly to the DOM button:
const ref = React.createRef();
<FancyButton ref={ref}>Click me!</FancyButton>;
```

# 组件的生命周期管理

## 受控组件的状态变化

在编写 Input 这样的受控组件时，我们常常需要在 Props 中的 value 值变化之后，联动更新存储实际数据的内部 value 值：

```jsx
const defaultProps = {
  formData: {}
};

export function VCForm({ formData = defaultProps.formData }) {
  // ...
  const [innerFormData, setInnerFormData] = React.useState(formData);
  // ...

  // 当外部 Props 状态变化后，更新数据
  React.useEffect(() => {
    if (formData) {
      setInnerFormData(formData);
    }
  }, [formData]);
  // ...

  return (
    <Form
      value={innerFormDaat}
      onChange={newData => {
        setInnerFormData(newData);
      }}
    />
  );
}
```

这里需要注意的是，如果我们直接将默认值写在参数列表里，即 `formData = {}`；在外部参数未传入 formData，那么会发现每次组件更新都会触发 formData 被分配到新的默认值，也就导致了该组件的无限重复更新。因此我们需要仿造类组件中 defaultProps 的做法，将 defaultProps 以静态外部变量的方式存储并赋值。

# componentDidUpdate & useMemo

useCallback 与 useMemo

```js
function Button({ onClick, color, children }) {
  const textColor = slowlyCalculateTextColor(this.props.color);
  return (
    <button
      onClick={onClick}
      className={"Button-" + color + " Button-text-" + textColor}
    >
      {children}
    </button>
  );
}
export default React.memo(Button); // ✅ Uses shallow comparison
```

不过在实际场景下，很多的 Callback 还是会被重新生成，我们还是需要在子组件中进行精细地 shouldComponentUpdate 控制。

# 业务逻辑处理

# useReducer

示例可以参考 [react-hooks-reducer-count](https://codesandbox.io/s/6yy0933923)

## dispatch

# 坑杂记

在 Lerna 创建的 TS 多模块项目中，如果 Module A 依赖于 Module B 中的使用了 Hooks 的 FC，那么可能会抛出 Hooks can only be called inside the body of a funtion component 错误，此时需要在 Webpack 的配置中添加：

```js
resolve: {
    alias: {
        react: path.resolve('./node_modules/react'),
        'react-dom': path.resolve('./node_modules/react-dom')
    }
},
```

# 链接

- https://reactjs.org/docs/hooks-faq.html
- https://reactjs.org/blog/2019/02/06/react-v16.8.0.html
- https://fettblog.eu/typescript-react/hooks/
- https://mp.weixin.qq.com/s/P5XZO5j494rGczXqKIza5w
