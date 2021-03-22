# Sagas

我们可以理解为 Sage 是一个可以用来处理复杂的异步逻辑的模块，并且由 redux 的 action 触发。副作用就是在 action 触发 reduser 之后执行的一些动作，这些动作包括但不限于，连接网络，io 读写，触发其他 action。并且，因为 Sage 的副作用是通过 redux 的 action 触发的，每一个 action，sage 都会像 reduser 一样接收到。并且通过触发不同的 action, 我们可以控制这些副作用的状态，例如，启动，停止，取消。

![redux-sagas 示意图](https://s2.ax1x.com/2019/11/02/KOSwZt.png)

![Redux Sagas 示意图](https://s2.ax1x.com/2020/01/06/lyYvUU.png)

# 基础使用

在定义生成 store 的地方，引入并加入 redux-sage 中间件。

```js
// npm install --save redux-saga
import { createStore, applyMiddleware } from "redux";
import createSagaMiddleware from "redux-saga";

import reducer from "./reducers";
import mySaga from "./sagas";

// create the saga middleware
const sagaMiddleware = createSagaMiddleware();
// mount it on the Store
const store = createStore(reducer, applyMiddleware(sagaMiddleware));

// then run the saga
sagaMiddleware.run(mySaga);
```

# 副作用

副作用，顾名思义，在主要作用（action 触发 reducer）之外，用来处理其他业务逻辑。redux-saga 提供了几种产生副作用的方式, 主要用到了有两种 takeEvery 和 takeLates。

- takeEvery 类似于 redux-thunk 的作用，会在接到相应的 action 之后不断产生新的副作用。比如，做一个计数器按钮，用户需要不断的点击按钮，对后台数据更新，这里可以使用 takeEvery 来触发。

- takeLatest 在相同的 action 被触发多次的时候，之前的副作用如果没有执行完，会被取消掉，只有最后一次 action 触发的副作用可以执行完。比如，我们需要一个刷新按钮，让用户可以手动的从后台刷新数据，当用户不停单机刷新的时候，应该最新一次的请求数据被刷新在页面上，这里可以使用 takeLatest。

在下面的事例中，当我们点击 Fetch 按钮时，其会触发某个 `FETCH_REQUESTED` 动作，然后 Sagas 中的监听函数会自动去监听该动作并且触发数据加载：

```js
import { call, put } from "redux-saga/effects";
import { takeEvery } from "redux-saga";

export function* fetchData(action) {
  try {
    const data = yield call(Api.fetchUser, action.payload.url);
    yield put({ type: "FETCH_SUCCEEDED", data });
  } catch (error) {
    yield put({ type: "FETCH_FAILED", error });
  }
}

function* watchFetchData() {
  yield* takeEvery("FETCH_REQUESTED", fetchData);
}
```

注意，takeEvery 第一个参数可以是数组或者方法。也可以有第三个参数用来传递变量给方法。takeEvery 会允许同时创建多个 fetchData 实例，这也就意味着可能某个时刻，某个 fetchData 在被执行的时候，它还有多个 fetchData 的动作尚未完成。如果我们只希望展示最新的数据请求的结果，则应该使用 taskLatest:

```js
import { takeLatest } from "redux-saga/effects";

function* watchFetchData() {
  yield takeLatest("FETCH_REQUESTED", fetchData);
}
```

takeLatest 同一时刻仅允许单个 fetchData 的任务运行，如果某个先前的任务尚未执行完毕，则其会被自动地终止。我们也可以同时创建多个监听函数：

```js
import { takeEvery } from 'redux-saga/effects'

// FETCH_USERS
function* fetchUsers(action) { ... }

// CREATE_USER
function* createUser(action) { ... }

// use them in parallel
export default function* rootSaga() {
  yield takeEvery('FETCH_USERS', fetchUsers)
  yield takeEvery('CREATE_USER', createUser)
}
```

# Links

- https://blog.logrocket.com/understanding-redux-saga-from-action-creators-to-sagas-2587298b5e71/

- [Redux Saga 实践](http://yanqiw.github.io/react/2017/03/05/redux-saga.html)

- [advanced-redux-action-types](https://medium.com/@zackargyle/advanced-redux-action-types-d5a71ed44e16#.hngz4r406)

- https://itnext.io/scalable-redux-architecture-for-react-projects-with-redux-saga-and-typescript-f6afe1dece9b
