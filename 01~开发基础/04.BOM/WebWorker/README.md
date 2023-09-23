# Web Worker

Web Worker 即是运行在后台独立线程中的 JavaScript 脚本，可以用其来执行阻塞性程序以避免影响到页面的性能。Web Worker 的两大特性是高效与并行，因为浏览器是单线程的，任何大量耗时的 JS 任务都会卡住界面，使浏览器无法响应任何操作，这样的用户体验非常糟糕。Web Workers 可以将耗时任务拆解出去，降低主线程的压力，避免主线程无响应。但 CPU 资源是有限的，Web Workers 并不能增加总体运行效率，算上通信的损耗，整体计算效率会有一定的下降。

Worker 会运行在独立的不同于当前 window 的全局上下文中，因此我们并不能再 Worker 中进行 DOM 操作。

- 直接使用 Worker 构造函数创建的 Worker 被称为 Dedicated Worker, 其运行在所谓的 DedicatedWorkerGlobalScope 代表的上下文中，其仅允许创建脚本进行访问。

- 另一种 Shared Worker 则运行在 SharedWorkerGlobalScope 代表的上下文中，其允许多个脚本访问。

实际上 ServiceWorkers 也是 Web Worker 的一种，其常被用于 Web 应用之间，或者浏览器与网络之间的代理。ServiceWorkers 致力于提供更良好的离线体验，并且能够介入到网络请求中完成缓存与更新等操作；ServiceWorkers 同样能够被用于进行通知推送与后台同步接口。
