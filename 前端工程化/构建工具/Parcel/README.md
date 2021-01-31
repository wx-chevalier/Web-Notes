# Parcel

Parcel 是 Web 应用打包工具，适用于经验不同的开发者。它利用多核处理提供了极快的速度，并且不需要任何配置。

![](https://i.postimg.cc/nzKs8ryw/image.png)

首先通过 Yarn 或者 npm 安装 Parcel：

```sh
$ yarn global add parcel-bundler
$ npm install -g parcel-bundler
```

Parcel 可以使用任何类型的文件作为入口，但是最好还是使用 HTML 或 JavaScript 文件。如果在 HTML 中使用相对路径引入主要的 JavaScript 文件，Parcel 也将会对它进行处理将其替换为相对于输出文件的 URL 地址。接下来，创建一个 index.html 和 index.js 文件。

```html
<html>
  <body>
    <script src="./index.js"></script>
  </body>
</html>
```

```js
console.log("hello world");
```

Parcel 内置了一个当你改变文件时能够自动重新构建应用的开发服务器，而且为了实现快速开发，该开发服务器支持热模块替换。只需要在入口文件指出：

```sh
$ parcel index.html
```

# 资源处理

## CSS

CSS 资源可以被 JavaScript 或者 HTML 文件导入，其他 LESS 等类型的样式文件也可以被直接引入。

```js
import "./index.css";

<link rel="stylesheet" type="text/css" href="index.css" />;
```

CSS 资源不但可以通过@import 语法包含其他依赖，也可以通过 url()函数引入图片、字体等。其他通过 @import 导入的 CSS 文件被内联到同一个 CSS 包里，并将 url() 引用重写为其输出文件名。所有文件名都应该与当前 CSS 文件相关联。

```css
/* 导入其他 CSS 文件 */
@import "./other.css";

.test {
  /* 引入一个图片文件 */
  background: url("./images/background.png");
}
```

除了原始的 CSS，其他预编译成 CSS 的语言如 LESS, SASS, 和 Stylus 都是以同样的方式支持。

### PostCSS

PostCSS 是一个通过各类插件转换 CSS 的工具，如：autoprefixer, Preset Env, 和 CSS Modules。在 Parcel 中通过创建一个名字为.postcssrc (JSON), .postcssrc.js,或 postcss.config.js 的配置文件来配置 PostCSS。

在你的应用中安装下列插件：

```sh
$ yarn add postcss-modules autoprefixer
```

接着：创建一个文件 .postcssrc，

```json
{
  "modules": true,
  "plugins": {
    "autoprefixer": {
      "grid": true
    }
  }
}
```

在 plugins 对象中 key 指定插件，values 以对象形式被用来定义该插件的配置选项。如果这个插件没有配置，value 设置为 true。Autoprefixer, cssnext 和其他工具的可以在.browserslistrc 文件指定浏览器目标为：

```
> 1%
last 2 versions
```

在使用最外层的 modules 键值时，CSS Modules 启用方式稍有不同。这是因为 Parcel 需要对 CSS Modules 提供特殊的支持，因为它们导出了一个对象也要包含在 JavaScript 包中。注意你仍需安装 postcss-modules。

Parcel 为了在生产环境构建压缩 css，向 postcss 中添加了 cssnano。这里可以通过创建 cssnano.config.js 文件自定义配置。

```js
module.exports = {
  preset: [
    "default",
    {
      calc: false,
      discardComments: {
        removeAll: true
      }
    }
  ]
};
```

# 典型应用

## Vue

首先可以编写 Vue 单模块组件：

```html
<template lang="html">
  <div id="app">
    <h1>Hello Parcel vue app ðŸ“¦ ðŸš€</h1>
  </div>
</template>

<script>
  export default {
    name: "app"
  };
</script>

<style lang="css">
  #app {
    display: flex;
    justify-content: center;
    align-items: center;
    height: 100%;
  }
  h1 {
    font-weight: 300;
  }
</style>
```

然后编写入口文件：

```js
import Vue from "vue";
import App from "./app.vue";

new Vue({
  el: "#app",
  render: h => h(App)
});
```

最后编写 HTML 文件：

```html
<html>
  <head>
    <title>Welcome to Vue</title>
  </head>
  <body>
    <style>
      .sidebar {
        margin-top: 48px;
      }

      #nav {
        position: fixed;
        z-index: 9;
        padding: 0 8px;
        display: flex;
        justify-content: space-evenly;
        align-items: center;
        width: 300px;
        top: 0;
        height: 60px;
      }
    </style>
    <div id="nav">
      <h3><a href="http://ng-tech.icu/books">Books</a></h3>
      <span style="margin:0 8px;display:inline-block">|</span>
      <h3><a href="https://github.com/FE-Kits">FE-Kits</a></h3>
      <span style="margin:0 8px;display:inline-block">|</span>
      <h3><a href="https://github.com/BE-Kits">BE-Kits</a></h3>
      <span style="margin:0 8px;display:inline-block">|</span>
      <h3><a href="https://github.com/AI-Kits">AI-Kits</a></h3>
    </div>
    <div id="app"></div>
    <script src="src/main.js"></script>
  </body>
</html>
```

然后可以直接使用 Parcel 运行 html 文件：

```sh
# 运行
$ parcel serve path/to/index.html --no-cache

# 打包
$ parcel build path/to/index.html --public-url . --no-source-maps --no-cache --detailed-report
```

## React

首先编写 React 组件：

```tsx
import * as React from "react";

export default class App extends React.Component<any, any> {
  render() {
    return (
      <div className="container">
        <h1>typescript react component</h1>
      </div>
    );
  }
}
```

然后编写入口文件：

```ts
import * as React from "react";
import { render } from "react-dom";

import App from "./components/App";

render(<App />, document.getElementById("root"));
```

以及 HTML 入口文件：

```html
<html lang="en">
  <head>
    <title>Parcel with Typescript</title>
  </head>
  <body>
    <div id="root"></div>
    <script src="./index.tsx"></script>
  </body>
</html>
```

最后同样执行打包操作：

```sh
# 运行
$ parcel serve path/to/index.html --no-cache

# 打包
$ parcel build path/to/index.html --public-url . --no-source-maps --no-cache --detailed-report
```

# 生产模式

## 代码分割

Parcel 支持零配置代码拆分，并且开箱即用。这允许您将应用程序的代码拆分成单独的包，这些包可以按需加载，这意味着更小的初始包大小和更短的加载时间。随着用户在应用程序中浏览相应的模块需要加载，Parcel 会自动负责按需加载子捆绑包。

代码拆分时通过使用动态 import() 函数的语法提案来控制的，该提案与普通 import 语句或 require 函数的类似，但返回一个 Promise 对象。这意味着模块是异步加载的。以下示例展示了如何使用动态导入(dynamic import)来按需加载应用程序的子页面。

```js
// pages/about.js
export function render() {
  // 渲染页面
}

import("./pages/about").then(function(page) {
  // 渲染页面
  page.render();
});
```

因为 import() 返回一个 Promise，所以你也可以使用 async/await 语法。不过，在浏览器广泛支持它之前，你可能需要配置 Babel 来转换语法。

```js
const page = await import("./pages/about");
// 渲染页面
page.render();
```

动态导入也会在 Parcel 中延迟加载，因此你仍然需要将所有的 import() 调用放在文件的顶部，并且在使用子捆绑包之前，它们不会被加载。以下示例展示如何动态地延迟加载应用程序的子页面。

```js
// 设置页面名称到动态引入的映射中。
// 在使用前，这些页面都不会被加载。
const pages = {
  about: import("./pages/about"),
  blog: import("./pages/blog")
};

async function renderPage(page) {
  // 懒加载请求页面。
  const page = await pages[page];
  return page.render();
}
```

注意：如果你仍然想在本地浏览器中使用不支持的语法 async/await，切记需要在你的应用程序引入 babel-polyfill 或在你的库中引入 babel-runtime + babel-plugin-transform-runtime。

```sh
yarn add babel-polyfill
```

```js
import "babel-polyfill";
import "./app";
```

## 多页面应用

建立 pages 文件夹放 html 文件：

```html
// index.html
<html lang="en">
  <head>
    <title>index</title>
  </head>
  <body>
    <nav>
      <ul>
        <li><a href="./page1.html">第一页</a></li>
        <li><a href="./page2.html">第二页</a></li>
        <li><a href="./page3.html">第三页</a></li>
      </ul>
    </nav>
    <h1>这是首页</h1>
  </body>
</html>

// page1.html
<html lang="en">
  <head>
    <title>Page 1</title>
  </head>
  <body>
    <h1>第一页</h1>
    <a href="./index.html">返回首页</a>
    <script src="../js/page1.js"></script>
  </body>
</html>

// page2.html
<html lang="en">
  <head>
    <title>Page 2</title>
  </head>
  <body>
    <h1>第二页</h1>
    <a href="./index.html">返回首页</a>
    <script src="../js/page2.js"></script>
  </body>
</html>

// page3.html
<html lang="en">
  <head>
    <title>Page 3</title>
  </head>
  <body>
    <h1>第三页</h1>
    <a href="./index.html">返回首页</a>
    <script src="../js/page3.js"></script>
  </body>
</html>
```

建立 css 文件夹放 less 文件：

```less
// base.less
body {
  background: grey;
  color: #ffffff;
}

// page1.less
body {
  background: red !important;
}

// page2.less
body {
  background: black !important;
}

// page3.less
body {
  background: green !important;
}
```

建立 js 文件夹放 js 文件：

```js
// base.js
import "../css/base.less";

export const baseFunc = text => {
  alert(`baseFunc --- by ${text}`);
};

// page1.js
import "../css/page1.less";
import { baseFunc } from "./base";

baseFunc("page1");

// page2.js
import "../css/page2.less";
import { baseFunc } from "./base";

baseFunc("page2");

// page3.js
import "../css/page3.less";
import { baseFunc } from "./base";

baseFunc("page3");
```

最后开发与打包，注意这里使用 `*` 号匹配 html 路径：

```sh
# 开发
$ parcel serve path/to/pages/*.html --no-cache

# 打包
$ parcel build path/to/pages/*.html --public-url ./ --no-source-maps --no-cache --detailed-report
```

# 自定义插件

写一个 Asset 实现类 myAsset.js

```js
const path = require("path");
const json5 = require("json5");
const { minify } = require("terser");
const { Asset } = require("parcel-bundler");

class MyAsset extends Asset {
  constructor(name, options) {
    super(name, options);
    this.type = "js"; // set the main output type.
  }

  async parse(code) {
    // parse code to an AST
    return path.extname(this.name) === ".json5" ? json5.parse(code) : null;
  }

  // async pretransform() { // 转换前
  //   // optional. transform prior to collecting dependencies.
  // }

  // collectDependencies() { // 分析依赖
  //   // analyze dependencies
  // }

  // async transform() { // 转换
  //   // optional. transform after collecting dependencies.
  // }

  async generate() {
    // 生成代码
    // code generate. you can return multiple renditions if needed.
    // results are passed to the appropriate packagers to generate final bundles.
    let code = `module.exports = ${
      this.ast ? JSON.stringify(this.ast, null, 2) : this.contents
    };`;

    if (this.options.minify && !this.options.scopeHoist) {
      let minified = minify(code);
      if (minified.error) {
        throw minified.error;
      }
      code = minified.code;
    }

    return [
      {
        type: "json2",
        value: this.contents
      },
      {
        type: "js",
        value: code
      }
    ];
  }

  // async postProcess(generated) { // 生成代码完成之后操作
  //   // Process after all code generating has been done
  //   // Can be used for combining multiple asset types
  // }
}

module.exports = MyAsset;
```

然后再写一个 Packager 实现类 myPackager.js：

```js
const { Packager } = require("parcel-bundler");

class MyPackager extends Packager {
  async start() {
    // 文件头之前的内容
    // optional. write file header if needed.
    await this.dest.write(`\n123-before\n`);
  }

  async addAsset(asset) {
    // 文件内容
    // required. write the asset to the output file.
    await this.dest.write(`\n${asset.generated.json2}\n`);
  }

  async end() {
    // 写在文件尾 的内容
    // optional. write file trailer if needed.
    await this.dest.end(`\nabc-after\n`);
  }
}

module.exports = MyPackager;
```

然后编写插件方法 myPlugin.js：

```js
module.exports = function(bundler) {
  bundler.addAssetType(".josn2", require.resolve("./MyAsset"));
  bundler.addPackager("json2", require.resolve("./MyPackager"));
};
```

只需要将 `parcel-plugin-` 前缀的包，加入到 package.json 中，pacel 在初始化的时候就会自动加载这些插件。或者通过 Parcel 类使用：

```js
const path = require("path");
const Bundler = require("parcel-bundler");
const bundler = new Bundler(file, options);

// 获取node命令行的参数
const args = process.argv.splice(2);

// Entrypoint file location
const file = path.join(__dirname, "./src/index.html");
// Bundler options
const options = {
  outDir: "./demo_custom/dist", // The out directory to put the build files in, defaults to dist
  //   outFile: './demo_custom/dist/index.html', // The name of the outputFile
  //   publicUrl: './demo_custom/dist', // The url to server on, defaults to dist
  watch: true, // whether to watch the files and rebuild them on change, defaults to process.env.NODE_ENV !== 'production'
  cache: false, // Enabled or disables caching, defaults to true
  cacheDir: ".cache", // The directory cache gets put in, defaults to .cache
  minify: true, // Minify files, enabled if process.env.NODE_ENV === 'production'
  target: "browser", // browser/node/electron, defaults to browser
  https: false, // Serve files over https or http, defaults to false
  logLevel: 3, // 3 = log everything, 2 = log warnings & errors, 1 = log errors
  hmrPort: 0, // The port the HMR socket runs on, defaults to a random free port (0 in node.js resolves to a random free port)
  sourceMaps: args[0] !== "build", // Enable or disable sourcemaps, defaults to enabled (not supported in minified builds yet)
  hmrHostname: "", // A hostname for hot module reload, default to ''
  detailedReport: args[0] === "build", // Prints a detailed report of the bundles, assets, filesizes and times, defaults to false, reports are only printed if watch is disabled
  open: true,
  port: 1234,
  production: args[0] === "build"
};

const runBundle = async () => {
  // Initializes a bundler using the entrypoint location and options provided
  const bundler = new Bundler(file, options);
  bundler.addAssetType(".json2", require.resolve("./myAsset")); // 引入刚刚写好的资源识别类 【识别xx.json2类型文件】
  bundler.addPackager("json2", require.resolve("./myPackager")); // 引入刚刚写好的打包类【打包 xx.json2 类型文件】
  if (cli === "serve" && options.open) {
    const server = await bundler.serve(options.port);
    if (server) {
      await require("parcel-bundler/src/utils/openInBrowser")(
        `http://localhost:${options.port}`,
        true
      );
    }
  } else {
    childProcess.exec(`rm -rf ${path.join(__dirname, "./dist")}`);
    bundler.bundle();
  }
};
```
