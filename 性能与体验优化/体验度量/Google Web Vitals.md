# Web Vitals

# 监控指标

![](https://ww1.sinaimg.cn/large/007rAy9hly1g0hf62zvvyj30u00bdt9y.jpg)

![](https://ww1.sinaimg.cn/large/007rAy9hly1g0hf62zvvyj30u00bdt9y.jpg)

白屏时间；首屏时间；用户可交互时间；总下载时间；
DNS 解析时间；
TCP 连接时间；
HTTP 请求时间；
HTTP 响应时间；

当我们讨论前端性能时，我们往往关注的性能指标包括:

- 白屏时间(first Paint Time)——用户从打开页面开始到页面开始有东西呈现为止
- 首屏时间——用户浏览器首屏内所有内容都呈现出来所花费的时间
- 用户可操作时间(dom Interactive)——用户可以进行正常的点击、输入等操作，默认可以统计 domready 时间，因为通常会在这时候绑定事件操作
- 总下载时间——页面所有资源都加载完成并呈现出来所花的时间，即页面 onload 的时间

我们需要在用户输入 URL 或者点击链接的时候就开始统计，因为这样才能衡量用户的等待时间。高端浏览器 Navigation Timing 接口；普通浏览器通过  cookie  记录时间戳的方式来统计，需要注意的是 Cookie 方式只能统计到站内跳转的数据。

# 监控相关 API

W3C 给我们提供了更全面、更强大的一个性能分析矩阵，比单一的 performance.timing 更加强大，能帮助我们从各个方面分析前端页面性能。

![](https://ww1.sinaimg.cn/large/007rAy9hly1g0hf62zvvyj30u00bdt9y.jpg)

还有 High Resolution Time 这个基础的 API，可以为我们提供更精准的 timestamp。为什么叫高精度时间，就是精度非常之高，也是为了适应现在前端一些复杂的一些性能衡量的场景，包括一些复杂的动画场景，需要的一些高精度的定义。那么 High Resolution Time 的另外一个特性就是，当我们在用户界面获取当前时间，然后修改一下系统时间，再次调用同一个方法就可以获取当前时间。

然后在 HRTime 之上，是一个叫 PerformanceTimeline 的 API，这个 API 很简单，它只是去定义了把各种各样的性能的情况。
在此，我们得出的最佳实践是：采集性能数据时先抹平 Navigation Timing spec 差异，优先使用 PerformanceTimeline API(在复杂场景，亦可考虑优先使用 PerformanceObserver)。

## 白屏时间

首次渲染是指第⼀个非网页背景像素渲染，⾸次内容渲染是指第一个⽂本、图像、背景图片或非白色 canvas/SVG 渲染。

我们通常认为的白屏时间计算方式为:白屏时间=开始渲染时间(首字节时间+HTML 下载完成时间)+头部资源加载时间。在高版本的 Chrome 中，我们可以通过`window.chrome.loadTimes().firstPaintTime`这个对象来获取:

```json
{
  "connectionInfo": "http/1",
  "finishDocumentLoadTime": 1422412260.278667,
  "finishLoadTime": 1422412261.083637,
  "firstPaintAfterLoadTime": 1422412261.094726,
  "firstPaintTime": 1422412258.085214,
  "navigationType": "Reload",
  "npnNegotiatedProtocol": "unknown",
  "requestTime": 0,
  "startLoadTime": 1422412256.920803,
  "wasAlternateProtocolAvailable": false,
  "wasFetchedViaSpdy": false,
  "wasNpnNegotiated": false
}
```

那么实际上在 Chrome 中的计算时间为:`(chrome.loadTimes().firstPaintTime - chrome.loadTimes().startLoadTime)*1000`。大部分浏览器没有特定函数，必须想其他办法来监测。仔细观察 WebPagetest 视图分析发现，白屏时间出现在头部外链资源加载完附近，因为浏览器只有加载并解析完头部资源才会真正渲染页面。基于此我们可以通过获取头部资源加载完的时 刻来近似统计白屏时间。尽管并不精确，但却考虑了影响白屏的主要因素：首字节时间和头部资源加载时间(HTML 下载完成时间非常微小)。

![](http://img4.07net01.com/upload/images/2016/09/07/348706070643491.png)

有一个点:mod_36ad799.js 等几个 js 为什么会在 hm.js 之前下载？html 代码如下:

![](http://img4.07net01.com/upload/images/2016/09/07/348706070643492.png)

## 首屏加载时长

# Links

- https://medium.freecodecamp.org/creating-a-web-performance-culture-inside-your-team-f00c0d79765f


# Links

- https://sctrack.sendcloud.net/track/click/eyJuZXRlYXNlIjogImZhbHNlIiwgIm1haWxsaXN0X2lkIjogMCwgInRhc2tfaWQiOiAiIiwgImVtYWlsX2lkIjogIjE2MTc5NzI4NjM1NjJfMTg3Xzg5MV8zMDYzLnNjLTEwXzlfMTIxXzE5Ny1pbmJvdW5kMCQzODQ5MjQ1NTJAcXEuY29tIiwgInNpZ24iOiAiMjQ4YmQwODM5ZTA0MGVjZDRiMmEwN2Q4OGZmZjY1ODAiLCAidXNlcl9oZWFkZXJzIjoge30sICJsYWJlbCI6ICI2MTkyMDMwIiwgInRyYWNrX2RvbWFpbiI6ICJzY3RyYWNrLnNlbmRjbG91ZC5uZXQiLCAicmVhbF90eXBlIjogIiIsICJsaW5rIjogImh0dHBzJTNBLy92aXAubWFub25nLmlvL2JvdW5jZSUzRm5pZCUzRDQ4JTI2YWlkJTNEMjAxNiUyNnVybCUzRGh0dHBzJTI1M0ElMjUyRiUyNTJGdG91dGlhby5pbyUyNTJGayUyNTJGdzdheHl6eSUyNm4lM0RNVE15Ljcwa3lyQmNnSXU4c0lkeWdYMThFWFFkUkVhSSIsICJvdXRfaXAiOiAiMTE3LjUwLjM3LjI1IiwgImNvbnRlbnRfdHlwZSI6ICIwIiwgInVzZXJfaWQiOiAxODcsICJvdmVyc2VhcyI6ICJmYWxzZSIsICJjYXRlZ29yeV9pZCI6IDYwMzQ5fQ==.html
