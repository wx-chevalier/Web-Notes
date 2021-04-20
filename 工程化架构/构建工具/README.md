# Web 构建与打包工具

自 2011 年开始随着前端项目复杂度的增加，社区提出了很多工具或者框架的方案；首先崛起的是以 RequireJS 与 SeaJS 为代表的模块加载器(Module Loader)；虽然譬如 Yui、Dojo 这些当时流行的前端框架已经有了自己的模块化支持方案，但是 RequireJS 是首个通用的流行前端模块化规范。不过 RequireJS 中所有模块都是异步加载，导致了发布到生产环境时会非常麻烦，因此又出现了如 r.js 这样的能够帮助模块加载器进行文件合并与压缩的工具。

此时在开发流程中需要针对每个入口文件使用 r.js 等工具进行打包，于是社区又提出了以 Grunt、Gulp 为代表的任务自动化运行工具(Task Runner)。Grunt 与 Gulp 殊途同归，前者基于临时文件进行构建，后者通过文件流处理；但是它们都是旨在解决文件自动化处理问题，通过结合模块加载器、加载器打包工具以及任务自动化工具，我们可以实现初步的开发流程自动化。虽然任务自动化运行工具允许开发者在项目中配置一些自动化的任务以便捷进行文件合并、代码压缩、后处理等操作，不过它们存在的问题在于其不能够去真正的自动化解析依赖，并且对于 HTML、CSS、JavaScript 这些不同类型的资源文件只能分割独立地处理，无形会大大拉低开发部署的速度。

在前端模块化尚未流行的年代里，每个 HTML 文件的尾部都会挂载很多的 `script` 标签来载入 JavaScript 代码，各个文件之间的依赖异常混乱，项目的可维护性随着代码的增加而迅速降低，整个应用的开发流程中也尚未有专门的编译流程。后来出现了以 Grunt/Gulp 为代表的所谓的 Task Runner：

虽然类似于 Gulp 这样的 Task Runner 也能添加很多的预处理器或者转换器，但是本质上它仍然需要指定元输入。而 Webpack 最早的动因即是希望能够让开发工具自己去处理模块依赖问题，开发者不需要再为每一个任务去指定输入输出：

综上所述，Webpack 具有如下优点：

- 代码拆分：Webpack 有两种组织模块依赖的方式，同步和异步。异步依赖作为分割点，形成一个新的块。在优化了依赖树后，每一个异步区块都作为一个文件被打包。
- Loader：Webpack 本身只能处理原生的 JavaScript 模块，但是 loader 转换器可以将各种类型的资源转换成 JavaScript 模块。这样，任何资源都可以成为 Webpack 可以处理的模块。
- 智能解析：Webpack 有一个智能解析器，几乎可以处理任何第三方库，无论它们的模块形式是 CommonJS、AMD 还是普通的 JS 文件。甚至在加载依赖的时候，允许使用动态表达式 `require("./templates/" + name + ".jade")`。
- 插件系统：Webpack 还有一个功能丰富的插件系统。大多数内容功能都是基于这个插件系统运行的，还可以开发和使用开源的 Webpack 插件，来满足各式各样的需求。
- 快速运行：Webpack 使用异步 IO 和多级缓存提高运行效率，这使得 Webpack 能够以令人难以置信的速度快速增量编译。Webpack 是笔者见过的最强大的模块管理器与编译工具，他不仅仅同时支持 CMD 与 AMD 模式，也能实时编译 JSX、ES6 等语法，还能将 CSS、图片等资源文件都进行打包。

另一个笔者想提到的所谓小模块问题，模块打包工具能够有效地帮我们自动处理模块之间的依赖关系，不过因为现在我们在进行模块打包的同时会进行大量的转换或者 Polyfill 的工作，导致了模块过多时最终的生成包体中会包含大量的胶水代码。譬如我们编写了两个简单的模块仅仅会导出一些常量：

```js
// index.js
var total = 0;
total += require("./module_0");
total += require("./module_1");
total += require("./module_2");
// etc.
console.log(total);
// module_0.js
module.exports = 0;
// module_1.js
module.exports = 1;
```

我们如果使用 Browserify 或者 Webpack 进行打包，其会将每个模块包裹进独立的函数作用域中，然后声明一个顶层的运行时加载器，譬如上述代码在 Browserify 中的打包结果如下：

```js
(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
module.exports = 0
},{}],2:[function(require,module,exports){
module.exports = 1
},{}],3:[function(require,module,exports){
module.exports = 10
},{}],4:[function(require,module,exports){
module.exports = 100
// etc.
```

而 Rollup 或者 Closure 打包的结果看起来会舒适很多：

```js
(function () {
'use strict';
var module_0 = 0
var module_1 = 1
// ...
total += module_0
total += module_1
// etc.
```

不过在大量模块的情况下，任何一种打包工具包体的增长速度会随着模块数的增长而变大：

| Bundler              | 100 modules | 1000 modules | 5000 modules |
| -------------------- | ----------- | ------------ | ------------ |
| browserify           | 7982        | 79987        | 419985       |
| browserify-collapsed | 5786        | 57991        | 309982       |
| webpack              | 3955        | 39057        | 203054       |
| rollup               | 1265        | 13865        | 81851        |
| closure              | 758         | 7958         | 43955        |
| rjs                  | 29234       | 136338       | 628347       |
| rjs-almond           | 14509       | 121612       | 613622       |
