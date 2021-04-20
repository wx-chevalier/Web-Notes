# Module Federation

Module Federation 为我们提供了一种在应用程序之间共享代码的新方法。Module Federation 使 JavaScript 应用得以从另一个 JavaScript 应用中动态地加载代码 —— 同时共享依赖。如果某应用所消费的 federated module 没有 federated code 中所需的依赖，Webpack 将会从 federated 构建源中下载缺少的依赖项。代码是可以共享的，但每种情况都有降级方案。federated code 可以总是加载自己的依赖，但在下载前会去尝试使用消费者的依赖。更少的代码冗余，依赖共享就像一个单一的 Webpack 构建。
