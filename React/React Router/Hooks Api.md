# Hooks Api

React Router 附带了一些 Hooks Api，可让您访问路由器的状态并从组件内部执行导航。

# useHistory

useHistory Hook 使您可以访问可用于导航的历史记录实例。

```js
import { useHistory } from "react-router";

function HomeButton() {
  let history = useHistory();

  function handleClick() {
    history.push("/home");
  }

  return (
    <button type="button" onClick={handleClick}>
      Go home
    </button>
  );
}
```

# useLocation

useLocation Hook 返回代表当前 URL 的位置对象。您可以将其想像为 useState，它会在 URL 发生更改时返回一个新位置。在您希望每次加载新页面时都使用 Web 分析工具触发新的“页面浏览”事件的情况下，如以下示例所示：

```js
import React from "react";
import ReactDOM from "react-dom";
import { BrowserRouter as Router, Switch, useLocation } from "react-router";

function usePageViews() {
  let location = useLocation();
  React.useEffect(() => {
    ga.send(["pageview", location.pathname]);
  }, [location]);
}

function App() {
  usePageViews();
  return <Switch>...</Switch>;
}

ReactDOM.render(
  <Router>
    <App />
  </Router>,
  node
);
```

# useParams

useParams 返回 URL 参数的键/值对的对象。使用它来访问当前 `<Route>` 的 match.params。

```js
import React from "react";
import ReactDOM from "react-dom";
import {
  BrowserRouter as Router,
  Switch,
  Route,
  useParams
} from "react-router";

function BlogPost() {
  let { slug } = useParams();
  return <div>Now showing post {slug}</div>;
}

ReactDOM.render(
  <Router>
    <Switch>
      <Route exact path="/">
        <HomePage />
      </Route>
      <Route path="/blog/:slug">
        <BlogPost />
      </Route>
    </Switch>
  </Router>,
  node
);
```

# useRouteMatch

useRouteMatch Hook 尝试以与 `<Route>` 相同的方式匹配当前 URL。在无需实际呈现`<Route>` 的情况下访问匹配数据最有用。

```js
function BlogPost() {
  return (
    <Route
      path="/blog/:slug"
      render={({ match }) => {
        // Do whatever you want with the match ...
        return <div />;
      }}
    />
  );
}

function BlogPost() {
  let match = useMatch("/blog/:slug");
  // Do whatever you want with the match...
}
```
