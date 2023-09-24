# Electron 小记

# 前言

第一次听到 Electron 这个技术大概是在 18、19 年的时候，当时觉得好神奇，以后 JSer 也可以写出客户端程序了。但是由于工作中用不到，个人项目中也没想到什么使用场景，所以跟着官方文档敲了遍 Demo 后也就不了了之了。

直到最近帮别人开发些小工具，才体会到这门技术的美。对于一些使用人数很少的项目，部署一套 Web 服务代价比较大，如果使用 Electron 开发，打包好程序后扔给对方一个压缩包就可以了，而且 Electron 还拥有与操作系统交互的能力，使得功能可以做的更强大。于是决定深入了解一下 Electron，以下是根据这套教程做的一些记录：[Electron 教程](https://www.bilibili.com/video/BV1pY4y1i7Ac)。如有错漏之处，敬请指正。

![img](https://assets.ng-tech.icu/item/db75225feabec8d8b64ee7d3c7165cd639554cbc.png@progressive.webp)

首先要说明一点，这套视频教程的时间比较早，大概 17 年的样子。教程中使用的 Electron 版本是 1.6.6，写这篇文章的时候 Electron 大版本已经更新到 19 了。不过我认为问题不大，如果你不是功利性特别强，需要学完找工作的话，从 1 号大版本学习也未尝不好。主要学习的是思想，具体的 API 细节等理解了思想后，边查文档边开发效率也很高。

（咪咪看了下官方文档，从版本 1 到版本 19，对视频教程中有最大影响的就是版本 9 开始，无法在 renderer process 直接使用 “non-context-aware native modules”，这个是什么我没找到相关说明，反正像视频中在 Web 侧直接使用 require 方法是不行的。其余更新内容与视频的知识点关系不大，可放心食用。）

> Electron 可以理解为就是 Google Chrome，前端代码运行在"浏览器"的 Tab 内，而 Electron 代码控制整个"浏览器"。

# 搭建环境

electron 依赖安装命令（安装 1 号大版本，跟视频中保持一致）

```shell
npm install --save-dev electron@1
```

不过由于某些原因，安装大概率会出错，可以使用这条命令替代

```shell
ELECTRON_MIRROR=http://npm.taobao.org/mirrors/electron/ npm install electron@1 -D --registry=https://registry.npm.taobao.org
```

这种包含 C++ 代码的库，安装起来都挺折腾的，初学者安装一个库花掉 1、2 个小时也不奇怪。

# 项目 1：获取视频时长

第一个项目是一个获取视频时长的程序。选择一个视频，然后在窗口中显示这个视频的时长（秒）。这个项目主要目的是熟悉 Electron 的基础。

最基础的 Electron 程序由两部分组成，App 与 BrowserWindow。App 代表整个应用，提供与应用有关的监听事件，属于 Electron 侧，而 BrowserWindow 可以创造与控制窗口，属于 Web 侧。

启动一个最简单的 Electron 程序

根目录新建 index.js 文件

```javascript
// 引入依赖
const electron = require("electron");

const { app } = electron;

// app 监听 ready 事件
app.on("ready", () => {
  console.log("app ready");
});
```

package.json 文件新增一行

```javascript
{
	...
  "scripts": {
		...
    "start": "electron ."
  },
	...
}
```

然后在命令输入

```shell
npm run start
```

不出意外的话，控制台会输出

```shell
app ready
```

这时我们的 App 进程就已经启动了，进程会持续运行，Windows 用户可以通过 Ctrl + c 终止进程。

> 默认情况下，electron App process 不会向用户展示任何信息。

现在除了控制台的输出外，屏幕上不会出现窗口，因为窗口是 Web 侧的功能。

首先在根目录新增 index.html 文件

```html
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta http-equiv="X-UA-Compatible" content="IE=edge" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>首页</title>
  </head>
  <body>
    <h1>首页</h1>
  </body>
</html>
```

在 index.js 中增加 BrowserWindow 相关代码

```javascript
...

const { app, BrowserWindow } = electron;

// 主窗口作为全局变量
let mainWindow;

app.on("ready", () => {
  // 新建 BrowserWindow 实例
  mainWindow = new BrowserWindow({});
  // 窗口加载 html 文件
  // __dirname 代表当前模块的目录名
  mainWindow.loadURL(`file://${__dirname}/index.html`);
});
```

启动命令

```shell
npm run start
```

等待一小会儿后，程序窗口就有了，展示的内容就是我们加载的 HTML 文件内容。

至此大概已经对 Electron 中的 App 与 BrowserWindow 是什么有点概念了吧。还记得我们这个程序要做什么吗，用户选择视频后，输出视频的时长。

先来说一下如何选择视频，在 index.html 中增加代码

```html
<body>
  <h1>首页</h1>
  <div>
    <form>
      <label for="upload-btn">上传视频</label>
      <input id="upload-btn" type="file" accept="video/*" />

      <button type="submit">获取信息</button>
    </form>
  </div>

  <script>
    document.querySelector("form").addEventListener("submit", (e) => {
      e.preventDefault();

      const file = document.querySelector("#upload-btn").files[0];
      debugger;
      const { path } = file;
    });
  </script>
