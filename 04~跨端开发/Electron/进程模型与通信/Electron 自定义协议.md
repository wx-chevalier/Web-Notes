# 1. 协议: 从网页端唤起[Electron](https://link.juejin.cn/?target=https%3A%2F%2Fwww.electronjs.org%2Fzh%2Fdocs)应用

### 1.1 什么是协议

electron 注册的协议, electron 会将协议注册到系统的协议列表中，它是系统层级的 API，只能在当前系统下使用, 其他未注册协议的电脑不能识别。Electron 的 app 模块提供了一些处理协议的方法, 这些方法允许您设置协议和取消协议, 来让你的应用成为默认的应用程序。

### 1.2 协议的作用

注册一个协议到系统协议中, 当通过其他应用/浏览器网页端**打开新协议的链接时，浏览器会检测该协议有没有在系统协议中, 如果该协议注册过，然后唤起协议的默认处理程序(我们的应用)**

### 1.3 注册协议**app.setAsDefaultProtocolClient**

协议需要在`ready`事件后注册具体的代码如下

```js
// 注册自定义协议
const { app } = require("electron");
const path = require("path");

// 注册自定义协议
function setDefaultProtocol() {
  const agreement = "electron-fiddle"; // 自定义协议名
  let isSet = false; // 是否注册成功

  app.removeAsDefaultProtocolClient(agreement); // 每次运行都删除自定义协议 然后再重新注册
  // 开发模式下在window运行需要做兼容
  if (process.env.NODE_ENV === "development" && process.platform === "win32") {
    // 设置electron.exe 和 app的路径
    isSet = app.setAsDefaultProtocolClient(agreement, process.execPath, [
      path.resolve(process.argv[1]),
    ]);
  } else {
    isSet = app.setAsDefaultProtocolClient(agreement);
  }
  console.log("是否注册成功", isSet);
}

setDefaultProtocol();
```

### 1.4 使用协议

使用方式: 在浏览器地址栏输入注册好的协议，即可唤起应用。

协议唤起的链接格式: 自协议名称://参数

比如上文注册: `electron-fiddle`协议,触发时会默认带上`://`。

在使用的时候, 需要在浏览器地址栏输入:

```js
electron-fiddle://参数
```

### 1.5 监听应用程序被唤醒

应用程序唤起，mac 系统会触发`open-url`事件，window 系统会触发`second-instance`事件。

```js
// 注册自定义协议
const { app, dialog } = require("electron");
const agreement = "electron-fiddle"; // 自定义协议名
// 验证是否为自定义协议的链接
const AGREEMENT_REGEXP = new RegExp(`^${agreement}://`);

// 监听自定义协议唤起
function watchProtocol() {
  // mac唤醒应用 会激活open-url事件 在open-url中判断是否为自定义协议打开事件
  app.on("open-url", (event, url) => {
    const isProtocol = AGREEMENT_REGEXP.test(url);
    if (isProtocol) {
      console.log("获取协议链接, 根据参数做各种事情");
      dialog.showMessageBox({
        type: "info",
        message: "Mac protocol 自定义协议打开",
        detail: `自定义协议链接:${url}`,
      });
    }
  });
  // window系统下唤醒应用会激活second-instance事件 它在ready执行之后才能被监听
  app.on("second-instance", (event, commandLine) => {
    // commandLine 是一个数组，唤醒的链接作为数组的一个元素放在这里面
    commandLine.forEach((str) => {
      if (AGREEMENT_REGEXP.test(str)) {
        console.log("获取协议链接, 根据参数做各种事情");
        dialog.showMessageBox({
          type: "info",
          message: "window protocol 自定义协议打开",
          detail: `自定义协议链接:${str}`,
        });
      }
    });
  });
}

// 在ready事件回调中监听自定义协议唤起
watchProtocol();
console.log("监听成功");
```

### 1.6 应用场景

1. 单纯唤醒应用 只需注册协议，系统会自动打开应用。表现：如果应用未打开将打开应用，如果应用已经打开应用将会激活应用窗口。
2. 根据协议链接的参数进行各种操作 如上面的弹窗演示, **在监听协议链接打开的时候，可以获取完整的协议链接**。我们可以根据协议链接来进行各种业务操作。比如跳转指定链接地址，比如判断是否登录再进行跳转，比如下载指定文件等。

### 1.7 其他的 API

`app.removeAsDefaultProtocolClient(protocol)` 删除注册的协议, 返回是否成功删除的 Boolean

Mac: `app.isDefaultProtocolClient(protocol)` 当前程序是否为协议的处理程序。

`app.getApplicationNameForProtocol(url)` 获取该协议链接的应用处理程序

参数说明:

protocol 不包含:// 注册的协议名。

url 包含://

# 2. 自定义协议

注册自定义协议，拦截基于现有协议的请求，根据注册的自定义协议类型返回对应类型的数据。

我们可以自动的来使用所有的

在该项目中的代码地址: electron-fiddle/app/protocol

### 2.1 protocol.registerSchemesAsPrivileged

将协议注册成标准的[scheme](https://link.juejin.cn/?target=https%3A%2F%2Fso.csdn.net%2Fso%2Fsearch%3Fq%3Dscheme%26spm%3D1001.2101.3001.7020), 方便后续调用。

**注意**： 它必须在 ready 事件加载之前调用，并且只能调用一次

```js
protocol.registerSchemesAsPrivileged([
  { scheme: "myscheme", privileges: { bypassCSP: true } },
]);
```

### 2.2 protocol.registerFileProtocol

拦截自定义协议的请求回调，重新处理后再请求路径。

**示例** [文档](https://link.juejin.cn/?target=https%3A%2F%2Fwww.electronjs.org%2Fdocs%2Flatest%2Fapi%2Fprotocol)

```js
protocol.registerFileProtocol(
  "myscheme",
  (request, callback) => {
    // 拼接绝对路径的url
    const resolvePath = path.resolve(__dirname, "../../playground");
    let url = request.url.replace(`${myScheme}://`, "");
    url = `${resolvePath}/${url}`;
    return callback({ path: decodeURIComponent(url) });
  },
  (error) => {
    if (error) console.error("Failed to register protocol");
  }
);
```

### 2.3 使用方式

在 html 中使用自定义协议请求文件，即可自动拦截。

项目中的使用地址: electron-fiddle/playground/page/protocol/protocol.md

```js
<img src={"myscheme://page/protocol/wakeUp.jpg"} alt="wakeUp" />
```

### 2.4 protocol 其他 API

```js
protocol.unregisterProtocol(scheme); // 取消对自定义scheme的注册
protocol.isProtocolRegistered(scheme); // 自定义协议是否已经拦截
protocol.uninterceptProtocol(scheme); // 移除自定义协议的拦截器
// 各种用新的拦截器替换原有的拦截器
protocol.interceptFileProtocol(scheme, handler);
protocol.interceptStringProtocol(scheme, handler);
protocol.interceptBufferProtocol(scheme, handler);
protocol.interceptHttpProtocol(scheme, handler);
protocol.interceptStreamProtocol(scheme, handler);
```
