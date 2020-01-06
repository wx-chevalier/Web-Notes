# React Router

# 基本使用

- 安装方式：

```jsx
npm install --save react-router-redux
```

- 简单示例

```jsx
import React from "react";
import ReactDOM from "react-dom";
import { createStore, combineReducers, applyMiddleware } from "redux";
import { Provider } from "react-redux";
import { Router, Route, browserHistory } from "react-router";
import { syncHistoryWithStore, routerReducer } from "react-router-redux";

import reducers from "<project-path>/reducers";

// Add the reducer to your store on the `routing` key
const store = createStore(
  combineReducers({
    ...reducers,
    routing: routerReducer
  })
);

// Create an enhanced history that syncs navigation events with the store
const history = syncHistoryWithStore(browserHistory, store);

ReactDOM.render(
  <Provider store={store}>
    {/* Tell the Router to use our enhanced history */}
    <Router history={history}>
      <Route path="/" component={App}>
        <Route path="foo" component={Foo} />
        <Route path="bar" component={Bar} />
      </Route>
    </Router>
  </Provider>,
  document.getElementById("mount")
);
```

# Router State

## Params | Router 的参数

在 React Router 中可以通过本身组件的 Props 来传递路由参数，而在 React-Redux 中因为是采用了`connect()`方法将 State 映射到了 Props 中，因此需要采用`mapStateToProps`中的第二个参数进行路由映射：

```js
function mapStateToProps(state, ownProps) {
  return {
    id: ownProps.params.id,
    filter: ownProps.location.query.filter
  };
}
```

## History

如果有时候需要对于你的路由的历史进行监控的话，可以采用如下的方案：

```js
const history = syncHistoryWithStore(browserHistory, store);

history.listen(location => analyticsService.track(location.pathname));
```

# Navigation Control

## issue navigation events via Redux actions

```js
import { routerMiddleware, push } from "react-router-redux";

// Apply the middleware to the store
const middleware = routerMiddleware(browserHistory);
const store = createStore(reducers, applyMiddleware(middleware));

// Dispatch from anywhere like normal.
store.dispatch(push("/foo"));
```
