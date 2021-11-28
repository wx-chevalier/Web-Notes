# 与 JavaScript 集成使用

# 模块加载

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

## wasm-loader

我们也可以使用 wasm-loader 进行加载，这样可以将 wasm 直接打包在 Bundle 中，然后通过 `import` 导入：

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

# 参数传递

对于 WebAssembly 项目而言，我们经常会需要接收外部 JavaScript 传递的相关数据，难免就会涉及到互操作的问题。我们一般情况而言是需要从外部 JavaScript 中获取到 JSON 字符串，然后在 WebAssembly 代码中进行解析后做对应的业务逻辑处理，并返回对应的结果给外部 JavaScript。接下来，我们会增强 JSON 解析的相关代码，实现如下：

```c
#include <stdio.h>
#include "cJSON/cJSON.h"

int json_parse(const char *jsonstr) {
    cJSON *json = cJSON_Parse(jsonstr);
    const cJSON *data = cJSON_GetObjectItem(json, "data");
    printf("%s\n", cJSON_GetStringValue(data));
    cJSON_Delete(json);
    return 0;
}
```

在如上代码中，我们将相关逻辑封装在 json_parse 的函数之中，以便外部 JavaScript 能够顺利的调用得到此方法，接着我们修改一下 CMakeList.txt 的编译链接参数：

```c
#....
set_target_properties(sample PROPERTIES LINK_FLAGS "\
    -s EXIT_RUNTIME=1 \
    -s EXPORTED_FUNCTIONS=\"['_json_parse']\"
")
```

`EXPORTED_FUNCTIONS` 配置用于设置需要暴露的执行函数，其接受一个数组。这里我们需要将 `json_parse` 进行暴露，因此只需要填写 `_json_parse` 即可。需要注意的是，这里暴露的函数方法名前面以下划线（`_`）开头。然后我们执行 emcmake 编译即可得到对应的生成文件。

接着我们访问 sample.html，并在控制台执行如下代码完成 JavaScript 到 WebAssembly 的调用：

```js
let jsonstr = JSON.stringify({ data: "Hello World!" });
jsonstr = intArrayFromString(jsonstr).concat(0);

const ptr = Module._malloc(jsonstr.length);
Module.HEAPU8.set(jsonstr, ptr);
Module._json_parse(ptr);
```

在这里，`intArrayFromString`、`Module._malloc` 以及 `Module.HEAPU8` 等都是 Emscripten 提供给我们的方法。`intArrayFromString` 会将字符串转化成 UTF8 的字符串数组，由于我们知道 C/C++中的字符串是需要 `\0` 结尾的，因此我们在末尾 concat 了一个 0 作为字符串的结尾符。接着，我们使用 `Module._malloc` 创建了一块堆内存并使用 `Module.HEAPU8.set` 方法将字符串数组赋值给这块内存，最后我们调用 `_json_parse` 函数即可完成 WebAssembly 的调用。

需要注意的是，由于 WebAssembly 端的 C/C++代码接收的是指针，因此你是不能够将 JavaScript 的字符串直接传给 WebAssembly 的。但如果你传递的是 int、float 等基本类型，那么就可以直接进行传递操作。当然，上面的代码我们还可以进一步简化为：

```c
const jsonstr = JSON.stringify({data:"Hello World!"});
const ptr = allocate(intArrayFromString(jsonstr), 'i8', ALLOC_NORMAL);
Module._json_parse(ptr);
```

那为何需要如此繁琐的方式才能进行引用/指针类型的调用传参呢？在这里我们深入一点 Emscripten 的底层实现，为了方便说明，我们以 ASM.js 的相关逻辑作为参考进行剖析（WASM 实现同理）。我们调整下对应的 `CMakeList.txt` 将代码编译为 ASM.js：

```c
set_target_properties(sample PROPERTIES LINK_FLAGS " \
    -s WASM=0 \
    -s TOTAL_MEMORY=16777216 \
    -s EXIT_RUNTIME=1 \
    -s EXPORTED_FUNCTIONS=\"['_json_parse']\" \
")
```

