# DOM

# WebAPI、BOM、DOM 关系

JS 由 ECMAScript 基本语法（简称 ES）、DOM（文档对象模型）和 BOM（浏览器对象模型），图示如下：

![JS 构成](https://assets.ng-tech.icu/item/20230618214951.png)

API（Application Programming Interface ，应用程序 API）:是一些预先定义的函数，目的是提供应用程序与开发人员基于某软件或者硬件得以访问一组例程的能力，二又无需访问源码，或理解内部工作机制的细节。是给程序员提供的一种工具，以便能够更轻松的实现想要完成的功能。Web API 是浏览器提供的一套操作浏览器功能和页面元素的 API(BOM 和 DOM)

- BOM：Browser Object Model （浏览器对象模型），其实就是把浏览器当做一个对象来进行操作，比如前进、后退、页面跳转、刷新等

- DOM：Document Object Model（文档对象模型），Document 是文档，即整个 WEB 页面，所有的 Dom 元素都在 Document 整个文档里。简单来说，DOM 就是把整个文档页面当做一个对象进行操作，其核心思路就是把网页上的任何内容都当做一个对象来处理

二者的关系简单理解，就是 BOM 包含 DOM，图示如下：

![](https://assets.ng-tech.icu/item/8a0e95a6a387452aa851b6f49f547e19~tplv-k3u1fbpfcp-zoom-in-crop-mark:4536:0:0:0.png)

浏览器打开一个页面就会 自动 创建 一套 BOM 对象(window/document/.......)，其中 document 下 包含了 根据 html 创建 的 Dom 对象，这个 DOM 对象，以树形结构展示，即 DOM 树。
