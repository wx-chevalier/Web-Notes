# Snowpack

Snowpack 是一个现代的、轻量级的构建工具，用于更快的 Web 开发。传统的 JavaScript 构建工具，如 webpack 和 Parcel，每次保存一个文件时，都需要重建和重新捆绑整个应用程序的块。这个重新捆绑的步骤会在点击保存和在浏览器中看到它们之间产生滞后。在开发过程中，Snowpack 为您的应用程序提供非捆绑式服务。每个文件只需要构建一次，然后永远缓存。当一个文件发生变化时，Snowpack 会重新构建该单个文件。没有时间浪费在重新捆绑每一个变化，只是在浏览器中即时更新。

Snowpack 的非捆绑式开发仍然支持你习惯的生产用的捆绑式构建。当你去构建你的生产应用程序时，你可以通过官方的 Snowpack 插件插入你最喜欢的捆绑程序，用于 Webpack 或 Rollup（即将推出）。由于 Snowpack 已经在处理你的构建，所以不需要复杂的捆绑程序配置。Snowpack 为您提供了两全其美的解决方案：快速的、非捆绑式的开发，并在您的捆绑式生产构建中优化性能。

![Snowpack 与 Webpack 对比](https://s3.ax1x.com/2021/01/15/sw0XKs.png)

## Unbundled Development

非打包开发是指在开发过程中向浏览器运送单个文件的想法。文件仍然可以用你最喜欢的工具（如 Babel、TypeScript、Sass）来构建，然后通过 ESM 导入和导出语法在浏览器中单独加载依赖关系。任何时候你改变一个文件，Snowpack 只重建那个文件。另一种选择是捆绑式开发。如今几乎所有流行的 JavaScript 构建工具都专注于捆绑式开发。通过捆绑程序来运行你的整个应用程序会给你的开发工作流程带来额外的工作和复杂性，而现在 ESM 已经得到了广泛的支持，这一点是不必要的。每一个变化在每次保存时--必须与应用程序的其余部分重新捆绑，然后才能在浏览器中反映出你的变化。

## 使用 NPM 依赖

NPM 包主要是使用模块语法（Common.js，或者 CJS）发布的，如果不进行一些构建处理，就无法在网络上运行。即使你使用浏览器原生的 ESM 导入和导出语句来编写应用程序，这些语句都会直接在浏览器中运行，试图导入任何一个 npm 包都会迫使你回到捆绑式开发中。Snowpack 采用了一种不同的方法。Snowpack 没有将你的整个应用程序捆绑在一起，而是单独处理你的依赖关系。下面是它的工作原理。

```s
node_modules/react/**/*     -> http://localhost:3000/web_modules/react.js
node_modules/react-dom/**/* -> http://localhost:3000/web_modules/react-dom.js
```

- Snowpack 扫描你的网站/应用程序中所有使用的 npm 包。
- Snowpack 从你的 node_modules 目录中读取这些已安装的依赖项。
- Snowpack 将你所有的依赖关系分别捆绑到单个 JavaScript 文件中。例如：react 和 react-dom 分别被转换为 react.js 和 react-dom.js。
- 每个生成的文件都可以直接在浏览器中运行，并通过 ESM 导入语句导入。
- 因为你的依赖关系很少改变，所以 Snowpack 很少需要重建它们。

在 Snowpack 构建了你的依赖关系之后，任何包都可以直接导入并在浏览器中运行，而不需要额外的捆绑或工具。这种在浏览器中原生导入 npm 包的能力（不需要捆绑程序）是所有非捆绑开发和 Snowpack 其余部分的基础。

```html
<!-- This runs directly in the browser with `snowpack dev` -->
<body>
  <script type="module">
    import React from "react";
    console.log(React);
  </script>
</body>
```
