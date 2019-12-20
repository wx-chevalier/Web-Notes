[![返回目录](https://i.postimg.cc/50XLzC7C/image.png)](https://parg.co/UGZ)

# ServiceWorker

A web worker is a JavaScript script executed from an HTML page that runs in the background, independently of other user-interface scripts that may also have been executed from the same HTML page.Mimics multithreading, allowing intensive scripts to be run in the background so they do not block other scripts from running. Ideal for keeping your UI responsive while also performing processor-intensive functions. Cannot directly interact with the DOM. Communication must go through the Web Worker’s postMessage method.

Service Workers are a new browser feature that provide event-driven scripts that run independently of web pages. Unlike other workers Service Workers can be shut down at the end of events, note the lack of retained references from documents, and they have access to domain-wide events such as network fetches.

ServiceWorkers also have scriptable caches. Along with the ability to respond to network requests from certain web pages via script, this provides a way for applications to "go offline".

Service Workers are meant to replace the (oft maligned) HTML5 Application Cache. Unlike AppCache, Service Workers are comprised of scriptable primitives that make it possible for application developers to build URL-friendly, always-available applications in a sane and layered way.

A service worker is a programmable proxy between your web page and the network which provides the ability to intercept and cache network requests. This effectively lets you create an offline-first experience for your app.

While Service Workers cannot directly interact with the DOM, your main JS code can do that based on the messages you receive back from a Service Worker. Service workers also stop when not being used and restart when needed, so there is no persistent “state”; you would need to rely on some form of local storage for such persistence. It is important to remember that a Service Worker’s life cycle is completely separate from your webpage.

# 离线存储

![](https://cdn-images-1.medium.com/max/1600/1*dfohRhGZpHXNzZQdJvaRDQ.png)

# Service Worker

Service Worker 是 Web Worker 的一种，其常被当做 Web 应用之间，或者浏览器与网络之间的代理；致力于提供更良好的离线体验，并且能够介入到网络请求中完成缓存与更新等操作，此外还能够被用于通知推送、后台同步接口等。

A service worker is an event-driven worker registered against an origin and a path. It takes the form of a JavaScript file that can control the web page/site it is associated with, intercepting and modifying navigation and resource requests, and caching resources in a very granular fashion to give you complete control over how your app behaves in certain situations, (the most obvious one being when the network is not available.)

A service worker is run in a worker context: it therefore has no DOM access, and runs on a different thread to the main JavaScript that powers your app, so it is not blocking. It is designed to be fully async; as a consequence, APIs such as synchronous XHR and localStorage can't be used inside a service worker.

Service workers only run over HTTPS, for security reasons. Having modified network requests, wide open to man in the middle attacks would be really bad. In Firefox, Service Worker APIs are also hidden and cannot be used when the user is in private browsing mode.

我们不可以在 Service Worker 中使用 Local Storage，并且 Service Worker 不可以使用任何的同步 API，不过可以使用 IndexDB，CacheAPI，或者利用 postMessage() 与界面进行交互。参考 [GoogleChromeLabs/airhorn](https://github.com/GoogleChromeLabs/airhorn)，可以使用如下的代码注册 ServiceWorker，并且使用 Cache API 来进行资源与请求缓存，首先需要注册 ServiceWorker：

```js
if (‘serviceWorker’ in navigator) {
  window.addEventListener(‘load’, function() {
    navigator.serviceWorker.register('/sw.js').then(
      function(registration) {
        // Registration was successful
        console.log(‘ServiceWorker registration successful with scope: ‘, registration.scope); },
      function(err) {
        // registration failed :(
        console.log(‘ServiceWorker registration failed: ‘, err);
      });
  });
}
```

ServiceWorker 的关键生命周期函数包括了 install, activate, fetch 等，在 install 中可以对部分资源进行即时缓存：

```js
// 当浏览器解析完 SW 文件时触发 install 事件
self.addEventListener('install', function(e) {
  // install 事件中一般会将 cacheList 中要换存的内容通过 addAll 方法，请求一遍放入 caches 中
  e.waitUntil(
    caches.open(cacheStorageKey).then(function(cache) {
      return cache.addAll(cacheList);
    })
  );
});
```

然后在 active 中做一些过期资源释放的工作，匹配到就从 caches 中删除：

```js
// 激活时触发 activate 事件
self.addEventListener('activate', function(e) {
  var cacheDeletePromises = caches.keys().then(cacheNames => {
    return Promise.all(
      cacheNames.map(name => {
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
