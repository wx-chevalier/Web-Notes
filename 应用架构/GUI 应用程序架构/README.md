![](https://i.postimg.cc/JnFfmhFf/image.png)

# GUI 应用程序架构

> **Make everything as simple as possible, but not simpler — Albert Einstein**

Graphical User Interfaces 一直是软件开发领域的重要组成部分，从当年的 MFC，到 WinForm/Java Swing，再到 WebAPP/Android/iOS 引领的智能设备潮流，以及未来可能的 AR/VR，GUI 应用开发中所面临的问题一直在不断演变，但是从各种具体问题中抽象而出的可以复用的模式恒久存在。

GUI 架构核心即是对于对于富客户端的**代码组织/职责划分**。纵览这十年内的架构模式变迁，大概可以分为 `MV*` 与 Unidirectional 两大类，而 Clean Architecture 则是以严格的层次划分独辟蹊径。从笔者的认知来看，从 MVC 到 MVP 的变迁完成了对于 View 与 Model 的解耦合，改进了职责分配与可测试性。而从 MVP 到 MVVM，添加了 View 与 ViewModel 之间的数据绑定，使得 View 完全的无状态化。最后，整个从 `MV*` 到 Unidirectional 的变迁即是采用了消息队列式的数据流驱动的架构，并且以 Redux 为代表的方案将原本 `MV*` 中碎片化的状态管理变为了统一的状态管理，保证了状态的有序性与可回溯性。

![](https://i.postimg.cc/tTs5SKXy/image.png)

# 架构思维

当我们谈论所谓客户端开发的时候，我们首先会想到怎么保证向后兼容、怎么使用本地存储、怎么调用远程接口、如何有效地利用内存 / 带宽 /CPU 等资源，不过最核心的还是怎么绘制界面并且与用户进行交互。而当我们提纲挈领、高屋建瓴地以一个较高的抽象的视角来审视总结这个知识点的时候会发现，我们希望的好的架构，便如在引言中所说，即是有好的代码组织方式 / 合理的职责划分粒度。笔者脑中会出现如下这样的一个层次结构，可以看出，最核心的即为 View 与 ViewLogic 这两部分:

![](https://coding.net/u/hoteam/p/Cache/git/raw/master/2016/7/1/27259D5F-DF43-455C-8BBB-D4BC81E1C865.png)

实际上，对于富客户端的**代码组织/职责划分**，从具体的代码分割的角度，即是**功能的模块化**、**界面的组件化**、**状态管理**这三个方面。最终呈献给用户的界面，笔者认为可以抽象为如下等式：`View=f(State,Template)`。而 ViewLogic 中对于类 / 模块之间的依赖关系，即属于代码组织，譬如 MVC 中的 View 与 Controller 之间的从属关系。而对于动态数据，即所谓应用数据的管理，属于状态管理这一部分，譬如 APP 从后来获取了一系列的数据，如何将这些数据渲染到用户界面上使得用户可见，这样的不同部分之间的协同关系、整个数据流的流动，即属于状态管理。

## 不断衍化的架构

兵无常势，水无常形。实际上从 MVC、MVP 到 MVVM，一直围绕的核心问题就是如何分割 ViewLogic 与 View，即如何将负责界面展示的代码与负责业务逻辑的代码进行分割。所谓分久必合，合久必分，从笔者自我审视的角度，发现很有趣的一点。Android 与 iOS 中都是从早期的用代码进行组件添加与布局到专门的 XML/Nib/StoryBoard 文件进行布局，Android 中的 Annotation/DataBinding、iOS 中的 IBOutlet 更加地保证了 View 与 ViewLogic 的分割 ( 这一点也是从元素操作到以数据流驱动的变迁，我们不需要再去编写大量的 `findViewById`。而 Web 的趋势正好有点相反，无论是 WebComponent 还是 ReactiveComponent 都是将 ViewLogic 与 View 置于一起，特别是 JSX 的语法将 JavaScript 与 HTML 混搭，很像当年的 PHP/JSP 与 HTML 混搭。这一点也是由笔者在上文提及的 Android/iOS 本身封装程度较高的、规范的 API 决定的。对于 Android/iOS 与 Web 之间开发体验的差异，笔者感觉很类似于静态类型语言与动态类型语言之间的差异。(注：使用 TypeScript 与 Flow 同样能为 Web 开发引入静态类型语言的优势)

## 功能的模块化

老实说在 AMD/CMD 规范之前，或者说在 ES6 的模块引入与 Webpack 的模块打包出来之前，功能的模块化依赖一直也是个很头疼的问题。SOLID 中的接口隔离原则，大量的 IOC 或者 DI 工具可以帮我们完成这一点，就好像 Spring 中的 @Autowire 或者 Angular 1 中的 @Injection，都给笔者很好地代码体验。在这里笔者首先要强调下，从代码组织的角度来看，项目的构建工具与依赖管理工具会深刻地影响到代码组织，这一点在功能的模块化中尤其显著。譬如笔者对于 Android/Java 构建工具的使用变迁经历了从 Eclipse 到 Maven 再到 Gradle，笔者会将不同功能逻辑的代码封装到不同的相对独立的子项目中，这样就保证了子项目与主项目之间的一定隔离，方便了测试与代码维护。同样的，在 Web 开发中从 AMD/CMD 规范到标准的 ES6 模块与 Webpack 编译打包，也使得代码能够按照功能尽可能地解耦分割与避免冗余编码。而另一方面，依赖管理工具也极大地方便我们使用第三方的代码与发布自定义的依赖项，譬如 Web 中的 NPM 与 Bower，iOS 中的 CocoaPods 都是十分优秀的依赖发布与管理工具，使我们不需要去关心第三方依赖的具体实现细节即能够透明地引入使用。因此选择合适的项目构建工具与依赖管理工具也是好的 GUI 架构模式的重要因素之一。不过从应用程序架构的角度看，无论我们使用怎样的构建工具，都可以实现或者遵循某种架构模式，笔者认为二者之间也并没有必然的因果关系。

## 界面的组件化与无状态组件

> A component is a small piece of the user interface of our application, a view, that can be composed with other components to make more advanced components.

何谓组件？一个组件即是应用中用户交互界面的部分组成，组件可以通过组合封装成更高级的组件。组件可以被放入层次化的结构中，即可以是其他组件的父组件也可以是其他组件的子组件。根据上述的组件定义，笔者认为像 Activity 或者 UIViewController 都不能算是组件，而像 ListView 或者 UITableView 可以看做典型的组件。

![](https://coding.net/u/hoteam/p/Cache/git/raw/master/2016/7/1/1-k33db-Hx1gRRSxR_LMprMQ.png)

我们强调的是界面组件的 Composable&Reusable，即可组合性与可重用性。当我们一开始接触到 Android 或者 iOS 时，因为本身 SDK 的完善度与规范度较高，我们能够很多使用封装程度较高的组件。譬如 ListView，无论是 Android 中的 RecycleView 还是 iOS 中的 UITableView 或者 UICollectionView，都为我们提供了。凡事都有双面性，这种较高程度的封装与规范统一的 API 方便了我们的开发，但是也限制了我们自定义的能力。同样的，因为 SDK 的限制，真正意义上可复用 / 组合的组件也是不多，譬如你不能将两个 ListView 再组合成一个新的 ListView。在 React 中有所谓的 controller-view 的概念，即意味着某个 React 组件同时担负起 MVC 中 Controller 与 View 的责任，也就是 JSX 这种将负责 ViewLogic 的 JavaScript 代码与负责模板的 HTML 混编的方式。界面的组件化还包括一个重要的点就是路由，譬如 Android 中的[AndRouter](https://github.com/campusappcn/AndRouter)、iOS 中的[JLRoutes](https://github.com/joeldev/JLRoutes)都是集中式路由的解决方案，不过集中式路由在 Android 或者 iOS 中并没有大规模推广。iOS 中的 StoryBoard 倒是类似于一种集中式路由的方案，不过更偏向于以 UI 设计为核心。笔者认为这一点可能是因为 Android 或者 iOS 本身所有的代码都是存放于客户端本身，而 Web 中较传统的多页应用方式还需要用户跳转页面重新加载，而后在单页流行之后即不存在页面级别的跳转，因此在 Web 单页应用中集中式路由较为流行而 Android、iOS 中反而不流行。

无状态的组件的构建函数是纯函数 (pure function) 并且引用透明的 (refferentially transparent)，在相同输入的情况下一定会产生相同的组件输出，即符合 `View=f(State,Template)` 公式。笔者觉得 Android 中的 ListView/RecycleView，或者 iOS 中的 UITableView，也是无状态组件的典型。譬如在 Android 中，可以通过动态设置 Adapter 实例来为 RecycleView 进行源数据的设置，而作为 View 层以 IoC 的方式与具体的数据逻辑解耦。组件的可组合性与可重用性往往最大的阻碍就是状态，一般来说，我们希望能够重用或者组合的组件都是 Generalization，而状态往往是 Specification，即领域特定的。同时，状态也会使得代码的可读性与可测试性降低，在有状态的组件中，我们并不能通过简单地阅读代码就知道其功能。如果借用函数式编程的概念，就是因为副作用的引入使得函数每次回产生不同的结果。函数式编程中存在着所谓 Pure Function，即纯函数的概念，函数的返回值永远只受到输入参数的影响。譬如 `(x)⇒x⋅2` 这个函数，输入的 x 值永远不会被改变，并且返回值只是依赖于输入的参数。而 Web 开发中我们也经常会处于带有状态与副作用的环境，典型的就是 Browser 中的 DOM，之前在 jQuery 时代我们会经常将一些数据信息缓存在 DOM 树上，也是典型的将状态与模板混合的用法。这就导致了我们并不能控制到底应该何时去进行重新渲染以及哪些状态变更的操作才是必须的，

```js
var Header = component(function(data) {
  // First argument is h1 metadata
  return h1(null, data.text);
});

// Render the component to our DOM
render(Header({ text: 'Hello' }), document.body);

// Some time later, we change it, by calling the
// component once more.
setTimeout(function() {
  render(Header({ text: 'Changed' }), document.body);
}, 1000);
```

```js
var hello = Header({ text: 'Hello' });
var bye = Header({ text: 'Good Bye' });
```

## 状态管理

所谓可变的与不可预测的状态是软件开发中的万恶之源，我们尽可能地希望组件的无状态性，那么整个应用中的状态管理应该尽量地放置在所谓 High-Order Component 或者 Smart Component 中。在 React 以及 Flux 的概念流行之后，Stateless Component 的概念深入人心，不过其实对于 MVVM 中的 View，也是无状态的 View。通过双向数据绑定将界面上的某个元素与 ViewModel 中的变量相关联，笔者认为很类似于 HOC 模式中的 Container 与 Component 之间的关联。随着应用的界面与功能的扩展，状态管理会变得愈发混乱。这一点，无论前后端都有异曲同工之难。

# 架构模式

在漫长的 GUI 架构模式变迁过程中，很多概念其实是交错复杂，典型的譬如 MVP 与 MVVM 的区别，笔者按照自己的理解强行定义了二者的区分边界，不可避免的带着自己的主观想法。另外，鉴于笔者目前主要进行的是 Web 方面的开发，因此在整体倾向上是支持 Unidirectional Architecture 并且认为集中式的状态管理是正确的方向。但是必须要强调，GUI 架构本身是无法脱离其所依托的平台，下文笔者也会浅述由于 Android 与 iOS 本身 SDK API 的特殊性，生搬硬套其他平台的架构模式也是邯郸学步，沐猴而冠。不过总结而言，它山之石，可以攻玉，本身我们所处的开发环境一直在不断变化，对于过去的精华自当应该保留，并且与新的环境相互印证，触类旁通。

而这些模式也就是所谓应用架构的核心与基础。对于所谓应用架构，空谈误事，不谈误己，笔者相信不仅仅只有自己想把那一团糟的代码给彻底抛弃。往往对于架构的认知需要一定的大局观与格局眼光，每个有一定经验的客户端程序开发者，无论是 Web、iOS 还是 Android，都会有自己熟悉的开发流程习惯，但是笔者认为架构认知更多的是道，而非术。当你能够以一种指导思想在不同的平台上能够进行高效地开发时，你才能真正理解架构。这个有点像张三丰学武，心中无招，方才达成。笔者这么说只是为了强调，尽量地可以不拘泥于某个平台的具体实现去审视 GUI 应用程序架构模式，会让你有不一样的体验。譬如下面这个组装 Android 机器人的图:

![](http://luboganev.github.io/images/2015-07-21-clean-architecture-pt1/android_anatomy.jpg)

怎么去焊接两个组件，属于具体的术实现，而应该焊接哪两个组件就是术，作为合格的架构师总不能把脚和头直接焊接在一起，而忽略中间的连接模块。对于软件开发中任何一个方面，我们都希望能够寻找到一个抽象程度适中，能够在接下来的 4，5 年内正常运行与方便维护扩展的开发模式。目前在 GUI 架构模式中，无论是 Android、iOS 还是 Web，都在经历着从命令式编程到声明式 / 响应式编程，从 Passive Components 到 Reactive Components，从以元素操作为核心到以数据流驱动为核心的变迁。

我们先对一些概念进行阐述：

- User Events/ 用户事件 : 即是来自于可输入设备上的用户操作产生的数据，譬如鼠标点击、滚动、键盘输入、触摸等等。
- User Interface Rendering/ 用户界面渲染 :View 这个名词在前后端开发中都被广泛使用，为了明晰该词的含义，我们在这里使用用户渲染这个概念，来描述 View，即是以 HTML 或者 JSX 或者 XAML 等等方式在屏幕上产生的图形化输出内容。
- UI Application: 允许接收用户输入，并且将输出渲染到屏幕上的应用程序，该程序能够长期运行而不只是渲染一次即结束

# Passive Module & Reactive Module

箭头表示的归属权实际上也是 Passive Programming 与 Reactive Programming 的区别，譬如我们的系统中有 Foo 与 Bar 两个模块，可以把它们当做 OOP 中的两个类。如果我们在 Foo 与 Bar 之间建立一个箭头，也就意味着 Foo 能够影响 Bar 中的状态 :

![](https://coding.net/u/hoteam/p/Cache/git/raw/master/2016/7/2/5F14C7A2-9E84-40F4-BC6B-50FDAE97CB25.png)

譬如 Foo 在进行一次网络请求之后将 Bar 内部的计数器加一操作：

```js
// This is inside the Foo module
function onNetworkRequest() {
  // ...
  Bar.incrementCounter();
  // ...
}
```

在这里将这种逻辑关系可以描述为 Foo 拥有着网络请求完成之后将 Bar 内的计数器加一这个关系的控制权，也就是 Foo 占有主导性，而 Bar 相对而言是 Passive 被动的:

![](https://coding.net/u/hoteam/p/Cache/git/raw/master/2016/7/2/0790C8B2-0869-4468-9EF6-AA5DF9B2852E.png)

Bar 是 Passive 的，它允许其他模块改变其内部状态。而 Foo 是主动地，它需要保证能够正确地更新 Bar 的内部状态，Passive 模块并不知道谁会更新到它。而另一种方案就是类似于控制反转，由 Bar 完成对于自己内部状态的更新:

![](https://coding.net/u/hoteam/p/Cache/git/raw/master/2016/7/2/A17B8365-2A31-4F74-8B0A-8A3207F116AC.png)

在这种模式下，Bar 监听来自于 Foo 中的事件，并且在某些事件发生之后进行内部状态更新 :

```js
// This is inside the Bar module
Foo.addOnNetworkRequestListener(() => {
  self.incrementCounter(); // self is Bar
});
```

此时 Bar 就变成了 Reactive Module，它负责自己的内部的状态更新以响应外部的事件，而 Foo 并不知道它发出的事件会被谁监听。### Declarative & Imperative

形象地来描述命令式编程与声明式编程的区别，就好像 C#/JavaScript 与类似于 XML 或者 HTML 这样的标记语言之间的区别。命令式编程关注于`how to do what you want to do`，即事必躬亲，需要安排好每个要做的细节。而声明式编程关注于`what you want to do without worrying about how`，即只需要声明要做的事情而不用将具体的过程再耦合进来。对于开发者而言，声明式编程将很多底层的实现细节向开发者隐藏，而使得开发者可以专注于具体的业务逻辑，同时也保证了代码的解耦与单一职责。譬如在 Web 开发中，如果你要基于 jQuery 将数据填充到页面上，那么大概按照命令式编程的模式你需要这么做：

```js
var options = $('#options');
$.each(result, function() {
  options.append(
    $('<option />')
      .val(this.id)
      .text(this.name)
  );
});
```

而以 Angular 1 声明式的方式进行编写，那么是如下的标记模样：

```html
<div ng-repeat="item in items" ng-click="select(item)">{{item.name}}</div>
```

而在 iOS 和 Android 开发中，近年来函数响应式编程 (Functional Reactive Programming) 也非常流行，参阅笔者关于响应式编程的介绍可以了解，响应式编程本身是基于流的方式对于异步操作的一种编程优化，其在整个应用架构的角度看更多的是细节点的优化。以[RxSwift](https://github.com/ReactiveX/RxSwift)为例，通过响应式编程可以编写出非常优雅的用户交互代码：

```ts
let searchResults = searchBar.rx_text
    .throttle(0.3, scheduler: MainScheduler.instance)
    .distinctUntilChanged()
    .flatMapLatest { query -> Observable<[Repository]> in
        if query.isEmpty {
            return Observable.just([])
        }

        return searchGitHub(query)
            .catchErrorJustReturn([])
    }
    .observeOn(MainScheduler.instance)searchResults
    .bindTo(tableView.rx_itemsWithCellIdentifier("Cell")) {
        (index, repository: Repository, cell) in
        cell.textLabel?.text = repository.name
        cell.detailTextLabel?.text = repository.url
    }
    .addDisposableTo(disposeBag)
```

其直观的效果大概如下图所示:

![](https://raw.githubusercontent.com/kzaher/rxswiftcontent/master/GithubSearch.gif)

到这里可以看出，无论是从命令式编程与声明式编程的对比还是响应式编程的使用，我们开发时的关注点都慢慢转向了所谓的数据流。便如 MVVM，虽然它还是双向数据流，但是其使用的 Data-Binding 也意味着开发人员不需要再去以命令地方式寻找元素，而更多地关注于应该给绑定的对象赋予何值，这也是数据流驱动的一个重要体现。而 Unidirectional Architecture 采用了类似于 Event Source 的方式，更是彻底地将组件之间、组件与功能模块之间的关联交于数据流操控。

# 何谓好的架构

## Balanced Distribution of Responsibilities

合理的职责划分合理的职责划分即是保证系统中的不同组件能够被分配合理的职责，也就是在复杂度之间达成一个平衡，职责划分最权威的原则就是所谓 Single Responsibility Principle，单一职责原则。

## 可测试性（Testability）

可测试性是保证软件工程质量的重要手段之一，也是保证产品可用性的重要途径。在传统的 GUI 程序开发中，特别是对于界面的测试常常设置于状态或者运行环境，并且很多与用户交互相关的测试很难进行场景重现，或者需要大量的人工操作去模拟真实环境。

## 易用性（Ease of Use）

代码的易用性保证了程序架构的简洁与可维护性，所谓最好的代码就是永远不需要重写的代码，而程序开发中尽量避免的代码复用方法就是复制粘贴。

## 碎片化，易于封装与分发（Fractal）

> In fractal architectures, the whole can be naively packaged as a component to be used in some larger application.In non-fractal architectures, the non-repeatable parts are said to be orchestrators over the parts that have hierarchical composition.
>
> By André Staltz

所谓的 Fractal Architectures，即你的应用整体都可以像单个组件一样可以方便地进行打包然后应用到其他项目中。而在 Non-Fractal Architectures 中，不可以被重复使用的部分被称为层次化组合中的 Orchestrators。譬如你在 Web 中编写了一个登录表单，其中的布局、样式等部分可以被直接复用，而提交表单这个操作，因为具有应用特定性，因此需要在不同的应用中具有不同的实现。譬如下面有一个简单的表单：

```html
<form action="form_action.asp" method="get">
  <p>First name: <input type="text" name="fname" /></p>
  <p>Last name: <input type="text" name="lname" /></p>
  <input type="submit" value="Submit" />
</form>
```

因为不同的应用中，form 的提交地址可能不一致，那么整个 form 组件是不可直接重用的，即 Non-Fractal Architectures。而 form 中的 input 组件是可以进行直接复用的，如果将 input 看做一个单独的 GUI 架构，即是所谓的 Fractal Architectures，form 就是所谓的 Orchestrators，将可重用的组件编排组合，并且设置应用特定的一些信息。
