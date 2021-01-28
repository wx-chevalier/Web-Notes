# Service Worker

Service Worker 是 Web Worker 的一种，其常被当做 Web 应用之间，或者浏览器与网络之间的代理；致力于提供更良好的离线体验，并且能够介入到网络请求中完成缓存与更新等操作，此外还能够被用于通知推送、后台同步接口等。Service Worker 是一种独立于浏览器主线程且可以在离线环境下运行的工作线程，与当前的浏览器主线程是完全隔离的，并有自己独立的执行上下文。HTML5 提供的一个 Service Worker API，能够进行 Service Worker 线程的注册、注销等工作。且 Service Worker 一旦被安装成功就永远存在，除非线程被程序主动解除，而且 Service Worker 在访问页面的时候可以直接被激活，如果关闭浏览器或者浏览器标签的时候会自动睡眠，以减少资源损耗。利用 Service Worker 的这些特性我们可以预缓存 offline 页面和静态资源。

它采用 JavaScript 文件的形式，可以控制与其相关联的网页/网站，拦截和修改导航和资源请求，并以非常细化的方式缓存资源，让您完全控制您的应用程序在某些情况下的行为，（最明显的是当网络不可用时）。Service Worker 是在 Worker 上下文中运行的：因此，它没有 DOM 访问权，并在与为您的应用程序提供动力的主 JavaScript 不同的线程上运行，因此它不会阻塞。它被设计为完全异步；因此，在 Service Worker 中不能使用同步 XHR 和 localStorage 等 API。出于安全考虑，Service Worker 只能通过 HTTPS 运行。有修改过的网络请求，大开大合的中间人攻击会非常糟糕。在 Firefox 中，Service Worker 的 API 也是隐藏的，当用户处于私人浏览模式时，无法使用。

# 生命周期

![Service Worker 生命周期](https://s3.ax1x.com/2021/01/25/sOMK9U.png)

ServiceWorker 的关键生命周期函数包括了 install, activate, fetch 等，在 install 中可以对部分资源进行即时缓存：

```js
// 当浏览器解析完 SW 文件时触发 install 事件
self.addEventListener("install", function (e) {
  // install 事件中一般会将 cacheList 中要换存的内容通过 addAll 方法，请求一遍放入 caches 中
  e.waitUntil(
    caches.open(cacheStorageKey).then(function (cache) {
      return cache.addAll(cacheList);
    })
  );
});
```

然后在 active 中做一些过期资源释放的工作，匹配到就从 caches 中删除：

```js
// 激活时触发 activate 事件
self.addEventListener("activate", function (e) {
  var cacheDeletePromises = caches.keys().then((cacheNames) => {
    return Promise.all(
      cacheNames.map((name) => {
        if (name !== cacheStorageKey) {
          return caches.delete(name);
        } else {
          return Promise.resolve();
        }
      })
    );
  });

  e.waitUntil(Promise.all([cacheDeletePromises]));
});
```

fetch 事件则是对于网络请求的截获：

```js
self.addEventListener('fetch', function(e) {
  // 在此编写缓存策略
  e.respondWith(
    // 可以通过匹配缓存中的资源返回
    caches.match(e.request)
    // 也可以从远端拉取
    fetch(e.request.url)
    // 也可以自己造
    new Response('自己造')
    // 也可以通过吧 fetch 拿到的响应通过 caches.put 方法放进 caches
  );
});
```

# 离线 offline 页面

在用户断网情况下，通常会出现浏览器自带的网络崩溃页面，给人一种 App 可访问性差的印象。通过 Service Worker 我们可以在用户第一次访问网站时就预缓存一个 offline 的静态页面，在监听到请求失败时返回该页面，来改善用户的体验。

![离线界面](https://s3.ax1x.com/2021/01/25/sOMFXj.png)

# 推送通知

PWA 还提供了 API 在网站上向用户推送消息，通常有 Push API 和 Notification API 。PWA 提供的消息推送有很多优点，首先可以吸引用户访问；而且消息的推送只要浏览器在运行即可，无需用户打开网页；消息推送需要获取用户授权，但对于同一个域名下的网页，只需要获取一次授权。

![消息推送](https://s3.ax1x.com/2021/01/25/sOMd3D.png)

推送通知使用两个 API 进行组装：Notifications API 和 Push API 。Notifications API 使应用程序可以向用户显示系统通知。Notification 和 Push API 构建在 Service Worker API 之上，该 API 在后台响应推送消息事件并将它们中继到应用程序。

## Notification API

Notification API 是 HTML5 新增的桌面通知 API，用于向用户显示通知信息。

```js
self.registration.showNotification("PWA-Book-Demo 测试 actions", {
  body: "点赞按钮可点击",
  actions: [
    {
      action: "like",
      title: "点赞",
      icon: "/assets/images/like-icon.png",
    },
  ],
});
// 监听通知点击事件
self.addEventListener("notificationclick", function (e) {
  // 关闭通知
  e.notification.close();

  if (e.action === "like") {
    // 点击了“点赞”按钮
    console.log("点击了点赞按钮");
  } else {
    // 点击了对话框的其他部分
    console.log("点击了对话框");
  }
});
```

## Push API

```js
// 监听 push 事件
self.addEventListener("push", function (e) {
  if (!e.data) {
    return;
  }
  // 解析获取推送消息
  let payload = e.data.text();
  // 根据推送消息生成桌面通知并展现出来
  let promise = self.registration.showNotification(payload.title, {
    body: payload.body,
    icon: payload.icon,
    data: {
      url: payload.url,
    },
  });
  e.waitUntil(promise);
});
// 监听通知点击事件
self.addEventListener("notificationclick", function (e) {
  // 关闭窗口
  e.notification.close();
  // 打开网页
  e.waitUntil(self.clients.openWindow(e.data.url));
});
```
