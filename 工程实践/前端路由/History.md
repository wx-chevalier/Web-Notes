[![返回目录](https://i.postimg.cc/50XLzC7C/image.png)](https://parg.co/UGZ)

# HTML5 History

传统的不使用 Ajax 的站点，每一个翻页是一个跳转，然后你可以在浏览器地址栏里看到诸如 `?page=2` 这样的参数。每一页就这样通过地址栏的 URL 做了标记，每一次请求，浏览器都会根据参数返回正确的页码。所以，传统的跳转翻页，刷新也不会丢失状态。

在 Ajax 更新页面局部内容的同时，也在地址栏的 URL 里更新状态参数，HTML5 history API 将解决这个问题。HTML5 history API 只包括 2 个方法：`history.pushState()` 和 `history.replaceState()`，以及 1 个事件：`window.onpopstate`。

# APIs

我们可以使用如下方式来检测是否可用 HTML5 History:

```js
export const supportsHistory = () => {
  const ua = window.navigator.userAgent;

  if (
    (ua.indexOf('Android 2.') !== -1 || ua.indexOf('Android 4.0') !== -1) &&
    ua.indexOf('Mobile Safari') !== -1 &&
    ua.indexOf('Chrome') === -1 &&
    ua.indexOf('Windows Phone') === -1
  )
    return false;

  return window.history && 'pushState' in window.history;
};
```

## history.pushState()

它的完全体是 `history.pushState(stateObject, title, url)`，包括三个参数。

第 1 个参数是**状态对象**，它可以理解为一个拿来存储自定义数据的元素。它和同时作为参数的`url`会关联在一起。

第 2 个参数是**标题**，是一个字符串，目前各类浏览器都会忽略它(以后才有可能启用，用作页面标题)，所以设置成什么都没关系。目前建议设置为空字符串。

第 3 个参数是**URL 地址**，一般会是简单的`?page=2`这样的参数风格的相对路径，它会自动以当前 URL 为基准。需要注意的是，**本参数 URL 需要和当前页面 URL 同源**，否则会抛出错误。

调用 `pushState()` 方法将新生成一条历史记录，方便用浏览器的“后退”和“前进”来导航(“后退”可是相当常用的按钮)。另外，从 URL 的同源策略可以看出，HTML5 history API 的出发点是很明确的，就是让无跳转的单站点也可以将它的各个状态保存为浏览器的多条历史记录。当通过历史记录重新加载站点时，站点可以直接加载到对应的状态。

## history.replaceState()

它和 `history.pushState()` 方法基本相同，区别只有一点，`history.replaceState()` 不会新生成历史记录，而是将当前历史记录替换掉。

## window.onpopstate

push 的对立就是 pop，可以猜到这个事件是在浏览器取出历史记录并加载时触发的。但实际上，它的条件是比较苛刻的，几乎只有点击浏览器的“前进”、“后退”这些导航按钮，或者是由 JavaScript 调用的 `history.back()` 等导航方法，且切换前后的两条历史记录都属于同一个网页文档，才会触发本事件。

上面的“同一个网页文档”请理解为 JavaScript 环境的 `document` 是同一个，而不是指基础 URL(去掉各类参数的)相同。也就是说，只要有重新加载发生(无论是跳转到一个新站点还是继续在本站点)，JavaScript 全局环境发生了变化，`popstate` 事件都不会触发。

`popstate` 事件是设计出来和前面的 2 个方法搭配使用的。一般只有在通过前面 2 个方法设置了同一站点的多条历史记录，并在其之间导航(前进或后退)时，才会触发这个事件。同时，前面 2 个方法所设置的状态对象(第 1 个参数)，也会在这个时候通过事件的`event.state`返还回来。

此外请注意，`history.pushState()` 及 `history.replaceState()` 本身调用时是不触发 `popstate` 事件的。

# 路由监听

首先，在服务器端添加对 URL 状态参数的支持，例如 `?page=3` 将会输出对应页码的内容(后端模板)。也可以是服务器端把对应页码的数据给 JavaScript，由 JavaScript 向页面写入内容(前端模板)。接下来，使用 `history.pushState()`，在任一次翻页的同时，也设置正确的带参数的 URL，代码可能是这样：

```js
newURL = '?page=' + pageNow;
history.pushState(null, '', newURL);
```

到此，就解决了 F5 刷新状态还原的事了。在浏览器中点击后退，例如从 `?page=3` 退到 `?page=2`，会发现没有变化。按道理说，这时候也应该对应变化。这就要用到 `popstate` 事件了。为 `window` 添加 `popstate` 事件，加入这种导航变化时的处理：

```js
$(window).on('popstate', function(event) {
  // 取得之前通过pushState保存的state object，尽管本示例并不打算使用它。
  // jQuery对event做了一层包装，需要通过originalEvent取得原生event。
  var state = event.originalEvent.state, // 本示例直接取URL参数来处理
    reg = /page=(\d+)/,
    regMatch = reg.exec(location.search), // 第1页的时候既可以是 ?page=1，也可以根本没有page参数
    pageNow = regMatch === null ? 1 : +regMatch[1];

  updateByPage(pageNow);
});
```

这样，就完成了。这样看起来是否会觉得还挺容易的呢？在支持 HTML5 history API 的浏览器中，以上部分就已经做到了带页码记录的 Ajax 翻页。

# Todos

- [阮一峰 浏览器对象之 History](http://javascript.ruanyifeng.com/bom/history.html)