</body>
```

然后启动程序

```shell
npm run start
```

打开调试器

![img](https://assets.ng-tech.icu/item/9481f83ae6d3765dfd7df4a523bd1641870132b0.jpg@942w_575h_progressive.webp)通过程序菜单打开调试器

点击”上传视频“按钮并选择文件，然后点击”获取信息“按钮，程序会停在断点处，鼠标悬浮到 file 上可以看到视频的一些信息

![img](https://assets.ng-tech.icu/item/9c8cf1ac53a4a4f51df2b3345048133fe0966e04.jpg@942w_846h_progressive.webp)上传视频的信息

这个上传是通过前端实现的，没有 Electron 的逻辑。可以看到虽然相比纯 Web 上传多了一些文件的信息（path、size），但是没有我们要的视频长度，这个功能视频教程中是靠 FFmpeg 实现的。

首先要安装 FFmpeg

```javascript
Windows 用户参考 https://blog.csdn.net/qq_59636442/article/details/124526107
苹果用户使用 Homebrew 安装
```

安装完成后，在控制台输入

```shell
ffmpeg -version
```

输出相关信息表示安装成功了，然后我们要安装 fluent-ffmpeg 库，这个库是对 FFmpeg 的一层封装，方便 Node.js 使用 FFmpeg 的功能，使用 npm 安装

```shell
npm install fluent-ffmpeg
```

安装完成后，解析视频的准备工作就做好了。

视频教程里将解析视频长度的逻辑放在了 index.js 文件中，也就是 Electron 侧。视频中老版本 Electron 是可以在浏览器侧使用 Node.js Api 的，这时是靠约定来实现代码复用的。操作系统级别的逻辑，尽可能地放在 Electron 侧，让 Web 侧的逻辑保持简洁。

现在我们遇到问题了，刚刚上传的视频文件是在 Web 侧上传的，获取的文件信息也在 Web 侧，那如何将 Web 侧的信息传递给 Electron 侧呢？

进程间通信通过 ipc（Inter-Process Communication）来实现，Electron 中只要掌握下列四个方法就可以了

- Web 侧发送：ipcRenderer.send
- Electron 侧接收：ipcMain.on
- Electron 侧发送：mainWindow.webContents.send
- Web 侧接收：ipcRenderer.on

mainWindow 为 BrowserWindow 的实例，可以为任意名字。不同的窗口调用此方法，就是将信息发送到对应的窗口。

通过 ipc 将文件路径发送给 Electron 侧，index.html 中增加如下代码

```html
...
<script>
  // 引入依赖
  const electron = require("electron");
  const { ipcRenderer } = electron;

  document.querySelector("form").addEventListener("submit", (e) => {
    e.preventDefault();

    const { path } = document.querySelector("#upload-btn").files[0];
    // Web 侧发送消息
    ipcRenderer.send("video:submit", path);
  });
</script>
...
```

在 script 标签中使用 require 方法，第一眼看到肯定会感到有点违和，这是 Electron 提供给我们的能力。（新版本无法使用这种方法，需要通过事先加载 preload.js ，使得 Web 侧获取调用 Node.js API 的能力）

Web 侧发送了视频路径，我们在 Electron 侧接收消息，index.js 中增加对应代码

```javascript
const { app, BrowserWindow, ipcMain } = electron;
// 引入 ffmpeg 相关依赖
const ffmpeg = require("fluent-ffmpeg");

let mainWindow;

app.on("ready", () => {
  mainWindow = new BrowserWindow({});
  mainWindow.loadURL(`file://${__dirname}/index.html`);
});

