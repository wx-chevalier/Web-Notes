# 基于 Puppeteer 的编程控制

[Puppeteer](https://github.com/GoogleChrome/puppeteer) 是 Google

通过 headless 参数来指定是否启用 Headless 模式，默认情况下是启用的。此外，在我们使用 npm 安装 Puppeteer 的时候其会自动下载指定版本的 Chromium 从而保证接口的开箱即用性，也可以通过 executablePath 参数指定启动版本：

```js
const browser = await puppeteer.launch({ headless: false }); // default is true

const browser = await puppeteer.launch({ executablePath: "/path/to/Chrome" });
```

在大规模部署的情况下，我们需要控制 Puppeteer 连接到远端的服务化方式部署的 Headless Chrome 集群，此时就可以使用 `connect` 函数连接到 Headless Chrome 实例：

```js
puppeteer.connect({
  browserWSEndpoint:
    "ws://{remoteip}:9222/devtools/browser/fa60c034-422d-4f2c-bbeb-17a2cfd690f2"
});
```

```ts
import { launch } from "puppeteer";
(async () => {
  const browser = await launch({ headless: false });
  const page = await browser.newPage();
  await page.goto("https://example.com", { waitUntil: "networkidle" });
  await page.addScriptTag({
    url: "https://code.jquery.com/jquery-3.2.1.min.js"
  });
  await page.close();
  await browser.close();
})();
```

# 动态渲染

## 动态代理

```js
const puppeteer = require("puppeteer");

(async () => {
  const browser = await puppeteer.launch({
    // Launch chromium using a proxy server on port 9876.
    // More on proxying:
    //    https://www.chromium.org/developers/design-documents/network-settings
    args: ["--proxy-server=127.0.0.1:9876"]
  });

  //加隧道代理 加headers头即可
  await page.setExtraHTTPHeaders({
    "Proxy-Authorization":
      "Basic " + Buffer.from(`${username}:${password}`).toString("base64")
  });

  const page = await browser.newPage();
  await page.goto("https://google.com");
  await browser.close();
})();
```

# 页面操作

## 脚本执行

```js
const puppeteer = require("puppeteer");

(async () => {
  const browser = await puppeteer.launch();

  const page = await browser.newPage();

  await page.goto("https://example.com"); // Get the "viewport" of the page, as reported by the page.

  const dimensions = await page.evaluate(() => {
    return {
      width: document.documentElement.clientWidth,

      height: document.documentElement.clientHeight,

      deviceScaleFactor: window.devicePixelRatio
    };
  });

  console.log("Dimensions:", dimensions);

  await browser.close();
})();
```

如果需要传递参数，则在 evaluate 的后续参数传入需要传入的参数：

```js
const links = await page.evaluate(evalVar => {
  console.log(evalVar); // should be defined now
  // ...
}, evalVar);
```

在 Puppeteer 中我们还可以添加外部的脚本执行操作：

```js
const puppeteer = require("puppeteer");

(async () => {
  const browser = await puppeteer.launch({ headless: false });
  const page = await browser.newPage();
  await page.goto("https://google.com");
  await page.addScriptTag({
    url: "https://rawgithub.com/marmelab/gremlins.js/master/gremlins.min.js"
  });
  await page.evaluate(() => {
    window.gremlins.createHorde().unleash();
  });
})();
```

## 页面保存

```js
const puppeteer = require("puppeteer");

(async () => {
  const browser = await puppeteer.launch();

  const page = await browser.newPage();

  await page.goto("https://news.ycombinator.com", { waitUntil: "networkidle" });

  await page.pdf({ path: "hn.pdf", format: "A4" });

  await browser.close();
})();
```

## 监听网页请求

```js
const puppeteer = require("puppeteer");

puppeteer.launch().then(async browser => {
  const page = await browser.newPage();
  await page.setRequestInterception(true);
  page.on("request", interceptedRequest => {
    if (
      interceptedRequest.url().endsWith(".png") ||
      interceptedRequest.url().endsWith(".jpg")
    )
      interceptedRequest.abort();
    else interceptedRequest.continue();
  });
  await page.goto("https://example.com");
  await browser.close();
});
```

# 端到端测试
