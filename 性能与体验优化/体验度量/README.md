# 性能监控与度量

TTFB: Time to First Byte - seen as the time between clicking a link and the first bit of content coming in.

FP: First Paint - the first time any pixel gets becomes visible to the user.

FCP: First Contentful Paint - the time when requested content (article body, etc) becomes visible.

TTI: Time To Interactive - the time at which a page becomes interactive (events wired up, etc).

在构建 Web 站点的过程中，任何一个细节都有可能影响网站的访问速度。如果开发人员不了解前端性能相关知识，很多不利网站访问速度的因素会在线上形成累加，从而严重影响网站的性能，导致网站访问速度变慢、用户体验低下，最终导致用户流失。页面性能对网页而言，可谓举足轻重。因此，对页面的性能进行检测分析，是开发者不可忽视的课题。那么我们如何对页面进行监控分析及性能评判？对性能评判的规则又是什么样的呢？

从技术方面来讲，前端性能监控主要分为两种方式，一种叫做合成监控（Synthetic Monitoring，SYN），另一种是真实用户监控（Real User Monitoring，RUM）。

- 合成监控，就是在一个模拟场景里，去提交一个需要做性能检测的页面，通过一系列的工具、规则去运行你的页面，提取一些性能指标，得出一个性能报告。

- 真实用户监控，就是用户在我们的页面上浏览，浏览过程就会产生各种各样的性能数据，我们把这些性能数据上传到我们的日志服务器上，进行数据的提取清洗加工，最后在我们的监控平台上进行展示的一个过程。

前者注重“检测”，后者注重“监控”。

在性能优化之前，我们首先需要对性能评测的指标与常见的监控、审计方法有所了解。

这里我们统一地对于性能评测的工具与量化指标进行讨论，而后续文章中提到的很多优化点也可以作为评测的指标之一。

从技术方面来讲，前端性能监控主要分为两种方式，一种叫做合成监控（Synthetic Monitoring，SYN），另一种是真实用户监控（Real User Monitoring，RUM）。合成监控就是在一个模拟场景里，去提交一个需要做性能审计的页面，通过一系列的工具、规则去运行你的页面，提取一些性能指标，得出一个审计报告。合成监控中最近比较流行的是 Google 的 Lighthouse，下面我们就以 Lighthouse 为例。

![](https://ww1.sinaimg.cn/large/007rAy9hgy1g0gp49wiu2j30u00kw0ud.jpg)

合成监控相对实现简单，并且流程可控，在不影响真实用户访问性能的情况下能够采集到更丰富的数据。不过合成监控很难还原全部用户场景，并且需要额外解决登录等复杂场景，其采集到的数据量也相对较少。所谓真实用户监控，就是用户在我们的页面上访问，访问之后就会产生各种各样的性能指标，我们在用户访问结束的时候，把这些性能指标上传到我们的日志服务器上，进行数据的提取清洗加工，最后在我们的监控平台上进行展示的一个过程。

# Links

- https://zhuanlan.zhihu.com/p/82981365 10 分钟彻底搞懂前端页面性能监控
