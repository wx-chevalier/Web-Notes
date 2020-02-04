# TreeShaking

除了 Webpack 之外，还有很多其他优秀的模块打包工具，譬如 Browserify、Rollup.js 等。Rollup.js 由 Rich Harris 开发并且开源，其发布之处主打的特性是支持所谓的 TreeShaking，仅在最后的生成包体中仅包含使用到的代码而并非全部代码都打包进来。在 Webpack 1 中其并未支持 ES6 的`imports`与`exports`语法，而是需要转化为`var module = require('module')`；不过在 Webpack 2 中其已经能够原生支持 ES6 模块的语法，意味着可以引入像 TreeShaking 这样的模块优化机制了，在后续的 Webpack 3 中通过 Scope Hoisting 等方案可以解决小模块问题。我们以一个简单的例子来介绍 TreeShaking 的机制，假设我们的应用包含两个文件：index.js 与 module.js, 在后者中我们导出了两个辅助函数：

```js
// module.js
export const sayHello = name => `Hello ${name}!`;
export const sayBye = name => `Bye ${name}!`;
```

而在 index.js 中我们仅引入了`sayHello`函数：

```js
// index.js
import { sayHello } from "./module";
sayHello("World");
```

虽然我们同样暴露了`sayBye`这个函数，但是从未使用过，那么基于 TreeShaking 优化机制，最后的打包文件如下所示：

```
// bundle.js
const sayHello = name => `Hello ${name}!`;
sayHello('World');
```

通过这个小例子相信大家能够明白 TreeShaking 的机制，形象化来考虑，我们将应用看做某个依赖关系图谱，也就是一棵依赖树，每个 export 都可以看做一根树枝。我们通过摇晃这棵树来让那些没有使用的、假死状态的树枝脱落。在 Webpack 中我们往往使用`babel-loader`来转换所有的 JavaScript 文件使其能够运行在较低版本的浏览器上，不过同样其会将 ES6 的模块语法转化为 AMD 或者 CommonJS 规范等，我们需要在 Webpack 2 中进行如下配置来避免 Babel 对模块语法进行转换：

```js
// webpack.config.js
const HtmlWebpackPlugin = require("html-webpack-plugin");
module.exports = {
  entry: "./src/index.js",
  output: { filename: "bundle.js", path: "dist" },
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        loader: "babel-loader",
        options: {
          presets: [["es2015", { modules: false }]]
        }
      }
    ]
  },
  plugins: [new HtmlWebpackPlugin({ title: "Tree-shaking" })]
};
```
