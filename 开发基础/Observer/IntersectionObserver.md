# IntersectionObserver

它用于观察两个 HTML DOM 元素之间的交集。当 DOM 进入或离开可见的视窗（Visible Viewport）时，在 DOM 中观察一个元素是很有用的。IntersectionObserver 的一些用例。

- 当一个元素在视窗中可见时，延迟加载图像或其他资源
- 识别广告的可见性并计算广告收入
- 实现网站的无限滚动。当用户向下滚动页面时，不必要浏览不同的页面
- 当一个元素在视窗中时，加载和自动播放、视频或动画

# 基础使用

使用 IntersectionObserver API 主要需要三个步骤：创建观察者、定义要观察的目标对象、定义回调事件。

## 创建观察者

```ts
const options = {
  root: document.querySelector('.scrollContainer'),
  rootMargin: '0px',
  threshold: [0.3, 0.5, 0.8, 1]
};

const observer = new IntersectionObserver(handler, options);
```

[0.3] 的阈值意味着，当目标元素在根元素指定的元素内可见 30% 时，调用处理函数。上面意味着当元素被 30%、50%、80% 和 100% 可见时，将调用处理程序、回调函数。

## 定义观察目标

任何目标元素都可以通过调用 `.observer(target)` 方法来观察。

```js
const target = document.querySelector(“.targetBox”); observer.observe(target);
```

## 定义回调事件

这是当一个人注意到某件不寻常的事情发生时的反应。当目标元素与根元素通过阈值相交时，就会触发回调函数。

```js
function handler(entries, observer) {
  entries.forEach(entry => {
    // 每个entry描述一个观察到的目标元素的交集变化
    // entry.boundingClientRect
    // entry.intersectionRatio
    // entry.intersectionRect
    // entry.isIntersecting
    // entry.rootBounds
    // entry.target
    // entry.time
  });
}
```

```js
window.addEventListener(
  'load',
  function(event) {
    const mainBox = document.querySelector('.mainBox');
    /* Creating observer */
    const options = {
      root: mainBox,
      rootMargin: '0px',
      threshold: [0.3, 0.5, 0.8, 1]
    };
    const observer = new IntersectionObserver(handler, options);

    /* Defining target object */
    const target = document.querySelector('.targetBox');
    observer.observe(target);
  },
  false
);

/* Defining callback handler */
function handler(entries, observer) {
  console.log('Observer handler called: ');
  entries.forEach(entry => {
    const intersectionRatio = entry.intersectionRatio.toFixed(2);
    entry.target.innerText = 'Interserction ratio: ' + intersectionRatio;
    if (intersectionRatio > 0.8) {
      entry.target.style.background = 'green';
    } else if (intersectionRatio > 0.5) {
      entry.target.style.background = 'blue';
    } else if (intersectionRatio > 0.2) {
      entry.target.style.background = 'red';
    }
  });
}
```
