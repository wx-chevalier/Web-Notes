# Workbox

Workbox 极大地简化了 PWA 的构建过程，可以把 Workbox 理解为 Google 官方的 PWA 框架，它解决的就是用底层 API 写 PWA 太过复杂的问题，接管了监听 SW 的 install、active、fetch 事件做相应逻辑处理等。

Workbox 的功能非常完善，插件机制也能够很好的满足各种业务场景需求，如果自己手动维护一个应用的原生的 Service Worker 文件工作量非常巨大，而且有很多潜在的问题不容易被发现，Workbox 很好的规避了很多 Service Worker 潜在的问题，也大大减小了 Service Worker 的维护成本，所以建议大家在开始考虑使用 Service Worker 的时候优先考虑 Workbox。

# 引入

```js
// 首先引入 Workbox 框架
importScripts("https://g.alicdn.com/kg/workbox/3.3.0/workbox-sw.js");

workbox.setConfig({
  modulePathPrefix: "https://g.alicdn.com/kg/workbox/3.3.0/",
});

workbox.precaching([
  // 注册成功后要立即缓存的资源列表
]);

// html的缓存策略
workbox.routing.registerRoute(
  new RegExp(".*.html"),
  workbox.strategies.networkFirst()
);

workbox.routing.registerRoute(
  new RegExp(".*.(?:js|css)"),
  workbox.strategies.cacheFirst()
);

workbox.routing.registerRoute(
  new RegExp("https://your.cdn.com/"),
  workbox.strategies.staleWhileRevalidate()
);

workbox.routing.registerRoute(
  new RegExp("https://your.img.cdn.com/"),
  workbox.strategies.cacheFirst({
    cacheName: "example:img",
  })
);
```

通过 workbox.precaching 中的是 install 以后要塞进 caches 中的内容，workbox.routing.registerRoute 中第一个参数是一个正则，匹配经过 fetch 事件的所有请求，如果匹配上了，就走相应的缓存策略 workbox.strategies 对象为我们提供了几种最常用的策略，如下：

- HTML，如果你想让页面离线可以访问，使用 NetworkFirst，如果不需要离线访问，使用 NetworkOnly，其他策略均不建议对 HTML 使用。

- CSS 和 JS，情况比较复杂，因为一般站点的 CSS，JS 都在 CDN 上，SW 并没有办法判断从 CDN 上请求下来的资源是否正确（HTTP 200），如果缓存了失败的结果，问题就大了。这种我建议使用 Stale-While-Revalidate 策略，既保证了页面速度，即便失败，用户刷新一下就更新了。如果你的 CSS，JS 与站点在同一个域下，并且文件名中带了 Hash 版本号，那可以直接使用 Cache First 策略。

- 图片建议使用 Cache First，并设置一定的失效事件，请求一次就不会再变动了。

## CLI

Workbox 为我们提供了 CLI 工具以便于生成配置文件：

```sh
$ yarn global add workbox-cli

# 生成配置文件
$ workbox wizard
```

![wizard](https://s2.ax1x.com/2020/01/24/1Zcskq.md.png)

```js
module.exports = {
  globDirectory: "./",
  globPatterns: ["**/*.{html,json,js}"],
  swDest: "./src/sw.js",
};
```

基于配置文件可以快速生成 SW 文件：

```sh
$ workbox generateSW path/to/config.js
```

# 预缓存

PWA 中预缓存的文件只要按照如下所示的接口给出文件路径即可，在第一次访问网站时便会预缓存相应文件：

```js
// 预缓存，同ws中的cacheName
workbox.core.setCacheNameDetails({
  prefix: "sharee",
  suffix: "v1",
  precache: "precache",
  runtime: "runtime",
});

// 动态缓存
workbox.routing.precacheAndRoute([
  {
    url: "/index.html",
    revision: "asdf",
  },
  "/index.abc.js",
  "/index.bcd.css",
]);
```

# 路由匹配 & 请求响应

Workbox 对资源请求匹配和对应的缓存策略执行进行了统一管理，采用路由注册的组织形式，以此来规范化动态缓存，使用下面这个函数：

```js
workbox.routing.registerRoute(match, handlerCb);
```

## match：路由匹配规则

上述函数中的 match 指路由匹配规则，有三种匹配方式。

- 对 URL 进行字符串匹配，绝对路径/相对路径

```js
workbox.routing.registerRoute("http://127.0.0.1:8080/index.css", handlerCb);
workbox.routing.registerRoute("/index.css", handlerCb); // 以当前url为基准
workbox.routing.registerRoute("./index.css", handlerCb);
```

- 正则匹配

```js
workbox.routing.registerRoute(`/\/index\.css$/`, handlerCb);
```

- 自定义匹配方法

该自定义方法是一个同步执行函数，在表示资源请求匹配成功时返回一个真值。

```js
const match = ({ url, event }) => {
  return url.pathname === "/index.html";
};
```

## handlerCb：资源请求处理方法

对匹配到的资源请求进行处理的方法，开发者可以在这里决定如何响应请求，无论是从网络、从本地缓存还是在 Service Worker 中直接生成都是可以的。该方法是异步方法并返回一个 Promise，要求 Promise 解析的结果必须是一个 Response 对象。

```js
// url：event.request.url 经 URL 类实例化的对象；
// event：fetch 事件回调参数；
// params：自定义路由匹配方法所返回的值。
const handlerCb = ({ url, event, params }) => {
  return Promise.resolve(new Response("Hello World!"));
};
```

## 缓存策略

拦截请求后我们可能会缓存响应，通常我们需要自己来编写相应的策略，Workbox 提供了常用的几种策略可以直接使用。workbox.strategies 对象提供了一系列常用的动态缓存策略来实现对资源请求的处理，有以下五种：

- NetworkFirst：网络优先
- CacheFirst：缓存优先
- NetworkOnly：仅使用正常的网络请求
- CacheOnly：仅使用缓存中的资源
- StaleWhileRevalidate：从缓存中读取资源的同时发送网络请求更新本地缓存

以 CacheFirst 为例，使用方法如下：

```js
workbox.routing.registerRoute(
  /\.(jpe?g|png)/,
  new workbox.strategies.CacheFirst({
    cacheName: "image-runtime-cache",
    plugins: [
      // 通过插件来强化缓存策略
      new workbox.expiration.Plugin({
        maxAgeSeconds: 7 * 24 * 60 * 60, // 对图片资源缓存1星期
        maxEntries: 10, // 匹配该策略的图片最多缓存10张
      }),
    ],
    fetchOptions: {
      // 跨域请求的资源
      mode: "cors",
    },
  })
);
```
