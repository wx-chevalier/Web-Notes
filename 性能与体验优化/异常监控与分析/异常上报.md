# Web 异常上报

# 上报类型

整体的监控，我们需要采集的数据分为 4 类，即：JS 的异常错误、资源测速、接口的成功率、失败率、性能。

![异常上报类型](https://i.postimg.cc/4dh5DwXs/image.png)

其实浏览器已经提供了比较好的 API；当然对于不好支持的部分，我们可以采用 Patch 方式，对一些原生方法进行处理，从而做到无侵入开发上报的方式。如上图，大家可以看到 JS 错误监控里面有个 window.onEerror，但在资源测速监控里面又用了 window.addEventLisenter（'error'），其实两者并不能互相代替。window.onError 是一个标准的错误捕获接口，它可以拿到对应的这种 JS 错误；windows.addEventLisenter（'error'）也可以捕获到错误，但是它拿到的 JS 报错堆栈往往是不完整的。同时 window.onError 无法获取到资源加载失败的一个情况，必须使用 window.addEventLisenter（'error'）来捕获资源加载失败的情况。

# 上报端框架

![上报端框架](https://i.postimg.cc/d1wqZNDV/image.png)

我们先会在页面上内嵌一个最小的 SDK，并且一定是要放在头部的。如果把 SDK 全部异步加载，那么 SDK 必然无法采集到加载之前的一些数据。这里我们采用了一个折中的办法，只把最小的采集端缩小成一个最简版的 SDK 放在头部，然后再进一步的去加载主体的 SDK，采集端采集到的数据，会先放入到一个内存的池子里面，然后等到主体端的 SDK 加载完成之后，再从池子里面把数据读取出来，然后上报。

![上报流程](https://i.postimg.cc/DZvS3wr6/image.png)

那么问题来了，如果主体 SDK 加载失败了怎么办？我们的做法是再加入一层保护机制，首先加载主体 SDK 会有两次重试的机制。如果再次失败，会先把上报池中要上报的数据先存在 IndexedDB 里面，作为本地日志。等到用户下一次进入页面的时候，再把本地日志历史中的这些日志一并进行上报；或者服务器直接下发上传指令，主动上传日志。

# 上报请求

上报一般都是用 new Image 来发送，因为我们会对上报的请求做一个合并，请求长度太大会导致请求失败。比如说，三秒内的多条请求，会合并成一条请求发出去，但是合并之后就会导致一个问题，发出的长度如果超过了 2KB，也就是一个 get 请求的最大长度，那么这条请求是会失败的。最直接的解决办法是用 xhr 走 post 请求的方式来发送。但是又会面临另外一个问题：用 XHR 发送的话，这个请求的优先级会升级为最高，将影响到业务主体的消息请求。

这个时候我们又看到一个新的 API，就是 sendBeacon，那么用这个是不是问题就得到解决了呢？我们尝试用了 sendBeacon，同样也发现了问题，它的优先级也是要区分的。如果 sendBeacon 没有带 FormData 的话，它的优先级是比较低的，不会影响业务。如果用的是 FormData 的形式，它的优先级依然是比较高的，这也是我们之前遇到的问题，这一点在官方文档中并没有提到。当时我们在本地测试之后，就上线了使用 sendBeacon 的版本，发布之后很快就出现测速告警，图片延迟率变得特别高，多了三秒之多。我们针对这个问题定位了很久，最后发现是因为 sendBeacon 的这一改动。

兜兜转转，好像只能回到 new Image 的解法，我们再次使用了它，并给它加了一层保护，首先压缩合并并判断它压缩后的请求，之后再对过长的压缩进行拆分，保证它在可用的长度范围内进行压缩。压缩之后用 new Image 发送的话，由于压缩的计算耗时，终究会影响到业务的体验。所以我们就借助了 requestIdleCallback 这个方法。这个 API 做了什么事情呢？它可以检测到浏览器的资源空闲状态。可以在空闲时发送业务请求。

本来以为这样就可以了，后来产品同学又来找我们反馈，说上报数据老是有丢失，还有用户页面停留时间过长，以及数据量各种不对。我们试验之后得出的结果是，一个浏览器关闭了之后，那些没有发送的请求其实是会丢掉的。一般的做法就是在 Windows 里面发一个同步的 XHR 请求，但是在移动端其实是没有效果的。遗憾的是，即使我们用 sendBeacon，页面关闭后仍然不会去发送请求，好像陷入了死局，最终我们的解决方案是借助终端的能力去发送关闭这种事件的一些请求。

## Beacon

The Beacon API is used for sending small amounts of data to a server without waiting for a response. That last part is critical and is the key to why Beacon is so useful — our code never even gets to see a response, even if the server sends one. Beacons are specifically for sending data and then forgetting about it. We don’t expect a response and we don’t get a response.

Beacon 常用于用户追踪，行为分析，调试与日志。

# Links

- https://zhuanlan.zhihu.com/p/68838820 如何在 Web 关闭页面时发送 Ajax 请求
