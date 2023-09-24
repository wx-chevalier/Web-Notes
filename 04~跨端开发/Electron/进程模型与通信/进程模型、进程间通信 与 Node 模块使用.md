# 进程模型、进程间通信 与 Node 模块使用

# 进程模型

每个 Electron 的应用程序都有一个主入口文件，它所在的进程被成为主进程（Main Process）。而主进程中创建的窗体都有自己运行的进程，称为渲染进程（Renderer Process）。每个 Electron 的应用程序有且仅有一个主进程，但可以有多个渲染进程。简单理解下主进程就相当于浏览器，而渲染进程就相当于在浏览器上打开的一个个网页。

主进程主要工作就是 控制应用程序生命周期 和 管理窗口、菜单、托盘等 ，另外主进程运行在 Node.js 环境中，所以它可以使用各种 Node.js 模块，也可以调用操作系统中的各种资源等。渲染进程主要就是用来显示下网页、跑跑前端代码，这里只能用前端的语法规则，没法使用 Node.js 的语法和模块。

早期版本的 Electron 渲染进程是可以直接使用 Node.js 的语法和模块的，现在版本中出于安全考虑所以无法直接使用（虽然可以通过配置解锁），但渲染进程中使用 Node.js 的一些功能这个需求还是存在的，所以 Electron 现在提供了预加载（preload）的功能。预加载调用一个 JS 脚本，它会在网页被加载前运行，它既可以使用 Node.js 的功能，又可以访问网页上的 window 对象（默认情况下并不能直接访问，得通过 contextBridge 模块）。所以可以在这里将 Node.js 的功能传递给 window 对象，这样渲染进程就可以使用这些功能了。

# 进程间通讯

上面内容中可以知道默认情况下渲染进程只能使用前端的语法规则，所以它和相当于后台的主进程间只能通过 http 或是 websocket 等方式进行通讯，这种方式并不方便，所以 Electron 还提供了一些别的方式用于处理这方面问题。Electron 中使用 ipcMain、ipcRenderer 两个模块来处理进程间通讯，这两个是基于 Node.js 方式的模块，所以根据上面的内容使用上会有些注意点，主要就是怎么用的问题。

## 不安全方式

上一章内容中有说到早期版本的 Electron 渲染进程是可以直接使用 Node.js 的语法和模块的，现在版本中出于安全考虑所以无法直接使用，但可以通过配置解锁。所以我们可以配置下，然后就可以直接在渲染进程中使用 Node.js 的语法和模块，比如用于进程间通讯的 ipc 模块。使用上来说这是最简单的方式。

下面是个简单的例子，分别改写 main.js 和 index.html 文件：

```js
const { app, BrowserWindow, ipcMain } = require("electron");
const path = require("path");

function createWindow() {
  const mainWindow = new BrowserWindow({
    webPreferences: {
      nodeIntegration: true, // 启用node环境
      contextIsolation: false, // 禁用上下文隔离
    },
  });
  mainWindow.loadFile("index.html");
  mainWindow.webContents.openDevTools();

  setInterval(() => {
    // 使用下面方法向mainWindow发送消息，消息事件名称为 main-send ，内容为 hello
    mainWindow.webContents.send("main-send", "hello");
  }, 5000);
}

// 使用ipcMain.on方法监听 renderer-send 事件
ipcMain.on("renderer-send", (event, arg) => {
  console.log(arg);
  // 使用下面方法对产生事件的对象进行应答，应答时事件名为main-reply，内容为pong
  event.reply("main-reply", "pong");
});

app.whenReady().then(() => {
  createWindow();
  app.on("activate", function () {
    if (BrowserWindow.getAllWindows().length === 0) createWindow();
  });
});

app.on("window-all-closed", function () {
  if (process.platform !== "darwin") app.quit();
});
```

```html
<!DOCTYPE html>
<html>
  <head>
    <meta charset="UTF-8" />
    <title>test</title>
  </head>
  <body>
    <h1 id="txt">Hello World!</h1>
    <script>
      // 渲染进程使用ipcRenderer模块
      const { ipcRenderer } = require("electron");

      // 使用ipcRenderer.send方法发送消息，消息事件名称为 renderer-send ，内容为 ping
      setInterval(() => {
        ipcRenderer.send("renderer-send", "ping");
      }, 3000);

      // 使用ipcRenderer.on方法监听 main-reply 事件
      ipcRenderer.on("main-reply", (event, arg) => {
        console.log(arg);
      });

      // 使用ipcRenderer.on方法监听 main-send 事件
      ipcRenderer.on("main-send", (event, arg) => {
        console.log(arg);
      });
    </script>
  </body>
</html>
```

上面就是个简单的通讯演示了，通过设置 nodeIntegration: true 和 contextIsolation: false 在渲染进程中就可以直接使用 Node.js 的语法和模块了。ipcMain 和 ipcRenderer 两个模块分别用于主进程和渲染进程。传递消息时消息都会有个事件名称，两个模块分别用各自的 on() 方法来监听消息事件。只有 ipcRenderer 可以主动向 ipcMain 发送消息，ipcMain 只能在监听到来自 ipcRenderer 的事件后才可以返回消息。

主线程中可以使用 BrowserWindow 对象的 webContents.send() 方法主动向该对象渲染进程发送消息，该渲染进程中同样使用 ipcRenderer.on() 来监听此消息。上面演示中 ipcRenderer 发送和 ipcMain 返回消息用的都是异步方法，它们还有同步方法可用，可以参考 Electron 官方的 API 文档。

## 预加载方式

上面的方式 Electron 现在并不推荐，现在推荐的是用预加载的方式把 Node.js 的一些内容传递给渲染进程。下面是个简单的例子，现在添加一个 preload.js 文件，内容如下：

```js
const { contextBridge, ipcRenderer } = require("electron");

// 使用contextBridge.exposeInMainWorld()方法将
// Function、String、Number、Array、Boolean、对象等
// 传递给渲染进程的window对象
contextBridge.exposeInMainWorld("myAPI", () => {
  setInterval(() => {
    ipcRenderer.send("renderer-send", "ping");
  }, 3000);
  ipcRenderer.on("main-reply", (event, arg) => {
    console.log(arg);
  });
  ipcRenderer.on("main-send", (event, arg) => {
    console.log(arg);
  });
});
```

分别改写 main.js 和 index.html 文件：

```js
// main.js中只需要改写下面内容就行了
const mainWindow = new BrowserWindow({
  webPreferences: {
    preload: path.join(__dirname, "preload.js"), // 使用预加载脚本
  },
});
```

```html
<!-- index.html中只要改写下面内容就好了 -->
<script>
  window.myAPI();
</script>
```

上面就是个简单的预加载的使用方式了，可以看到从使用角度来说其实也没太大差别，无非就是使用 contextBridge.exposeInMainWorld() 方法来传递 Node.js 的内容给了 window 对象。
