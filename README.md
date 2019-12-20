![image](https://user-images.githubusercontent.com/5803001/43637212-f62daf14-9746-11e8-84e0-78247690b3c6.png)

[中文版本](./README.md) | [English Version](./README-en.md)

# 现代 Web 全栈开发与工程架构

`Copyright © 2019 王下邀月熊`

Web 开发，入门易，深度难，分为初窥门径、登堂入室、融会贯通等阶段，如果您是首次阅读笔者的系列文章，建议前往[某熊的技术之路指北 ☯](https://github.com/wx-chevalier/Developer-Zero-To-Mastery)以做整体了解。如果您对于 JavaScript 基础语法尚不完全了解，那么建议您首先浏览[《现代 JavaScript 语法基础与工程实践》](https://ngte-pl.gitbook.io/i/javascript) 以了解基础的 JavaScript 语法及实践应用。在了解了理论知识之后，建议前往 [wx-fe](https://github.com/topics/wx-fe) 查阅笔者所有的前端相关的开源项目。

> Gitbook 悦享版：https://ngte-web.gitbook.io/i/

# Preface | 前言

回顾数十年间 Web 技术与生态的灿烂变迁，我们亲身经历着激动人心的变革，也往往会陷入选择的迷茫。随着浏览器版本的革新与硬件性能的提升，Web 前端开发进入了高歌猛进，日新月异的时代，无数的前端开发框架、技术体系争妍斗艳，让开发者们陷入困惑，乃至于无所适从。特别是随着现代 Web 前端框架（Angular、React、Vue.js）的出现，JavaScript、CSS、HTML 等语言特性的提升，工程化、跨平台、微前端、大前端、BFF 等理论概念的提出，Web 前端开发的技术栈、社区也是不断丰富完善。

总体而言，任何一个编程生态都会经历三个阶段，首先是原始时期，由于需要在语言与基础的 API 上进行扩充，这个阶段会催生大量的辅助工具。第二个阶段，随着做的东西的复杂化，需要更多的组织，会引入大量的设计模式啊，架构模式的概念，这个阶段会催生大量的框架。第三个阶段，随着需求的进一步复杂与团队的扩充，就进入了工程化的阶段，各类分层 MVC，MVP，MVVM 之类，可视化开发，自动化测试，团队协同系统应运而生。

有趣的是，当我们站在不同的时间点，这三个阶段的划分也是不一致的，以目前笔者的认知而言，划分为了：模板渲染、前后端分离与单页应用，工程化与微前端，大前端与 Serverless 这三个不同的阶段。

![](https://i.postimg.cc/50xXjKN9/image.png)

## 模板渲染、前后端分离与单页应用

Web 前端开发可以追溯于 1991 年蒂姆·伯纳斯-李公开提及 HTML 描述，而后 1999 年 W3C 发布 HTML4 标准，这个阶段主要是 B/S 架构，没有所谓的前端开发概念，此时多是基于模板渲染的静态页面。主要就是通过 JSP、PHP 等技术写一些动态模板，然后通过 Web Server 将模板解析成一个个 HTML 文件，浏览器只负责渲染这些 HTML 文件。这个阶段还没有前后端的分工，通常是后端工程师顺便写了前端页面。

接下来的几年间随着 Ajax 技术与 REST 等架构标准的提出，前后端分离与富客户端的概念日渐为人认同，我们需要在语言与基础的 API 上进行扩充，这个阶段出现了以 jQuery 为代表的一系列前端辅助工具。而基于 AJAX，前后端也开启了分离之路，前后端分离架构逐步流行。前端负责界面和交互，后端负责业务逻辑的处理。前后端通过接口进行数据交互。我们也不再需要在各个后端语言里面写着难以维护的 HTML。网页的复杂度也由后端的 Web Server 转向了浏览器端的 JavaScript。

2009 年以来，智能手机开发普及，移动端大浪潮势不可挡，SPA 单页应用的设计理念也大行其道，相关联的前端模块化、组件化、响应式开发、混合式开发等等技术需求甚为迫切。特别是 2009 年 Node.js 的出现，还有伴生的 CommonJS 规范和 npm 包管理机制，催生了 Angular 1、Ionic 等一系列优秀的框架以及 AMD、CMD、UMD 与 RequireJS、SeaJS 等模块标准与 Grunt, Gulp 这样的工具，前端工程师也成为了专门的开发领域，拥有独立于后端的技术体系与架构模式。

## 工程化与微前端

以前我们只需要简单的 HTML 和 JS 就够了，现在我们得用 包管理器 自动下载第三方包，用 模块管理器（module bundler） 创建单个脚本文件，用 翻译编译器（transpiler） 应用新的 JavaScript 功能，还要用 任务运行器（task runner） 自动执行各个构建步骤。

近两年间随着 Web 应用复杂度的提升、团队人员的扩充、用户对于页面交互友好与性能优化的需求，我们需要更加优秀灵活的开发框架来协助我们更好的完成前端开发。这个阶段涌现出了很多关注点相对集中、设计理念更为优秀的框架，譬如 React、Vue.js、Angular 2 等组件框架允许我们以声明式编程来替代以 DOM 操作为核心的命令式编程，加快了组件的开发速度，并且增强了组件的可复用性与可组合性。而遵循函数式编程的 Redux 与借鉴了响应式编程理念的 MobX 都是非常不错的状态管理辅助框架，辅助开发者将业务逻辑与视图渲染剥离，更为合理地划分项目结构，更好地贯彻单一职责原则与提升代码的可维护性。在项目构建工具上，以 Grunt、Gulp 为代表的任务运行管理与以 Webpack、Rollup、JSPM 为代表的项目打包工具各领风骚，帮助开发者更好的搭建前端构建流程，自动化地进行预处理、异步加载、Polyfill、压缩等操作。

工具链的成熟，也带来了工程化的需求，业务引领技术，技术驱动业务。前端工程化是根据具体的业务特点，将前端的开发流程、技术、工具、经验等规范化、标准化。它的目的是让前端开发能够自成体系，最大程度地提高前端工程师的开发效率，降低技术选型、前后端联调等带来的协调沟通成本。

应用自身的逻辑复杂度以及工程化的加载、组合复杂度的提升，为前端的性能也带来了一定的挑战。譬如 React 等组件框架在页面初始化的时候会有白屏时间，对于 SEO 也并不友好；前端开始尝试以服务端渲染解决这个问题，基于 React、Vue 等实现的同构应用来替代过去的 JSP、PHP 等服务端语言的模板，还是以完整的 HTML 文档的形式返回给浏览器。

## 大前端、BFF 与 Serverless

着眼全栈，经过多年的发展，Node.js 已经完全具备了支撑企业级应用的能力，在 Lowe、Netflix、阿里等国内外诸多的公司中有着海量的实践；并且 Node.js 天然地语言亲和性，使开发人员更易承担全栈的职责。随着微服务架构以及云原生，Serverless 等概念的兴起，后端的接口渐渐变得原子性，微服务的接口也不再直接面向页面，前端的调用变得复杂了。于是以 GraphQL 为代表的 BFF（Backend For Frontend）理念应运而生，在微服务和前端中间，加了一个 BFF 层，由 BFF 对接口进行聚合、裁剪后，再输出给前端。

BFF 在解决接口协调与聚合问题的同时，也承载了原本后端的并发压力，这也给前端工程师带来了很多的开发与运维压力。Serverless 则是能够缓解这种问题，我们可以使用函数来实现接口的聚合裁剪；前端对于 BFF 的请求被转化为对 FaaS 的 HTTP 触发器的触发，这个函数中来实现针对该请求的业务逻辑，比如调用多个微服务获取数据，然后再将处理结果返回给前端。这样运维的压力，就由以往的 BFF Server 转向了 FaaS 服务，前端再也不用关心服务器了。Serverless 同样也能够应用到服务端渲染中，将以往的每个路由，都拆分为一个个函数，再在 FaaS 上部署对应的函数。这样用户请求的 path，对应的就是每个单独的函数。通过这种方式，就将运维操作转移到了 FaaS 平台，前端做服务端渲染，就不用再关心服务端程序的运维部署了。此外，像微信、支付宝等小程序也提供了符合 Serverless 理念的云开发平台，赋能业务前端迅速迭代。

![Web](https://s2.ax1x.com/2019/09/07/nljt0K.png)

# About

## 版权

![License: CC BY-NC-SA 4.0](https://img.shields.io/badge/License-CC%20BY--NC--SA%204.0-lightgrey.svg) ![](https://parg.co/bDm)

![](https://i.postimg.cc/yY17YwJN/image.png)

笔者所有文章遵循[知识共享 署名 - 非商业性使用 - 禁止演绎 4.0 国际许可协议](https://creativecommons.org/licenses/by-nc-nd/4.0/deed.zh)，欢迎转载，尊重版权。如果觉得本系列对你有所帮助，欢迎给我家布丁买点狗粮(支付宝扫码)~

![default](https://i.postimg.cc/y1QXgJ6f/image.png)

## Home & More | 延伸阅读

![技术视野](https://s2.ax1x.com/2019/12/03/QQJLvt.png)

您可以通过以下导航来在 Gitbook 中阅读笔者的系列文章，涵盖了技术资料归纳、编程语言与理论、Web 与大前端、服务端开发与基础架构、云计算与大数据、数据科学与人工智能、产品设计等多个领域：

- 知识体系：《[Awesome Lists | CS 资料集锦](https://ngte-al.gitbook.io/i/)》、《[Awesome CheatSheets | 速学速查手册](https://ngte-ac.gitbook.io/i/)》、《[Awesome Interviews | 求职面试必备](https://github.com/wx-chevalier/Awesome-Interviews)》、《[Awesome RoadMaps | 程序员进阶指南](https://github.com/wx-chevalier/Awesome-RoadMaps)》、《[Awesome MindMaps | 知识脉络思维脑图](https://github.com/wx-chevalier/Awesome-MindMaps)》、《[Awesome-CS-Books | 开源书籍（.pdf）汇总](https://github.com/wx-chevalier/Awesome-CS-Books)》

- 编程语言：《[编程语言理论](https://ngte-pl.gitbook.io/i/)》、《[Java 实战](https://github.com/wx-chevalier/Java-Series)》、《[JavaScript 实战](https://github.com/wx-chevalier/JavaScript-Series)》、《[Go 实战](https://ngte-pl.gitbook.io/i/go/go)》、《[Python 实战](https://ngte-pl.gitbook.io/i/python/python)》、《[Rust 实战](https://ngte-pl.gitbook.io/i/rust/rust)》

- 软件工程、模式与架构：《[编程范式与设计模式](https://ngte-se.gitbook.io/i/)》、《[数据结构与算法](https://ngte-se.gitbook.io/i/)》、《[软件架构设计](https://ngte-se.gitbook.io/i/)》、《[整洁与重构](https://ngte-se.gitbook.io/i/)》、《[研发方式与工具](https://ngte-se.gitbook.io/i/)》

* Web 与大前端：《[现代 Web 全栈开发与工程架构](https://ngte-web.gitbook.io/i/)》、《[数据可视化](https://ngte-fe.gitbook.io/i/)》、《[iOS](https://ngte-fe.gitbook.io/i/)》、《[Android](https://ngte-fe.gitbook.io/i/)》、《[混合开发与跨端应用](https://ngte-fe.gitbook.io/i/)》

* 服务端开发实践与工程架构：《[服务端基础](https://ngte-be.gitbook.io/i/)》、《[微服务与云原生](https://ngte-be.gitbook.io/i/)》、《[测试与高可用保障](https://ngte-be.gitbook.io/i/)》、《[DevOps](https://ngte-be.gitbook.io/i/)》、《[Spring](https://github.com/wx-chevalier/Spring-Series)》、《[信息安全与渗透测试](https://ngte-be.gitbook.io/i/)》

* 分布式基础架构：《[分布式系统](https://ngte-infras.gitbook.io/i/)》、《[分布式计算](https://ngte-infras.gitbook.io/i/)》、《[数据库](https://github.com/wx-chevalier/Database-Series)》、《[网络](https://ngte-infras.gitbook.io/i/)》、《[虚拟化与云计算](https://github.com/wx-chevalier/Cloud-Series)》、《[Linux 与操作系统](https://github.com/wx-chevalier/Linux-Series)》

* 数据科学，人工智能与深度学习：《[数理统计](https://ngte-aidl.gitbook.io/i/)》、《[数据分析](https://ngte-aidl.gitbook.io/i/)》、《[机器学习](https://ngte-aidl.gitbook.io/i/)》、《[深度学习](https://ngte-aidl.gitbook.io/i/)》、《[自然语言处理](https://ngte-aidl.gitbook.io/i/)》、《[工具与工程化](https://ngte-aidl.gitbook.io/i/)》、《[行业应用](https://ngte-aidl.gitbook.io/i/)》

* 产品设计与用户体验：《[产品设计](https://ngte-pd.gitbook.io/i/)》、《[交互体验](https://ngte-pd.gitbook.io/i/)》、《[项目管理](https://ngte-pd.gitbook.io/i/)》

* 行业应用：《[行业迷思](https://github.com/wx-chevalier/Business-Series)》、《[功能域](https://github.com/wx-chevalier/Business-Series)》、《[电子商务](https://github.com/wx-chevalier/Business-Series)》、《[智能制造](https://github.com/wx-chevalier/Business-Series)》

此外，你还可前往 [xCompass](https://wx-chevalier.github.io/home/#/search) 交互式地检索、查找需要的文章/链接/书籍/课程；或者在 [MATRIX 文章与代码索引矩阵](https://github.com/wx-chevalier/Developer-Zero-To-Mastery)中查看文章与项目源代码等更详细的目录导航信息。最后，你也可以关注微信公众号：『**某熊的技术之路**』以获取最新资讯。