// Electron 侧接收消息
ipcMain.on("video:submit", (e, path) => {
  console.log(path);
  // ffmpeg.ffprobe 方法获取视频信息
  ffmpeg.ffprobe(path, (err, metadata) => {
    console.log(metadata.format.duration);
    // 视频时长，单位秒
    const d = metadata.format.duration;
    // Electron 侧发送消息
    mainWindow.webContents.send("video:duration", metadata.format.duration);
  });
});
```

获取视频时长后，再发送给 Web 侧，Web 侧接收后在视图上展示

```html
...
<script>
  const electron = require("electron");
  const { ipcRenderer } = electron;

  // Web 侧接收消息
  ipcRenderer.on("video:duration", (e, duration) => {
    // 事件处理函数第二个参数就是发送的参数
    console.log(duration);
    document.querySelector("#video-duration").innerHTML = duration;
  });

  document.querySelector("form").addEventListener("submit", (e) => {
    e.preventDefault();

    const { path } = document.querySelector("#upload-btn").files[0];
    ipcRenderer.send("video:submit", path);
  });
</script>
...
```

项目小结，通过这个项目，我们学习到

1. 如何启动 Electron App
2. 如何新建窗口
3. Electron 中如何进程间通信，传递信息
4. 如何使用 FFmpeg 获取视频信息

# 项目 2：TODO LIST

第二个项目是一个经典项目——待办列表。通过这个项目我们将学习到如何自定义下拉菜单以及多窗口。

首先新建一个项目，根据前面搭建环境的方法，搭建出一套 Electron 初始项目模板，还是以 index.js 作为程序入口，index.html 作为程序主窗口试图。

index.html

```html
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta http-equiv="X-UA-Compatible" content="IE=edge" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Document</title>
  </head>
  <body>
    <h1>TODO LIST</h1>
    <ul></ul>
  </body>
</html>
```

我们先增加一个菜单，菜单下拉后有“添加 TODO”和“退出”两个子菜单。自定义下拉菜单通过配置菜单模板实现，菜单模板格式如下

```javascript
const menuTemplateItem = {
  // 菜单名
  label: "",
  // 快捷键
  accelerator: "",
  // 点击事件回调
  click() {},
  // 下级菜单列表
  submenu: [],
};
```

在 index.js 中定义菜单模板

```javascript
// 菜单模板
const menuTemplate = [
  {
    // 第一层菜单固定在窗口上方
    label: "文件",
    // 文件的子菜单
    submenu: [
      {
        label: "添加TODO",
      },
      {
        label: "退出",
        accelerator: (() => {
          // 通过 process.platform 可以获取用户操作系统信息
          // darwin 就是苹果系统
          if (process.platform === "darwin") {
            return "Command+Q";
          } else {
            return "Ctrl+Q";
          }
        })(),
        click() {
          // 点击退出程序
          app.quit();
        },
      },
    ],
  },
];
```

定义完菜单模板后，在 App ready 事件回调中设置菜单

```javascript
const electron = require("electron");

const { app, BrowserWindow, Menu } = electron;

const menuTemplate = [...];

app.on("ready", () => {
  mainWindow = new BrowserWindow({});
  mainWindow.loadURL(`file://${__dirname}/index.html`);
  mainWindow.on("closed", () => {
    app.quit();
  });

  // 通过 Menu.buildFromTemplate 方法将菜单模板转为 electron.Menu 对象
  const menu = Menu.buildFromTemplate(menuTemplate);
  // 设置应用菜单
  Menu.setApplicationMenu(menu);
});
```

启动程序，可以看到我们自定义菜单了

![img](https://assets.ng-tech.icu/item/960abd861dcf4934a4694b196e6d8673661c364c.jpg@771w_542h_progressive.webp)自定义菜单

这时点击“添加 TODO”菜单是没有任何反应的，接下来我们增加新建窗口的逻辑。

首先新建 add.html 文件作为新增 TODO 窗口的视图

```html
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta http-equiv="X-UA-Compatible" content="IE=edge" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Document</title>
  </head>
  <body>
    <form>
      <div>
        <label>新增TODO</label>
        <input type="text" autofocus />
      </div>
      <button type="submit">提交</button>
    </form>
  </body>
</html>
```

新建窗口的逻辑还是通过 BrowserWindow 类来实现的，但是这次我们把新建逻辑封装成一个函数，在 index.js 增加 createAddWindow 函数

```javascript
// 同 mainWindow 一样，将新增窗口设为全局变量
let addWindow;

