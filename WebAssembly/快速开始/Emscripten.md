# Emscriptrn

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

# Hello World

我们先以打印 Hello World! 作为我们学习 WebAssembly 的第一个程序吧！让我们先快速编写一个 C/C++的打印 Hello World! 代码，如下所示：
