# Node.js 中的事件循环

![](https://pic4.zhimg.com/v2-8966bd88d6c3773ccd133969f1f39be3_b.png)

# Node.js 事件循环机制

## setImmediate 与 setTimeout 对比

上文中我们介绍过 setImmediate 与 setTimeout 都属于 MacroTask，每轮事件循环中都会执行 MacroTask 中的队列首部回调；不过我们也经常可以看到描述说 setImmediate 会优于 setTimeout 执行，

```js
//index.js
setTimeout(function(){
  console.log("SETTIMEOUT");
});
setImmediate(function(){
  console.log("SETIMMEDIATE");
});

//run it
node index.js
```

上述代码的执行结果并不固定，在介绍 setImmediate 与 setTimeout 的区别之前，我们先来讨论下 Node.js 中的事件循环机制；其基本流程如下图所示：

```js
 ┌───────────────────────┐
┌─>│timers │
│└──────────┬────────────┘
│┌──────────┴────────────┐
││ IO callbacks │
│└──────────┬────────────┘
│┌──────────┴────────────┐
││ idle, prepare │
│└──────────┬────────────┘┌───────────────┐
│┌──────────┴────────────┐│ incoming: │
││ poll│<─────┤connections, │
│└──────────┬────────────┘│ data, etc.│
│┌──────────┴────────────┐└───────────────┘
││check│
│└──────────┬────────────┘
│┌──────────┴────────────┐
└──┤close callbacks│
 └───────────────────────┘
```

```js
//index.js
var fs = require('fs');
fs.readFile("my-file-path.txt", function() {
  setTimeout(function(){
  console.log("SETTIMEOUT");
  });
  setImmediate(function(){
  console.log("SETIMMEDIATE");
  });
});

//run it
node index.js

//output (always)
SETIMMEDIATE
SETTIMEOUT
```

```js
var Suite = require('benchmark').Suite
var fs = require('fs')


var suite = new Suite


suite.add('deffered.resolve()', function(deferred) {
  deferred.resolve()
}, {defer: true})


suite.add('setImmediate()', function(deferred) {
  setImmediate(function() {
  deferred.resolve()
  })
}, {defer: true})


suite.add('setTimeout(,0)', function(deferred) {
  setTimeout(function() {
  deferred.resolve()
  },0)
}, {defer: true})


suite
.on('cycle', function(event) {
  console.log(String(event.target));
})
.on('complete', function() {
  console.log('Fastest is ' + this.filter('fastest').pluck('name'));
})
.run({async: true})


// 输出
deffered.resolve() x 993 ops/sec Â±0.67% (22 runs sampled)
setImmediate() x 914 ops/sec Â±2.48% (57 runs sampled)
setTimeout(,0) x 445 ops/sec Â±2.79% (82 runs sampled)
```

## 浏览器中实现 setImmediate

当我们使用 Webpack 打包应用时，其默认会添加 setImmediate 的垫片

# Node.js Event Loop

![](https://blog-assets.risingstack.com/2016/10/the-Node-js-event-loop.png)

```
 ┌───────────────────────┐
┌─>│timers │
│└──────────┬────────────┘
│┌──────────┴────────────┐
││ IO callbacks │
│└──────────┬────────────┘
│┌──────────┴────────────┐
││ idle, prepare │
│└──────────┬────────────┘┌───────────────┐
│┌──────────┴────────────┐│ incoming: │
││ poll│<─────┤connections, │
│└──────────┬────────────┘│ data, etc.│
│┌──────────┴────────────┐└───────────────┘
││check│
│└──────────┬────────────┘
│┌──────────┴────────────┐
└──┤close callbacks│
 └───────────────────────┘
```

## nextTick 与 setImmediate

我们通过比较以下两个用例来了解 setImmediate 与 nextTick 的区别：

- setImmediate

```
setImmediate(function A() {
  setImmediate(function B() {
  log(1);
  setImmediate(function D() { log(2); });
  setImmediate(function E() { log(3); });
  });
  setImmediate(function C() {
  log(4);
  setImmediate(function F() { log(5); });
  setImmediate(function G() { log(6); });
  });
});


setTimeout(function timeout() {
  console.log('TIMEOUT FIRED');
}, 0)


// 'TIMEOUT FIRED' 1 4 2 3 5 6
// OR
// 1 'TIMEOUT FIRED' 4 2 3 5 6
```

- nextTick

```js
process.nextTick(function A() {
  process.nextTick(function B() {
    log(1);
    process.nextTick(function D() {
      log(2);
    });
    process.nextTick(function E() {
      log(3);
    });
  });
  process.nextTick(function C() {
    log(4);
    process.nextTick(function F() {
      log(5);
    });
    process.nextTick(function G() {
      log(6);
    });
  });
});

setTimeout(function timeout() {
  console.log('TIMEOUT FIRED');
}, 0);

// 1 4 2 3 5 6 'TIMEOUT FIRED'
```

如上文所述，通过 setImmediate 设置的回调会以 MacroTask 加入到 Event Loop 中，每个循环中会提取出某个回调执行；setImmediate 能够避免 Event Loop 被阻塞，从而允许其他完成的 IO 操作或者定时器回调顺利执行。而通过 nextTick 加入的回调会在当前代码执行完毕(即函数调用栈执行完毕)后立刻执行，即会在返回 Event Loop 之前立刻执行。譬如上面的例子中，setTimeout 的回调会在 Event Loop 中调用，因此 TIMEOUT FIRED 的输出会在所有的 nextTick 回调执行完毕后打印出来。
