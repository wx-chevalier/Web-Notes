# single-spa

qiankun 是一个基于 single-spa 的微前端实现库，在 qiankun 还未诞生前，用户通常使用 single-spa 来解决微前端的问题，所以我们先来了解 single-spa。我们先来上一个例子，并逐步分析每一步发生了什么。

- 亮点

  - 全异步编程，对于用户需要提供的 load,bootstrap,mount,unmount 均使用 promise 异步的形式处理，不管同步、异步都能 hold 住
  - 通过劫持路由，可以在每次路由变更时先判断是否需要切换应用，再交给子应用去响应路由
  - 标准化每个应用的挂载和卸载函数，不耦合任何框架，只要子应用实现了对应接口即可接入系统中

- 不足

  - `load` 方法需要知道子项目的入口文件
  - 把多个应用的运行时集成起来需要项目间自行处理内存泄漏，样式污染问题
  - 没有提供父子数据通信的方式

# 应用注册

```js
import { registerApplication, start } from "single-spa";

registerApplication(
  "foo",
  () => System.import("foo"),
  (location) => location.pathname.startsWith("foo")
);

registerApplication({
  name: "bar",
  loadingFn: () => import("bar.js"),
  activityFn: (location) => location.pathname.startsWith("bar"),
});

start();
```

- **appName:** string 应用的名字将会在 single-spa 中注册和引用, 并在开发工具中标记
- **loadingFn:** () => 必须是一个加载函数，返回一个应用或者一个 Promise
- **activityFn:** (location) => boolean 判断当前应用是否活跃的方法
- **customProps?:** Object 可选的传递自定义参数

# 元数据处理

首先，single-spa 会对上述数据进行标准化处理，并添加上状态，最终转化为一个元数据数组，例如上述数据会被转为：

```js
[{
  name: 'foo',
  loadApp: () => System.import('foo'),
  activeWhen: location => location.pathname.startsWith('foo'),
  customProps: {},
  status: 'NOT_LOADED'
},{
  name: 'bar',
  loadApp: () => import('bar.js'),
  activeWhen: location => location.pathname.startsWith('bar')
  customProps: {},
  status: 'NOT_LOADED'
}]
```

# 路由劫持

single-spa 内部会对浏览器的路由进行劫持，所有的路由方法和路由事件都确保先进入 single-spa 进行统一调度。

```js
// We will trigger an app change for any routing events.
window.addEventListener("hashchange", urlReroute);
window.addEventListener("popstate", urlReroute);
// Monkeypatch addEventListener so that we can ensure correct timing
const originalAddEventListener = window.addEventListener;
window.addEventListener = function (eventName, fn) {
  if (typeof fn === "function") {
    if (
      ["hashchange", "popstate"].indexOf(eventName) >= 0 &&
      !find(capturedEventListeners[eventName], (listener) => listener === fn)
    ) {
      capturedEventListeners[eventName].push(fn);
      return;
    }
  }
  return originalAddEventListener.apply(this, arguments);
};

function patchedUpdateState(updateState, methodName) {
  return function () {
    const urlBefore = window.location.href;
    const result = updateState.apply(this, arguments);
    const urlAfter = window.location.href;
    if (!urlRerouteOnly || urlBefore !== urlAfter) {
      urlReroute(createPopStateEvent(window.history.state, methodName));
    }
  };
}
window.history.pushState = patchedUpdateState(
  window.history.pushState,
  "pushState"
);
window.history.replaceState = patchedUpdateState(
  window.history.replaceState,
  "replaceState"
);
```

可以看到，所有的劫持都指向了一个出口函数 urlReroute。

# urlReroute 统一处理函数

每次路由变化，都进入一个相同的函数进行处理：

