# Egg.js 源码探秘

## 代码加载与依赖注入

## 集群模式的启动逻辑

首先是 egg-scripts/start.js 中封装启动参数，并且 Fork 新的进程来启动：

```js
// 封装参数
this.serverBin = path.join(__dirname, '../start-cluster');
...
const eggArgs = [
  ...(execArgv || []),
  this.serverBin,
  clusterOptions,
  `--title=${argv.title}`
];
...
// 启动执行进程
spawn('node', eggArgs, options);
```

然后 start-cluster 中加载 egg-cluster 的启动代码：

```js
// start-cluster
require(options.framework).startCluster(options);
```

egg-cluster/index.js 中暴露了 startCluster 方法，其会构造 Master 对象实例：

```js
exports.startCluster = function(options, callback) {
  new Master(options).ready(callback);
};
```

Master 本身继承自 EventEmitter，并且包含了 Manager 与 Messenger 这两个消息组件的实例以及 AgentWorker 与 AppWorker 两类具体的工作进程。messenger.js 则是负责在 Master、Agent 与 App Worker 之间的通信：

```
        ┌────────┐
        │ parent │
        /└────────┘\
      /     |      \
      /  ┌────────┐  \
    /   │ master │   \
    /    └────────┘    \
  /     /         \    \
┌───────┐         ┌───────┐
│ agent │ ------- │  app  │
└───────┘         └───────┘
```

在 Master 的构造函数中，其会使用 detectPort 检测端口是否可用；若可用则调用 forkAgentWorker 创建 AgentWorker:

```js
// AgentWorker 创建完毕后创建 AppWorkers
this.once('agent-start', this.forkAppWorkers.bind(this));

// 使用 fork 创建新的 AgentWorker
const agentWorker = childprocess.fork(agentWorkerFile, args, opt);
```

在 forkAppWorkers 中调用 cfork 来创建多个 AppWorker，并且将它们注册到管理中心：

```js
cfork({
  exec: appWorkerFile,
  args,
  silent: false,
  count: this.options.workers,
  // don't refork in local env
  refork: this.isProduction
});

cluster.on('fork', worker => {
  ...
  this.workerManager.setWorker(worker);
  ...
});

// 子进程开始监听后，发送 app-start 消息
cluster.on('listening', (worker, address) => {
  this.messenger.send({
    action: 'app-start',
    ...
  });
});
```

app-start 事件会触发 onAppStart，并且启动所有的 AppWorker：

```js
// enable all workers when app started
for (const id in cluster.workers) {
  const worker = cluster.workers[id];
  worker.disableRefork = false;
}
```

egg-cluster 允许传入 sticky 属性，来控制是否启动门面服务器；如果传入，则会调用 startMasterSocketServer 方法：

```js
// manager.js
startMasterSocketServer(cb) {
  // Create the outside facing server listening on our port.
  require('net').createServer({ pauseOnConnect: true }, connection => {
    if (!connection.remoteAddress) {
      connection.close();
    } else {
      const worker = this.stickyWorker(connection.remoteAddress);
      worker.send('sticky-session:connection', connection);
    }
  }).listen(this[REALPORT], cb);
}
```

这里的 stickyWorker 会根据 IP 地址动态分配具体的 Worker 实例，每个 Worker 是完整的 Node.js 应用：

```js
// app_worker.js
const Application = require(options.framework).Application;
const app = new Application(options);
```

应用创建完毕后会调用 startServer 方法来启动本地服务器：

```js
// app_worker.js
if (options.https) {
  const httpsOptions = Object.assign({}, options.https, {
    key: fs.readFileSync(options.https.key),
    cert: fs.readFileSync(options.https.cert)
  });
  server = require('https').createServer(httpsOptions, app.callback());
} else {
  server = require('http').createServer(app.callback());
}
```

如果是 Sticky 模式，则监听 127.0.0.1，否则共享连接：

```js
// app_worker.js
if (options.sticky) {
  server.listen(0, '127.0.0.1');
} else {
  server.listen(...args);
}
```
