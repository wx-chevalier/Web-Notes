# Emscriptrn

Emscripten 是 WebAssembly 工具链里重要的组成部分。从最为简单的理解来说，Emscripten 能够帮助我们将 C/C++代码编译为 ASM.js 以及 WebAssembly 代码，同时帮助我们生成部分所需的 JavaScript 胶水代码。

但实质上 Emscripten 与 LLVM 工具链相当接近，其包含了各种我们开发所需的 C/C++头文件、宏参数以及相关命令行工具。通过这些 C/C++头文件及宏参数，其可以指示 Emscripten 为源代码提供合适的编译流程并完成数据转换，如下图所示：

![Emscriptrn 架构](https://s3.ax1x.com/2020/11/21/D3NXNQ.png)

emcc 是整个工具链的编译器入口，其能够将 C/C++代码转换为所需要的 LLVM-IR 代码，Clang/LLVM（Fastcomp）能够将通过 emcc 生成的 LLVM-IR 代码转换为 ASM.js 及 WebAssembly 代码，而 emsdk 及.emscripten 文件主要是用来帮助我们管理工具链内部的不同版本的子集工具及依赖关系以及相关的用户编译设置。

# 环境配置

我们使用 Emscripten 将 C 代码编译为 wasm 格式，官方推荐的方式是首先下载 [Portable Emscripten SDK for Linux and OS X (emsdk-portable.tar.gz)](https://s3.amazonaws.com/mozilla-games/emscripten/releases/emsdk-portable.tar.gz) 然后利用 emsdk 进行安装：

```sh
# 也可以直接拉取代码
$ git clone https://github.com/emscripten-core/emsdk.git

$ ./emsdk update
$ ./emsdk install latest
# 如果出现异常使用 ./emsdk install sdk-1.37.12-64bit
# https://github.com/kripken/emscripten/issues/5272
```

安装完毕后激活响应环境即可以进行编译：

```sh
$ ./emsdk activate latest
$ source ./emsdk_env.sh# you can add this line to your .bashrc
```

到这里基本环境已经配置完毕，我们可以对简单的 counter.c 进行编译，源文件如下：

```c
int counter = 100;

int count() {
  counter += 1;
  return counter;
}
```

```sh
$ emcc counter.c -s WASM=1 -s SIDE_MODULE=1 -o counter.wasm

# 如果出现以下错误，则是由如下参数
# WebAssembly Link Error: import object field 'DYNAMICTOP_PTR' is not a Number
emcc counter.c -O1 -s WASM=1 -s SIDE_MODULE=1 -o counter.wasm
```

这样我们就得到了 WebAssembly 代码:

![Some WebAssembly code](https://s3-eu-central-1.amazonaws.com/openbloc-blog/2017/06/Capture-du-2017-06-03-15-47-35.png)

## 使用 Docker

如果在本地执行上述搭建步骤时一直失败，可以改用 Docker 预先配置好的镜像进行处理：

```s
# 拉取 Docker 镜像
docker pull 42ua/emsdk

# 执行编译操作
docker run --rm -v $(pwd):/home/src 42ua/emsdk emcc hello_world.c
```

对应的 Dockfile 如下所示，我们可以自行修改以适应未来的编译环境：

```s
FROM ubuntu

RUN \
	apt-get update && apt-get install -y build-essential \
	cmake python2.7 python nodejs-legacy default-jre git-core curl && \
	apt-get clean && \
\
	cd ~/ && \
	curl -sL https://s3.amazonaws.com/mozilla-games/emscripten/releases/emsdk-portable.tar.gz | tar xz && \
	cd emsdk-portable/ && \
	./emsdk update && \
	./emsdk install -j1 latest && \
	./emsdk activate latest && \
\
	rm -rf ~/emsdk-portable/clang/tag-*/src && \
	find . -name "*.o" -exec rm {} \; && \
	find . -name "*.a" -exec rm {} \; && \
	find . -name "*.tmp" -exec rm {} \; && \
	find . -type d -name ".git" -prune -exec rm -rf {} \; && \
\
	apt-get -y --purge remove curl git-core cmake && \
	apt-get -y autoremove && apt-get clean


# http://docs.docker.com/engine/reference/run/#workdir
WORKDIR /home/src
```

编译命令如下所示，如果本地安装好了 emcc 则可以直接使用，否则使用 Docker 环境进行编译：

```sh
$ docker run --rm -v $(pwd):/home/src 42ua/emsdk emcc counter.c -s WASM=1 -s SIDE_MODULE=1 -o counter.wasm
```

## 编译参数

Emscripten 包含了非常丰富的相关设置参数帮助我们在编译和链接时优化我们的代码。其中部分常用的参数包括：

- -O1、-O2、-O3、-Oz、-Os、-g 等：编译优化，具体可参考 Emscripten 官网相关章节；
- -s ENVIRONMENT：设定编译代码的可执行环境，默认值为"web,work,node"；
- -s SINGLE_FILE：是否将 ASM.js 或 WebAssembly 代码以 Base64 的方式嵌入到 JavaScript 胶水代码中，可取值 0/1；
- -s WASM：是否编译为 WebAssembly 代码，0 编译为 ASM.js，1 编译为 WebAssembly；
- -s FETCH：是否启用 Fetch 模块，可取值 0/1；
- -s DISABLE_EXCEPTION_CATCHING：禁止生成异常捕获代码，可取值 0/1；
- -s ERROR_ON_UNDEFINED_SYMBOLS：编译时出现 Undefined Symbols 后是否退出，可取值 0/1；
- -s EXIT_RUNTIME: 执行完毕 `main` 函数后是否退出，可取值 0/1；
- -s FILESYSTEM：是否启用 File System 模块，可取值 0/1；
- -s INVOKE_RUN：是否执行 C/C++的`main`函数，可取值 0/1；
- -s ASSERTIONS：是否给运行时增加断言，可取值 0/1；
- -s TOTAL_MEMORY：总的可用内存使用数，可取以 16777216 为基数的整数值；
- -s ALLOW_MEMORY_GROWTH：当可用内存不足时，是否自动增长，可取值 0/1；
- -s EXPORTED_FUNCTIONS：暴露的函数列表名称；
- -s LEGACY_VM_SUPPORT：是否增加部分兼容函数以兼容低版本浏览器（iOS9、老版本 Chrome 等），可取值 0/1；
- -s MEM_INIT_METHOD：是否将.mem 文件以 Base64 的方式嵌入到 JavaScript 胶水代码中，可取值 0/1；
- -s ELIMINATE_DUPLICATE_FUNCTIONS：将重复函数进行自动剔除，可取值 0/1；
- –closure: 是否使用 Google Closure 进行最终代码的压缩，可取值 0/1；
- –llvm-lto：是否进行 LLVM 的链接时优化，可取值 0-3；
- –memory-init-file：同-s MEM_INIT_METHOD；

# Hello World

我们先以打印 Hello World! 作为我们学习 WebAssembly 的第一个程序吧！让我们先快速编写一个 C/C++的打印 Hello World! 代码，如下所示：

```c
#include <stdio.h>

int main() {
  printf("Hello World!\n");
  return 0;
}
```

使用相关的 GCC 等相关编译器能够很正确得到对应的输出：

```sh
> emcc main.c -o hello.html
```

执行完毕后你将得到三个文件代码，分别是：

- hello.html
- hello.js：相关的胶水代码，包括加载 WASM 文件并执行调用等相关逻辑
- hello.wasm：编译得到的核心 WebAssembly 执行文件

如果我们想要让 NodeJS 使用我们代码，那么直接执行：

```js
> emcc main.c
```

## 第三方库

在我们的日常的业务开发中相关程序是不可能如此简单的。除了我们自己的操作逻辑外，我们还会依赖于非常多商用或开源的第三方库及框架。比如在数据通信及交换中我们往往会使用到 JSON 这种轻量的数据格式。在 C/C++中有非常多相关的开源库能解决 JSON 解析的问题，例如 cJSON 等，那么接下来我们就增加一点点复杂度，结合 cJSON 库编一个简单的 JSON 解析的程序。

首先我们下载相关的源码放置在我们项目的 vendor 文件夹中。接着我们在当前项目的根目录下创建一个 CMakeLists.txt 文件，并填入如下内容：

```s
cmake_minimum_required(VERSION 3.15) # 根据你的需求进行修改
project(sample C)

set(CMAKE_C_STANDARD 11) # 根据你的C编译器支持情况进行修改
set(CMAKE_EXECUTABLE_SUFFIX ".html") # 编译生成.html

include_directories(vendor) # 使得我们能引用第三方库的头文件
add_subdirectory(vendor/cJSON)

add_executable(sample main.c)

# 设置Emscripten的编译链接参数，我们等等会讲到一些常用参数

set_target_properties(sample PROPERTIES LINK_FLAGS "-s EXIT_RUNTIME=1")
target_link_libraries(sample cjson) # 将第三方库与主程序进行链接
```

CMakeList.txt 是 CMake 的“配置文件”，CMake 会根据 CMakeLists.txt 的内容帮助我们生成跨平台的编译命令。然后让我们在代码中引入 cJSON 然后并使用它进行 JSON 的解析操作，代码如下：

```c
#include <stdio.h>
#include "cJSON/cJSON.h"

int main() {
    const char jsonstr[] = "{\"data\":\"Hello World!\"}";
    cJSON *json = cJSON_Parse(jsonstr);

    const cJSON *data = cJSON_GetObjectItem(json, "data");
    printf("%s\n", cJSON_GetStringValue(data));

    cJSON_Delete(json);
    return 0;
}
```

由于我们使用了 CMake，因此 Emscripten 的编译命令需要有一点点修改，我们将不使用 emcc 而是使用 emcmake 及 emmake 来创建我们的相关 WebAssembly 代码，命令如下：

```sh
> mkdir build
> cd build
> emcmake cmake ..
> emmake make
```

我们创建了一个 build 文件夹用来存放 cmake 相关的生成文件及信息，接着进入 build 文件夹并使用 emcmake 及 emmake 命令生成对应的 WebAssembly 代码 sample.html、sample.js、sample.wasm，最后我们执行访问 sample.html 后可以看到其正确的输出了 JSON 的 data 内容。

# WASM 的调试

对于开发的 WebAssembly 代码而言，我们对于调试可以使用两种方式，一种方式是通过日志的方式进行输出，另一种方式使用单步调试。使用日志的方式输出调试信息非常容易，Emscripten 能很好的支持 C/C++里面的相关 IO 库。而对于单步调试而言，目前最新版本的 Firefox 及 Chrome 浏览器都已经有了一定的支持，例如我们有如下代码：

```c
#include <stdio.h>

int main() {
    printf("Hello World!");
    return 0;
}
```

然后我们使用 emcc 进行编译得到相关的文件：

```s
> emcc -g4 main.c -o main.wasm # -g4可生成对应的sourcemap信息
```

接着打开 Chrome 及其开发者工具，我们就可以看到对应的 main.c 文件并进行单步调试了。但值得注意的是，目前 emcmake 对于 soucemap 的生成支持并不是很好，并且浏览器的单步调试支持也仅仅支持了代码层面的映射关系，对于比较复杂的应用来说目前的单步调试能力还比较不可用，因此建议开发时还是以日志调试为主要手段。

# Links

- https://web.dev/webassembly-threads/ Using WebAssembly threads from C, C++ and Rust
