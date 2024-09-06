# WASM 调用 JavaScript

WebAssembly 在执行完成之后可能会需要返回部分返回值，针对这个场景其也分为两种情况：

- 如果返回 int、float、double 等基础类型，那么直接函数声明返回类型后返回即可；
- 如果需要返回数组、指针等类型，则可以通过 `EM_ASM` 或是 `Memory Copy` 的方式进行处理；

例如我们在 WebAssembly 端接收并解析 JSON 字符串后，判断对应数值然后返回修改后的 JSON 字符串，这个需求我们采用 `EM_ASM` 方式的代码如下：

```c
#include <stdio.h>
#include "cJSON/cJSON.h"
#ifdef __EMSCRIPTEN__
#include <emscripten.h>
#endif

int json_parse(const char *jsonstr) {
    cJSON *json = cJSON_Parse(jsonstr);
    cJSON *data = cJSON_GetObjectItem(json, "data");
    cJSON_SetValuestring(data, "Hi!");

    const char *result = cJSON_Print(json);
    #ifdef __EMSCRIPTEN__
        EM_ASM({
            if(typeof window.onRspHandler == "function"){
                window.onRspHandler(UTF8ToString($0))
            }
        }, result);
    #endif

    cJSON_Delete(json);
    return 0;
}
```

首先我们引入 emscripten.h 头文件，接着我们使用 `EM_ASM` 调用外部的 `window.onRspHandler` 回调方法即可完成对应需求。`EM_ASM` 大括号内可以书写任意的 JavaScript 代码，并且可以对其进行传参操作。在本例中，我们将 result 传递给 `EM_ASM` 方法，其 `$0` 为传参的等价替换，若还有更多参数则可以写为 `$1`、`$2`等。接着，我们编译对应代码，然后访问 sample.html，并在控制台执行如下代码完成 JavaScript 到 WebAssembly 的调用：

```js
window.onRspHandler = (result) => {
  console.log(result); // output: {"data":"Hi!"}
};

const jsonstr = JSON.stringify({ data: "Hello World!" });
const ptr = allocate(intArrayFromString(jsonstr), "i8", ALLOC_NORMAL);
Module._json_parse(ptr);
```

可以看到，`window.onRspHandler` 函数被调用并正确的进行了结果输出。实际上 Emscripten 给我们提供了非常多的 JavaScript 调用函数及宏，包括：

- EM_ASM
- EM_ASM_INT
- emscripten_run_script
- emscripten_run_script_int
- emscripten_run_script_string
- emscripten_async_run_script
- …

但是在一般实践中我们推荐使用 `EM_ASM_*` 的相关宏来进行对应的 JavaScript 调用，其原因在于 `EM_ASM_*` 的内容在编译中会被抽出内联为对应的 JavaScript 函数，上面的例子在编译之后实际上得到的内容如下所示：

```c
function _json_parse($jsonstr) {
  // ...
  $call4 = _emscripten_asm_const_ii(0,($4|0))|0;
  // ...
}
```

我们可以看到在这里，我们 `EM_ASM` 的调用其实质是直接调用了 `_emscripten_asm_const_ii`，而 `_emscripten_asm_const_ii` 函数内容如下：

```js
var ASM_CONSTS = [function($0) {
    if(typeof window.onRspHandler == "function"){
        window.onRspHandler(UTF8ToString($0))
    }
}];

function _emscripten_asm_const_ii(code, a0) {
  return ASM_CONSTS[](a0);
}
```

我们所编写的 JavaScript 代码被放置到了 ASM*CONSTS 数组之中，然后被通过对应的索引位置进行调用。而对于 `emscripten_run_script*\*`相关函数而言，其实质是调用了`eval`来进行执行。因此两者在频繁调用的场景下会有比较大的性能差距。分析完`EM_ASM`的方式，那如果我们使用`Memory Copy` 的话怎么做呢？代码如下：

```c
#include <stdio.h>
#include <memory.h>
#include <string.h>
#include "cJSON/cJSON.h"

int json_parse(const char *jsonstr, char *output) {
    cJSON *json = cJSON_Parse(jsonstr);
    cJSON *data = cJSON_GetObjectItem(json, "data");
    cJSON_SetValuestring(data, "Hi!");

    const char *string = cJSON_Print(json);
    memcpy(output, string, strlen(string));

    cJSON_Delete(json);
    return 0;
}
```

我们相比之前的实现多传递了一个参数 output，在 WebAssembly 端解析、改写 JSON 完成后，使用 memcpy 将对应结果复制到 output 当中。接着，我们编译对应代码，然后访问 sample.html，并在控制台执行如下代码完成 JavaScript 到 WebAssembly 的调用：

```c
const jsonstr = JSON.stringify({data:"Hello World!"});
const ptr = allocate(intArrayFromString(jsonstr), 'i8', ALLOC_NORMAL);


const output = Module._malloc(1024);
Module._json_parse(ptr, output);
console.log(UTF8ToString(output)); // output: {"data":"Hi!"}
```

如上所示，我们使用 `Malloc._malloc` 创建了一块堆内存，并传递给 `_json_parse` 函数，同时使用 `UTF8ToString` 方法将对应 JSON 字符串结果输出。

# 更多的 Emscripten 的 API

实际上 Emscripten 为了方便我们在 C/C++中编写代码，其提供了非常多的 API 供我们使用，其中包括：Fetch、File System、VR、HTML5、WebSocket 等诸多实现。例如我们以 Fetch 为例：

```c
#include <stdio.h>
#include <string.h>

#ifdef __EMSCRIPTEN__
#include <emscripten/fetch.h>
void downloadSucceeded(emscripten_fetch_t *fetch) {
  printf("%llu %s.\n", fetch->numBytes, fetch->url);
  emscripten_fetch_close(fetch);
}

void downloadFailed(emscripten_fetch_t *fetch) {
  emscripten_fetch_close(fetch);
}
#endif


int main() {
#ifdef __EMSCRIPTEN__
  emscripten_fetch_attr_t attr;
  emscripten_fetch_attr_init(&attr);
  strcpy(attr.requestMethod, "GET");
  attr.attributes = EMSCRIPTEN_FETCH_LOAD_TO_MEMORY;
  attr.onsuccess = downloadSucceeded;
  attr.onerror = downloadFailed;
  emscripten_fetch(&attr, "http://myip.ipip.net/");
#endif
}
```

在上面的代码中我们使用了 `emscripten_fetch` 相关函数来进行浏览器宿主环境 fetch 方法的调用。为了启用 Emscripten 中的 Fetch 能力，我们还需要修改编译链接参数，为其增加-s FETCH=1：

```cpp
#....
set_target_properties(sample PROPERTIES LINK_FLAGS "\
    -s NO_EXIT_RUNTIME=1 \
    -s FETCH=1 \
")
```
