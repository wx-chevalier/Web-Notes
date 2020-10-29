# 基于 vw 的移动端适配

目前出视觉设计稿，我们都是使用 750px 宽度的，从上面的原理来看，那么 100vw = 750px，即 1vw = 7.5px。那么我们可以根据设计图上的 px 值直接转换成对应的 vw 值。看到这里，很多同学开始感到崩溃，又要计算，能不能简便一点，能不能再简单一点，其实是可以的，我们可以使用 PostCSS 的插件 [postcss-px-to-viewport](https://github.com/evrone/postcss-px-to-viewport)，让我们可以直接在代码中写 px，比如：

```css
[w-369] {
  width: 369px;
}

[w-369] h2 span {
  background: #ff5000;
  color: #fff;
  display: inline-block;
  border-radius: 4px;
  font-size: 20px;
  text-shadow: 0 2px 2px #ff5000;
  padding: 2px 5px;
  margin-right: 5px;
}
```

PostCSS 编译之后就是我们所需要的带 vw 代码：

```css
[w-369] {
  width: 49.2vw;
}
[w-369] h2 span {
  background: #ff5000;
  color: #fff;
  display: inline-block;
  border-radius: 0.53333vw;
  text-shadow: 0 0.26667vw 0.26667vw #ff5000;
  padding: 0.26667vw 0.66667vw;
}
[w-369] h2 span,
[w-369] i {
  font-size: 2.66667vw;
  margin-right: 0.66667vw;
}
```

在实际使用的时候，你可以对该插件进行相关的参数配置：

```json
{
  "postcss-px-to-viewport": {
    "viewportWidth": 750,
    "viewportHeight": 1334,
    "unitPrecision": 5,
    "viewportUnit": "vw",
    "selectorBlackList": [],
    "minPixelValue": 1,
    "mediaQuery": false
  }
}
```

上面解决了 px 到 vw 的转换计算。那么在哪些地方可以使用 vw 来适配我们的页面。根据相关的测试：

- 容器适配，可以使用 vw
- 文本的适配，可以使用 vw
- 大于 1px 的边框、圆角、阴影都可以使用 vw
- 内距和外距，可以使用 vw

# 1px 问题

前面提到过，对于 `1px` 是不建议将其转换成对应的 `vw` 单位的，但在 Retina 下，我们始终是需要面对如何解决 `1px` 的问题。个人推荐另外一种解决`1px`的方案。依旧是使用 PostCSS 插件，解决 `1px` 可以使用 [postcss-write-svg](https://github.com/jonathantneal/postcss-write-svg)。

使用 postcss-write-svg 你可以通过`border-image`或者`background-image`两种方式来处理。比如：

```css
@svg 1px-border {
  height: 2px;
  @rect {
    fill: var(--color, black);
    width: 100%;
    height: 50%;
  }
}
.example {
  border: 1px solid transparent;
  border-image: svg(1px-border param(--color #00b1ff)) 2 2 stretch;
}
```

这样 PostCSS 会自动帮你把 CSS 编译出来：

```css
.example {
  border: 1px solid transparent;
  border-image: url("data:image/svg+xml;charset=utf-8,%3Csvg xmlns='http://www.w3.org/2000/svg' height='2px'%3E%3Crect fill='%2300b1ff' width='100%25' height='50%25'/%3E%3C/svg%3E")
    2 2 stretch;
}
```

使用 PostCSS 的插件是不是比我们修改图片要来得简单与方便。

上面演示的是使用`border-image`方式，除此之外还可以使用`background-image`来实现。比如：

```css
@svg square {
  @rect {
    fill: var(--color, black);
    width: 100%;
    height: 100%;
  }
}

#example {
  background: white svg(square param(--color #00b1ff));
}
```

编译出来就是：

```css
#example {
  background: white
    url("data:image/svg+xml;charset=utf-8,%3Csvg xmlns='http://www.w3.org/2000/svg'%3E%3Crect fill='%2300b1ff' width='100%25' height='100%25'/%3E%3C/svg%3E");
}
```

这个方案简单易用，是我所需要的。目前测试下来，基本能达到我所需要的需求。但有一点千万别忘了，记得在中添加：

```html
<meta
  name="viewport"
  content="width=device-width,initial-scale=1,maximum-scale=1,minimum-scale=1,user-scalable=no"
/>
```

上面阐述的是这个适配方案中所用到的技术点，简单的总结一下：

- 使用`vw`来实现页面的适配，并且通过 PostCSS 的插件[postcss-px-to-viewport](https://github.com/evrone/postcss-px-to-viewport)把`px`转换成`vw`。这样的好处是，我们在撸码的时候，不需要进行任何的计算，你只需要根据设计图写`px`单位

- 为了更好的实现长宽比，特别是针对于`img`、`vedio`和`iframe`元素，通过 PostCSS 插件[postcss-aspect-ratio-mini](https://github.com/yisibl/postcss-aspect-ratio-mini)来实现，在实际使用中，只需要把对应的宽和高写进去即可

- 为了解决 `1px` 的问题，使用 PostCSS 插件 [postcss-write-svg](https://github.com/jonathantneal/postcss-write-svg),自动生成 `border-image` 或者 `background-image` 的图片

# Viewport 不足之处

采用 vw 来做适配处理并不是只有好处没有任何缺点。有一些细节之处还是存在一定的缺陷的。比如当容器使用 vw 单位，margin 采用 px 单位时，很容易造成整体宽度超过 100vw，从而影响布局效果。对于类似这样的现象，我们可以采用相关的技术进行规避。比如将 margin 换成 padding，并且配合 box-sizing。只不过这不是最佳方案，随着将来浏览器或者应用自身的 Webview 对 calc()函数的支持之后，碰到 vw 和 px 混合使用的时候，可以结合 calc()函数一起使用，这样就可以完美的解决。

另外一点，px 转换成 vw 单位，多少还会存在一定的像素差，毕竟很多时候无法完全整除。
