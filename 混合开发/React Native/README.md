# React Native

目前我们常用的移动端应用开发方式主要为原生方式、混合开发这两种，其中原生开发运行效率高,流畅,用户体验好,可以做各种复杂的动画效果。不过我们需要去掌握不同开发平台上特定的开发语言与内建的组件框架，譬如在 Android 开发中开发者需要掌握 Java，而 iOS 开发中开发者需要掌握 Objective-C 或者 Swift；并且由于平台之间的独立性，代码无法在其他平台上运行,无法做到跨平台。而传统混合开发方式则以 Cordova 与 Ionic 为代表，定义好原生功能与 Web 界面之间的协议,拦截特定的 URL Schema 进行原生功能的调用，应用则调用 Web 提供的 JavaScript 方法，将数据回传给 Web 界面。这种方式可以满足一套代码到处运行的目标，不过受限于 UIWebView 等容器本身的限制，其性能体验与原生应用不可同日而语。实际上无论哪一种开发方式都致力于解决如下几个问题：找到一种能达到或者接近原生体验的开发方式、找到一种一套代码能在各个平台上运行,达到代码复用的目的、能够以热更新或者类似的方式进行快速问题修复。

随着 React 在 Web 领域取得的巨大成功，Facebook 继续推出 React Native 以创建接近原生性能的跨平台移动应用，其倡导的 Learn Once，Write Anywhere 的概念同时兼顾了性能与快速迭代的需求。React 的核心设计理念其提供了抽象的、平台无关的组件定义范式，然后通过 react-dom 等库将其渲染到不同的承载体上；这些承载可以是服务端渲染中的字符串，或者客户端渲染中的 DOM 节点。在 React Native 中，我们只需要了解 React 组件定义规范与语法，然后利用 React Native 这个新的渲染库将界面渲染到原生界面组件中。在未来的客户端开发中，负责与用户交互以及存储这一部分建议采用原生的代码，而对于逻辑控制这边，建议是采用 JavaScript 方式实现。

React Native 本质上是用 JSX 的语法风格编写原生的应用，它本质上还是跨平台编译性质的，并没有提供完整的类似于 WebView 那样的上下文，并且大量的 HTML 元素也是不可以直接应用的。React Native 只是借用了 HTML 的语法风格，并且提供了 JavaScript 与原生的桥接。React Native 使用了所谓的 Native Widget APIs 来调用底层的操作系统相关代码，并且处于性能的考虑它会异步批量地调用原生平台接口，其整体架构如下所示：

