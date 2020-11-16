# Snowpack

Snowpack 是 JavaScript 构建工具领域中的一个有趣的新成员。与其他解决方案相比，Snowpack 的关键的改进是可以使用 React.js，Vue.js 和 Angular 等现代框架来构建应用程序，而无需打包器。由于省去了打包的环节，对代码的任何修改都几乎可以立即显
示在浏览器上，因此开发过程中的反馈周期得到了极大的改善。为了达到这个神奇的效果，Snowpack 将 node_modules 中的依赖转换为单个的 JavaScript 文件，并将其放置于一个新的 web_modules 目录中，从这个目录中可以将它们作为 ECMAScript 模块（ESM）导入。对于 IE11 和其他不支持 ESM 的浏览器，它也支持一种变通方法。遗憾的是，目前还没有任何浏览器可以从 JavaScript 中导入 CSS，因此使用 CSS 模块并不简单。
