# Dva

Dva 首先是一个基于 redux 和 redux-saga 的数据流方案，然后为了简化开发体验，Dva 还额外内置了 react-router 和 fetch，所以也可以理解为一个轻量级的应用框架。

Dva 的官方特性如下：

- 易学易用，仅有 6 个 api，对 redux 用户尤其友好，配合 umi 使用后更是降低为 0 API。

- elm 概念，通过 reducers, effects 和 subscriptions 组织 model。

- 插件机制，比如 dva-loading 可以自动处理 loading 状态，不用一遍遍地写 showLoading 和 hideLoading。

- 支持 HMR，基于 babel-plugin-dva-hmr 实现 components、routes 和 models 的 HMR。
