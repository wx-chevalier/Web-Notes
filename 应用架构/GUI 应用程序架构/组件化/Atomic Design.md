[![返回目录](https://i.postimg.cc/50XLzC7C/image.png)](https://parg.co/UGZ)

![](https://coding.net/u/hoteam/p/Cache/git/raw/master/2017/1/3/1-QddpkVU6DTA986YrLzxaow.png)

在很多大型复杂的项目中，基于组件的设计方案(Component Based Design)往往都会被提上讨论日程。而本文则是作者在很多小型项目中使用 CBD 的感悟与经验总结，项目无论大小皆可适用基于组件的设计方案。首先，我想引用下布拉德弗罗斯特在 Atomic Design 一书中的论述，我们在做设计的时候并不仅仅是设计某个网页或者应用交互，而是在设计一个设计系统。虽然这句话被很多人奉为圭臬，但是我发现不少的使用者在具体实践时却陷入混乱，特别是那些对于产品的不同抽象层级与相应的命名方法非常容易使得开发者手足无措。因此我们将自己团队中基于组件的设计的完整抽象流程与大家共享。

# 何谓 Component Based Design？

简而言之，Component Based Design 就是将整个 UI 切分为更小的、更可控的具有清晰命名的部分。而这些细小的部分又可以划分为如下 6 个不同的分组。

## Identity: 特性

首先是特性，即是项目的核心标志性元素，譬如字体、排版、主色与次生色等等。在某个项目中设计人员应该保持所有的设计都遵从同一套特性规范。

![](https://coding.net/u/hoteam/p/Cache/git/raw/master/2017/1/3/1-ZS6dVifI8bRs1PhFL8a1Tg.png)

## Elements: 元素

第二个可复用的部分是元素，譬如按钮、链接、输入框、下拉列表等等这些都是属于元素。每个元素同时也会定义其不同状态下的显示，譬如悬浮状态的按钮、聚焦状态的按钮以及不可用的按钮。我们的口号是：Define Once，Reuse Throughout The Project.

![](https://coding.net/u/hoteam/p/Cache/git/raw/master/2017/1/3/1-KnoBW4w_RCBEwAvzG800TQ.png)

## Components: 组件

第三个可复用的部分是组件，这也是用户屏幕当中展示的最多的块。组件即是使用了一到多个元素(Elements)的任何界面部分，典型的譬如卡片、导航栏等等。需要注意的是，组件并不一定需要模块化。

![](https://coding.net/u/hoteam/p/Cache/git/raw/master/2017/1/3/1-iDRvbuMgs9j2OQ_MADU6sw.png)

在设计组件的时候，我们同样需要根据项目的不同响应式尺寸来设计不同尺寸下的组件呈现方式。

## Compositions: 复合

我们逐步提高我们的着眼点，第四个分组即是复合。复合是任何包含了多个组件的 UI 部分，它们定义了内部组件的行为范式。下图就是简单的例子，下面的这个复合定义了组件的展示内容、组件的间距、整个标题等信息。

![](https://coding.net/u/hoteam/p/Cache/git/raw/master/2017/1/3/1-4Hc7Cd6ksSXKe5vzAzVrQw.png)

## Layout: 布局

第五大类，布局，是对于设计原则的更高层抽象，典型的譬如网格系统，定义了行列之间的间隔。定义统一的布局有助于其他设计者复用现有的样式规范。

![](https://coding.net/u/hoteam/p/Cache/git/raw/master/2017/1/3/1-vL3mknPTPbBUThj-nhrwIw.png)

## Pages: 页面

最后一组即是完整的呈现页面，每个页面包含了一系列的复合与组件的排列组合。所有超出设计预期的东西应该添加在页面这个层级，譬如如果市场的同学说我们的联系人页背景应该是蓝色的，那我们就该将这个特性添加到页面这个层级，而不应该污染上述五个层级。

![](https://coding.net/u/hoteam/p/Cache/git/raw/master/2017/1/3/1-tQAbsQmbLY7RAL1tBBPIfg.png)

# 实例

我们下面以一个简单的例子来阐述基于组件的设计流程。我们产品的某个重要服务就是进行门票售卖，因此我们需要展示三种不同风格的门票卡片、每个卡片的呈现方式是一致的，都会包含按钮和一些文字。换言之，这里的门票卡片就应该被设计为组件，即所谓的 Ticket-Component.

![](https://coding.net/u/hoteam/p/Cache/git/raw/master/2017/1/3/1-RS0Q5A8qa8GnjcPqpBg4oA.png)

然后，我们需要将三种卡片编为一组同时展示在组件上，此时即就是设计出了所谓的复合，Tickets-Composition，定义了每个卡片之间的间距以及整个的标题。

![](https://coding.net/u/hoteam/p/Cache/git/raw/master/2017/1/3/1-54sPeC4dOjdLWdHlnVG1fQ.png)

项目上线的几天之后客户来消息说票卖完了，此时我们只需要更新下 Ticket-Component 中的文字即可，而不会影响更高或者更低层次的部分。

# Sketch

毫无疑问 Sketch 已经正为了 UI 设计与 UX 设计的潮流，我们也是在 Sketch 中定义了很多的文本样式、符号等等，这样会大大有利于整个基于组件的设计工作流，使我们更为方便地启动新项目。

![](https://coding.net/u/hoteam/p/Cache/git/raw/master/2017/1/3/1-77SqMm7XmH8gvLswYeOgBQ.png)

# 链接

- https://www.jianshu.com/p/13e87bf4f857
