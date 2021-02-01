# Thunk

![redux-thunk 示意图](https://s2.ax1x.com/2019/11/02/KOFQZd.md.png)

Thunk 这个单词有点拗口，其代指那些包含了可以延时求值的表达式的函数，譬如下面的代码对比：

```js
// 计算 1 + 2 的过程是立即发生的
// x === 3
let x = 1 + 2;

// 这里计算 1 + 2 的过程是可以延迟进行的，即当调用 foo 函数时才进行真正的求职，那么 foo 就被称为 thunk
let foo = () => 1 + 2;
```

而 Redux 中的 Thunk 即是代指那些在某个时间间隔之后再分发 Action 的函数，该中间件允许你在编写 Action Creators 的时候返回一个参数为`dispatch`与`getState`的函数而不是一个 Action 本身。Thunk 可以用来延时分发该 Action，或者根据条件判断的结果来分发 Action。

# redux-thunk

在项目中引入 redux-thunk 的方法也很简单，首先使用 `npm` 命令安装相关依赖:

```sh
npm install --save redux-thunk
```

然后使用 `applyMiddleware` 函数来引用 Thunk 中间件:

```js
import { createStore, applyMiddleware } from "redux";
import thunk from "redux-thunk";
import rootReducer from "./reducers/index";

// Note: this API requires redux@>=3.1.0
const store = createStore(rootReducer, applyMiddleware(thunk));
```

配置完毕之后，我们即可以编写返回值为函数的 ActionCreator 函数了，这里我们还是以计数器为例，普通的计数器是瞬时进行加一操作，而这里我们希望延时 1s 进行加一操作：

```js
const INCREMENT_COUNTER = "INCREMENT_COUNTER";

function increment() {
  return {
    type: INCREMENT_COUNTER,
  };
}

function incrementAsync() {
  return (dispatch) => {
    setTimeout(() => {
      // 这里同样可以使用 dispatch 调用其他同步或者异步函数
      dispatch(increment());
    }, 1000);
  };
}
```

同样我们也可以根据当前状态来判断分发不同的事件，譬如我们希望仅当奇数时进行加一操作：

```js
function incrementIfOdd() {
  return (dispatch, getState) => {
    const { counter } = getState();

    if (counter % 2 === 0) {
      return;
    }

    dispatch(increment());
  };
}
```

# 延时调用

下面我们来讨论稍微复杂点的例子，在应用开发中我们经常需要设计消息提示组件，典型的使用场景譬如用户点击某个按钮之后弹出消息提示框，等待几秒后提示框自动关闭。传统的以 DOM 操作为核心的开发中会选择直接显示或者隐藏窗体的方式，而基于 Redux 的开发中我们只能通过改变全局状态来控制提示框的显示隐藏。首先我们需要定义基本的 Action 与 ActionCreator:

```js
const notificationId = 0;

const notificationActions = {
  show: function(text, id) {
    return { type: 'SHOW_NOTIFICATION', text: text, id: id || notificationId++ }
  },

  hide: function(id) {
    return { type: 'HIDE_NOTIFICATION', id: id }
  },

  showTimed: function(text) {
    return function(dispatch) {
      const id = notificationId++;

      dispatch(this.show(text, id))

      setTimeout(() => {
        dispatch(this.hide(id)
      }, 5000)
    }
  }
}
```

在上述代码片中可以看出，我们特意将 `show` 与 `hide` 两个纯函数与异步处理函数剥离开来，这样会更加地符合单一职责原则，也保证了代码的可复用性。而我们在组件中，根据用户的响应直接调用 `setTimed` 函数即可：

```js
function NotifyButton(props) {
  return (
    <button onClick={() => props.showTimedNotification("Awesome notification")}>
      Notify Me!
    </button>
  );
}

export default connect(null, {
  showTimedNotification: notificationActions.showTimed,
})(NotifyButton);
```

# 数据请求

由上可知，Thunk 非常的简单易用，其也是 Redux 生态系统中非常重要的组成部分，几乎每个应用中都可以发现它的身影。不过简单也有其代价，因为 Thunk 是直接返回的函数而不是某个朴素对象，我们也就无法序列化地记录 Action 的触发顺序，复杂逻辑下很难去调试。并且 Thunk 允许每个 Action Creator 中都进行任意的逻辑操作，本身也不是较强的束缚，这样就不利于整体的代码分割。在真实的应用程序开发过程中，最常遇到的问题就是对于数据的请求、获取与更新，而这一套流程涉及到数个 Action 以及对应的状态的改变。

```js
// thunk1
export function fetchPublishedPosts() {
  return async function (dispatch, getState) {
    dispatch({ type: "LOADING", loading: true });
    const posts = await postService.fetch("published");
    dispatch({ type: "PUBLISHED_POSTS", newPosts: posts });
    dispatch({ type: "LOADING", loading: false });
  };
}

// thunk2
export function fetchUnpublishedPosts() {
  return async function (dispatch, getState) {
    dispatch({ type: "LOADING", loading: true });
    const posts = await postService.fetch("unpublished");
    dispatch({ type: "UNPUBLISHED_POSTS", newPosts: posts });
    dispatch({ type: "LOADING", loading: false });
  };
}

// thunk3
export function fetchAllPosts() {
  return async function (dispatch, getState) {
    const promise1 = dispatch(fetchPublishedPosts());
    const promise2 = dispatch(fetchUnpublishedPosts());
    await Promise.all([promise1, promise2]);
  };
}
```

在上述代码中，清晰地能够看到存在大量的代码重复，我们可以基于 Thunk 对常见的数据请求流程进行封装：

```js
import { createAction, handleActions } from "redux-actions";
import update from "react-addons-update";

const REQ_STATE = {
  INIT: "@INIT",
  REQUESTING: "@REQUESTING",
  SUCCESS: "@SUCCESS",
  FAILED: "@FAILED",
};

let reqActionAndReducerCreator = (reqName, fetch, initData) => {
  let request = `${reqName}_REQUEST`,
    success = `${reqName}_SUCCESS`,
    failure = `${reqName}_FAILURE`;

  let actions = {
    [request]: createAction(request),
    [success]: createAction(success),
    [failure]: createAction(failure),
  };

  let reducer = handleActions(
    {
      [request]: (state, action) =>
        update(state, {
          state: { $set: REQ_STATE.REQUESTING },
          time: { $set: new Date() },
        }),
      [success]: (state, action) =>
        update(state, {
          state: { $set: REQ_STATE.SUCCESS },
          data: { $set: action.payload },
          time: { $set: new Date() },
        }),
      [failure]: (state, action) =>
        update(state, {
          state: { $set: REQ_STATE.FAILED },
          err: { $set: action.payload },
          time: { $set: new Date() },
        }),
    },
    {
      state: REQ_STATE.INIT,
      time: new Date(),
      err: null,
      data: initData || null,
    }
  );

  let asyncFetch = (...args) => (dispatch) => {
    dispatch(actions[request]());
    try {
      let data = fetch(...args);
      dispatch(actions[success](data));
    } catch (e) {
      dispatch(actions[failure](e));
    }
  };

  return {
    reducer: reducer,
    actions: {
      REQUEST: actions[request],
      SUCCESS: actions[success],
      FAILURE: actions[failure],
    },
    asyncReq: asyncFetch,
  };
};

export { REQ_STATE };
export default reqActionAndReducerCreator;
```

# TypeScript

```ts
import { Action, ActionCreator, Dispatch } from "redux";
import { ThunkAction } from "redux-thunk";

// Redux action
const reduxAction: ActionCreator<Action> = (text: string) => {
  return {
    type: SET_TEXT,
    text,
  };
};

// Redux-Thunk action
const thunkAction: ActionCreator<ThunkAction<Action, IState, void>> = (
  text: string
) => {
  return (dispatch: Dispatch<IState>): Action => {
    return dispatch({
      type: SET_TEXT,
      text,
    });
  };
};

// Async Redux-Thunk action
const asyncThinkAction: ActionCreator<
  ThunkAction<Promise<Action>, IState, void>
> = () => {
  return async (dispatch: Dispatch<IState>): Promise<Action> => {
    try {
      const text = await Api.call();
      return dispatch({
        type: SET_TEXT,
        text,
      });
    } catch (e) {}
  };
};
```
