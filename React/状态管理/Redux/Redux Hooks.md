# Redux Hooks

在函数式组件中如果希望使用 Redux，我们可以使用 connect 函数注入 State 与 Action Creator，也可以使用 React Redux 提供的 Hooks Api。

# useSelector

```js
const result : any = useSelector(selector : Function, equalityFn? : Function)
```

useSelector 允许我们通过传入的 selector 函数将 State 中数据提取出来，其相当于 connect 中的 mapStateToProps 的函数。该 selector 会在组件重渲染时候被调用，useSelector 同样会监听 Redux store 的变化，然后在某个 action 分发时调用。

当某个 action 被分发时，useSelector 会对之前 selector 返回的结果与当前的结果进行对比；当发现值不同时，该组件会被强制重渲染。useSelector 值会使用严格比较（`===`）来判断值的变化，而 connect 函数会使用浅比较（`==`）来判断是否需要进行重渲染。在 mapState 中，所有指定的返回域会被合并为某个对象，connect 会自动去比较单个属性值是否发生变化。而 useSelector 中则是会直接比较 selector 函数的返回值；。

```js
import React from "react";
import { useSelector } from "react-redux";

export const CounterComponent = () => {
  const counter = useSelector(state => state.counter);
  return <div>{counter}</div>;
};

// 如果需要引用 Props 中的数据，则以闭包方式传入
export const TodoListItem = props => {
  const todo = useSelector(state => state.todos[props.id]);
  return <div>{todo.text}</div>;
};
```

在上述的用法中，每次组件渲染的时候都会创建新的 selector 函数实例；我们可以使用 reselect 来创建可缓存的 selector 函数：

```js
import React from "react";
import { useSelector } from "react-redux";
import { createSelector } from "reselect";

const selectNumOfDoneTodos = createSelector(
  state => state.todos,
  todos => todos.filter(todo => todo.isDone).length
);

export const DoneTodosCounter = () => {
  const NumOfDoneTodos = useSelector(selectNumOfDoneTodos);
  return <div>{NumOfDoneTodos}</div>;
};

export const App = () => {
  return (
    <>
      <span>Number of done todos:</span>
      <DoneTodosCounter />
    </>
  );
};
```

# useDispatch

```js
const dispatch = useDispatch();
```

该 Hook 会返回 Redux store 中的 dispatch 函数的引用，可以永安里分发 Action：

```js
import React from "react";
import { useDispatch } from "react-redux";

export const CounterComponent = ({ value }) => {
  const dispatch = useDispatch();

  return (
    <div>
      <span>{value}</span>
      <button onClick={() => dispatch({ type: "increment-counter" })}>
        Increment counter
      </button>
    </div>
  );
};
```

当我们在父组件封装某个事件处理函数时，建议是使用 useCallback 来创建缓存的函数，以避免子组件因为事件处理函数的变化而造成的无意义渲染：

```js
import React, { useCallback } from "react";
import { useDispatch } from "react-redux";

export const CounterComponent = ({ value }) => {
  const dispatch = useDispatch();
  const incrementCounter = useCallback(
    () => dispatch({ type: "increment-counter" }),
    [dispatch]
  );

  return (
    <div>
      <span>{value}</span>
      <MyIncrementButton onIncrement={incrementCounter} />
    </div>
  );
};

export const MyIncrementButton = React.memo(({ onIncrement }) => (
  <button onClick={onIncrement}>Increment counter</button>
));
```

# useStore

```js
const store = useStore();
```

该 Hook 会返回 Provider 中传入的 store 实例：

```js
import React from "react";
import { useStore } from "react-redux";

export const CounterComponent = ({ value }) => {
  const store = useStore();

  // EXAMPLE ONLY! Do not do this in a real app.
  // The component will not automatically update if the store state changes
  return <div>{store.getState()}</div>;
};
```
