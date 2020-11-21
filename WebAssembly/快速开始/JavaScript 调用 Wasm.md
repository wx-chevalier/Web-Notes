# 与 JavaScript 集成使用

独立的 .wasm 文件并不能直接使用，我们需要在客户端中使用 JavaScript 代码将其加载进来。最朴素的加载 WebAssembly 的方式就是使用 fetch 抓取然后编译，整个过程可以封装为如下函数：

```js
// 判断是否支持 WebAssembly
if (!("WebAssembly" in window)) {
  alert("当前浏览器不支持 WebAssembly！");
} // Loads a WebAssembly dynamic library, returns a promise. // imports is an optional imports object
function loadWebAssembly(filename, imports) {
  // Fetch the file and compile it
  return fetch(filename)
    .then((response) => response.arrayBuffer())
    .then((buffer) => WebAssembly.compile(buffer))
    .then((module) => {
      // Create the imports for the module, including the
      // standard dynamic library imports
      imports = imports || {};
      imports.env = imports.env || {};
      imports.env.memoryBase = imports.env.memoryBase || 0;
      imports.env.tableBase = imports.env.tableBase || 0;
      if (!imports.env.memory) {
        imports.env.memory = new WebAssembly.Memory({ initial: 256 });
      }
      if (!imports.env.table) {
        imports.env.table = new WebAssembly.Table({
          initial: 0,
          element: "anyfunc",
        });
      } // Create the instance.
      return new WebAssembly.Instance(module, imports);
    });
}
```

我们可以使用上述工具函数加载 wasm 文件：

```js
loadWebAssembly("counter.wasm").then((instance) => {
  var exports = instance.exports; // the exports of that instance
  var count = exports._count; // the "_count" function (note "_" prefix) // 下面即可以调用 count 函数
});
```

而在笔者的[脚手架](https://github.com/wx-chevalier/create-react-boilerplate)中，使用了 wasm-loader 进行加载，这样可以将 wasm 直接打包在 Bundle 中，然后通过 `import` 导入：

```js
import React, { PureComponent } from "react";

import CounterWASM from "./counter.wasm";
import Button from "antd/es/button/button";

import "./Counter.scss";

/** 简单计数器示例 */
export default class Counter extends PureComponent {
  state = {
    count: 0,
  };

  componentDidMount() {
    this.counter = new CounterWASM({
      env: {
        memoryBase: 0,
        tableBase: 0,
        memory: new window.WebAssembly.Memory({ initial: 256 }),
        table: new window.WebAssembly.Table({ initial: 0, element: "anyfunc" }),
      },
    });
    this.setState({
      count: this.counter.exports._count(),
    });
  }
  /**
   * Description 默认渲染函数
   */

  render() {
    const isWASMSupport = "WebAssembly" in window;

    if (!isWASMSupport) {
      return <div>  浏览器不支持 WASM </div>;
    }

    return (
      <div className="Counter__container">
        <span>  简单计数器示例: </span>
        <span>{this.state.count}</span>

        <Button
          type="primary"
          onClick={() => {
            this.setState({
              count: this.counter.exports._count(),
            });
          }}
        >
          点击自增
        </Button>
      </div>
    );
  }
}
```

在使用 `wasm-loader` 时，其会调用 `new WebAssembly.Instance(module, importObject);`

- `module` 即 [WebAssembly.Module](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/WebAssembly/Module) 实例。
- `importObject` 即默认的由 `wasm-loader` 提供的对象。
