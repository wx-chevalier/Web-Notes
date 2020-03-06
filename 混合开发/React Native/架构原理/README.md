# React Native 架构原理

React Native 是一个跨平台开发框架，允许开发人员使用 Javascript 构建原生应用程序。RN 和基于 Cordova 的应用程序之间的主要区别在于：基于 Cordova 的应用程序在 Webview 中运行，而 RN 应用程序使用原生视图进行渲染；RN 应用程序可以直接访问底层移动操作系统提供的所有 Native API 和视图，因此具有与本机应用程序相同的开发体验和性能表现。

React Native 并没有直接将 JS 代码编译到相应的本机代码中，因为 Java 和 Objective C 是强类型语言，而 Javascript 则不是。本质上，React Native 可以被视为一组 React 组件，其中每个组件代表相应的本机视图和组件；例如，TextInput 将具有相应的 RN 组件，该组件可以直接导入到 JS 代码中，并像任何其他 React 组件一样使用。因此，开发人员将像编写任何其他 React Web 应用程序一样编写代码，但输出将是原生应用程序。

# 架构概览

React Native 的 iOS 与 Android 版本的架构大同小异，可以认为大体包含以下三个模块：Native Code/Modules, JavaScript VM, Bridge。

[![image.png](https://i.postimg.cc/6q2TyxV7/image.png)](https://postimg.cc/64KBmSmw)

## Native Code/Modules

这是应用程序启动后立即生成的主要线程。它加载应用程序并启动 JS 线程来执行 Javascript 代码。本机线程还会侦听 UI 事件，例如“press”，“touch”等。然后，这些事件将通过 RN Bridge 传递给 JS 线程。一旦 Javascript 加载，JS 线程就会将需要呈现的内容的信息发送到屏幕上。阴影节点线程使用此信息来计算布局。影子线程基本上就像一个数学引擎，最终决定如何计算视图位置。然后将这些指令传递回主线程以呈现视图。

除了由 React Native 生成的线程之外，我们还可以在我们构建的自定义本机模块上生成线程，以加快应用程序的性能。例如 - 动画由 React Native 在一个单独的本机线程中处理，以从 JS 线程卸载工作。

## JavaScript VM

运行所有 JavaScript 代码的 JS 虚拟机。在 iOS / Android 模拟器和设备上，React Native 使用 JavaScriptCore，它是为 Safari 提供支持的 JavaScript 引擎。JavaScriptCore 是一个最初为 WebKit 构建的开源 JavaScript 引擎。对于 iOS，React Native 使用 iOS 平台提供的 JavaScriptCore。它首先在 iOS 7 中与 OS X Mavericks 一起推出。

在 Android 的情况下，React Native 将 JavaScriptCore 与应用程序捆绑在一起。这会增加应用程序的大小。因此，对于 Android，RN 的 Hello World 应用程序将需要大约 3 到 4 兆字节。

在 Chrome 调试模式的情况下，JavaScript 代码在 Chrome 本身（而不是设备上的 JavaScriptCore）中运行，并通过 WebSocket 与本机代码通信。在这里，它将使用 V8 引擎。这样，我们就可以看到有关 Chrome 调试工具的大量信息，例如网络请求，控制台日志等。

Javascript Queue 是主捆绑 JS 线程运行的线程队列。JS 线程运行所有业务逻辑。

[![image.png](https://i.postimg.cc/50j2RWRP/image.png)](https://postimg.cc/HcDmrRH5)

## Bridge

[![image.png](https://i.postimg.cc/VspRfjX6/image.png)](https://postimg.cc/gryR4LSF)

Bridge 的作用就是给 RN 内嵌的 JS Engine 提供原生接口的扩展供 JS 调用。所有的本地存储、图片资源访问、图形图像绘制、3D 加速、网络访问、震动效果、NFC、原生控件绘制、地图、定位、通知等都是通过 Bridge 封装成 JS 接口以后注入 JS Engine 供 JS 调用。理论上，任何原生代码能实现的效果都可以通过 Bridge 封装成 JS 可以调用的组件和方法, 以 JS 模块的形式提供给 RN 使用。

每一个支持 RN 的原生功能必须同时有一个原生模块和一个 JS 模块，JS 模块是原生模块的封装，方便 Javascript 调用其接口。Bridge 会负责管理原生模块和对应 JS 模块之间的沟通, 通过 Bridge, JS 代码能够驱动所有原生接口，实现各种原生酷炫的效果。RN 中 JS 和 Native 分隔非常清晰，JS 不会直接引用 Native 层的对象实例，Native 也不会直接引用 JS 层的对象实例(所有 Native 和 JS 互掉都是通过 Bridge 层会几个最基础的方法衔接的)。

Bridge 原生代码负责管理原生模块并生成对应的 JS 模块信息供 JS 代码调用。每个功能 JS 层的封装主要是针对 ReactJS 做适配，让原生模块的功能能够更加容易被用 ReactJS 调用。MessageQueue.js 是 Bridge 在 JS 层的代理，所有 JS2N 和 N2JS 的调用都会经过 MessageQueue.js 来转发。JS 和 Native 之间不存在任何指针传递，所有参数都是字符串传递。所有的 instance 都会被在 JS 和 Native 两边分别编号，然后做一个映射,然后那个数字/字符串编号会做为一个查找依据来定位跨界对象。

# Fabric

React Native 团队目前正在研究 React Native 的新架构。新架构的代号为 Fabric，允许 React Native 以同步方式执行高优先级 UI 更新。这意味着 UI 在某些边缘情况下（例如滚动视图）会更具响应性。要了解 Fabric 是什么以及它将如何改善 React Native 体验，请观看 Parashuram N 在 React Conf 2018 上的精彩演讲。
