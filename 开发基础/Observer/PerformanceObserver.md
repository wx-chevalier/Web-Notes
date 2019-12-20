# PerformanceObserver

它主要用于观察性能时间轴（Performance Timeline），并在浏览器记录时通知新的性能条目。它可以用来度量浏览器和 Node.js 应用程序中某些性能指标。在浏览器中，我们可以使用 Window 对象作为 `window.PerformanceObserver`，在 Node.js 应用程序中需要 perf_hooks 获得性能对象。比如，`const {performance} = require('perf_hooks')`。它在下列情况下是有用的。

- 测量请求（Request）和响应（Response）之间的处理时间。（浏览器）
- 在从数据库中检索数据时计算持续时间。（Node.js 应用程序）
- 抽象精确的时间信息，使用 Paint Timing API，比如 First Paint 或 First Contentful Paint 时间
- 使用"User Timing API"、"Navigation Timing API"、"Network Information API"、"Resource Timing API"和"Paint Timing API"访问性能指标

# 基础使用

## 创建观察者

可以通过调用它的构造函数和传递处理函数来创建它。

```js
const observer = new PerformanceObserver(logger);
```

## 定义要观察的目标对象

`observer.observe(...)` 方法接受可以观察到的有效的入口类型。这些输入类型可能属于各种性能 API，比如 User tming 或 Navigation Timing API。有效的 entryType 值：

- "mark": [USER-TIMING]
- "measure": [USER-TIMING]
- "navigation": [NAVIGATION-TIMING-2]
- "resource": [RESOURCE-TIMING]

```js
// subscribe to User-Timing events
const config = { entryTypes: ['mark', 'measure'] };
observer.observe(config);
```

## 定义回调函数事件

当应用程序中使用观察到的事件时，会触发回调处理程序。

```js
function getDataFromServer() {
  performance.mark('startWork');
  // see [USER-TIMING]
  doWork(); // Some developer code
  performance.mark('endWork');
  performance.measure('start to end', 'startWork', 'endWork');
  const measure = performance.getEntriesByName('start to end')[0];
}

function logger(list, observer) {
  const entries = list.getEntries();
  entries.forEach(entry => {
    console.log(
      'Name: ' +
        entry.name +
        ', Type: ' +
        entry.entryType +
        ', Start: ' +
        entry.startTime +
        ', Duration: ' +
        entry.duration +
        '\n'
    );
  });
}
```