function createAddWindow() {
  // 和新增主窗口的步骤一样，new BrowserWindow 的实例，然后加载 add.html 作为视图
  addWindow = new BrowserWindow({
    // 创建实例时，可以传参设定窗口属性
    width: 300,
    height: 200,
    title: "新增TODO",
  });
  addWindow.loadURL(`file://${__dirname}/add.html`);

  // 窗口关闭后，虽然视图消失了，但是 addWindow 指向的对象还在内存中
  // 通过手动赋值 null 释放之前的对象
  addWindow.on("closed", () => (addWindow = null));
}
```

菜单模板增加“添加 TODO”菜单的点击事件

```javascript
// ...

const menuTemplate = [
  {
    label: "文件",
    submenu: [
      {
        label: "添加TODO",
        click() {
          // 调用创建新增窗口函数
          createAddWindow();
        },
      },
      {
        label: "退出",
        accelerator: (() => {
          if (process.platform === "darwin") {
            return "Command+Q";
          } else {
            return "Ctrl+Q";
          }
        })(),
        click() {
          app.quit();
        },
      },
    ],
  },
];

// ...
```

重新启动程序，然后点击菜单“文件”-“添加 TODO”，此时会弹出新建 TODO 窗口了

![img](https://assets.ng-tech.icu/item/c09af3f7fe6b68b3c73b2ecba77da44ff7b2c197.jpg@942w_701h_progressive.webp)新建 TODO 窗口

最后就是实现新增 TODO，然后展示在主窗口的功能了。实现这个功能还是要使用到我们之前提到的 ipc 的四个方法。数据流向：新增窗口（add.html） ==》index.js ==》主窗口（index.html）。

在 add.html 中增加发送事件，将输入的新 TODO 的值发送给 index.js

```html
<body>
  <!-- ... -->
  <script>
    const electron = require("electron");
    const { ipcRenderer } = electron;

    document.querySelector("form").addEventListener("submit", (e) => {
      e.preventDefault();

      // Web 侧发送消息
      // 将新增TODO的值发送给 index.js
      ipcRenderer.send("todo:add", document.querySelector("input").value);
    });
  </script>
  <!-- ... -->
</body>
```

index.js 中接收新 TODO 的值，并发送到 index.html 中

```javascript
const electron = require("electron");

const { app, BrowserWindow, Menu, ipcMain } = electron;

let mainWindow;
let addWindow;

// ...

// Electron 侧接收消息
ipcMain.on("todo:add", (e, newTodo) => {
  // Electron 侧发送消息
  // 发送给 index.html 那个窗口
  mainWindow.webContents.send("todo:add", newTodo);
  // 程序一般设计就是新增后，自动关闭新增窗口
  addWindow.close();
});
```

在 index.html 中接收 Electron 侧发来的消息

```html
<body>
  <h1>TODO LIST</h1>
  <ul></ul>

  <script>
    const electron = require("electron");
    const { ipcRenderer } = electron;
    const ul = document.querySelector("ul");

    // Web 侧接收消息
    ipcRenderer.on("todo:add", (e, newTodo) => {
      console.log(newTodo);

      // 将新 TODO 的值显示到页面上
      const li = document.createElement("li");
      const todo = document.createTextNode(newTodo);
      li.appendChild(todo);
      ul.appendChild(li);
    });
  </script>
