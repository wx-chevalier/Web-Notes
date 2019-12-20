[![返回目录](https://i.postimg.cc/50XLzC7C/image.png)](https://github.com/wx-chevalier/Web-Series)

# GPU Animation

## 动画

- 基本 style 可动画参数

| 参数名称        | 说明                                                                                                                             |
| --------------- | -------------------------------------------------------------------------------------------------------------------------------- |
| width           | `{ width: 100 }` 元素当前宽度到 100px                                                                                            |
| maxWidth        | `{ maxWidth: 100 }` 元素当前最大宽度到 100px                                                                                     |
| minWidth        | `{ minWidth: 100 }` 元素当前最小宽度到 100px                                                                                     |
| height          | `{ height: 100 }` 元素当前高度到 100px                                                                                           |
| maxHeight       | `{ maxHeight: 100 }` 元素当前最大高度到 100px                                                                                    |
| minHeight       | `{ minHeight: 100 }` 元素当前最小高度到 100px                                                                                    |
| lineHeight      | `{ lineHeight: 100 }` 区块行高到 100px                                                                                           |
| opacity         | `{ opacity: 0 }` 元素当前透明度到 0                                                                                              |
| top             | `{ top: 100 }` 元素当前顶部距离到 100px, 需配合 `position: relative | absolute`                                                  |
| right           | `{ right: 100 }` 元素当前右部距离到 100px, 需配合 `position: relative | absolute`                                                |
| bottom          | `{ bottom: 100 }` 元素当前下部距离到 100px, 需配合 `position: relative | absolute`                                               |
| left            | `{ left: 100 }` 元素当前左部距离到 100px, 需配合 `position: relative | absolute`                                                 |
| marginTop       | `{ marginTop: 100 }` 元素当前顶部外边距离到 100px                                                                                |
| marginRight     | `{ marginRight: 100 }` 元素当前右部外边距离到 100px                                                                              |
| marginBottom    | `{ marginBottom: 100 }` 元素当前下部外边距离到 100px                                                                             |
| marginLeft      | `{ marginLeft: 100 }` 元素当前左部外边距离到 100px                                                                               |
| paddingTop      | `{ paddingTop: 100 }` 元素当前顶部内边距离到 100px                                                                               |
| paddingRight    | `{ paddingRight: 100 }` 元素当前右部内边距离到 100px                                                                             |
| paddingBottom   | `{ paddingBottom: 100 }` 元素当前下部内边距离到 100px                                                                            |
| paddingLeft     | `{ paddingLeft: 100 }` 元素当前左部内边距离到 100px                                                                              |
| color           | `{ color: '#FFFFFF' }` 元素当前文字颜色到白色                                                                                    |
| backgroundColor | `{ backgroundColor: '#FFFFFF' }` 元素当前背景颜色到白色                                                                          |
| borderWidth     | `{ borderWidth: 2 }` 元素当前边框宽度到 2px，同样可用 `borderTopWidth` ` borderRightWidth``borderBottomWidth ` `borderLeftWidth` |
| borderRadius    | `{ borderRadius: 5 }` 元素当前圆角到 5px, 同上, 同样可用 `上 左 下 右`                                                           |
| borderColor     | `{ borderColor: '#FFFFFF' }` 元素当前边框颜色到白色                                                                              |
| boxShadow       | `{ boxShadow: '0 0 10px #000' }` 元素当前阴影模糊到 10px                                                                         |
| textShadow      | `{ textShadow: '0 0 10px #000' }` 元素当前文字内容阴影模糊到 10px                                                                |

- transform 参数

| 参数名称        | 说明                                                                                                 |
| --------------- | ---------------------------------------------------------------------------------------------------- |
| translateX / x  | `{ translateX: 10 } or { x: 10 } => transform: translateX(10px)`, x 方向的位置移动 10px              |
| translateY / y  | `{ translateY: 10 } or { y: 10 } => transform: translateY(10px)`, y 方向的位置移动 10px              |
| translateZ / z  | `{ translateZ: 10 } or { z: 10 } => transform: translateZ(10px)`, z 方向的位置移动 10px              |
| rotate          | `{ rotate: 10 } => transform: rotate(10deg)` 元素以 transformOrigin 的中心点旋转 10deg               |
| rotateX         | `{ rotateX: 10 } => transform: rotateX(10deg)` 元素以 transformOrigin 的中心点向 X 旋转 10deg        |
| rotateY         | `{ rotateY: 10 } => transform: rotateY(10deg)` 元素以 transformOrigin 的中心点向 Y 旋转 10deg        |
| scale           | `{ scale: 0 } => transform: scale(0)` 元素以 transformOrigin 的中心点缩放到 0, 不改变元素的宽高      |
| scaleX          | `{ scaleX: 0 } => transform: scaleX(0)` 元素以 transformOrigin 的中心点 X 缩放到 0, 不改变元素的宽高 |
| scaleY          | `{ scaleY: 0 } => transform: scaleY(0)` 元素以 transformOrigin 的中心点 Y 缩放到 0, 不改变元素的宽高 |
| transformOrigin | `{ transformOrigin: '50px 50px'}` 元素当前中心点到 x: 50px y: 50px;                                  |

- filter 参数

| 参数名称   | 说明                                                   |
| ---------- | ------------------------------------------------------ |
| grayScale  | `{ grayScale: 1 }` 元素 filter 灰度到 100%;            |
| sepia      | `{ sepia: 1 }` 元素 filter 颜色到 100%;                |
| hueRotate  | `{ hueRotate: '90deg' }` 元素 filter 色相盘旋转 90 度; |
| invert     | `{ invert: 1 }` 元素 filter 色值反相到 100%            |
| brightness | `{ brightness: 2 }` 元素 filter 亮度到 200%            |
| contrast   | `{ contrast: 2 }` 对比度到 200%                        |
| saturate   | `{ saturate: 2 }` 饱和度到 200%                        |
| blur       | `{ blur: '20px' }` 模糊到 20px                         |

# CSS-Animation&Transition

CSS3 提供了 `transition` 过渡、 `transform 变换`和 `animation 动画`来实现页面中的一些样式转化

## Transition(变换)

W3C 对 css transition 的定义是允许 css 属性值在指定的持续时间内发生平滑地变化。而 mozilla 上介绍它是 transition-property, transition-duration, transition-timing-function 和 transition-delay 的简写属性，它允许定义一个元素两个状态之间的过渡过程。不同的状态可以通过像:hover 或:active 这样的伪类来定义，还可以使用 JavaScript 来动态地设置。Transition 的基本语法如下所示：

```
transition : transition-property transition-duration transition-timing-function transition-delay [, ...]
```

- transition-property

用来指定执行 transition 效果的属性，可以为 none , all 或者特定的属性。

- transition-duration

动画执行的持续时间，单位为 s(秒) 或者 ms(毫秒) 。

- transition-timing-function

变换速率效果，可选值为 ease|linear|ease-in|ease-out|ease-in-out|cubic-bezier(自定义时间曲线) 。

- transition-delay

用来指定动画开始执行的时间，取值同 transition-duration ，但是可以为负数。

一个最简单的例子如下所示：

```html
<div style="height:150px;">
  <h2><span></span>热门网站</h2>
  <ul>
    <li><a href="http://info.3g.qq.com/g/s?aid=index&g_f=2543">腾讯</a></li>
    <li><a href="http://m.sohu.com/?_trans_=000012_qq_dh">搜狐</a></li>
    <li><a href="http://3g.163.com/links/3810">网易</a></li>
  </ul>
</div>
```

相对应的 CSS 代码为：

```css
.main {
  overflow: hidden;
  -webkit-transition: all 0.5s ease-in 0s;
  -moz-transition: all 0.5s ease-in 0s;
  -o-transition: all 0.5s ease-in 0s;
  transition: all 0.5s ease-in 0s;
  background: #fff;
}
.main .close {
  height: 0 !important;
}
```

上面代码会使得类名为 main 的 div 元素的所有属性值中任何一个发生改变时，如 height 属性由 150px 变为 0 时(可通过将”main”类名修改为”main close”实现)执行 transition 动画效果，动画持续时间为 0.5s，属性值的改变速率为加速，延迟时间为 0s，即立即执行。当然，div 元素的 height 属性由 0 变为 150px 时同样会自动执行该动画。考虑到该属性的标准还没有稳定下来，不同的浏览器对它的支持都需要加上对应的前缀，比如像 chrome 和 safari 这样的基于 webkit 内核的浏览器需要添加-webkit 作为前缀。

## Transform

transform 分为 2D 和 3D。

### 2D

其主要包含以下几种变换: 旋转 rotate、扭曲 skew、缩放 scale 和移动 translate 以及矩阵变形 matrix，语法如下:

```
transform: rotate | scale | skew | translate |matrix;
```

- rotate 旋转

  rotate 的单位是 `deg 度`

  ，正数表示顺时针旋转，负数表示逆时针旋转。

  DEMO: [http://codepen.io/CodingMonkeyzh/pen/XbNYOa](http://codepen.io/CodingMonkeyzh/pen/XbNYOa)

- scale 缩放

  scale 的取值范围是 `0~n`

  ，小于 `1`

  时表示缩小，反之表示放大。例如 `scale(0.5, 2)`

  表示水平方向缩小 1 倍，垂直方向放大 1 倍， 另外，也可以通过 `scaleX`

  或者 `scaleY`

  对一个方向进行设置。

  DEMO: [http://codepen.io/CodingMonkeyzh/pen/doOKrg](http://codepen.io/CodingMonkeyzh/pen/doOKrg)

- skew 扭曲

  skew 的单位跟 `rotate`

  一样都是 `deg 度`

  。例如 `skew(30deg, 10deg)`

  表示水平方向倾斜 30 度，垂直方向倾斜 10 度。

  DEMO: [http://codepen.io/CodingMonkeyzh/pen/KpNeYg](http://codepen.io/CodingMonkeyzh/pen/KpNeYg)

- translate 偏移

  偏移同样包括水平偏移和垂直偏移。`translate(x,y)`

  水平方向和垂直方向同时移动(也就是 X 轴和 Y 轴同时移动)； `translateX(x)`

  仅水平方向移动(X 轴移动)； `translateY(Y)`

  仅垂直方向移动(Y 轴移动)。

  DEMO: [http://codepen.io/CodingMonkeyzh/pen/waoXbB](http://codepen.io/CodingMonkeyzh/pen/waoXbB)

## Animation

### Keyframes

CSS3 中的 animation 是通过一个叫 `Keyframes 关键帧`的玩意来控制的，他的命名是由"@keyframes"开头，后面紧接着是这个“动画的名称”加上一对花括号“{}”，括号中就是一些不同时间段样式规则，有点像我们 css 的样式写法一样。对于一个"@keyframes"中的样式规则是由多个百分比构成的，如“0%”到"100%"之间，语法如下:

```css
@keyframes IDENT {
  from {
    properties: Properties value;
  }
  Percentage {
    properties: Properties value;
  }
  to {
    properties: Properties value;
  }
}

@keyframes IDENT {
  0% {
    properties: Properties value;
  }
  Percentage {
    properties: Properties value;
  }
  100% {
    properties: Properties value;
  }
}
```

### animation

animation 属性是一个简写属性，用于设置动画属性：

1. animation-name----规定需要绑定到选择器的 keyframe 名称。

语法：animation-name: keyframename|none；

Keyframename：规定需要绑定到选择器的 keyframe 的名称。

None: 规定无动画效果(可用于覆盖来自级联的动画)。

例如：

{

-webkit-animation-name: my_animation;

-moz-animation-name : my_animation;

-ms-animation-name : my_animation;

-o-animation-name: my_animation;

animation-name: my_animation;

}

@-webkit-keyframes my_animation{}

@-moz-keyframes my_animation{}

@-ms-keyframes my_animation{}

@-o-keyframes my_animation{}

@keyframes my_animation{}

2. animation-duration----规定完成动画所花费的时间，以秒或毫秒计。

语法：animation-duration: time;

time : 规定完成动画所花费的时间。默认值是 0，意味着没有动画效果。

例如：

{

-webkit-animation-duration: 2s;

-moz-animation-duration : 2s;

-ms-animation-duration : 2s;

-o-animation-duration: 2s;

animation--duration: 2s;

}

3. animation-timing-function----规定动画的速度曲线

语法: animation-timing-function: value;

Value 值 :

linear：动画从头到尾的速度是相同的。

ease：默认。动画以低速开始，然后加快，在结束前变慢。

ease-in：动画以低速开始。

ease-out ：动画以低速结束。

ease-in-out：动画以低速开始和结束。

cubic-bezier(n,n,n,n)：在 cubic-bezier 函数中自己的值。可能的值是从 0 到 1 的数值。

例如：

{animation-timing-function:linear;}

{animation-timing-function:ease;}

{animation-timing-function:ease-in;}

{animation-timing-function:ease-out;}

{animation-timing-function:ease-in-out;}

4. animation-delay----规定在动画开始之前的延迟

语法: animation-delay: time;

Time 值：可选。定义动画开始前等待的时间，以秒或毫秒计。默认值是 0 。允许负值， -2s 使动画马上开始，但跳过 2 秒进入动画。

{

animation-delay:2s;

-webkit-animation-delay:2s;

}

5. animation-iteration-count----规定动画应该播放的次数

语法: animation-iteration-count: n|infinite;

n：定义动画播放次数的数值。

infinite ：规定动画应该无限次播放。默认值为：1 。

示例：

{

animation-iteration-count:infinite;

-webkit-animation-iteration-count:infinite;

}

6. animation-direction----规定是否应该轮流反向播放动画

语法: animation-direction: normal|alternate;

normal ：默认值。动画应该正常播放。

alternate ：动画应该轮流反向播放。

注释：如果把动画设置为只播放一次，则该属性没有效果。

示例：

{

animation-direction:alternate;

-webkit-animation-direction:alternate;

}

7. animation-play-state 属性规定动画正在运行还是暂停

语法: animation-play-state: paused|running;

paused ：规定动画已暂停。

running ：规定动画正在播放。

注释：可以在 JavaScript 中使用该属性，这样就能在播放过程中暂停动画。

示例：

{

animation-play-state:running;

-webkit-animation-play-state:running;

}

8. animation-fill-mode 属性规定动画在播放之前或之后，其动画效果是否可见

语法: animation-fill-mode : none | forwards | backwards | both;

none ：不改变默认行为。

forwards ：当动画完成后，保持最后一个属性值(在最后一个关键帧中定义)。

backwards ：在 animation-delay 所指定的一段时间内，在动画显示之前，应用开始属性值(在第一个关键帧中定义)。

both ：向前和向后填充模式都被应用。

# JavaScript-Animation

## requestAnimationFrame

## tick

```js
/* tick https://github.com/AlloyTeam/AlloyTouch/blob/master/transformjs/asset/tick.js
 * By dntzhang|当耐特
 */
(function() {
  if (!Date.now)
    Date.now = function() {
      return new Date().getTime();
    };

  var vendors = ['webkit', 'moz'];
  for (var i = 0; i < vendors.length && !window.requestAnimationFrame; ++i) {
    var vp = vendors[i];
    window.requestAnimationFrame = window[vp + 'RequestAnimationFrame'];
    window.cancelAnimationFrame =
      window[vp + 'CancelAnimationFrame'] ||
      window[vp + 'CancelRequestAnimationFrame'];
  }
  if (
    /iP(ad|hone|od).*OS 6/.test(window.navigator.userAgent) || // iOS6 is buggy
    !window.requestAnimationFrame ||
    !window.cancelAnimationFrame
  ) {
    var lastTime = 0;
    window.requestAnimationFrame = function(callback) {
      var now = Date.now();
      var nextTime = Math.max(lastTime + 16, now);
      return setTimeout(function() {
        callback((lastTime = nextTime));
      }, nextTime - now);
    };
    window.cancelAnimationFrame = clearTimeout;
  }

  var tickArr = [];

  var tick = function(fn) {
    tickArr.push(fn);
  };

  var execTick = function() {
    var i = 0,
      len = tickArr.length;
    for (; i < len; i++) {
      tickArr[i]();
    }
    requestAnimationFrame(execTick);
  };
  execTick();

  window.tick = tick;
})();
```
