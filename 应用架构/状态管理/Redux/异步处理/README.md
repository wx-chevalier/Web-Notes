# Redux 异步处理

在前一节介绍的 Action 与 Action Creator 都属于 Sync Action Creator，即每个 Action Creator，即每个 Action Creator 都是 Pure Function。而我们在实际的应用程序中经常会需要发起网络请求，网络请求往往附带着延迟，即从触发请求开始到实际获得数据并分发肯定会存在时间间隔，因此，我们在这种情况下需要的不仅仅是同步的 Action Creators，还有异步的 Action Creator。实际上对于如何实践异步的 Action Creator 也是见仁见智，笔者在这里会介绍几种常见的用法，各人也可以按照个人的认知与喜好进行选择使用。

本章介绍的 Thunk, Promise, Sagas, Observable 这几种方式本质上都是通过自定义 Redux Middleware 来实现对于异步事件的处理。
