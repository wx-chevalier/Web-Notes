# Kea

Kea 是用于构建复杂 React 应用的生产级别的状态管理框架。随着应用程序的增长，它可以很好地扩展，并有助于保持状态整洁。

![Kea 架构](https://i.postimg.cc/cHBmwhQq/image.png)

Kea 建立在 Redux 之上，并利用其基本功能原理：

- 应用中的每个操作都以一个操作（递增计数器）开始。
- 这些操作将更新保存实际数据的减速器（计数器）。
- 此数据以全局状态存储，该状态由 Redux 管理。
- 您可以从此状态通过选择器（在状态中找到计数器）获取值（计数器为 1）。
- 动作也可能触发侦听器，这些侦听器是与外部 API 对话，读取值或调度其他动作的纯异步函数。
- 所有相关的动作，缩减器，选择器和侦听器都分组为一个逻辑（counterLogic）。
- React 组件连接到此逻辑并提取所有需要的动作和值。

# 核心概念

## Actions

Kea 将核心业务逻辑封装在 Logic 中：

```ts
import { kea } from 'kea'

const logic = kea({ ... })
```

在 Logic 中我们首先要定义操作的 Actions：

```js
const logic = kea({
  actions: () => ({
    addToCounter: (amount) => ({ amount }),
    setName: (name) => ({ name }),
    submitForm: (values, page) => ({ values, page }),
    actionWithoutArguments: true,
  }),
});
```

将动作视为调度到队列的事件。他们自己什么也不做，减速器和侦听器（如下所述）等待操作并做出相应反应。

```js
import { useActions } from "kea";

function BigButton() {
  const { addToCounter } = useActions(logic);

  return (
    <button onClick={() => addToCounter(1000)}>Add one thousand! 🤩</button>
  );
}
```

## Reducer

Reducers 的定义相较于 Redux 中也简化了很多：

```js
const logic = kea({
  actions: () => ({
    increment: (amount) => ({ amount }),
    decrement: (amount) => ({ amount }),
  }),
  reducers: () => ({
    counter: [
      0,
      {
        increment: (state, { amount }) => state + amount,
        decrement: (state, { amount }) => state - amount,
      },
    ],
  }),
});
```

不过需要注意的是，Reducer 中不可以去修改某些值，而应该返回不可变对象：

```js
{
  addTodo: (state, { todo }) => [...state, todo], // ❤️❤️❤️ Always do this!
  addTodo: (state, { todo }) => state.push(todo), // ☠️☠️☠️ NEVER do this!
}
```

## Listener

在 Kea 中还可以添加 Listener 来进行异步处理：

```js
const logic = kea({
  actions: () => ({
    loadUsers: true,
    setUsers: (users) => ({ users }),
  }),

  listeners: () => ({
    loadUsers: async () => {
      const users = await api.get("users");
      actions.setUsers(users);
    },
  }),

  reducers: () => ({
    users: [
      [],
      {
        setUsers: (_, { users }) => users,
      },
    ],
  }),
});
```

有时候我们在 Listener 中还需要根据当前的 Store 值进行某些操作，这个概念在 Kea 中被称为 Values：

```js
const logic = kea({
  // actions, reducers, ...

  listeners: ({ actions, values }) => ({
    fetchDetails: async () => {
      const { username } = values; // 👈 get the latest username
      const details = await api.fetchDetails({ username });
      actions.setDetails(details);
    },
  }),
});
```

## Selector

而 Selector 则用于组合获取到 Store 中的值：

```js
const logic = kea({
  actions: () => ({
    setMonth: (month) => ({ month }),
    setRecords: (records) => ({ records }),
  }),
  reducers: () => ({
    month: [
      "2020-04",
      {
        setMonth: (_, { month }) => month,
      },
    ],
    records: [
      [],
      {
        setRecords: (_, { records }) => records,
      },
    ],
  }),
  selectors: ({ selectors }) => ({
    recordsForSelectedMonth: [
      () => [selectors.month, selectors.records],
      (month, records) => {
        return records.filter((r) => r.month === month);
      },
    ],
  }),
});

const { recordsForSelectedMonth } = useValues(logic);
```

# 在 React 中使用

## 函数式组件

```ts
import { kea, useActions } from 'kea'

const logic = kea({ ... })

function MyComponent () {
  const { increment } = useActions(logic)

  return <button onClick={increment}>Increment</button>
}

import { kea, useValues } from 'kea'

const logic = kea({ ... })

function MyComponent () {
  const { counter, doubleCounter } = useValues(logic)

  return <div>{counter} * 2 = {doubleCounter}</div>
}
```

## 类组件

```ts
const logic = kea({
  actions: () => ({
    doSomething: true,
    doSomethingElse: true,
  }),
  reducers: () => ({
    firstOne: ["default", { doSomething: () => "did it" }],
    secondOne: ["default", { doSomething: () => "did it" }],
  }),
});

class MyComponent extends Component {
  render() {
    const { firstOne, secondOne } = this.props;

    // The following two lines are equivalent as
    // `this.actions` is a shorthand for `this.props.actions`
    const { doSomething, doSomethingElse } = this.actions;
    const { doSomething, doSomethingElse } = this.props.actions;

    return <div />;
  }
}

const MyConnectedComponent = logic(MyComponent);
```

```ts
import { connect } from "kea";

@connect({
  actions: [menuLogic, ["openMenu", "closeMenu"]],
  values: [menuLogic, ["isOpen as isMenuOpen"], accountLogic, ["currentUser"]],
})
class MyComponent extends Component {
  render() {
    const { currentUser } = this.props;
    const { closeMenu } = this.actions;

    return <button onClick={closeMenu}>{currentUser.name}</button>;
  }
}
```

# 插件（Plugins）

## LocalStorage

```ts
import localStoragePlugin from "kea-localstorage";
import { resetContext } from "kea";

resetContext({
  plugins: [localStoragePlugin],
});

localStoragePlugin({
  // in case you want to replace this, e.g. for tests or non browser environments
  storageEngine: window.localStorage,

  // added before all paths in localStorage keys
  prefix: "example",

  // to change the symbol that concats path parts
  separator: "_",
});
```

```ts
const logic = kea({
  // path must be defined!
  path: () => ["scenes", "homepage", "name"],

  actions: ({ constants }) => ({
    updateName: (name) => ({ name }),
  }),

  reducers: ({ actions, constants }) => ({
    // just add { persist: true }
    name: [
      "chirpy",
      { persist: true },
      {
        [actions.updateName]: (state, payload) => payload.name,
      },
    ],
    // you may override the prefix and separator keys
    name: [
      "chirpy",
      { persist: true, prefix: "example", separator: "_" },
      {
        [actions.updateName]: (state, payload) => payload.name,
      },
    ],
  }),
});
```
