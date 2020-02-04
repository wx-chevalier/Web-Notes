# React Router

# 中心化路由

基本的 React 的路由配置如下所示:

```js
<Router history={appHistory}>
  <Route path="/" component={withRouter(App)}>
    <IndexRoute component={withRouter(ClusterTabPane)} />
    <Route path="cluster" component={withRouter(ClusterTabPane)} />
  </Route>
  <Route path="*" component={withRouter(ErrorPage)} />
</Router>
```

不过 React-Router 因为其与 React 的强绑定性也不可避免的带来了一些缺陷，譬如在目前情况下因为 React 存在的性能问题(笔者觉得在 React-Fiber 正式发布之后能得到有效解决)，如果笔者打算使用[Inferno](https://github.com/trueadm/inferno)来替换部分对性能要求较大的页面，也是会存在问题。如果有兴趣的话也可以参考下[你不一定需要 React-Router 这篇文章](https://medium.freecodecamp.com/you-might-not-need-react-router-38673620f3d#.hzfajjq3t)。

React-Router 的核心原理是将子组件根据选择注入到`{this.props.children}`中。在一个多页面的应用程序中，如果我们不使用 React-Router，那么整体的代码可能如下所示:

```js
import React from "react";
import { render } from "react-dom";

const About = React.createClass({
  /*...*/
});
const Inbox = React.createClass({
  /*...*/
});
const Home = React.createClass({
  /*...*/
});

const App = React.createClass({
  getInitialState() {
    return {
      route: window.location.hash.substr(1)
    };
  },

  componentDidMount() {
    window.addEventListener("hashchange", () => {
      this.setState({
        route: window.location.hash.substr(1)
      });
    });
  },

  render() {
    let Child;
    switch (this.state.route) {
      case "/about":
        Child = About;
        break;
      case "/inbox":
        Child = Inbox;
        break;
      default:
        Child = Home;
    }

    return (
      <div>
        <h1>App</h1> 
        <ul>
          <li>
            <a href="#/about">About</a>
          </li>
          <li>
            <a href="#/inbox">Inbox</a>
          </li> 
        </ul>
        <Child />
         
      </div>
    );
  }
});

render(<App />, document.body);
```

可以看出，在原始的多页面程序配置下，我们需要在`render`函数中手动地根据传入的 Props 来决定应该填充哪个组件，这样就导致了父子页面之间的耦合度过高，并且这种命令式的方式可维护性也比较差，也不是很直观。

在 React-Router 的协助下，我们的路由配置可能如下所示:

```js
import React from "react";
import { render } from "react-dom";

// First we import some modules...
import { Router, Route, IndexRoute, Link, hashHistory } from "react-router";

// Then we delete a bunch of code from App and
// add some <Link> elements...
const App = React.createClass({
  render() {
    return (
      <div>
          <h1>App</h1>  {/* change the <a>s to <Link>s */} {" "}
        <ul>
           {" "}
          <li>
            <Link to="/about">About</Link>
          </li>
            <li>
            <Link to="/inbox">Inbox</Link>
          </li> {" "}
        </ul>
          {/*
  next we replace `<Child>` with `this.props.children`
  the router will figure out the children for us
  */}  {this.props.children} {" "}
      </div>
    );
  }
});

// Finally, we render a <Router> with some <Route>s.
// It does all the fancy routing stuff for us.
render(
  <Router history={hashHistory}>
    <Route path="/" component={App}>
        <IndexRoute component={Home} />
        <Route path="about" component={About} />
        <Route path="inbox" component={Inbox} />
    </Route>
  </Router>,
  document.body
);
```

React Router 提供了统一的声明式全局路由配置方案，使我们在父组件内部不需要再去关系应该如何选择子组件、应该如何控制组件间的跳转等等。而如果你希望将路由配置独立于应用程序，你也可以使用简单的 JavaScript Object 来进行配置:

```js
const routes = {
  path: "/",
  component: App,
  indexRoute: { component: Home },
  childRoutes: [
    { path: "about", component: About },
    { path: "inbox", component: Inbox }
  ]
};

render(<Router history={history} routes={routes} />, document.body);
```

在 2.4.0 版本之前，`router`对象通过`this.context`进行传递，不过这种方式往往会引起莫名的错误。因此在 2.4.0 版本之后推荐的是采取所谓的 HOC 模式进行 router 对象的访问，React Router 也提供了一个`withRouter`函数来方便进行封装：

```js
import React from "react";
import { withRouter } from "react-router";

const Page = React.createClass({
  componentDidMount() {
    this.props.router.setRouteLeaveHook(this.props.route, () => {
      if (this.state.unsaved)
        return "You have unsaved information, are you sure you want to leave this page?";
    });
  },

  render() {
    return <div>Stuff</div>;
  }
});

export default withRouter(Page);
```

然后在某个具体的组件内部，可以使用`this.props.router`来获取`router`对象:

```js
router.push("/users/12");

// or with a location descriptor object
router.push({
  pathname: "/users/12",
  query: { modal: true },
  state: { fromDashboard: true }
});
```

router 对象的常见方法有:

- replace(pathOrLoc):Identical to push except replaces the current history entry with a new one.
- go(n):Go forward or backward in the history by n or -n.
- goBack():Go back one entry in the history.
- goForward():Go forward one entry in the history.

React Router 提供了钩子函数以方便我们在正式执行跳转前进行确认:

```js
const Home = withRouter(
  React.createClass({
    componentDidMount() {
      this.props.router.setRouteLeaveHook(
        this.props.route,
        this.routerWillLeave
      );
    },

    routerWillLeave(nextLocation) {
      // return false to prevent a transition w/o prompting the user,
      // or return a string to allow the user to decide:
      if (!this.state.isSaved)
        return "Your work is not saved! Are you sure you want to leave?";
    } // ...
  })
);
```

除了跳转确认之外，[Route](/docs/Glossary.md#route)也提供了钩子函数以通知我们当路由发生时的情况，可以有助于我们进行譬如页面权限认证等等操作:
 - `onLeave` : 当我们离开某个路由时
 - `onEnter` : 当我们进入某个路由时

如果我们在 React Component 组件外，譬如 Reducer 或者 Service 中需要进行路由跳转的时候，我们可以直接使用`history`对象进行手动跳转:

```
// your main file that renders a Router
import { Router, browserHistory } from 'react-router'
import routes from './app/routes'
render(<Router history={browserHistory} routes={routes}/>, el)
// somewhere like a redux/flux action file:
import { browserHistory } from 'react-router'
browserHistory.push('/some/path')
```
