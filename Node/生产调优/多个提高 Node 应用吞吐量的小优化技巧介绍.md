- [多个提高 Node.js 应用吞吐量的小优化技巧介绍](https://zhuanlan.zhihu.com/p/25276558)翻译自 InfoQ 英文站的 [node-micro-optimizations-javascript](https://www.infoq.com/articles/node-micro-optimizations-javascript) 一文，从属于笔者的[Web 前端入门与工程实践](https://github.com/wx-chevalier/Web-Frontend-Introduction-And-Engineering-Practices)。

# 多个提高 Node.js 应用吞吐量的小优化技巧介绍

## 内容提点

- 尽可能地使用聚合 IO 操作，以批量写的方式来最小化系统调用的次数。
- 需要将发布的开销考虑进内，清除应用中不同的定时器。
- CPU 分析器能够给你提高一些有用信息，但是并不能完整地反馈整个流程。
- 谨慎使用 ECMAScript 高级语法，特别是你还未使用最新的 JavaScript 引擎或者类似于 Babel 这样的转换器的时候。
- 要洞察你的依赖树的组成并且对你使用的依赖进行适当的性能评测

当我们希望去优化某个包含了 IO 功能的应用性能时，我们需要对于应用耗费的 CPU 周期以及那些妨碍到应用并行化执行的因素了如指掌。本文则是分享我在提升 Apache Cassandra 项目中的[DataStax Node.js 驱动](https://github.com/datastax/nodejs-driver)时的一些思考与总结出的导致应用吞吐量降级的关键因素。

# 背景

Node.js 使用的标准 JavaScript 引擎 V8 会将 JavaScript 代码编译为机器码然后以本地代码的方式运行。V8 引擎使用了如下三个组件来同时保证较低的启动时间与最佳性能表现：

- 能够快速将 JavaScript 代码编译为机器码的通用编译器。
- 能够自动追踪应用中代码执行时间并且决定应该优化哪些代码模块的运行时分析器。
- 能够自动优化被分析器标注的待优化代码的优化编译器；并且如果操作被认为是过优化，该编译器还能自动地进行逆优化操作。

尽管优化编译器能够保证最佳的性能表现，但是它并不会对所有的代码进行优化，特别是那些不合适的代码编写模式。你可以参考[来自 Google Chrome DevTools 团队的建议](https://github.com/GoogleChrome/devtools-docs/issues/53)来了解哪些代码模式是 V8 拒绝优化的，典型的包括：

- 包含`try-catch`语句的函数
- 使用`arguments`对象对函数参数进行重新赋值

虽然优化编译器能够显著提升代码允许速度，但是对于典型的 IO 密集型的应用，大部分的性能优化还是依赖于指令重排以及避免高占用的调用来提高每秒的操作执行数目；这也会是我们在接下来的章节中需要讨论的部分。

# 测试基准

为了能够更好地发现那些可以惠及最多用户的优化技巧，我们需要模拟真实用户场景，根据常用任务执行的工作量来定义测试基准。首先我们需要测试 API 入口点的吞吐量与时延；除此之外如果希望获取更多的信息，你也可以选择对于内部调用方法进行性能评测。推荐使用`process.hrtime()`来获取实时解析与执行时长。虽然可能会对项目开发造成些许不便，但我还是建议尽可能早地在开发周期中引入性能评测。可以选择先从一些方法调用进行吞吐量测试，然后再慢慢地增加譬如时延分布这些相对复杂的测试。

# CPU 分析

目前有多种 CPU 分析器可供我们使用，其中 Node.js 本身提供的开箱即用的 CPU 分析器已经能应付大部分的使用场景。[内建的 Node.js 分析器](https://nodejs.org/en/docs/guides/simple-profiling/)源于 V8 内置的分析器，它能够以固定地频率对栈信息进行采样；你可以在运行 node 命令时使用`--prof`参数来创建 V8 标记文件。然后你可以对分析结果进行聚合转化处理，通过使用`--prof-process`参数将其转化为可读性更好的文本：

```
$ node --prof-process isolate-0xnnnnnnnnnnnn-v8.log > processed.txt
```

在编辑器中打开经过处理的记录文件，你可以看到整个记录被划分为了部分，首先我们来看下`Summary`部分，其格式如下所示：

```
 [Summary]:

  ticks   total   nonlib  name

  20109   41.2%   45.7%  JavaScript

  23548   48.3%   53.5%  C++

    805    1.7%    1.8%  GC

   4774    9.8%          Shared libraries

    356    0.7%          Unaccounted
```

上面的值分别代表了在 JavaScript/C++代码以及垃圾收集器中的采样频次，其会随着分析代码的不同而变化。然后你可以根据需要分别查看具体的子部分(譬如[JavaScript], [C++], ...)来了解具体的采样信息。除此之外，分析文件中还包含一个叫做`[Bottom up (heavy) profile]`的非常有用的部分，它以树形结构展示了买个函数的调用者，其基本格式如下：

```
223  32%      LazyCompile: *function1 lib/file1.js:223:20

221  99%        LazyCompile: ~function2 lib/file2.js:70:57

221  100%         LazyCompile: *function3 /lib/file3.js:58:74
```

上面的百分比代表该层调用者占目标函数所有调用者数目的比重，而函数之前的星号意味着该函数是经过优化处理的，而波浪号代表该函数是未经过优化的。在上面的例子中，`function1`99%的调用是由`function2`发起的，而`function3`占据了`function2`100%的调用占比。CPU 分析结果与[火焰图](http://www.brendangregg.com/blog/2014-09-17/node-flame-graphs-on-linux.html)是非常有用的分析栈占用与 CPU 耗时的工具。不过需要注意的是，这些分析结果并不意味着全部，大量的异步 IO 操作会让分析变得不那么容易。

# 系统调用

Node.js 利用 Libuv 提供的平台无关的接口来实现非阻塞型 IO，应用程序中所有的 IO 操作(sockets, 文件系统, ...)都会被转化为系统调用。而调度这些系统调用会耗费大量的时间，因此我们需要尽可能地聚合 IO 操作，以批量写的方式来最小化系统调用的次数。具体而言，我们应该将 Socket 或者文件流放入到缓冲中然后一次性处理而不是对每个操作进行单独处理。你可以使用写队列来管理你的所有写操作，常用的写队列的实现逻辑如下：

- 当我们需要进行写操作并且在某个处理窗口期内：
  - 将该缓冲区添加到待写列表中
- 连接所有的缓冲区并且一次性的写入到目标管道中。

你可以基于总的缓冲区长度或者第一个元素进入队列的时间来定义窗口尺寸，不过在定义窗口尺寸时我们需要权衡考虑单个写操作的时延与整体写操作的时延，不能厚此薄彼。你也需要同时考虑能够聚合的写操作的最大数目以及单个写请求的开销。你可能会以千字节为单位决定一个写队列的上限，我们的经验发现 8 千字节左右是个不错的临界点；当然根据你应用的具体场景这个值肯定会有变化，你可以参考[我们的这个写队列的完整实现](https://github.com/datastax/nodejs-driver/blob/v3.1.6/lib/writers.js#L159)。总结而言，当我们采用了批量写之后系统调用的数目大大降低了，最终提升了应用的整体吞吐量。

# Node.js 定时器

Node.js 中的定时器与 window 中的定时器具有相同的 API，可以很方便地实现简单的调度操作；在整个生态系统中有很广泛的应用，因此我们的应用中可能充斥着大量的延时调用。类似于其他[基于散列的轮转调度器](http://cseweb.ucsd.edu/users/varghese/PAPERS/twheel.ps.Z)，Node.js 使用哈希表与链表来维护定时器实例。不过有别于其他的轮转调度器，Node.js 并没有维持固定长度的哈希表，而是根据触发时间对定时器建立索引。添加新的定时器实例时，如果 Node.js 发现已经存在了相同的键值(有相同触发事件的定时器)，那么会以 O(1)复杂度完成添加操作。如果还不存在该键值，则会创建新的桶然后将定时器添加到该桶中。需要铭记于心的是，我们应该尽可能地重用已存在的定时器存放桶，避免移除整个桶然后再创建一个新的这种耗时的操作。举例而言，如果你使用滑动延时，那么应该在使用`clearTimeout()`移除定时器之前使用`setTimeout()`创建新的定时器。我们对于心跳包的处理中在移除上一个定时器之前会先确定下以 O(1)复杂度调度空闲的定时器。

# Ecmascript 语言特性

当我们着眼于整体的性能保障时，我们需要避免使用部分 Ecmascript 中的高级语言特性，典型的譬如:[Function.prototype.bind()](https://developer.mozilla.org/en/docs/Web/JavaScript/Reference/Global_objects/Function/bind), [Object.defineProperty()](https://developer.mozilla.org/en/docs/Web/JavaScript/Reference/Global_Objects/Object/defineProperty) 以及 [Object.defineProperties()](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/defineProperties)。我们可以在 JavaScript 引擎的实现描述或者问题中发现这些特性的性能缺陷所在，譬如[Improvement in ](http://v8project.blogspot.com.es/2016/07/v8-release-53.html)[Promise](http://v8project.blogspot.com.es/2016/07/v8-release-53.html)[ performance in V8 5.3](http://v8project.blogspot.com.es/2016/07/v8-release-53.html) 以及 [Function.prototype.bind](http://benediktmeurer.de/2015/12/25/a-new-approach-to-function-prototype-bind/)[ performance in V8 5.4](http://benediktmeurer.de/2015/12/25/a-new-approach-to-function-prototype-bind/)。另外你也需要谨慎使用 ES2015 或者 ESNext 中的新的语言特性，它们相较于 ECMAScript 5 中的语法会慢很多。[six-speed 项目网站](https://fhinkel.github.io/six-speed)就追踪了这些语言特性在不同的 JavaScript 引擎上的性能表现，如果你尚未发现某些特性的性能评测你也可以自己进行一些测试。V8 团队也一直致力于提高新的语言特性的性能表现，最终使其与底层实现保持一致。我们可以在[性能规划](https://docs.google.com/document/d/1EA9EbfnydAmmU_lM8R_uEMQ-U_v4l9zulePSBkeYWmY)中随时了解他们对于 ES2015 性能优化的工作进展，这里他们会收集使用者对于提升点的建议并且发布新的设计文档来阐述他们的解决方案。你也可以在[这个博客](http://v8project.blogspot.com/)随时了解 V8 的实现进展，不过考虑到 V8 的提升可能需要较长的时间才能合并入 LTS 版本的 Node.js: 根据[LTS 规划](https://github.com/nodejs/LTS)只有在 Node.js 大版本迭代时才会合并进最新的 V8 版本。你可能要等待 6-12 月才能发现新的 V8 引擎被合并进入 Node.js 的运行环境中，而目前 Node.js 的新的发布版本只会包含[V8 引擎中的部分修复](https://nodejs.org/en/download/releases/)。

# 依赖

Node.js 运行时为我们提供了完整的 IO 操作库，但是 ECMAScript 语法标准则仅提供了寥寥无几的内建数据类型，很多时候我们不得不依赖第三方的库来进行某些基本任务。没有人能保证这些第三方的库可以准确高效地工作，即使那些流行的明星模块也可能存在问题。Node.js 的生态系统是如此的繁荣茂盛，可能很多依赖模块中只包含几个你自己很方便就能实现的方法。我们需要在重复造轮子的代价与依赖带来的性能不可控之间做一个权衡。我们团队会尽可能地避免引入新的依赖，并且对所有的依赖持保守态度。不过对于[bluebird](https://github.com/petkaantonov/bluebird/blob/master/docs/docs/benchmarks.md)这样本身发布了可信赖的性能评测的库我们是很欢迎的。我们的项目中使用[async](https://github.com/caolan/async)来处理异步操作，在代码库中广泛地使用了[async.series()](https://caolan.github.io/async/docs.html#series), [async.waterfall()](https://caolan.github.io/async/docs.html#waterfall) 以及 [async.whilst()](https://caolan.github.io/async/docs.html#whilst)。确实我们很难说这样连接了多个层次的异步处理库就是性能受损的罪魁祸首，幸好有很多其他开发者定位了其中存在的问题。我们也可以选择类似于[neo-async](https://github.com/suguru03/neo-async)这样的替代库，它的运行效率明显提高并且也有公开的性能评测结果。

# 总结

本文中提及的优化技巧有的属于常识，有的则是涉及到 Node.js 生态系统以及 JavaScript 核心引擎的实现细节与工作原理。在我们开发的客户端驱动中，通过引入这些优化手段我们达成了两倍的吞吐量的提升。考虑到我们的 Node.js 应用以单线程方式运行，我们应用占据 CPU 的时间片与指令的排布顺序会大大影响整体的吞吐量与高平行的实现程度。

# 关于作者

Jorge Bay 是 Apache Cassandra 项目中 Node.js 以及 C#客户端驱动的核心工程师，同时还是 DataStax 的 DSE。他乐于解决问题与提供服务端解决方案，Jorge 拥有超过 15 年的专业软件开发经验，他为 Apache Cassandra 实现的 Node.js 客户端驱动同样也是 DataStax 官方驱动的基础
