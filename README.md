[![Contributors][contributors-shield]][contributors-url]
[![Forks][forks-shield]][forks-url]
[![Stargazers][stars-shield]][stars-url]
[![Issues][issues-shield]][issues-url]
[![license: CC BY-NC-SA 4.0](https://img.shields.io/badge/license-CC%20BY--NC--SA%204.0-lightgrey.svg)][license-url]

<!-- PROJECT LOGO -->
<br />
<p align="center">
  <a href="https://github.com/wx-chevalier/Web-Notes">
    <img src="https://assets.ng-tech.icu/item/header.svg" alt="Logo" style="width: 100vw;height: 400px" />
  </a>

  <p align="center">
    <a href="https://ng-tech.icu/books/Web-Notes"><strong>在线阅读 >> </strong></a>
    <br />
    <br />
    <a href="https://github.com/wx-chevalier">代码案例</a>
    ·
       <a href="https://github.com/wx-chevalier/Awesome-Lists">参考资料</a>

  </p>
</p>

<!-- ABOUT THE PROJECT -->

# Web Series | Web 全栈开发、工程架构与性能调优

Web 开发，入门易，深度难，分为初窥门径、登堂入室、融会贯通等阶段，如果您是首次阅读笔者的系列文章，建议前往[某熊的技术之路指北 ☯](https://github.com/wx-chevalier/Developer-Zero-To-Mastery)以做整体了解。在本系列中，笔者致力于探索，如何有效地提升团队的研发效能，在整个产品迭代的生命周期中都能及时、可靠地完成交付；同时能够控制住系统整体的复杂性，并且不断地、持续地进行系统的性能与体验优化。

![Web Series 原有题图](https://user-images.githubusercontent.com/5803001/43637212-f62daf14-9746-11e8-84e0-78247690b3c6.png)

回顾数十年间 Web 技术与生态的灿烂变迁，我们亲身经历着激动人心的变革，也往往会陷入选择的迷茫。随着浏览器版本的革新与硬件性能的提升，Web 前端开发进入了高歌猛进，日新月异的时代，无数的前端开发框架、技术体系争妍斗艳，让开发者们陷入困惑，乃至于无所适从。特别是随着现代 Web 前端框架（Angular、React、Vue.js）的出现，JavaScript、CSS、HTML 等语言特性的提升，工程化、跨平台、微前端、大前端、BFF 等理论概念的提出，Web 前端开发的技术栈、社区也是不断丰富完善。地位。而所谓现代化的前端工程师，他们通常需要运用大量的专业知识来解决工程化问题，包括如何将项目进行模块化，如何设计组件间的交互，如何提高可复用性，如何提升打包效率，优化浏览器渲染性能，等等；不再像以前，只需要 HTML/CSS/JS 一个套路来开发静态页面。

## 迭代的阶段

总体而言，任何一个编程生态都会经历三个阶段，首先是原始时期，由于需要在语言与基础的 API 上进行扩充，这个阶段会催生大量的辅助工具。第二个阶段，随着做的东西的复杂化，需要更多的组织，会引入大量的设计模式啊，架构模式的概念，这个阶段会催生大量的框架。第三个阶段，随着需求的进一步复杂与团队的扩充，就进入了工程化的阶段，各类分层 MVC，MVP，MVVM 之类，可视化开发，自动化测试，团队协同系统应运而生。

有趣的是，当我们站在不同的时间点，这三个阶段的划分也是不一致的，以目前笔者的认知而言，划分为了：模板渲染、前后端分离与单页应用，工程化与微前端，大前端与 Serverless 这三个不同的阶段。

![大的阶段划分](https://i.postimg.cc/50xXjKN9/image.png)

当然，每个小阶段都会伴随着新框架、新工具的出现：

![不同阶段出现的框架](https://assets.ng-tech.icu/superbed/2021/07/06/60e3ed9b5132923bf8ff713f.jpg)

### 模板渲染、前后端分离与单页应用

Web 前端开发可以追溯于 1991 年蒂姆·伯纳斯-李公开提及 HTML 描述，而后 1999 年 W3C 发布 HTML4 标准，这个阶段主要是 B/S 架构，没有所谓的前端开发概念，此时多是基于模板渲染的静态页面。主要就是通过 JSP、PHP 等技术写一些动态模板，然后通过 Web Server 将模板解析成一个个 HTML 文件，浏览器只负责渲染这些 HTML 文件。这个阶段还没有前后端的分工，通常是后端工程师顺便写了前端页面。

接下来的几年间随着 Ajax 技术与 REST 等架构标准的提出，前后端分离与富客户端的概念日渐为人认同，我们需要在语言与基础的 API 上进行扩充，这个阶段出现了以 jQuery 为代表的一系列前端辅助工具。而基于 AJAX，前后端也开启了分离之路，前后端分离架构逐步流行。前端负责界面和交互，后端负责业务逻辑的处理。前后端通过接口进行数据交互。我们也不再需要在各个后端语言里面写着难以维护的 HTML。网页的复杂度也由后端的 Web Server 转向了浏览器端的 JavaScript。

2009 年以来，智能手机开发普及，移动端大浪潮势不可挡，SPA 单页应用的设计理念也大行其道，相关联的前端模块化、组件化、响应式开发、混合式开发等等技术需求甚为迫切。特别是 2009 年 Node.js 的出现，还有伴生的 CommonJS 规范和 npm 包管理机制，催生了 Angular 1、Ionic 等一系列优秀的框架以及 AMD、CMD、UMD 与 RequireJS、SeaJS 等模块标准与 Grunt, Gulp 这样的工具，前端工程师也成为了专门的开发领域，拥有独立于后端的技术体系与架构模式。

### 工程化与微前端

以前我们只需要简单的 HTML 和 JS 就够了，现在我们得用 包管理器 自动下载第三方包，用 模块管理器（module bundler）创建单个脚本文件，用 翻译编译器（transpiler）应用新的 JavaScript 功能，还要用 任务运行器（task runner）自动执行各个构建步骤。

近两年间随着 Web 应用复杂度的提升、团队人员的扩充、用户对于页面交互友好与性能优化的需求，我们需要更加优秀灵活的开发框架来协助我们更好的完成前端开发。这个阶段涌现出了很多关注点相对集中、设计理念更为优秀的框架，譬如 React、Vue.js、Angular 2 等组件框架允许我们以声明式编程来替代以 DOM 操作为核心的命令式编程，加快了组件的开发速度，并且增强了组件的可复用性与可组合性。而遵循函数式编程的 Redux 与借鉴了响应式编程理念的 MobX 都是非常不错的状态管理辅助框架，辅助开发者将业务逻辑与视图渲染剥离，更为合理地划分项目结构，更好地贯彻单一职责原则与提升代码的可维护性。在项目构建工具上，以 Grunt、Gulp 为代表的任务运行管理与以 Webpack、Rollup、JSPM 为代表的项目打包工具各领风骚，帮助开发者更好的搭建前端构建流程，自动化地进行预处理、异步加载、Polyfill、压缩等操作。

工具链的成熟，也带来了工程化的需求，业务引领技术，技术驱动业务。前端工程化是根据具体的业务特点，将前端的开发流程、技术、工具、经验等规范化、标准化。它的目的是让前端开发能够自成体系，最大程度地提高前端工程师的开发效率，降低技术选型、前后端联调等带来的协调沟通成本。

应用自身的逻辑复杂度以及工程化的加载、组合复杂度的提升，为前端的性能也带来了一定的挑战。譬如 React 等组件框架在页面初始化的时候会有白屏时间，对于 SEO 也并不友好；前端开始尝试以服务端渲染解决这个问题，基于 React、Vue 等实现的同构应用来替代过去的 JSP、PHP 等服务端语言的模板，还是以完整的 HTML 文档的形式返回给浏览器。

### 大前端、BFF 与 Serverless

着眼全栈，经过多年的发展，Node.js 已经完全具备了支撑企业级应用的能力，在 Lowe、Netflix、阿里等国内外诸多的公司中有着海量的实践；并且 Node.js 天然地语言亲和性，使开发人员更易承担全栈的职责。随着微服务架构以及云原生，Serverless 等概念的兴起，后端的接口渐渐变得原子性，微服务的接口也不再直接面向页面，前端的调用变得复杂了。于是以 GraphQL 为代表的 BFF（Backend For Frontend）理念应运而生，在微服务和前端中间，加了一个 BFF 层，由 BFF 对接口进行聚合、裁剪后，再输出给前端。

BFF 在解决接口协调与聚合问题的同时，也承载了原本后端的并发压力，这也给前端工程师带来了很多的开发与运维压力。Serverless 则是能够缓解这种问题，我们可以使用函数来实现接口的聚合裁剪；前端对于 BFF 的请求被转化为对 FaaS 的 HTTP 触发器的触发，这个函数中来实现针对该请求的业务逻辑，比如调用多个微服务获取数据，然后再将处理结果返回给前端。这样运维的压力，就由以往的 BFF Server 转向了 FaaS 服务，前端再也不用关心服务器了。Serverless 同样也能够应用到服务端渲染中，将以往的每个路由，都拆分为一个个函数，再在 FaaS 上部署对应的函数。这样用户请求的 path，对应的就是每个单独的函数。通过这种方式，就将运维操作转移到了 FaaS 平台，前端做服务端渲染，就不用再关心服务端程序的运维部署了。此外，像微信、支付宝等小程序也提供了符合 Serverless 理念的云开发平台，赋能业务前端迅速迭代。

![Web](https://s2.ax1x.com/2019/09/07/nljt0K.png)

更多介绍与导览参阅 [INTRODUCTION](./INTRODUCTION.md)。

# Nav | 关联导航

[中文版本](./README.md) | [English Version](./README-en.md)

- 如果你是颇有经验的开发者，想要了解前端工程化与架构方面的知识，那么建议阅读[前端演化](./架构与优化/前端工程化)一文。

- 如果您对于 JavaScript 基础语法尚不完全了解，那么建议您首先浏览[《现代 JavaScript 语法基础与工程实践》](https://ngte-pl.gitbook.io/i/javascript) 以了解基础的 JavaScript 语法及实践应用。

- 如果你希望了解 Node.js 全栈开发，可以参阅 [Node-Notes](https://github.com/wx-chevalier/Node-Notes)。

- 在了解了理论知识之后，建议前往 [wx-fe](https://github.com/topics/wx-fe) 查阅笔者所有的前端相关的开源项目。

# About

## Copyright & More | 延伸阅读

![License: CC BY-NC-SA 4.0](https://img.shields.io/badge/License-CC%20BY--NC--SA%204.0-lightgrey.svg) ![](https://parg.co/bDm)

笔者所有文章遵循[知识共享 署名 - 非商业性使用 - 禁止演绎 4.0 国际许可协议](https://creativecommons.org/licenses/by-nc-nd/4.0/deed.zh)，欢迎转载，尊重版权。您还可以前往 [NGTE Books](https://ng-tech.icu/books-gallery/) 主页浏览包含知识体系、编程语言、软件工程、模式与架构、Web 与大前端、服务端开发实践与工程架构、分布式基础架构、人工智能与深度学习、产品运营与创业等多类目的书籍列表：

[![NGTE Books](https://s2.ax1x.com/2020/01/18/19uXtI.png)](https://ng-tech.icu/books-gallery/)

<!-- MARKDOWN LINKS & IMAGES -->
<!-- https://www.markdownguide.org/basic-syntax/#reference-style-links -->

[contributors-shield]: https://img.shields.io/github/contributors/wx-chevalier/Web-Notes.svg?style=flat-square
[contributors-url]: https://github.com/wx-chevalier/Web-Notes/graphs/contributors
[forks-shield]: https://img.shields.io/github/forks/wx-chevalier/Web-Notes.svg?style=flat-square
[forks-url]: https://github.com/wx-chevalier/Web-Notes/network/members
[stars-shield]: https://img.shields.io/github/stars/wx-chevalier/Web-Notes.svg?style=flat-square
[stars-url]: https://github.com/wx-chevalier/Web-Notes/stargazers
[issues-shield]: https://img.shields.io/github/issues/wx-chevalier/Web-Notes.svg?style=flat-square
[issues-url]: https://github.com/wx-chevalier/Web-Notes/issues
[license-shield]: https://img.shields.io/github/license/wx-chevalier/Web-Notes.svg?style=flat-square
[license-url]: https://github.com/wx-chevalier/Web-Notes/blob/master/LICENSE.txt