</body>
```

重新启动程序，试试看新建 TODO 吧

![img](https://assets.ng-tech.icu/item/be745c3b6a52b10d51f21b65ebc226af2766bef4.jpg@731w_596h_progressive.webp)新建 TODO 成功！

至此我们项目二的主要功能就实现了，了解了自定义菜单与窗口间通信。但是还有一个问题没有解决，细心的童鞋可能发现了，我们自定义菜单后，原来默认的菜单就不见了。

![img](https://assets.ng-tech.icu/item/3f74065b63dd21c2300955bf31a0190a2a138f1b.jpg@537w_149h_progressive.webp)Electron 程序默认的菜单

更要命的是，这些菜单不但在窗口中不显示了，它们对应的快捷键也失效了。比如现在我们就无法打开调试页面了，这使得在开发时就很不方便。

如何恢复调试功能呢，其实很简单，在 index.js 中添加以下逻辑

```javascript
// process.env.NODE_ENV 来获取 Node.Js 的环境变量，一般开发环境的值设置为 "production"
// 调试功能我们不希望用户在生产环境中使用，所以只有非生产环境，才添加对应的菜单
if (process.env.NODE_ENV !== "production") {
  // 菜单模板增加"开发"菜单
  // 子菜单为 "打开调试器"
  menuTemplate.push({
    label: "开发",
    submenu: [
      {
        label: "打开调试器",
        click(item, focusedWindow) {
          // 点击回调函数的第二个参数是当前 focus 窗口的引用
          // 通过 .toggleDevTools 方法打开调试器
          focusedWindow.toggleDevTools();
        },
      },
    ],
  });
}
```

现在重新运行程序，菜单栏多了“开发”，这样我们就可以开发坏境下打开调试器了。

除了调试器，我们还希望增加刷新页面功能，Web 侧的改动可以直接刷新更新，只需要在刚刚的代码中做一点小小的改动

```javascript
if (process.env.NODE_ENV !== "production") {
  menuTemplate.push({
    label: "开发",
    submenu: [
      // role 也是菜单模板对象中的属性，通过这个属性可以使用一些预设好的功能
      // "reload"就是刷新，还有其他值可以参考官网文档
      { role: "reload" },
      {
        label: "打开调试器",
        click(item, focusedWindow) {
          focusedWindow.toggleDevTools();
        },
      },
    ],
  });
}
```

再重新启动程序，现在“开发”菜单中不但增加了“Reload”子菜单，而且还增加了快捷键刷新。

项目小结，通过这个项目，我们学习到

1. 如何自定义菜单
2. 如何进行窗口间通信

# 项目 3：时钟

到第三个项目了，经过前两个项目的学习，我们现在对 Electron 的主要功能有了一定的了解了，接下来通过这个项目，我们学习一下 Electron 程序如何与状态栏（Tray）交互。

这是个时间管理项目，在状态栏点击程序 icon 后，弹出窗口进行时间操作。

这个项目要先去下载作者的模板代码，下载地址

```javascript
https://github.com/StephenGrider/ElectronCode
```

下载或克隆下来的项目，进入 \boilerplates\tasky 文件夹，然后在 package.json 中，把 electron 的版本改成 1.8.8（原版可能会有安装问题），版本号改好后，在命令行执行 npm 安装命令

```shell
ELECTRON_MIRROR=http://npm.taobao.org/mirrors/electron/ npm install --registry=https://registry.npm.taobao.org
```

等待依赖安装完毕，在项目根目录新建 index.js 文件，增加 Electron “模板”代码，注意 main 窗口加载的 HTML 文件路径

```javascript
const electron = require("electron");

const { app, BrowserWindow } = electron;

let mainWindow;

app.on("ready", () => {
  mainWindow = new BrowserWindow({});
  mainWindow.loadURL(`file://${__dirname}/src/index.html`);
});
```

这个项目和我们之前两个项目有一点点区别，这个项目的前端是用 React 写的，如果你不熟悉 React 也没有关系，我们的重点还是放在 Electron 上，只是如何运行这个项目需要注意下，需要先启动前端项目，在命令行输入

```shell
npm run start
```

等待几秒后，在命令窗口看到下面的输出说明前端项目启动好了

```shell
Version: webpack 2.7.0
Time: 2942ms
    Asset    Size  Chunks             Chunk Names
bundle.js  231 kB       0  [emitted]  main
chunk    {0} bundle.js (main) 227 kB [entry] [rendered]
    [4] ./src/index.js 721 bytes {0} [built]
    [5] (webpack)-dev-server/client?http://localhost:4172 7.93 kB {0} [built]
    [6] ./src/components/App.js 9.73 kB {0} [built]
    [7] ./src/components/Header.js 1.35 kB {0} [built]
    [8] ./src/components/Settings.js 5.62 kB {0} [built]
    [9] ./src/components/TasksIndex.js 4.42 kB {0} [built]
   [10] ./src/components/TasksShow.js 6.05 kB {0} [built]
   [11] ./src/utils/Timer.js 4.48 kB {0} [built]
   [12] ./~/sockjs-client/dist/sockjs.js 181 kB {0} [built]
   [13] (webpack)-dev-server/client/overlay.js 3.67 kB {0} [built]
   [14] (webpack)-dev-server/client/socket.js 1.08 kB {0} [built]
   [15] (webpack)/hot nonrecursive ^\.\/log$ 160 bytes {0} [built]
   [16] (webpack)/hot/emitter.js 77 bytes {0} [built]
   [25] multi (webpack)-dev-server/client?http://localhost:4172 ./src/index.js 40 bytes {0} [built]
     + 12 hidden modules
