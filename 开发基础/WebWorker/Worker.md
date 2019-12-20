# Web Worker

# 基础使用

```js
// 判断浏览器是否支持 Worker
typeof Worker !== 'undefined';

// 从脚本中创建 Worker
new Worker('workers.js');

// 使用字符串方式创建 Worker
new Worker('data:text/javascript;charset=US-ASCII,...');
```

## worker-loader

[worker-loader](https://github.com/webpack-contrib/worker-loader) 是一个 webpack 插件，可以将一个普通 JS 文件的全部依赖提取后打包并替换调用处，以 Blob 形式内联在源码中。

```js
import Worker from 'worker-loader!./file.worker.js';

const worker = new Worker();

// 转化为下述代码
const blob = new Blob([codeFromFileWorker], { type: 'application/javascript' });
const worker = new Worker(URL.createObjectURL(blob));
```

## Blob

我们也可以自己通过 Blob 的方式创建：

```js
const code = `
  importScripts('https://xxx.com/xxx.js');
  self.onmessage = e => {};
`;

const blob = new Blob([code], { type: 'application/javascript' });
const worker = new Worker(URL.createObjectURL(blob));
```

## workerize/workerize-loader

```js
let worker = workerize(`
	export function add(a, b) {
		// block for half a second to demonstrate asynchronicity
		let start = Date.now();
		while (Date.now()-start < 500);
		return a + b;
	}
`);

(async () => {
  console.log('3 + 9 = ', await worker.add(3, 9));
  console.log('1 + 2 = ', await worker.add(1, 2));
})();
```

我们也可以使用 [workerize-loader](https://github.com/developit/workerize-loader) 作为 Webpack 插件来加载 Web Worker:

```js
// worker.js
export function expensive(time) {}

// app.js
import worker from 'workerize-loader!./worker';

let instance = worker(); // `new` is optional

instance.expensive(1000).then(count => {
  console.log(`Ran ${count} loops`);
});
```

You cannot use Local Storage in service workers. It was decided that service workers should not have access to any synchronous APIs. You can use IndexedDB instead, or communicate with the controlled page using postMessage().

# 网络请求

By default, cookies are not included with fetch requests, but you can include them as follows: fetch(url, {credentials: 'include'}).

```js
function XHRWorker(url, ready, scope) {
  var oReq = new XMLHttpRequest();
  oReq.addEventListener(
    'load',
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
  oReq.open('get', url, true);
  oReq.send();
}

function WorkerStart() {
  XHRWorker(
    'http://static.xxx.com/js/worker.js',
    function(worker) {
      worker.postMessage('hello world');
      worker.onmessage = function(e) {
        console.log(e.data);
      };
    },
    this
  );
}

WorkerStart();
```