在这里我们将对应的编译链接参数增加 `-s WASM=0` 及 `-s TOTAL_MEMORY=16777216`，然后进行相关的编译操作得到 `sample.html` 及 `sample.js`。首先我们来了解一下 `-s TOTAL_MEMORY=16777216` 的作用，我们搜索 `16777216` 这个数字时我们可以看到如下的代码：

```c
function updateGlobalBufferAndViews(buf) {
  buffer = buf;
  Module['HEAP8'] = HEAP8 = new Int8Array(buf);
  Module['HEAP16'] = HEAP16 = new Int16Array(buf);
  Module['HEAP32'] = HEAP32 = new Int32Array(buf);
  Module['HEAPU8'] = HEAPU8 = new Uint8Array(buf);
  Module['HEAPU16'] = HEAPU16 = new Uint16Array(buf);
  Module['HEAPU32'] = HEAPU32 = new Uint32Array(buf);
  Module['HEAPF32'] = HEAPF32 = new Float32Array(buf);
  Module['HEAPF64'] = HEAPF64 = new Float64Array(buf);
}

var STATIC_BASE = 8,
    STACK_BASE = 2960,
    STACKTOP = STACK_BASE,
    STACK_MAX = 5245840,
    DYNAMIC_BASE = 5245840,
    DYNAMICTOP_PTR = 2928;

// ....

var INITIAL_TOTAL_MEMORY = Module['TOTAL_MEMORY'] || 16777216;


// ....

if (Module['buffer']) {
  buffer = Module['buffer'];
} else {
  buffer = new ArrayBuffer(INITIAL_TOTAL_MEMORY);
}


INITIAL_TOTAL_MEMORY = buffer.byteLength;
updateGlobalBufferAndViews(buffer);
```

在这段代码中我们可以看到实际上 Emscripten 帮助我们使用 `ArrayBuffer` 开辟了一块内存，并将这块内存分为了 `栈（STACK)` 和 `堆（DYNAMIC/HEAP)` 两个区域，而这里的 `TOTAL_MEMORY` 实际上是指明了程序运行内存的实际可用大小（这里非常像简化版的进程内存布局）。同时我们可以看到我们在上面提及的 `Module.HEAPU8` 等实际上只是这块内存上的不同类型的指针类型（或者说不同的 `ArrayBuffer` 类型）。因此当我们在进行 `Module.HEAPU8.set` 的相关操作时，其本质上也是在对这块内存进行相关的操作。

接着我们查找 `_json_parse` 关键字，`_json_parse` 的编译后代码如下所示：

```c
function _json_parse($jsonstr) {
 $jsonstr = $jsonstr|0;
 // ...
 sp = STACKTOP;
 STACKTOP = STACKTOP + 16|0;
 // ...
 $jsonstr$addr = $jsonstr;
 $0 = $jsonstr$addr;
 $call = (_cJSON_Parse($0)|0);
 // ...
 HEAP32[$vararg_buffer>>2] = $call2;
 (_printf(1005,$vararg_buffer)|0);
 STACKTOP = sp;return 0;
}
```

对于 `_json_parse` 这个函数调用而言，由于我们传入的是字符串，因此 `$jsonstr` 实际上是程序运行内存上的某个地址，其很自然地进行了 `|0` 操作。接着它先对栈顶进行了保存，然后将 `$jsonstr$addr`（实际上就是 `$jsonstr`）传递给了 `_cJSON_Parse` 函数，最后进行一系列相关调用后恢复栈地址，结束运行。在这里需要我们注意的是，实际上 `$jsonstr$addr` 的相关连续内存的内容上就是我们通过 `Module.HEAPU8.set` 设置的对应数据，如果需要传递类似如上的指针数据的话，其实质上是传递了程序运行内存的对应地址信息。因此我们如果直接传入 JavaScript 的原生字符串、对象、数组等对象参数，ASM.js 并不能将其从自己程序的运行内存中获取（内存地址信息并不一致）。对于 WebAssembly 而言其调用本质与 ASM.js 一致，若有兴趣可以编译后自行探索。
