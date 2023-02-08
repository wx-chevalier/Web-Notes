# nectTick

在 Vue.js 中，其会异步执行 DOM 更新；当观察到数据变化时，Vue 将开启一个队列，并缓冲在同一事件循环中发生的所有数据改变。如果同一个 watcher 被多次触发，只会一次推入到队列中。这种在缓冲时去除重复数据对于避免不必要的计算和 DOM 操作上非常重要。然后，在下一个的事件循环“tick”中，Vue 刷新队列并执行实际(已去重的)工作。Vue 在内部尝试对异步队列使用原生的 `Promise.then` 和 `MutationObserver`，如果执行环境不支持，会采用 `setTimeout(fn, 0)` 代替。Vue.js 选择使用 MicroTask 来进行数据更新，是为了保证能够在当前界面渲染的 Task 执行完毕之后即得到最新的界面，而不是历经两次渲染，从而提高效率。

而当我们希望在数据更新之后执行某些 DOM 操作，就需要使用 `nextTick` 函数来添加回调：

```js
// HTML
<div id="example">{{ message }}</div>;

// JS
var vm = new Vue({
  el: "#example",
  data: {
    message: "123"
  }
});
vm.message = "new message"; // 更改数据
vm.$el.textContent === "new message"; // false
Vue.nextTick(function() {
  vm.$el.textContent === "new message"; // true
});
```

在组件内使用 `vm.$nextTick()` 实例方法特别方便，因为它不需要全局 Vue，并且回调函数中的 this 将自动绑定到当前的 Vue 实例上：

```js
Vue.component("example", {
  template: "<span>{{ message }}</span>",
  data: function() {
    return {
      message: "没有更新"
    };
  },
  methods: {
    updateMessage: function() {
      this.message = "更新完成";
      console.log(this.$el.textContent); // => '没有更新'
      this.$nextTick(function() {
        console.log(this.$el.textContent); // => '更新完成'
      });
    }
  }
});
```

src/core/util/env

```js
/** 使用 MicroTask 来异步执行批次任务 */
export const nextTick = (function() {
  // 需要执行的回调列表
  const callbacks = []; // 是否处于挂起状态

  let pending = false; // 时间函数句柄

  let timerFunc; // 执行并且清空所有的回调列表

  function nextTickHandler() {
    pending = false;
    const copies = callbacks.slice(0);
    callbacks.length = 0;
    for (let i = 0; i < copies.length; i++) {
      copies[i]();
    }
  } /* istanbul ignore if */ // nextTick 的回调会被加入到 MicroTask 队列中，这里我们主要通过原生的 Promise 与 MutationObserver 实现

  if (typeof Promise !== "undefined" && isNative(Promise)) {
    let p = Promise.resolve();
    let logError = err => {
      console.error(err);
    };
    timerFunc = () => {
      p.then(nextTickHandler).catch(logError); // 在部分 iOS 系统下的 UIWebViews 中，Promise.then 可能并不会被清空，因此我们需要添加额外操作以触发

      if (isIOS) setTimeout(noop);
    };
  } else if (
    typeof MutationObserver !== "undefined" &&
    (isNative(MutationObserver) || // PhantomJS and iOS 7.x
      MutationObserver.toString() === "[object MutationObserverConstructor]")
  ) {
    // 当 Promise 不可用时候使用 MutationObserver
    // e.g. PhantomJS IE11, iOS7, Android 4.4
    let counter = 1;
    let observer = new MutationObserver(nextTickHandler);
    let textNode = document.createTextNode(String(counter));
    observer.observe(textNode, {
      characterData: true
    });
    timerFunc = () => {
      counter = (counter + 1) % 2;
      textNode.data = String(counter);
    };
  } else {
    // 如果都不存在，则回退使用 setTimeout
    /* istanbul ignore next */
    timerFunc = () => {
      setTimeout(nextTickHandler, 0);
    };
  }

  return function queueNextTick(cb?: Function, ctx?: Object) {
    let _resolve;
    callbacks.push(() => {
      if (cb) {
        try {
          cb.call(ctx);
        } catch (e) {
          handleError(e, ctx, "nextTick");
        }
      } else if (_resolve) {
        _resolve(ctx);
      }
    });
    if (!pending) {
      pending = true;
      timerFunc();
    } // 如果没有传入回调，则表示以异步方式调用

    if (!cb && typeof Promise !== "undefined") {
      return new Promise((resolve, reject) => {
        _resolve = resolve;
      });
    }
  };
})();
```