![](https://www.safaribooksonline.com/library/view/react-and-react/9781786465658/graphics/image_12_001.jpg)

# 快速开始

- Architecture(应用架构)

当使用 react-native 命令创建新的项目时，调用的即https://github.com/facebook/react-native/blob/master/react-native-cli/index.js这个脚本。当使用```react-native init HelloWorld```创建一个新的应用目录时，它会创建一个新的 HelloWorld 的文件夹，包含如下列表：

> HelloWorld.xcodeproj/
>
> Podfile
>
> iOS/
>
> Android/
>
> index.ios.js
>
> index.android.js
>
> node_modules/
>
> package.json

React Native 最大的卖点在于(1)可以使用 JavaScript 编写 iOS 或者 Android 原生程序。(2)应用可以运行在原生环境下并且提供流畅的 UI 与用户体验。众所周知，iOS 或者 Android 并不能直接运行 JavaScript 代码，而是依靠类似于 UIWebView 这样的原生组件去运行 JavaScript 代码，也就是传统的混合式应用。整个应用运行开始还是自原生开始，不过类似于 Objective-C/Java 这样的原生代码只是负责启动一个 WebView 容器，即没有浏览器界面的浏览器引擎。

而对于 React Native 而言，并不需要一个 WebView 容器去执行 Web 方面的代码，而是将所有的 JavaScript 代码运行在一个内嵌的 JavaScriptCore 容器实例中，并最终渲染为高级别的平台相关的组件。这里以 iOS 为例，打开 HelloWorld/AppDelegate.m 文件，可以看到如下的代码：

```objective-c
.....................
RCTRootView *rootView = [[RCTRootView alloc]
initWithBundleURL:jsCodeLocation
moduleName:@"HelloWorld"
launchOptions:launchOptions];
.....................
```

AppDelegate.m 文件本身是 iOS 程序的入口，相信每一个有 iOS 开发经验的同学都不会陌生，这也是本地的 Objective-C 代码与 React Native 的 JavaScript 代码胶合的地方。而这种胶合的关键就是 RCTRootView 这个组件，可以从 React 声明的组件中加载到 Native 的组件。RCTRootView 组件是一个由 React Native 提供的原生的 Objective-C 类，可以读取 React 的 JavaScript 代码并且执行，除此之外，也允许我们从 JavaScript 代码中调用 iOS UI 的组件。

到这里我们可以看出，React Native 并没有将 JavaScript 代码编译转化为原生的 Objective-C 或者 Swift 代码，但是这些在 React 中创建的组件渲染的方式也非常类似于传统的 Objective-C 或者 Swift 创建的基于 UIKit 的组件，并不是类似于 WebView 中网页渲染的结果。

这种架构也就很好地解释了为什么可以动态加载我们的应用，当我们仅仅改变了 JS 代码而没有原生的代码改变的时候，不需要去重新编译。RCTRootView 组件会监听`Command+R`组合键然后重新执行 JavaScript 代码。

- Virtual Dom 的扩展

Virtual Dom 是 React 的核心机制之一，对于 Virtual Dom 的详细说明可以参考笔者 React 系列文章。在 React 组件被用于原生渲染之前，Clipboard 已经将 React 用于渲染到 HTML 的 Canvas 中，可以查看[render React to the HTML element](https://github.com/Flipboard/react-canvas)这篇文章。对于 React Web 而言，就是将 React 组件渲染为 DOM 节点，而对于 React Natively 而言，就是利用原生的接口把 React 组件渲染为原生的接口，其大概示意图可以如下：

![React Native behaves much like React, but can render to many different targets.](https://www.safaribooksonline.com/library/view/learning-react-native/9781491929049/assets/render-targets.png)

虽然 React 最初是以 Web 的形式呈现，但是 React 声明的组件可以通过*bridge*，即不同的桥接器转化器会将同样声明的组件转化为不同的具体的实现。React 在组件的 render 函数中返回具体的平台中应该如何去渲染这些组件。对于 React Native 而言，`<View/>`这个组件会被转化为 iOS 中特定的`UIView`组件。

- 载入 JavaScript 代码

React Native 提供了非常方便的动态调试机制，具体的表现而言即是允许以一种类似于中间件服务器的方式动态的加载 JS 代码，即

```objective-c
jsCodeLocation = [NSURL URLWithString:@"http://localhost:8081/index.ios.bundle"];
```

另一种发布环境下，可以将 JavaScript 代码打包编译，即`npm build`：

```objective-c
jsCodeLocation = [[NSBundle mainBundle] URLForResource:@"main" withExtension:@"jsbundle"];
```

如果在 Xcode 中直接运行程序会自动调用`npm start`命令来启动一个动态编译的服务器，如果没有自动启动可以手动的使用`npm start`命令，就如定义在 package.json 文件中的，它会启动 node_modules/react-native/packager/packager.sh 这个脚本。

### React Native 中的现代 JavaScript 代码

从上文中可以看出，React Native 中使用的是所谓的 JSX 以及大量的 ES6 的语法，在打包器打包之前需要将 JavaScript 代码进行一些转换。这是因为 iOS 与 Android 中的 JavaScript 解释器目前主要还是支持到了 ES5 版本，并不能完全识别 React Native 中提供的语法或者关键字。当然，并不是说我们不能使用 ES5 的语法去编写 React Native 程序，只是最新的一些语法细则规范可以辅助我们快速构建高可维护的应用程序。

譬如我们以 JSX 的语法编写了如下渲染函数：

```js
render: function() {
  return (
    <View style={styles.container}>
      <TextInput
      style={styles.nameInput}
      onChange={this.onNameChanged}
      placeholder='Who should be greeted?'/>
      <Text style={styles.welcome}>
      Hello, {this.state.name}!</Text>
      <Text style={styles.instructions}>
      To get started, edit index.ios.js
      </Text>
      <Text style={styles.instructions}>
      Press Cmd+R to reload,{'\n'}
      Cmd+Control+Z for dev menu
      </Text>
    </View>
  );
}
```

在 JS 代码载入之前，React 打包器需要首先将 JSX 语法转化为 ES5 的表达式：

```js
render: function() {
  return (
  	React.createElement(View, {style: styles.container},
    React.createElement(TextInput, {
    style: styles.nameInput,
    onChange: this.onNameChanged,
    placeholder: "Who should be greeted?"}),
    React.createElement(Text, {style: styles.welcome},
    "Hello, ", this.state.name, "!"),
    React.createElement(Text, {style: styles.instructions},
    "To get started, edit index.ios.js"
    ),
    React.createElement(Text, {style: styles.instructions},
    "Press Cmd+R to reload,", '\n',
    "Cmd+Control+Z for dev menu"
    )
  )
);
}
```

另一些比较常用的语法转换，一个是模块导入时候的结构器，即我们常常见到模块导入：

```js
var React = require("react-native");
var { AppRegistry, StyleSheet, Text, TextInput, View } = React;
```

上文中的用法即是所谓的解构赋值，一个简单的例子如下：

```js
var fruits = { banana: "A banana", orange: "An orange", apple: "An apple" };
var { banana, orange, apple } = fruits;
```

那么我们在某个组件中进行导出的时候，就可以用如下语法：

```js
module.exports.displayName = "Name";
module.exports.Component = Component;
```

而导入时，即是：

```js
var { Component } = require("component.js");
```

另一个常用的 ES6 的语法即是所谓的 Arrow Function，这有点类似于 Lambda 表达式：

```js
AppRegistry.registerComponent("HelloWorld", () => HelloWorld);
```

会被转化为：

```js
AppRegistry.registerComponent("HelloWorld", function () {
  return HelloWorld;
});
```

RN 需要一个 JS 的运行环境，在 IOS 上直接使用内置的 javascriptcore，在 Android 则使用 webkit.org 官方开源的 jsc.so。此外还集成了其他开源组件，如 fresco 图片组件，okhttp 网络组件等。

RN 会把应用的 JS 代码(包括依赖的 framework)编译成一个 js 文件(一般命名为 index.android.bundle), , RN 的整体框架目标就是为了解释运行这个 js 脚本文件，如果是 js 扩展的 API，则直接通过 bridge 调用 native 方法; 如果是 UI 界面，则映射到 virtual DOM 这个虚拟的 JS 数据结构中，通过 bridge 传递到 native ，然后根据数据属性设置各个对应的真实 native 的 View。bridge 是一种 JS 和 Java 代码通信的机制，用 bridge 函数传入对方 module 和 method 即可得到异步回调的结果。

对于 JS 开发者来说，画 UI 只需要画到 virtual DOM 中，不需要特别关心具体的平台, 还是原来的单线程开发，还是原来 HTML 组装 UI(JSX)，还是原来的样式模型(部分兼容 )。RN 的界面处理除了实现 View 增删改查的接口之外，还自定义一套样式表达 CSSLayout，这套 CSSLayout 也是跨平台实现。RN 拥有画 UI 的跨平台能力，主要是加入 Virtual DOM 编程模型，该方法一方面可以照顾到 JS 开发者在 html DOM 的部分传承，让 JS 开发者可以用类似 DOM 编程模型就可以开发原生 APP ，另一方面则可以让 Virtual DOM 适配实现到各个平台，实现跨平台的能力，并且为未来增加更多的想象空间，比如 react-cavas, react-openGL。而实际上 react-native 也是从 react-js 演变而来。

对于 Android 开发者来说，RN 是一个普通的安卓程序加上一堆事件响应，事件来源主要是 JS 的命令。主要有二个线程，UI main thread, JS thread。UI thread 创建一个 APP 的事件循环后，就挂在 looper 等待事件 , 事件驱动各自的对象执行命令。JS thread 运行的脚本相当于底层数据采集器，不断上传数据，转化成 UI 事件，通过 bridge 转发到 UI thread, 从而改变真实的 View。后面再深一层发现，UI main thread 跟 JS thread 更像是 CS 模型，JS thread 更像服务端，UI main thread 是客户端，UI main thread 不断询问 JS thread 并且请求数据，如果数据有变，则更新 UI 界面。

![](https://unbug.gitbooks.io/react-native-training/content/21.jpg)

![](https://unbug.gitbooks.io/react-native-training/content/Pasted%20Graphic.jpg)

# 利用 Create React Native App 快速创建 React Native 应用

[Create React Native App](https://github.com/react-community/create-react-native-app) 是由 Facebook 与 [Expo](https://expo.io/) 联合开发的用于快速创建 React Native 应用的工具，其深受我们在前文介绍的 [Create React App](https://github.com/facebookincubator/create-react-app) 的影响。很多没有移动端开发经验的 Web 开发者在初次尝试 React Native 应用开发时可能会困扰于大量的原生依赖与开发环境，特别对于 Android 开发者而言。而 Create React Native App 则能够让用户在未安装 Xcode 或者 Android Studio 时，即使是在 Linux 或者 Windows 环境下也能开始 React Native 的开发与调试。这一点主要基于我们可以选择将应用运行在 Expo 的客户端应用内，该应用能够加载远端的纯粹的 JavaScript 代码而不用进行任何的原生代码编译操作。我们可以使用 NPM 快速安装命令行工具：

```
$ npm i -g create-react-native-app
$ create-react-native-app my-project
$ cd my-project
$ npm start
```

命令行中会输出如下界面，我们可以在 Expo 移动端应用中扫描二维码，即可以开始远程调试。我们也可以选择使用 Expo 的桌面端辅助开发工具 [XDE](https://github.com/exponent/xde) ，其内置了命令行工具与发布工具，同时支持使用内部模拟器：
![](https://docs.expo.io/bb256105106a86d5d9484892e82f94f3-quality=50&pngCompressionLevel=9&width=2128.png)

除此之外，Expo 还提供了 [Sketch](https://sketch.expo.io/Sk90tMVol) 这个在线编辑器，提供了组件拖拽、内建的 ESLint 等功能，允许开发者直接在网页中进行快速开发与共享，然后通过二维码在应用内预览。

Expo 支持标准的 React Native 组件，目前已经内置了相机、视频、通讯录等等常用的系统 API，并且预置了 Airbnb react-native-maps、Facebook authentication 等优秀的工具库，未来也在逐步将常用的微信、百度地图等依赖作为预置纳入到 SDK 中。我们也可以使用 `npm run eject` 来将其恢复为类似于 `react-native init` 创建的包含原生代码的初始化项目，这样我们就能够自由地添加原生模块。我们也可以使用 Expo 提供的 `exp` 命令行将项目编译为独立可发布的应用。我们需要使用 `npm install -g exp` 安装命令行工具，然后配置 exp.json 文件：

```
 {
   name: "Playground",
   icon: "https://s3.amazonaws.com/exp-us-standard/rnplay/app-icon.png",
   version: "2.0.0",
   slug: "rnplay",
   sdkVersion: "8.0.0",
   ios: {
     bundleIdentifier: "org.rnplay.exp",
   },
   android: {
     package: "org.rnplay.exp",
   }
 }
```

配置完毕之后在应用目录内使用 `exp start` 命令来启动 Expo 打包工具，然后选择使用 `exp build:android` 或者 `exp build:ios` 分别构建 Android 或者 iOS 独立应用。

除此之外，我们还可以使用 [PepperoniAppKit](https://github.com/futurice/pepperoni-app-kit) ，或者[Deco](https://www.decosoftware.com)

# 开发第一个应用程序

在安装 React Native 开发环境时官方就推荐了 Flow 作为开发辅助工具，Flow 是一个用于静态类型检查的 JavaScript 的开发库。Flow 依赖于类型推导来检测代码中可能的类型错误，并且允许逐步向现存的项目中添加类型声明。如果需要使用 Flow，只需要用如下的命令：

```
flow check
```

一般情况下默认的应用中都会包含一个*.flowconfig*文件，用于配置 Flow 的行为。如果不希望 flow 检查全部的文件，可以在*.flowconfig*文件中添加配置进行忽略：

```
[ignore]
.*/node_modules/.*
```

最终检查的时候就可以直接运行：

```shell
$ flow check
$ Found 0 errors.
```

React Native 支持使用 Jest 进行 React 组件的测试，Jest 是一个基于 Jasmine 的单元测试框架，它提供了自动的依赖 Mock，并且与 React 的测试工具协作顺利。

```
npm install jest-cli --save-dev
```

可以将 test 脚本加入到 package.son 文件中：

```js
{
  ...
  "scripts": {
    "test": "jest"
   }
   ...
}
```

直接使用*npm test*命令直接运行 jest 命令，下面可以创建 tests 文件夹，Jest 会递归搜索 tests 目录中的文件，这些测试文件中的代码如下：

```js
"use strict";

describe("a silly test", function () {
  it("expects true to be true", function () {
    expect(true).toBe(true);
  });
});
```

而对于一些复杂的应用可以查看 React Native 的官方文档，以其中一个 getImageSource 为例：

```js
**
 * Taken from https://github.com/facebook/react-native/blob/master/Examples/Movies/__tests__/getImageSource-test.js
 */

'use strict';

jest.dontMock('../getImageSource');
var getImageSource = require('../getImageSource');

describe('getImageSource', () => {
  it('returns null for invalid input', () => {
    expect(getImageSource().uri).toBe(null);
  });
  ...
});
```

因为 Jest 是默认自动 Mock 的，所以需要对待测试的方法设置 dontMock.
