# Rcoiljs

Rcoiljs 是 Facebook 针对 React 推出的新的状态管理框架，它更小，更加地 Reactive，不会破坏 Code Splitting。

# Atoms 和 Selectors

Atoms 跟名字一样，就是原子化，提供一个 state，如下，设置唯一的 key 和 默认值：

```js
const todoListState = atom({
  key: "todoListState",
  default: [],
});
```

当我们在 app 里面使用的时候，从官网的 todo list 项目来看，有三种使用方式

- 单纯去使用它的值 `const todoList = useRecoilValue(todoListState);` , 如下

```js
{todoList.map((todoItem) => (

      ))}
```

- 单纯想去更新值 `const setTodoList = useSetRecoilState(todoListState);`, 如下

```js
const addItem = () => {
  setTodoList((oldTodoList) => [
    ...oldTodoList,
    {
      id: getId(),
      text: inputValue,
      isComplete: false,
    },
  ]);
};
```

- 想同时获取值和可以更新值 `const [todoList, setTodoList] = useRecoilState(todoListState);`，类似 react useState ，其中 todolist 是 state 值，这个没什么好说，setTodoList 也是直接把值设置进去，注意跟上面 useSetRecoilState 产出的 setTodoList 的区别，

# Selectors

```js
const todoListFilterState = atom({
  key: "todoListFilterState",
  default: "Show All",
});

const filteredTodoListState = selector({
  key: "filteredTodoListState",
  get: ({ get }) => {
    const filter = get(todoListFilterState);
    const list = get(todoListState);

    switch (filter) {
      case "Show Completed":
        return list.filter((item) => item.isComplete);
      case "Show Uncompleted":
        return list.filter((item) => !item.isComplete);
      default:
        return list;
    }
  },
});
```

同时 selector 也支持 set 操作，类似官网对华氏度和摄氏度的转化, 当我们对摄氏度的 selector 进行赋值的时候，也会更新华氏度 tempFahrenheit 的值：

```js
const tempFahrenheit = atom({
  key: 'tempFahrenheit',
  default: 32,
});

const tempCelcius = selector({
  key: 'tempCelcius',
  get: ({get}) => ((get(tempFahrenheit) - 32)  5) / 9,
  set: ({set}, newValue) => set(tempFahrenheit, (newValue  9) / 5 + 32),
});
```
