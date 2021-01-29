# App Manifest

App Manifest 是一个 JSON 格式的文件，用于配置网站应用的相关信息。通过该文件，我们可以配置桌面留存图标、安装弹窗和启动动画的相关信息。我们可以在配置文件中配置桌面留存图标的 icon 和名称，当用户将网站保存在桌面后，会自动应用配置信息。

添加到主屏幕的好处有很多，主要体现在用户粘性和用户体验上。桌面图标减少了网站的入口深度，用户可以从主屏幕直达站点，而无需从浏览器首页一层一层进入。添加到主屏幕的图标具有接近 Native App 的体验，如下图所示，左二为 Native App，左三为 PWA 其他均为 Native App：

![App 图标对比](https://s3.ax1x.com/2021/01/25/sOZLCQ.png)

从桌面图标进入网站时具有启动页面和脱离浏览器 UI 的全屏体验，添加到主屏幕的网站会被纳入应用抽屉中。添加屏幕图标无需下载，类似桌面快捷键，减少了用户安装 App 的成本。与快捷方式的区别：

- 屏幕留存图标拥有独立的图标和名称。
- 点击图标打开网站，资源加载的过程并不会像普通网页那样出现白屏，取而代之的是一个展示应用图标和名称的启动页面，资源加载结束时加载页消失。
- 当网页最终展现时，地址栏、工具栏等浏览器元素将不会展现出来，网页内容占满屏幕，看起来与 Native App 一样。

编写配置文件后在 head 中引入：`<link rel="manifest" href="/manifest.json">`。Mainfest 文件通过一些文本描述，具体定义显示到桌面上的内容，并询问用户是否添加，添加之后可在 Chrome 浏览器的 Application - Manifest 来查看你的 Mainfest 文件是否生效。

```json
// manifest.json
{
  "name": "Sharee PWA", // 用于安装横幅、启动画面显示
  "short_name": "Sharee PWA", // 用于主屏幕显示
  // 浏览器会根据有效图标的 sizes 字段进行选择。首先寻找与显示密度相匹配并且尺寸调整到 48dp 屏幕密度的图标
  "icons": [
    {
      "src": "../logo/180.png",
      "sizes": "180x180",
      "type": "image/png"
    },
    {
      "src": "../logo/192.png",
      "sizes": "192x192",
      "type": "image/png"
    },
    {
      "src": "../logo/512.png",
      "sizes": "512x512",
      "type": "image/png"
    }
  ],
  "start_url": "/?from=homescreen", // 启动网址，相对于manifest.json所在路径
  "scrope": "/", // sw的作用范围只能在此路径或子路径
  "display": "standalone",
  "theme_color": "#FFF",
  "background_color": "#FFF" // 启动时的背景色
}
```

```html
// iOS不支持manifest配置，通过meta标签添加到head中
<meta name="apple-mobile-web-app-capable" content="yes" />
<meta name="apple-mobile-web-app-status-bar-style" content="#fff" />
<meta name="apple-mobile-web-app-title" content="Sharee PWA" />
<link rel="apple-touch-icon" sizes="180x180" href="../logo/180.jpg" />
<meta name="msapplication-TileColor" content="#fff" />
<meta name="theme-color" content="#fff" />
```

# 安装弹窗

网站添加 Manifest 配置文件并满足一定要求后，浏览器会根据用户的访问频率在合适的时间弹出弹窗询问用户是否需要添加屏幕图标。浏览器展现应用安装提示需满足以下条件 [https://web.dev/install-criteria/](https://link.zhihu.com/?target=https%3A//web.dev/install-criteria/)。通过 HTTPS 访问（调试模式下允许 **[http://127.0.0.1](https://link.zhihu.com/?target=http%3A//127.0.0.1/)** 或 **[http://localhost](https://link.zhihu.com/?target=http%3A//localhost/)** 访问）

manifest.json 文件包含以下配置：

- name / short_name，优先采用 short_name
- start_url
- icons
- display 为 `standalone` 或 `fullscreen` 或 `minimal-ui`

站点必须注册 Service Worker，Chrome 要求 Service Worker 且必须监听 `fetch` 事件，用户访问频率足够高（浏览器未明确说明频率）。开发者无法主动触发安装提示的弹出，但可监听 `beforeinstallprompt` 事件拦截弹窗事件并保存，然后提供按钮触发：

```js
let appPromptEvent = null;
const installBtn = document.getElementById("install-btn");
self.addEventListener("beforeinstallprompt", function (e) {
  e.preventDefault();
  // 保存弹窗事件
  appPromptEvent = event;
  installBtn.classList.add("visible");
  return false;
});
window.addEventListener("appinstalled", function () {
  console.log("应用已安装");
  installBtn.classList.remove("visible");
});
installBtn.addEventListener("click", function () {
  if (appPromptEvent !== null) {
    console.log(appPromptEvent);
    // 触发弹窗
    appPromptEvent.prompt();
    appPromptEvent.userChoice.then(function (result) {
      if (result.outcome === "accepted") {
        console.log("同意安装应用");
      } else {
        console.log("不同意安装应用");
      }
      appPromptEvent = null;
    });
  }
});
```

`beforeinstallprompt` 的兼容性如下，大多数浏览器不支持弹窗。其实在支持弹窗的浏览器中，它的触发策略也是很低频的，需要用户在短时间内与网站进行高频互动才会触发，且在用户选择取消安装后很长一段时间内都不会再次触发，浏览器需要保证用户的使用体验，没有人会喜欢频繁弹出的广告影响自己浏览。

# 启动动画

从屏幕图标进入时，根据 Manifest 文件中的配置项会自动生成启动动画，用来过渡资源拉取前的白屏时间，改善用户体验。启动动画根据 manifest.json 中的配置项自动生成，配置项与动画界面的对应关系如下图所示：

![启动动画](https://s3.ax1x.com/2021/01/25/sOKj0I.png)
