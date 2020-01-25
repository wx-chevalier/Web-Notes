[![返回目录](https://i.postimg.cc/50XLzC7C/image.png)](https://github.com/wx-chevalier/Web-Series)

> 本文翻译自[A-Study-Plan-To-Cure-JavaScript-Fatigue](https://medium.com/@sachagreif/a-study-plan-to-cure-javascript-fatigue-8ad3a54f2eb1#.gfap70pkh)。笔者看到里面的几张配图着实漂亮，顺手翻译了一波。本文从属于笔者的[Web Frontend Introduction And Best Practices: 前端入门与最佳实践](https://github.com/wx-chevalier/Web-Develop-Introduction-And-Best-Practices/tree/master/Frontend)。

最近我也读了 Jose Aguinaga 的博文[2016 年里做前端是怎样一种体验](https://segmentfault.com/a/1190000007083024)。这篇博客引发了广泛的关注与讨论，无论是在 Hacker News 还是 Reddit 还是 Medium 上，都有很多人参与到了它的讨论中。我也是很早之前就感觉到了目前 JavaScript 生态圈中的群雄逐鹿，并且我还特地对目前[JavaScript 库流行现状](http://stateofjs.com/)进行了调查，希望能够在异彩纷呈的各式各样的库中寻找到真正的为大众所接受的。不过今天我希望能够更进一步，不仅仅再抱怨现状，而是从我个人的角度来给出一个逐步深入学习 JavaScript 生态圈的方案。(如果你尚对 HTML/CSS/JavaScript 并不了解，那么可以阅读[前端攻略：从路人甲到英雄无敌](https://github.com/wx-chevalier/Web-Develop-Introduction-And-Best-Practices/blob/master/Frontend/Introduction/Frontend-From-Zero-To-Hero.md))。而在文本中我们会涉及以下几个方面 :

- 一个现代的 JavaScript Web 应用会包含哪些部分
- 为什么不推荐使用 jQuery？
- 为什么 React 是个不错的选择
- 为什么并不需要你首先学透 JavaScript？
- 如何学习 ES6 语法
- 缘何与如何学习 Redux?
- GraphQL 到底解决了什么问题？
- 下一步又会走向何方

# Background

## JavaScript vs JavaScript

在正式开始之前，我们先要搞清楚我所要说的和你目前理解的是不是同一个东西。如果你在 Google 中搜索 ‘Learn JavaScript’ 或者 ‘JavaScript study plan’，你能得到一坨一坨的资料与教程指导你如何学习。不过实际上在我们的真实项目中，我们只会用到一些相对简单的语法。换言之，可能你在学习 Web 应用编写中所需要的 80% 的知识点都包含在了任何一本 JavaScript 书籍的前几章。另一个角度来说，真正麻烦的点在于如何掌握整个 JavaScript 生态圈，这里包含了数不尽的框架与库。不过我相信本文可以给你一点启示。

## Building Blocks Of JavaScript Apps

>

- [State Of JavaScript ：前端框架现状调查](https://segmentfault.com/a/1190000006728971)

为了便于理解现代 JavaScript 为啥看起来如何复杂，我们首先要明白其工作原理。我们首先来看下 2008 年左右流行的所谓传统 Web 应用的架构 : ![](https://coding.net/u/hoteam/p/Cache/git/raw/master/2016/10/3/1-k8ouvk608TxH5FaLM8XUxQ.png) 1. 服务端从数据库中获取数据。2. 服务端读取这些数据然后渲染到 HTML 中。3.HTML 文件被发送到浏览器，浏览器将 HTML 转化为 DOM 树并且展示出来。

现在很多的应用会在客户端使用 JavaScript 来保证应用的可交互性，不过本质上浏览器还是从收到 HTML 文件开始。下面我们再比较下 2016 年流行的所谓现代 Web 应用，典型的就是所谓的单页应用 : ![](https://coding.net/u/hoteam/p/Cache/git/raw/master/2016/11/1/1-_kZH0yiuh9b7ypYpoPANTw.png) 注意到区别了吗？与传统的 Web 应用相比，现在的服务端更多的承担起是提供数据的功能，而渲染 HTML 文件这一步交由客户端进行处理。这一个根本性的变化也会导致很多或好或坏的结果，好的一方面呢 :

- 对于某一块内容，仅仅发送数据会比发送整个 HTML 文件快很多
- 以单页应用为例，客户端可以刷新局部数据而不需要刷新整个浏览器窗口

坏的方面 :

- 由于现在数据的加载与渲染放在了客户端，初始加载与渲染会耗费更长的时间
- 现在需要在客户端提供一个存储与管理数据的地方，也就是我们目前所熟悉的状态管理工具

恶心的地方 :

- 随着客户端应用逻辑与交互的日渐复杂，你需要掌握像服务端技术栈一样复杂的前端技术栈

## The Client-Server Spectrum

实际上很多才接触现代前端开发技术栈的同学，特别是才从后端转前端的同学都会有个疑问，既然这么麻烦为何还要进行转变？举个例子，如果用户希望得到 2+2 的结果，肯定不需要我们将这个计算发送到服务端然后等待结果，浏览器完全能够支持这种简单的计算。换言之，如果你是打算构建一个纯粹的静态内容站，譬如博客这样的，那么在服务端直接生成最终的 HTML 文件是个不错的选择。不过实际上很多 Web 应用中我们并不能很好地界定这个分割点，并且整个光谱并不是连续的，你并不能先构建一个纯粹的服务端应用然后慢慢地向客户端迁移。当到达某个分割点时，你不得不停止这种迁移过程而去重构大量的代码，或者你就会面对一个庞杂无序难以维护的垃圾代码库。![](https://coding.net/u/hoteam/p/Cache/git/raw/master/2016/11/1/1-m0iR2VK7iNt8flGqyhYx9A.png)

这一点与不建议使用 jQuery 不谋而合，你可以将 jQuery 看做胶带一类的存在。对于房子的修修补补很是不错，但是如果你想不断地增加内容与功能，你就会发现你的房子歪歪扭扭，到处都是狗皮膏药，越看越丑。而大部分的现代 JavaScript 框架则是更像 3D 打印技术，可能在开始之前需要大量的准备时间，但是它能还你一个更整洁稳定的房屋。

# Week 0:JavaScript Basics

除非你是一个纯粹的服务端应用程序开发者，你肯定知道些 JavaScript 基础的内容。如果你还不是很了解的话那么也不需要担心，这里推荐个不错的教程[Codecademy’s JavaScript lessons](https://www.codecademy.com/learn/javascript)。

# Week 1:Start With React

在你了解了 JavaScript 基础语法知识之后，我推荐你下一步开始学习[React](https://facebook.github.io/react/)。![](https://coding.net/u/hoteam/p/Cache/git/raw/master/2016/11/1/1-eHRtRF0w78XfLEhOpFTflQ.png) React 是由 Facebook 开发并且开源的 UI 库，换言之，其专注于完成将数据渲染到 HTML 这一步骤，也就是所谓的 View 层。不过需要注意的是，我在这里并不是安利 React 为最优秀的库，这个是因项目而定的，不过我觉得 React 是个挺不错的合适初学者的库：

- React 不一定就是最受欢迎的库，不过其受欢迎程度相当高
- React 不一定是最轻量级的库，不过其谈不上是一个重量级的库
- React 不一定是最简单易学的库，不过其并不难学
- React 不一定是最优雅的库，不过其看上去还是很舒心的

总而言之，React 并不一定适用于所有的场景，但是我觉得它是所谓最安全的，学了不吃亏。React 还会引导你去了解一些像组件、应用状态与无状态函数等等现代 Web 应用框架的概念。最后，React 的整个生态圈非常繁荣，你可以从 Github 上有关 React 的项目中找到很多可用的组件，或者在 Stack Overflow 上找到很多关于 React 的答疑解惑。我个人是比较推荐[Wes Bos 的 React for Beginners](https://reactforbeginners.com/friend/STATEOFJS)这一课程。这课程包含了 React 从入门到最佳实践的全部知识。

# Week 2:Your First React Project

>

- [使用 Facebook 的 create-react-app 快速构建 React 开发环境](https://segmentfault.com/a/1190000006055973)
  >
- [在重构脚手架中掌握 React/Redux/Webpack2 基本套路](https://segmentfault.com/a/1190000007166607)

到了这里我假设你已经完成了 React 的基础课程，如果你跟我差不多的话，那么我估计你现在的状态可能是 :

- 估摸着你已经忘了一大半学过的知识点
- 你很想能够尽快付诸实践

众所周知，实践是学习某个框架的不二法诀，并且开始一个简单的个人项目也是学习新技术的不错的试验点。一个个人项目可以是简单的单页应用，也可能是像 Github 客户端这样复杂的 Web 应用。这里我推荐你可以尝试着去做一个简单的个人主页。不过还是要补充一句，如果你打算用 React 做一个简单的静态内容页就有点大材小用了，这里推荐一个不错的工具[Gatsby](https://github.com/gatsbyjs/gatsby)，这是一个 React 静态网站生成器。

![](https://coding.net/u/hoteam/p/Cache/git/raw/master/2016/11/1/1-nnHXMTKwXxCWJiY9yX2ZMA.gif)

这里我把 Gatsby 推荐为你可以在初步实践 React 阶段一个不错的参考项目，主要是因为 :

- 其提供了配置好的 Webpack，可以省去你很多学习配置的烦恼
- 能够基于你目录结构动态设置路由
- 所有的 HTML 内容同样可以服务端渲染
- 生成的静态内容页意味着你可以简单地就可以部署在 Github 主页上

# Week 3:Mastering ES6

随着我学习 React 的深入，我很快就感觉到了现在能够看得懂简单的代码示例，不过还有很多语法尚不能完全理解。举例来说，我还不熟悉[ES6](http://es6-features.org/#Constants)中的一些常见特性 :

- Arrow functions
- Object destructing
- Classes
- Spread Operator

如果你跟我一样也不是很熟悉，那么建议可以花个几天时间来认真学习下 ES6 的特性。如果你喜欢上面推荐的 React 基础课程，那么你也可以看下[ES6 for Everybody](https://es6.io/friend/stateofjs)系列教程。不过如果你想找点免费的资源，那么这里推荐[Nicolas Bevacqua’s book, Practical ES6.](https://ponyfoo.com/books/practical-es6/chapters)。最后，我还是想提到下对于 ES6 的好的学习方法就是回顾参照各种各样的代码库，学习人家的用法与实践。

# Week 4:Taking On State Management

>

- [思考 : 我需要怎样的前端状态管理工具 ?](https://segmentfault.com/a/1190000007103433)
  >
- [你不一定需要 Redux](https://segmentfault.com/a/1190000006966262)

>

- [深入理解 Redux:10 个来自专家的 Redux 实践建议](https://segmentfault.com/a/1190000006769471)

到这里我们已经能够构建基于静态内容的简单的 React 的前端项目，不过真实的 Web 应用项目不可能全是静态内容，他们需要从服务端获取数据然后交与 React 进行动态渲染。最直观的做法就是将数据一层一层地传递给组件，不过这很容易引发整个系统的混乱。譬如当两个组件需要去展示同样的数据时候，它们应该如何交互呢？这也就是所谓状态管理工具的用武之处，不同于将你的数据存放到组件内，你可以创建一个独立的全局单例 Store 来为组件树存放状态 : ![](https://coding.net/u/hoteam/p/Cache/git/raw/master/2016/11/1/1-g1LsxUV91i50-xE_VlMrsQ.png) 在 React 的生态圈中，最著名的状态管理工具当属 Redux。Redux 不仅能够帮助你集中管理数据，还能强制使用者对于数据的修改操作进行统一规范。![](https://coding.net/u/hoteam/p/Cache/git/raw/master/2016/11/1/1-4STSciyhxtniKgVagN2y0Q.png) 你可以将 Redux 想象为银行，你并不能直接进入自己的账户然后修改账户中的余额，你需要通过前台来发出一系列的指令控制操作。Redux 也是这样，并不允许你直接修改全局状态，你必须将 Actions 传入 Reducers，然后由这些纯函数来返回新的状态值。这样整个系统的流程就清晰可见并且可回溯 : ![](https://coding.net/u/hoteam/p/Cache/git/raw/master/2016/11/1/1-lAp8ZAk5uNFTuxjhx4GTdw.gif) 同样的，我们这里也推荐一些[Redux 教程](https://learnredux.com/)，以及免费的[Redux 作者的系列分享](https://egghead.io/courses/getting-started-with-redux)。

# Week 5: Building APIs With GraphQL

>

- [GraphQL 初探 : 从 REST 到 GraphQL，更完善的数据查询定义](https://segmentfault.com/a/1190000005766732)

现在我们已经讨论了很多客户端开发中所需要的知识栈，不过对于有追求的前端开发者而言这远远不够。不谈整个 Node 生态社区，我们还需要注意这个服务端的数据是如何传递到客户端的。这里要着重介绍下[GraphQL](http://graphql.org/)，一个由 Facebook 出品的可以替代传统的 REST API 的标准。![](https://coding.net/u/hoteam/p/Cache/git/raw/master/2016/11/1/1-HiWFjGqvZEOEUaSGau89eQ.png) 传统的 REST API 会通过暴露多个 REST 路由来允许用户访问些数据集，譬如`/api/posts,/api/comments`。而 GraphQL 将多个后端的 REST 接口整合为单个端点，允许用户从单个端点获取所需要的数据。

# Beyond & Next Steps

章节所限，在我的调查里也提到[Vue](http://vuejs.org/)与[Elm](http://elm-lang.org/)都是很优秀的框架，推荐有兴趣的朋友可以了解下。另外，在学完了这些基础知识，你还可以了解以下几个方面 :

- JavaScript on the server (Node, [Express](https://expressjs.com/)…)
- JavaScript testing ([Jest](https://facebook.github.io/jest/), [Enzyme](https://github.com/airbnb/enzyme)…)
- Build tools ([Webpack](https://webpack.github.io/)…)
- Type systems ([TypeScript](https://www.typescriptlang.org/), [Flow](https://flowtype.org/)…)
- Dealing with CSS in your JavaScript apps ([CSS Modules](https://github.com/css-modules/css-modules), [Styled Components](https://github.com/styled-components/styled-components)…)
- JavaScript for mobile apps ([React Native](https://facebook.github.io/react-native/)…)
- JavaScript for desktop apps ([Electron](http://electron.atom.io/)…)
