# 从零实现 Redux

```ts
// 定一个 reducer
function reducer (state, action) {
  /* 初始化 state 和 switch case */
}

// 生成 store
const store = createStore(reducer)

// 监听数据变化重新渲染页面
store.subscribe(() => renderApp(store.getState()))

// 首次渲染页面
renderApp(store.getState())

// 后面可以随意 dispatch 了，页面自动更新
store.dispatch(...)
```

# createStore

Redux 是围绕着 store 为核心的。store 是一个包含状态、更新方法(dispatch())和读取方法(subscribe()/getState())的 JavaScript 对象。还有 listeners（监听器）用于组件订阅状态变化执行的函数。store 的形式定义如下：

```ts
const store = {
  state: {}, // 状态是一个对象
  listeners: [], // 监听器是一个函数数组
  dispatch: () => {}, // dispatch是一个函数
  subscribe: () => {}, // subscribe是一个函数
  getState: () => {}, // getState是一个函数
};
```

为了使用这个仓库对象来管理状态，我们要够一个 createStore()函数，代码如下:

```ts
const createStore = (reducer, initialState) => {
  const store = {};
  store.state = initialState;
  store.listners = [];

  store.getState = () => store.state;

  store.subscribe = (listner) => {
    store.listners.push(listener);
  };

  store.dispatch = (action) => {
    store.state = reducer(store.state, action);
    store.listeners.forEach((listener) => listener());
  };

  return store;
};
```

createStore 函数接收两个参数，一个是 reducer 和一个 initialState。reducer 函数会在后续详细介绍，现在只要知道这是一个指示状态应该如何更新的函数。createStore 函数开始于创建一个 store 对象。然后通过 store.state = initialState 进行初始化，如果开发者没有提供则值会是 undefined。state.listeners 会被初始化为空数组。store 中定义的第一个函数是 getState()。当调用时只是返回状态，store.getState = () => store.state。

# 状态订阅

我们允许 UI 订阅(subscribe)状态的变化。订阅实际上是传递一个函数给 subscribe 方法，并且这个函数作为监听器会被添加到监听器数组中。typeof listener === 'function'的结果是 true。在每一个状态变化的时候，我们会遍历所有的监听器函数数组，并逐个执行。

```ts
store.listeners.forEach((listener) => listener());
```

接下来，定义了 dispatch 函数。dispatch 函数是当用户和 UI 交互时，组件进行调用的。dispatch 接收
一个单一的 action 对象参数。这个 action 应该要完全描述用户接收到的交互。action 和当前状态一起，
会被传递到 reducer 函数，并且返回一个新的状态。在新的状态被 reducer 创建后，监听器数组会被遍历，并且每个函数会执行。通常，getState 函数在监听器函数内部会被调用，因为监听的目的是响应状态变化。

注意到数据流向是一个非常线性和同步的过程。监听器函数添加到一个单独的监听器数组中。当用户和应用交互时，会产生一个用于 dispatch 的 action。这个 action 会创建一个可预测和独立的状态改变。接着这个监听器数组被遍历，让每个监听器函数被调用。这个过程是一个单向的数据流。只有一个途径在应用中创建和响应数据变化。没有什么特别的技巧发生，只是一步一步针对交互并遵循明确统一模式的路径。

# Reducer 函数

reducer 是一个接收 state 和 action 的函数，并返回新的状态。形式如下:

```ts
const reducer = (prevState, action) => {
  let nextState = {}; // 一个表示新状态的对象

  // ...
  // 使用前一个状态和action创建新状态的代码
  // ...

  return nextState;
};
```

这里的 prevState, nextState 和 action 都是 JavaScript 对象。让我们详细看一下 action 对象来理解它是如何用于更新状态的。我们知道一个 action 会包含一个唯一的字符串 type 来标识由用户触发的交互。

例如，假设你使用 Redux 来创建一个简单的 todo list 应用。当用户点击提交按钮来添加项目到列表中时，将会触发一个带有 ADD_TODO 类型的 action。这是一个既对人类可读和理解，并且对 Redux 关于 aciton 目的也是清晰的指示。当添加一个项目时，它将会包含一个 text 的 todo 内容作为负载(payload)。因此，添加一个 todo 到列表中，可以通过以下的 action 对象来完全表示:

```ts
const todoAction = {
  type: "ADD_TODO",
  text: "Get milk from the store",
};
```

现在我们可以构建一个 reducer 来支撑一个 todo 应用。

```ts
const getInitialState = () => ({
  todoList: [],
});

const reducer = (prevState = getInitialState(), action) => {
  switch (action.type) {
    case "ADD_TODO":
      const nextState = {
        todoList: [...prevState.todoList, action.text],
      };

      return nextState;
    default:
      return prevState;
  }
};

// console.log(store.getState()) = { todoList: [] };
//
// store.dispatch({
//  type: 'ADD_TODO',
//  text: 'Get milk from the store',
//});
//
// console.log(store.getState()) => { todoList: ['Get milk from the store'] }
```

注意每次 reducer 被调用的时候我们都会创建一个新的对象。我们使用前一次的状态，但是创建了一个
完整全新的状态。这是另一个非常重要的原则能够让 redux 可预测。通过将状态分割成离散的，开发者
可以精确的指导应用中会发生什么。这里只要了解根据状态的变化来重新渲染 UI 的特定部分即可。

你通常会看到在 Redux 中使用 switch 语句。这是匹配字符串比较方便的一个方法，在我们的例子中，
action 的 type 为例，对应更新状态的代码块。这个使用 if...else 语句来写没有差别，如下:

```ts
if (action.type === "ADD_TODO") {
  const nextState = {
    todoList: [...prevState.todoList, action.text],
  };

  return nextState;
} else {
  return prevState;
}
```

Redux 对于 reducer 中的内容实际上是无感知的。这是一个开发者定义的函数，用来创建一个新的状态。
实际上，用户控制了几乎所有——reducer，被使用的 action，通过订阅被执行的监听器函数。Redux 就
像一个夹层将这些内容进行联系起来，并提供一个通用的接口来和状态进行交互。

# 完整应用

```tsx
import React, { useEffect, useState } from "react";
import { Action } from "redux";

interface Todo {
  title: string;
  content: string;
}

interface InitialState {
  todos: Todo[];
}

interface Store {
  state: any;
  listeners: Function[];
  dispatch: Function;
  subscribe: Function;
  getState: () => InitialState;
}

const todos: Todo[] = [
  {
    title: "title",
    content: "content",
  },
];

const getInitialState = () => {
  return {
    todos,
  };
};

const createStore = (reducer: Function, initialState?: InitialState) => {
  const store: Partial<Store> = {};
  store.state = initialState;
  store.listeners = [];

  store.getState = () => store.state;

  store.subscribe = (listener: Function) => {
    store.listeners!.push(listener);
  };

  store.dispatch = (action: Action) => {
    console.log("> Action", action);
    store.state = reducer(store.state, action);
    store.listeners!.forEach((listener) => listener());
  };

  return store;
};

const reducer = (
  state = getInitialState(),
  action: {
    type: "ADD_TODO";
    payload: Todo;
  }
) => {
  switch (action.type) {
    case "ADD_TODO":
      const nextState = {
        todos: [...state.todos, action.payload],
      };

      return nextState;
    default:
      return state;
  }
};

const store = createStore(reducer);

store.dispatch!({}); // 设置初始化状态

export const ReduxScratch = () => {
  const [slosh, setSlosh] = useState(0);

  useEffect(() => {
    store.subscribe!(() => {
      setSlosh(Math.random());
    });
  }, []);

  return (
    <div>
      {store.getState!().todos.map((todo) => (
        <div>
          <h1>{todo.title}</h1>
          <p>{todo.content}</p>
        </div>
      ))}

      <button
        key={slosh}
        onClick={() => {
          const num = Math.random();
          store.dispatch!({
            type: "ADD_TODO",
            payload: {
              title: `title：${num}`,
              content: `content：${num}`,
            },
          });
          setSlosh(num);
        }}
      >
        点击更新
      </button>
    </div>
  );
};
```

# Links

- https://blog.bookcell.org/2019/08/04/learn-redux-by-build-a-redux/
- http://huziketang.mangojuice.top/books/react/lesson30
