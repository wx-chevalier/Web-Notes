# Redux

随着 JavaScript 单页应用开发日趋复杂，JavaScript 需要管理比任何时候都要多的状态。这些状态可能包括服务器响应、缓存数据、本地生成尚未持久化到服务器的数据，也包括 UI 状态，如激活的路由，被选中的标签，是否显示加载动效或者分页器等等。管理不断变化的状态非常困难，如果一个模型的变化会引起另一个模型变化，那么当视图变化时，就可能引起对应模型以及另一个模型的变化，依次地，可能会引起另一个视图的变化。直至你搞不清楚到底发生了什么。状态在什么时候，由于什么原因，如何变化已然不受控制。当系统变得错综复杂的时候，想重现问题或者添加新功能就会变得举步维艰。

Redux 是 JavaScript 状态容器，提供可预测化的状态管理。可以让你构建一致化的应用，运行于不同的环境(客户端、服务器、原生应用)，并且易于测试。不仅于此，它还提供超爽的开发体验，比如有一个[时间旅行调试器可以编辑后实时预览](https://github.com/gaearon/redux-devtools)。Redux 除了和 [React](https://facebook.github.io/react/) 一起用外，还支持其它界面库。它体小精悍(只有 2kB)且没有任何依赖。

# 设计理念

下图列举了来自 Redux 官方网站的几个核心的特性：

![Redux 的几大特性](https://s2.ax1x.com/2019/10/07/uWSmp6.png)

Redux 的一大卖点就是所谓的时间旅行，即可以方便地回到某个时间点：

![Time Travel](https://s2.ax1x.com/2019/10/26/KBdNwT.png)

而对于具体的应用程序而言，是否应用 Redux 会带来极大的不同：

![Redux 有无对比](https://s2.ax1x.com/2019/09/01/n9la5j.png)

# Links

- https://www.redux.org.cn/docs/introduction/Motivation.html

- http://www.aliued.com/?p=3204

- https://www.leighhalliday.com/easy-mobx-redux-comparison

- https://github.com/leighhalliday/easy-mobx-redux-comparison/tree/context
