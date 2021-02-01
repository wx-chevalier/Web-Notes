# Redux 常用辅助库

# redux-actions

redux-actions 是一个辅助快速构建标准的 Flux Action 的工具集，也提供了快速构建 Reducer 的接口。可以使用 npm 进行安装使用：

```sh
npm install --save redux-actions
```

```js
import { createAction, handleAction, handleActions } from "redux-actions";
```

## createAction(type, payloadCreator = Identity, ?metaCreator)

将一个 Action Creator 封装成一个标准的 Flux Action 构造器，如果没有传入任何的 Payload Creator，那么会使用默认的函数，基本的使用例子如下：

```js
let increment = createAction("INCREMENT", (amount) => amount);
// same as
increment = createAction("INCREMENT");

expect(increment(42)).to.deep.equal({
  type: "INCREMENT",
  payload: 42,
});
```

如果传入的 payload 是一个 Error Object，redux-actions 会自动将 `action.error` 设置为`true`:

```js
const increment = createAction("INCREMENT");

const error = new TypeError("not a number");
expect(increment(error)).to.deep.equal({
  type: "INCREMENT",
  payload: error,
  error: true,
});
```

## handleAction(type, reducer | reducerMap, ?defaultState)

handleAction 函数可以将 Reducer 封装为处理标准的 Flux Actions 的函数，如果传入的是单个的 Reducer 的话，那可以用来处理正常的 Actions 与错误的 Actions，用法大概是这个样子的：

```js
handleAction('FETCH_DATA', {
  next(state, action) {...}
  throw(state, action) {...}
});
```

第三个参数指向了默认的 state。

## handleActions(reducerMap, ?defaultState)

handleActions 即等效于利用`handleAction`函数创建多个 Reducers 然后组合成一个单独的 Reducer 来处理多个 Actions。与标准的 Redux 中的 Reducer 的写法相比，其优势在于能够以扁平化的方式编写代码：

```js
const reducer = handleActions(
  {
    INCREMENT: (state, action) => ({
      counter: state.counter + action.payload,
    }),

    DECREMENT: (state, action) => ({
      counter: state.counter - action.payload,
    }),
  },
  { counter: 0 }
);
```

# reselect

```js
import { createSelector } from "reselect";

const shopItemsSelector = (state) => state.shop.items;
const taxPercentSelector = (state) => state.shop.taxPercent;

const subtotalSelector = createSelector(shopItemsSelector, (items) =>
  items.reduce((acc, item) => acc + item.value, 0)
);

const taxSelector = createSelector(
  subtotalSelector,
  taxPercentSelector,
  (subtotal, taxPercent) => subtotal * (taxPercent / 100)
);

export const totalSelector = createSelector(
  subtotalSelector,
  taxSelector,
  (subtotal, tax) => ({ total: subtotal + tax })
);

let exampleState = {
  shop: {
    taxPercent: 8,
    items: [
      { name: "apple", value: 1.2 },
      { name: "orange", value: 0.95 },
    ],
  },
};

console.log(subtotalSelector(exampleState)); // 2.15
console.log(taxSelector(exampleState)); // 0.172
console.log(totalSelector(exampleState)); // { total: 2.322 }
```

# redux-mock-store

redux-mock-store 常用于对 Redux 进行单元化测试。