webpack: Compiled successfully.
```

此时在**新的**命令窗口，运行我们 Electron 项目

```shell
npm run electron
```

运行成功后，应该会看到以下窗口

![img](https://assets.ng-tech.icu/item/0552a5fb7ee939630d438517ce759d95681bd6c3.jpg@942w_713h_progressive.webp)项目 3 初始

走到这里我们项目 3 的准备工作就做好了，接下来我们要实现程序在状态栏的展示。

Electron 使用 Tray 类来实现程序在状态栏的逻辑，在 index.js 增加代码

```javascript
// 引入 path 模块
const path = require("path");
const electron = require("electron");

const { app, BrowserWindow, Tray } = electron;

let mainWindow;
// 全局变量保存 Tray 实例
let tray;

app.on("ready", () => {
  mainWindow = new BrowserWindow({});
  mainWindow.loadURL(`file://${__dirname}/src/index.html`);

  // 我这里偷懒了，视频中通过 process.platform 来判断当前操作系统是否是 windows 系统
  // windows 系统使用 windows-icon@2x.png，否则使用 iconTemplate.png
  const iconPath = path.join(__dirname, "./src/assets/windows-icon@2x.png");
  // 新建 Tray 实例
  tray = new Tray(iconPath);
  // 增加状态栏 icon 的悬浮提示
  tray.setToolTip("提示");
});
```

重新启动项目（只要将当前 Electron 的进程杀死就行，前端的进程不需要重启），运行完毕后，状态栏就有了图标展示了，鼠标悬浮 icon 还会有文字提示

![img](https://assets.ng-tech.icu/item/96968610974b872c722045b5412d0a95353485fc.jpg@222w_59h_progressive.webp)状态栏 icon

视频中这时没有将 tray 作为全局变量保存，咪咪我在 windows10 的机器上运行程序，icon 会出现闪退，原因就是局部变量的 Tray 实例被内存垃圾回收导致的，所以必须设置成全局变量才行。

接下来我们添加状态栏 icon 的点击事件，在 index.js 增加 tray 的监听事件

```javascript
// ...
app.on("ready", () => {
  mainWindow = new BrowserWindow({});
  mainWindow.loadURL(`file://${__dirname}/src/index.html`);

  const iconPath = path.join(__dirname, "./src/assets/windows-icon@2x.png");
  tray = new Tray(iconPath);
  tray.setToolTip("提示");

  // Tray 实例增加 click 事件的监听
  tray.on("click", (e) => {
    // 通过 window.isVisible() 获取窗口是否显示
    if (mainWindow.isVisible()) {
      //  如果窗口已经显示就隐藏窗口
      mainWindow.hide();
    } else {
      //  如果窗口隐藏状态就显示
      mainWindow.show();
    }
  });
});
```

重启项目，此时点击 icon 已经实现了类似 toggle 窗口的效果。

如果作为普通程序，那做到这一步就差不多了，但是这次我们想实现一个类似小工具的程序，点击状态栏的 icon 后，直接在附近弹出一个小窗口，在窗口中进行操作，而不是把 icon 作为开关程序的入口而已。

要实现这个效果，关键有两件事，第一件需要重设窗口的外观，使其更像“小工具”的弹窗，第二件就是定位窗口的位置，使其出现在状态栏附近，在 index.js 中添加代码

```javascript
// ...
app.on("ready", () => {
  // 设置主窗口的初始化参数
  mainWindow = new BrowserWindow({
    // 窗口宽度
    width: 300,
    // 窗口高度
    height: 500,
    // 不展示边框（没有菜单栏）
    frame: false,
    // 用户不能重新更改窗口大小
    resizable: false,
    // 默认运行时不展示窗口
    show: false,
    // 在任务栏不展示程序
    skipTaskbar: true,
    webPreferences: {
      // 窗口不显示时，后台是否继续运行计时器和动画，默认是 true 不运行
      backgroundThrottling: false,
    },
  });
  mainWindow.loadURL(`file://${__dirname}/src/index.html`);
  // 增加窗口 blur 事件，窗口一旦失去聚焦，自动隐藏窗口
  mainWindow.on("blur", () => {
    mainWindow.hide();
  });

  const iconPath = path.join(__dirname, "./src/assets/windows-icon@2x.png");
  tray = new Tray(iconPath);
  tray.setToolTip("提示");

  // icon 的点击回调的第二个参数是 icon 的坐标
  tray.on("click", (e, bound) => {
    // x - icon 左上角的 x 坐标
    // y - icon 左上角的 y 坐标
    const { x, y } = bound;
    // 通过 window.getBounds 方法动态获取窗口的宽高
    const { width, height } = mainWindow.getBounds();

    if (mainWindow.isVisible()) {
      mainWindow.hide();
    } else {
      // 设置窗口的信息，注意这是 windows 下，任务栏在窗口下方的计算方法
      mainWindow.setBounds({
        // 窗口左上角的 x 坐标，要比 icon 左上角的 x 坐标，"往左"一半窗口的宽度
        x: x - width / 2,
        // 窗口左上角 y 坐标，要比 icon 左上角 y 坐标 "往上"窗口的高度
        y: y - height,
        // 窗口的宽高保持不变
        width,
        height,
      });
      mainWindow.show();
    }
  });
});
```

（视频中隐藏程序在任务栏的显示是通过 App.dock.hide 实现的，这个方法只有苹果系统中才可以用，Windows 系统下 App.dock 是 undefined，如果要隐藏任务栏的显示要通过 BrowserWindow 新建实例时传参 skipTaskbar）

> Mac OS X 是面向应用程序的，而 Windows 是面向窗口的。

重新运行程序，现在点击状态栏的 icon，会在上方弹出窗口（如果是苹果系统，窗口坐标的计算方式与 Windows 不同，视频中的老师是苹果系统），而且此时窗口的边框也没有了。

![img](https://assets.ng-tech.icu/item/fded8919f3743671bfee8c7c68794f07cad9e49b.jpg@689w_1289h_progressive.webp)窗口直接定位在 icon 上方

> 屏幕的左上角坐标为(0, 0)，越往右边 x 越大，越往下边 y 越大。屏幕可视范围内，坐标的 x、y 值应该都是正数。窗口、icon 的坐标，都是以自己左上角的那个像素为标准。

（视频中的代码其实有一点点问题，窗口的 blur 事件和 icon 的点击事件会有冲突，在窗口显示时，点击 icon 会优先触发窗口的 blur 事件导致窗口隐藏，icon 的点击事件又会导致窗口重新显示，使得原本的 toggle 效果失效）

最后我们为 icon 增加右键菜单功能，Tray 添加菜单同 Menu 一样，也是通过菜单模板实现的，具体代码如下

```javascript
// ...

