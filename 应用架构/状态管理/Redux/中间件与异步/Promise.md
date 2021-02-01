# Promise

![redux-promise 示意图](https://s2.ax1x.com/2019/11/02/KOppWD.png)

# redux-promise-middleware

```js
// npm i redux-promise-middleware -s
import promise from "redux-promise-middleware";

composeStoreWithMiddleware = applyMiddleware(promise)(createStore);
```

然后可以使用 Thunk 来执行自定义 Action 的分发：

```js
const secondAction = (data) => ({
  type: 'SECOND',
  payload: {...},
})

const firstAction = () => {
  return (dispatch) => {
    const response = dispatch({
      type: 'FIRST',
      payload: new Promise(...),
    })

    response.then((data) => {
      dispatch(secondAction(data))
    })
  }
}
```

对于 redux-promise-middleware 这个中间件而言，它对于如下的 action:

```js
const foo = () => ({
  type: "FOO",
  payload: new Promise()
});
```

它首先会立刻分发如下 type 的 action:

```json
{
  "type": "FOO_PENDING"
}
```

在 Promise 执行完毕之后，该中间件会分发另一个 action:

```js
{
  type: "FOO_FULFILLED";
  payload: {
    // ...
  }
}
```

如果是执行出异常的话，则会在 action 中添加 error 字段：

```js
{
  type: 'FOO_REJECTED'
  error: true,
  payload: {
    // ...
  }
}
```

# redux-pack-fsa

# 自定义 Promise Middleware

```js
function promiseMiddleware() {
  return ({ dispatch, getState }) => {
    return next => action => {
      if (typeof action === "function") {
        return action(dispatch, getState);
      }

      const { promise, types, ...rest } = action; // eslint-disable-line no-redeclare

      //判断是否存在Promise对象
      if (!promise) {
        return next(action);
      }

      const [REQUEST, SUCCESS, FAILURE] = types;
      next({ ...rest, type: REQUEST });

      let actionPromise;

      //判断promise的类别
      if (promise instanceof Function) {
        //如果promise为函数,则执行
        actionPromise = promise();
      } else {
        //否则直接赋值
        actionPromise = promise;
      }

      actionPromise
        .then(
          result => next({ ...rest, result, type: SUCCESS }),
          error => next({ ...rest, error, type: FAILURE })
        )
        .catch(error => {
          console.error("MIDDLEWARE ERROR:", error);
          next({ ...rest, error, type: FAILURE });
        });

      return actionPromise;
    };
  };
}

export default promiseMiddleware();
```
