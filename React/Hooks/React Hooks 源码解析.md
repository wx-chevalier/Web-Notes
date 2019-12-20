# React Hooks 源码解析

今天我将会深入 React hooks 的实现来让我们更加了解它。这个神奇的特性存在的问题是，一旦出现问题就很难调试，因为它有复杂的堆栈跟踪支持。因此，通过深入理解 React hooks 的系统，我们就可以在遇到问题时非常快的解决它们，甚至可以提前避免错误发生。

首先，让我们进入需要确保 hooks 在 React 的作用域调用的机制，因为你现在可能知道如果在没有正确的上下文调用钩子是没有意义的。

![React Hooks 示意图](https://s2.ax1x.com/2019/11/17/MrVzy6.png)

# dispatcher

dispatcher 是包含了 hooks 函数的共享对象。它将根据 ReactDom 的渲染阶段来动态分配或者清除，并且确保用户无法在 React 组件外访问 hooks。我们可以在渲染根组件前通过简单的切换来使用正确的 dispatcher，用一个叫做 enableHooks 的标志来开启/禁用；这意味这从技术上来说，我们可以在运行时开启/禁用挂钩。React 16.6.x 就已经有了试验性的实现，只不过它是被禁用的。

当我们执行完渲染工作时，我们将 dispatcher 置空从而防止它在 ReactDOM 的渲染周期之外被意外调用。这是一种可以确保用户不做傻事的机制。dispatcher 在每一个 hook 调用中使用 resolveDispatcher()这个函数来调用。就像我之前说的，在 React 的渲染周期之外调用是毫无意义的，并且 React 会打印出警告信息“Hooks 只能在函数组件的主体内部调用。

```js
let currentDispatcher;
const dispatcherWithoutHooks = {
  /* ... */
};
const dispatcherWithHooks = {
  /* ... */
};

function resolveDispatcher() {
  if (currentDispatcher) return currentDispatcher;
  throw Error("Hooks can't be called");
}
```

## The hooks queue

在使用场景之后，hooks 表示为在调用顺序下链接在一起的节点。它们被表示成这样是因为 hooks 并不是简单的创建然后又把它遗留下来。它们有一种可以让他们变成它们自己的机制。一个 Hook 有几个我希望你可以在深入研究实现之前记住的属性：

- 它的初始状态在首次渲染时被创建。

- 她的状态可以即时更新。

- React 会在之后的渲染中记住 hook 的状态。

- React 会根据调用顺序为您提供正确的状态

- React 会知道这个 hook 属于哪个 Fiber。

因此，我们需要重新思考我们查看组件状态的方式。到目前为止，我们认为它就像是一个普通的对象：

```json
{
  "foo": "foo",
  "bar": "bar",
  "baz": "baz"
}
```

但是在处理 hook 时，它应该被视为一个队列，其中每个节点代表一个状态的单个模型：

```js
{
  memoizedState: 'foo',
  next: {
    memoizedState: 'bar',
    next: {
      memoizedState: 'bar',
      next: null
    }
  }
```

可以在实现中查看单个 hook 节点的模式。你会看到 hook 有一些额外的属性，但是理解钩子如何工作的关键在于 memoizedState 和 next。其余属性由 useReducer()hook 专门用于缓存已经调度的操作和基本状态，因此在各种情况下，还原过程可以作为后备重复：

- baseState - 将给予 reducer 的状态对象。

- baseUpdate- 最近的创建了最新 baseState 的调度操作。

- queue - 调度操作的队列，等待进入 reducer。

回到 hooks，在每个函数组件调用之前，将调用一个名为 prepareHooks()的函数，其中当前 fiber 及其 hooks 队列中的第一个 hook 节点将被存储在全局变量中。这样，只要我们调用一个 hook 函数（useXXX()），就会知道要在哪个上下文中运行。

```js
let currentlyRenderingFiber;
let workInProgressQueue;
let currentHook;

// Source: https://github.com/facebook/react/tree/5f06576f51ece88d846d01abd2ddd575827c6127/react-reconciler/src/ReactFiberHooks.js:123
function prepareHooks(recentFiber) {
  currentlyRenderingFiber = workInProgressFiber;
  currentHook = recentFiber.memoizedState;
}

// Source: https://github.com/facebook/react/tree/5f06576f51ece88d846d01abd2ddd575827c6127/react-reconciler/src/ReactFiberHooks.js:148
function finishHooks() {
  currentlyRenderingFiber.memoizedState = workInProgressHook;
  currentlyRenderingFiber = null;
  workInProgressHook = null;
  currentHook = null;
}

// Source: https://github.com/facebook/react/tree/5f06576f51ece88d846d01abd2ddd575827c6127/react-reconciler/src/ReactFiberHooks.js:115
function resolveCurrentlyRenderingFiber() {
  if (currentlyRenderingFiber) return currentlyRenderingFiber;
  throw Error("Hooks can't be called");
}
// Source: https://github.com/facebook/react/tree/5f06576f51ece88d846d01abd2ddd575827c6127/react-reconciler/src/ReactFiberHooks.js:267
function createWorkInProgressHook() {
  workInProgressHook = currentHook ? cloneHook(currentHook) : createNewHook();
  currentHook = currentHook.next;
  workInProgressHook;
}

function useXXX() {
  const fiber = resolveCurrentlyRenderingFiber();
  const hook = createWorkInProgressHook();
  // ...
}

function updateFunctionComponent(
  recentFiber,
  workInProgressFiber,
  Component,
  props
) {
  prepareHooks(recentFiber, workInProgressFiber);
  Component(props);
  finishHooks();
}
```

一旦更新完成，一个叫做 finishHooks()的函数将被调用，其中 hooks 队列中第一个节点的引用将存储在渲染完成的 fiber 对象的 memoizedState 属性中。这意味着 hooks 队列及其状态可以在外部被定位到：

```js
const ChildComponent = () => {
  useState("foo");
  useState("bar");
  useState("baz");

  return null;
};

const ParentComponent = () => {
  const childFiberRef = useRef();

  useEffect(() => {
    let hookNode = childFiberRef.current.memoizedState;

    assert(hookNode.memoizedState, "foo");
    hookNode = hooksNode.next;
    assert(hookNode.memoizedState, "bar");
    hookNode = hooksNode.next;
    assert(hookNode.memoizedState, "baz");
  });

  return <ChildComponent ref={childFiberRef} />;
};
```

# 常见 Hooks 的实现

## State hooks

useState hook 使用的 useReducer 只是为它提供了一个预定义的 reducer 处理程序，这意味着实际上 useState 返回的结果是一个 reducer 状态和一个 action dispatcher。我希望你看一下 state hook 使用的 reducer 处理程序：

```js
function basicStateReducer(state, action) {
  return typeof action === "function" ? action(state) : action;
}
```

正如预期的那样，我们可以直接为 action dispatcher 提供新的状态，我们还可以为 dispatcher 提供一个动作函数，该函数将接收旧状态并返回新状态。这意味着，当你将状态设置器传递到子组件时，你可以改变当前父组件的状态，不需要作为一个不同的 prop 传递下去。举个例子：

```js
const ParentComponent = () => {
  const [name, setName] = useState();

  return <ChildComponent toUpperCase={setName} />;
};

const ChildComponent = props => {
  useEffect(() => {
    props.toUpperCase(state => state.toUpperCase());
  }, [true]);

  return null;
};
```

## Effect hooks

Effect hooks 的行为略有不同，并且有一个额外的逻辑层，我接下来会解释。同样，在我深入了解实现之前，我希望你能记住 Effect hooks 的属性：

- 它们是在渲染时创建的，但它们在绘制后运行。
- 它们将在下一次绘制之前被销毁。
- 它们按照已经被定义的顺序执行。

因此，应该有另一个额外的队列保持这些 effect，并应在绘制后处理。一般而言，fiber 保持包含 effect 节点的队列。每种 effect 都是不同的类型，应在适当的阶段处理：

- 在变化之前调用实例的 getSnapshotBeforeUpdate()方法。
- 执行所有节点的插入，更新，删除和 ref 卸载操作。
- 执行所有生命周期和 ref 回调。生命周期作为单独的过程发生，因此整个树中的所有放置，更新和删除都已经被调用。此过程还会触发任何特定渲染的初始 effects。
- 由 useEffect() hook 安排的 effects - 基于实现也被称为“passive effects”。

当涉及到 hook effects 时，它们应该存储在 fiber 的一个名为 updateQueue 的属性中，并且每个 effect node 应该具有以下模式：

- tag - 一个二进制数，它将决定 effect 的行为。
- create- 绘制后应该运行的回调。
- destroy- 从 create()返回的回调应该在初始渲染之前运行。
- inputs - 一组值，用于确定是否应销毁和重新创建 effect。
- next - 函数组件中定义的下一个 effect 的引用。

除了 tag 属性外，其他属性都非常简单易懂。如果你已经很好地研究了 hooks，你就会知道 React 为你提供了几个特殊的 hooks：useMutationEffect()和 useLayoutEffect()。这两种效果在内部使用 useEffect()，这实际上意味着它们创建了一个 effect 节点，但它们使用不同的 tag 值。标签由二进制值组合而成：

```js
const NoEffect = /*             */ 0b00000000;
const UnmountSnapshot = /*      */ 0b00000010;
const UnmountMutation = /*      */ 0b00000100;
const MountMutation = /*        */ 0b00001000;
const UnmountLayout = /*        */ 0b00010000;
const MountLayout = /*          */ 0b00100000;
const MountPassive = /*         */ 0b01000000;
const UnmountPassive = /*       */ 0b10000000;
```

这些二进制值的最常见用例是使用管道（|）将这些位按原样添加到单个值。然后我们可以使用＆符号（&）检查标签是否实现某种行为。如果结果为非零，则表示 tag 实现了指定的行为。以下是 React 支持的 hook effect 类型及其标签：

- Default effect — UnmountPassive | MountPassive.
- Mutation effect — UnmountSnapshot | MountMutation.
- Layout effect — UnmountMutation | MountLayout.

以下是 React 如何检查行为实现：

```js
if ((effect.tag & unmountTag) !== NoHookEffect) {
  // Unmount
}
if ((effect.tag & mountTag) !== NoHookEffect) {
  // Mount
}
```

因此，基于我们刚刚学到的关于 effect hooks 的内容，我们实际上可以在外部向某个 fiber 注入 effect：

```js
function injectEffect(fiber) {
  const lastEffect = fiber.updateQueue.lastEffect;

  const destroyEffect = () => {
    console.log("on destroy");
  };

  const createEffect = () => {
    console.log("on create");

    return destroy;
  };

  const injectedEffect = {
    tag: 0b11000000,
    next: lastEffect.next,
    create: createEffect,
    destroy: destroyEffect,
    inputs: [createEffect]
  };

  lastEffect.next = injectedEffect;
}

const ParentComponent = <ChildComponent ref={injectEffect} />;
```