const { app, BrowserWindow, Tray, Menu } = electron;

// ...

// icon 的右键点击菜单模板，模板格式同自定义菜单一样
const menuTemplate = Menu.buildFromTemplate([
  {
    label: "退出",
    click() {
      app.quit();
    },
  },
]);

app.on("ready", () => {
  // ...

  // tray 增加鼠标右键点击监听
  tray.on("right-click", () => {
    // tray 通过 .popUpContextMenu 方法弹出菜单
    tray.popUpContextMenu(menuTemplate);
  });
});
```

重启程序，现在右键点击 icon 有菜单弹出了。

至此项目 3 就进行的差不多了，视频中还有两点文章中没有说明，一个是视频中老师将 Tray 等功能封装成单独的 Class 了，这属于 ES6 特性，感兴趣的同学可以自己尝试下。还有一点就是视频中通过 tray.setTitle 方法设置 icon 区域的文字展示，这个应该是苹果系统下独有的功能，Windows 用户了解一下即可，由于方法本身也比较简单，这里就不多赘述了。

项目 3 小结

1. 如何在状态栏实现 icon 相关逻辑
2. 窗口的属性设置

# 项目 4：视频格式转换

最后一个项目，是将输入的视频批量转换格式。这个项目相当于是对前两个 Electron 项目知识点的一个总结。

对于比较扎实的掌握了前面三个项目的话，这个项目可以不看。转换视频格式核心是通过 FFmpeg 实现的，进程间通信使用项目 1 中提到的 ipc 那四个方法，最后通过 shell 模块的 .showItemInFolder 方法打开转换后文件夹即可。
