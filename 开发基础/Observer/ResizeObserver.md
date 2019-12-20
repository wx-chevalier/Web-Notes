# ResizeObserver

ResizeObserver 允许我们观察 DOM 元素的内容矩形大小（width、height）的变化，并做出相应的响应。它就像给元素添加 document.onresize()或 window.resize()事件。不调整视窗大小而只改变元素的大小，这是很有用的。例如，添加新的子元素，将元素的 display 设置为 none 或类似可以改变元素大小的的事件。事实上，它只关注内容框（Content Box）变化。比如下面这些行为将会触发 ResizeObserver 的行为：

- 当观察到的元素被插入或从 DOM 中删除时，观察将会触发
- 当观察到的元素 display 值为 none 时，观察都会触发
- 观察不会对未替换的内联元素（non-replaced inline element）触发
- 观察不会由 CSS 的 transform 触发
- 如果元素有显示，而且元素大小不是 0,0，观察将会触发

ResizeObserver 通知内容框的大小，如下图所示：

![](https://i.postimg.cc/2SqQrKsj/image.png)

# 基础使用

## 创建观察者

可以通过调用它的构造函数和传递处理函数来创建它。

```js
const observer = new ResizeObserver(handler);
```

## 定义要观察的目标对象

定义目标对象，其大小的变化应该被观察到。

```js
const child = document.querySelector('.child');
observer.observe(child);
```

## 定义回调事件

```js
function handler(entries) {
  entries.forEach(entry => {
    const size = entry.target.contentRect;
    console.log(
      `Element’s size: width: ${size.width} , height: ${size.height}`
    );
  });
}
```

```js
if (!('ResizeObserver' in window)) {
  document.body.innerText = 'Not supported by your browser';
}
/* Create resize observer */
const observer = new ResizeObserver(handler);

/* Callback handler */
function handler(entries) {
  entries.forEach(entry => {
    const size = entry.contentRect;
    console.log(
      `Resize Observer's callback: box size: width: ${size.width} , height:  ${
        size.height
      }`
    );
  });
}

/* Observe child element */
const child = document.querySelector('.box');
observer.observe(child);
```