```js
let appChangeUnderway = false,
  peopleWaitingOnAppChange = [];

export async function reroute(pendingPromises = [], eventArguments) {
  // 根据不同的条件把应用分到不同的待处理数组里
  const {
    appsToUnload,
    appsToUnmount,
    appsToLoad,
    appsToMount,
  } = getAppChanges();

  // 如果在变更进行中还进行了新的路由跳转，则进入一个队列中排队，
  if (appChangeUnderway) {
    return new Promise((resolve, reject) => {
      peopleWaitingOnAppChange.push({ resolve, reject, eventArguments });
    });
  }
  // 标记此次变更正在执行中，
  appChangeUnderway = true;

  await Promise.all(appsToUnmount.map(toUnmountPromise)); // 待卸载的应用先执行unmount
  await Promise.all(appsToUnload.map(toUnloadPromise)); // 待销毁的应用先销毁
  await Promise.all(appsToLoad.map(toLoadPromise)); // 待加载的应用先执行load
  await Promise.all(appsToBootstrap.map(toBootstrapPromise)); // 待bootstrap的应用执行bootstrap
  await Promise.all(appsMount.map(toMountPromise)); // 待挂载的应用执行mount

  appChangeUnderway = false;
  // 如果排队的队列中还有路由变更，则进行新的一轮reroute循环
  reroute(peopleWaitingOnAppChange);
}
```

接下来看看分组函数在做什么。

# getAppChanges 应用分组

每次路由变更都先根据应用的 activeRule 规则把应用分组。

```js
export function getAppChanges() {
  const appsToUnload = [],
    appsToUnmount = [],
    appsToLoad = [],
    appsToMount = [];

  apps.forEach((app) => {
    const appShouldBeActive =
      app.status !== SKIP_BECAUSE_BROKEN && shouldBeActive(app);
    switch (app.status) {
      case LOAD_ERROR:
      case NOT_LOADED:
        if (appShouldBeActive) appsToLoad.push(app);
      case NOT_BOOTSTRAPPED:
      case NOT_MOUNTED:
        if (!appShouldBeActive) {
          appsToUnload.push(app);
        } else if (appShouldBeActive) {
          appsToMount.push(app);
        }
      case MOUNTED:
        if (!appShouldBeActive) appsToUnmount.push(app);
    }
  });
  return { appsToUnload, appsToUnmount, appsToLoad, appsToMount };
}
```

# 关于状态字段的枚举

single-spa 对应用划分了一下的状态：

```js
export const NOT_LOADED = "NOT_LOADED"; // 还未加载
export const LOADING_SOURCE_CODE = "LOADING_SOURCE_CODE"; // 加载源码中
export const NOT_BOOTSTRAPPED = "NOT_BOOTSTRAPPED"; // 已加载源码，还未bootstrap
export const BOOTSTRAPPING = "BOOTSTRAPPING"; // bootstrap中
export const NOT_MOUNTED = "NOT_MOUNTED"; // bootstrap完毕，还未mount
export const MOUNTING = "MOUNTING"; // mount中
export const MOUNTED = "MOUNTED"; // mount结束
export const UPDATING = "UPDATING"; // updata中
export const UNMOUNTING = "UNMOUNTING"; // unmount中
export const UNLOADING = "UNLOADING"; // unload中
export const LOAD_ERROR = "LOAD_ERROR"; // 加载源码时加载失败
export const SKIP_BECAUSE_BROKEN = "SKIP_BECAUSE_BROKEN"; // 在load,bootstrap,mount,unmount阶段发生脚本错误
```

single-spa 使用了有限状态机的设计思想：

- 事物拥有多种状态，任一时间只会处于一种状态不会处于多种状态；
- 动作可以改变事物状态，一个动作可以通过条件判断，改变事物到不同的状态，但是不能同时指向多个状态，一个时间，就一个状态；
- 状态总数是有限的。

# single-spa 的事件系统

基于浏览器原生的事件系统，无框架耦合，全局开箱可用。

```js
// 接收方式
window.addEventListener("single-spa:before-routing-event", (evt) => {
  const {
    originalEvent,
    newAppStatuses,
    appsByNewStatus,
    totalAppChanges,
  } = evt.detail;
  console.log(
    "original event that triggered this single-spa event",
    originalEvent
  ); // PopStateEvent | HashChangeEvent | undefined
  console.log(
    "the new status for all applications after the reroute finishes",
    newAppStatuses
  ); // { app1: MOUNTED, app2: NOT_MOUNTED }
  console.log(
    "the applications that changed, grouped by their status",
    appsByNewStatus
  ); // { MOUNTED: ['app1'], NOT_MOUNTED: ['app2'] }
  console.log(
    "number of applications that changed status so far during this reroute",
    totalAppChanges
  ); // 2
});
```
