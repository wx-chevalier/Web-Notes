# Web Worker

# 基础使用

```js
// 判断浏览器是否支持 Worker
typeof Worker !== "undefined";

// 从脚本中创建 Worker
new Worker("workers.js");

// 使用字符串方式创建 Worker
new Worker("data:text/javascript;charset=US-ASCII,...");
```

## worker-loader

[worker-loader](https://github.com/webpack-contrib/worker-loader) 是一个 webpack 插件，可以将一个普通 JS 文件的全部依赖提取后打包并替换调用处，以 Blob 形式内联在源码中。

```js
import Worker from "worker-loader!./file.worker.js";

const worker = new Worker();

// 转化为下述代码
const blob = new Blob([codeFromFileWorker], { type: "application/javascript" });
const worker = new Worker(URL.createObjectURL(blob));
```

## Blob

我们也可以自己通过 Blob 的方式创建：

```js
const code = `
  importScripts('https://xxx.com/xxx.js');
  self.onmessage = e => {};
`;

const blob = new Blob([code], { type: "application/javascript" });
const worker = new Worker(URL.createObjectURL(blob));
```

# 网络请求

By default, cookies are not included with fetch requests, but you can include them as follows: fetch(url, {credentials: 'include'}).

```js
function XHRWorker(url, ready, scope) {
  var oReq = new XMLHttpRequest();
  oReq.addEventListener(
    "load",
    function() {
      var worker = new Worker(
        window.URL.createObjectURL(new Blob([this.responseText]))
      );
      if (ready) {
        ready.call(scope, worker);
      }
    },
    oReq
  );
  oReq.open("get", url, true);
  oReq.send();
}

function WorkerStart() {
  XHRWorker(
    "http://static.xxx.com/js/worker.js",
    function(worker) {
      worker.postMessage("hello world");
      worker.onmessage = function(e) {
        console.log(e.data);
      };
    },
    this
  );
}

WorkerStart();
```

# 跨线程消息

开启新的线程伴随而来的问题就是通讯问题。webworker 的 postMessage 可以帮助我们完成通信，但是这种通信机制是将数据从一部分内存空间复制到主线程的内存下。这个赋值过程就会造成性能的消耗。而共享内存，顾名思义，可以让我们在不同的线程间，共享一块内存，这些现成都可以对内存进行操作，也可以读取这块内存。省去了赋值数据的过程，不言而喻，整个性能会有较大幅度的提升。

## postMessage

创建完毕之后，我们主要依靠 postMessage 与 onmessage 回调来在 Worker 线程与 UI 线程之间进行消息传递：

```js
// worker.js
// 向主线程发送消息
postMessage("event from worker");
// 接收来自主线程的消息
onmessage = function(event) {};

// UI
worker.onmessage = function(event) {};
worker.postMessage("event from ui");

// 关闭当前 worker
worker.terminate();
```

主线程与 Web Workers 之间的通信，并不是对象引用的传递，而是序列化/反序列化的过程，当对象非常庞大时，序列化和反序列化都会消耗大量计算资源，降低运行速度。

```js
// main
var worker = new Worker("./worker.js");

worker.onmessage = function getMessageFromWorker(e) {
  // 被改造后的数据，与原数据对比，表明数据是被克隆了一份
  console.log("e.data", "   -- ", e.data);
  // [2, 3, 4]

  // msg 依旧是原本的 msg，没有任何改变
  console.log("msg", "   -- ", msg);
  // [1, 2, 3]
};

var msg = [1, 2, 3];

worker.postMessage(msg);

// worker
onmessage = function(e) {
  var newData = increaseData(e.data);
  postMessage(newData);
};

function increaseData(data) {
  for (let i = 0; i < data.length; i++) {
    data[i] += 1;
  }

  return data;
}
```

由上述代码可知，每一个消息内的数据在不同的线程中，都是被克隆一份以后再传输的。数据量越大，数据传输速度越慢。

## sharedBufferArray

对象转移使用方式很简单，给 postMessage 增加一个参数，把对象引用传过去即可：

```js
var ab = new ArrayBuffer(1);
worker.postMessage(ab, [ab]);
```

```js
// main.js
var worker = new Worker("./sharedArrayBufferWorker.js");

worker.onmessage = function(e) {
  // 传回到主线程已经被计算过的数据
  console.log("e.data", "   -- ", e.data);
  // SharedArrayBuffer(3) {}

  // 和传统的 postMessage 方式对比，发现主线程的原始数据发生了改变
  console.log("int8Array-outer", "   -- ", int8Array);
  // Int8Array(3) [2, 3, 4]
};

var sharedArrayBuffer = new SharedArrayBuffer(3);
var int8Array = new Int8Array(sharedArrayBuffer);

int8Array[0] = 1;
int8Array[1] = 2;
int8Array[2] = 3;

worker.postMessage(sharedArrayBuffer);

// worker.js
onmessage = function(e) {
  var arrayData = increaseData(e.data);
  postMessage(arrayData);
};

function increaseData(arrayData) {
  var int8Array = new Int8Array(arrayData);
  for (let i = 0; i < int8Array.length; i++) {
    int8Array[i] += 1;
  }

  return arrayData;
}
```

通过共享内存传递的数据，在 worker 中改变了数据以后，主线程的原始数据也被改变了。
