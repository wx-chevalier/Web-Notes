# Bridge

# RCTRootView

RCTRootView 是 React Native 加载的地方,是万物之源。从这里开始，我们有了 JS Engine, JS 代码被加载进来，对应的原生模块也被加载进来，然后 js loop 开始运行。js loop 的驱动来源是 Timer 和 Event Loop(用户事件). js loop 跑起来以后应用就可以持续不停地跑下去了。

如果你要通过调试来理解 RN 底层原理，你也应该是从 RCTRootView 着手，顺藤摸瓜。

每个项目的 AppDelegate.m 的- (BOOL)application:didFinishLaunchingWithOptions:里面都可以看到 RCTRootView 的初始化代码，RCTRootView 初始化完成以后，整个 React Native 运行环境就已经初始化好了，JS 代码也加载完毕，所有 React 的绘制都会有这个 RCTRootView 来管理。

RCTRootView 做的事情如下:

创建并且持有 RCTBridge
加载 JS Bundle 并且初始化 JS 运行环境.
初始化 JS 运行环境的时候在 App 里面显示 loadingView, 注意不是屏幕顶部的那个下拉悬浮进度提示条. RN 第一次加载之后每次启动非常快，很少能意识到这个加载过程了。loadingView 默认情况下为空, 也就是默认是没有效果的。loadingView 可以被自定义，直接覆盖 RCTRootView.loadingView 就可以了.开发模式下 RN app 第一次启动因为需要完整打包整个 js 所以可以很明显看到加载的过程，加载第一次以后就看不到很明显的加载过程了，可以执行下面的命令来触发重新打包整个 js 来观察 loadingView 的效果 `watchman watch-del-all && rm -rf node_modules/ && yarn install && yarn start – –reset-cache`, 然后杀掉 app 重启你就会看到一个很明显的进度提示.
JS 运行环境准备好以后把加载视图用 RCTRootContentView 替换加载视图.
所有准备工作就绪以后调用 AppRegistry.runApplication 正式启动 RN JS 代码，从 Root Component()开始 UI 绘制。
一个 App 可以有多个 RCTRootView, 初始化的时候需要手动传输 Bridge 做为参数，全局可以有多个 RCTRootView, 但是只能有一个 Bridge.

如果你做过 React Native 和原生代码混编，你会发现混编就是把 AppDelegate 里面那段初始化 RCTRootView 的代码移动到需要混编的地方，然后把 RCTRootView 做为一个普通的 subview 来加载到原生的 view 里面去，非常简单。不过这地方也要注意处理好单 Bridge 实例的问题，同时，混编里面要注意 RCTRootView 如果销毁过早可能会引发 JS 回调奔溃的问题。

# RCTRootContentView

RCTRootContentView reactTag 在默认情况下为 1. 在 Xcode view Hierarchy debugger 下可以看到，最顶层为 RCTRootView, 里面嵌套的是 RCTRootContentView, 从 RCTRootContentView 开始，每个 View 都有一个 reactTag.

RCTRootView 继承自 UIView, RCTRootView 主要负责初始化 JS Environment 和 React 代码，然后管理整个运行环境的生命周期。RCTRootContentView 继承自 RCTView, RCTView 继承自 UIView, RCTView 封装了 React Component Node 更新和渲染的逻辑，RCTRootContentView 会管理所有 react ui components. RCTRootContentView 同时负责处理所有 touch 事件.

# RCTBridge

这是一个加载和初始化专用类，用于前期 JS 的初始化和原生代码的加载。

负责加载各个 Bridge 模块供 JS 调用
找到并注册所有实现了 RCTBridgeModule protocol 的类, 供 JS 后期使用.
创建和持有 RCTBatchedBridge
RCTBatchedBridge
如果 RCTBridge 是总裁, 那么 RCTBatchedBridge 就是副总裁。前者负责发号施令，后者负责实施落地。

负责 Native 和 JS 之间的相互调用(消息通信)
持有 JSExecutor
实例化所有在 RCTBridge 里面注册了的 native node_modules
创建 JS 运行环境, 注入 native hooks 和 modules, 执行 JS bundle script
管理 JS run loop, 批量把所有 JS 到 native 的调用翻译成 native invocations
批量管理原生代码到 JS 的调用，把这些调用翻译成 JS 消息发送给 JS executor

# RCTJavaScriptLoader

这是实现远程代码加载的核心。热更新，开发环境代码加载，静态 jsbundle 加载都离不开这个工具。

从指定的地方(bundle, http server)加载 script bundle
把加载完成的脚本用 string 的形式返回
处理所有获取代码、打包代码时遇到的错误
RCTContextExecutor
封装了基础的 JS 和原生代码互掉和管理逻辑，是 JS 引擎切换的基础。通过不同的 RCTCOntextExecutor 来适配不同的 JS Engine，让我们的 React JS 可以在 iOS、Android、chrome 甚至是自定义的 js engine 里面执行。这也是为何我们能在 chrome 里面直接调试 js 代码的原因。

管理和执行所有 N2J 调用

# RCTModuleData

加载和管理所有和 JS 有交互的原生代码。把需要和 JS 交互的代码按照一定的规则自动封装成 JS 模块。

收集所有桥接模块的信息，供注入到 JS 运行环境

# RCTModuleMethod

记录所有原生代码的导出函数地址(JS 里面是不能直接持有原生对象的)，同时生成对应的字符串映射到该函数地址。JS 调用原生函数的时候会通过 message 的形式调用过来。

记录所有的原生代码的函数地址，并且生成对应的字符串映射到该地址
记录所有的 block 的地址并且映射到唯一的一个 id
翻译所有 J2N call，然后执行对应的 native 方法。
如果是原生方法的调用则直接通过方法名调用，MessageQueue 会帮忙把 Method 翻译成 MethodID, 然后转发消息给原生代码，传递函数签名和参数给原生 MessageQueue, 最终给 RCTModuleMethod 解析调用最终的方法
如果 JS 调用的是一个回调 block，MessageQueue 会把回调对象转化成一个一次性的 block id, 然后传递给 RCTModuleMethod, 最终由 RCTModuleMethod 解析调用。基本上和方法调用一样，只不过生命周期会不一样，block 是动态生成的，要及时销毁，要不然会导致内存泄漏。
注:

实际上是不存在原生 MessageQueue 对象模块的，JS 的 MessageQueue 对应到原生层就是 RCTModuleData & RCTModuleMethod 的组合, MessageQueue 的到原生层的调用先经过 RCTModuleData 和 RCTModuleMethod 翻译成原生代码调用，然后执行.
