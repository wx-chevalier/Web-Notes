[![返回目录](https://i.postimg.cc/50XLzC7C/image.png)](https://github.com/wx-chevalier/Web-Series)

# Flexbox

# Flexbox 简介

CSS 2.1 定义了四种布局模式 ― 由一个盒与其兄弟、祖先盒的关系决定其尺寸与位置的算法：

- 块布局 ― 为了呈现文档而设计出来的布局模式；
- 行内布局 ― 为了呈现文本而设计出来的布局模式；
- 表格布局 ― 为了用格子呈现 2D 数据而设计出来的布局模式；
- 定位布局 ― 为了非常直接地定位元素而设计出来的布局模式，定位元素基本与其他元素毫无关。

而 Flexbox(伸缩布局)是为了呈现复杂的应用与页面而设计出来的，一种更加方便有效，能够在未知或者动态尺寸的情况下自由分配容器空间的布局方式。

![flexbox](http://img3.tbcdn.cn/L1/461/1/386a363208b3d74b243ca878fc571133a30eddef)

- main axis(主轴)

  - main dimension(主轴方向)

    > The main axis of a flex container is the primary axis along which flex items are laid out. It extends in the main dimension.

    主轴是伸缩项目在伸缩容器里分布所遵循的主要轴线，在主轴方向上延伸。

  - main-start(主轴起点)main-end(主轴终点)

    > The flex items are placed within the container starting on the main-start side and going toward the main-end side.

    伸缩项目从容器的主轴起点开始放置，直到主轴终点。

  - main size(主轴尺寸)main size property(主轴尺寸属性)

    > A flex item’s width or height, whichever is in the main dimension, is the item’s main size. The flex item’s main size property is either the width or height property, whichever is in the main dimension.

    伸缩项目在主轴方向上的长或者宽是这个项目的主轴尺寸。一个伸缩项目的主轴属性是在主轴方向上的长或者宽属性。

- cross axis(交叉轴)

  - cross dimension(交叉轴方向)

    > The axis perpendicular to the main axis is called the cross axis. It extends in the cross dimension.

    和主轴垂直的轴叫做交叉轴，它在交叉轴方向上延伸。

  - cross-start(交叉轴起点)cross-end(交叉轴终点)

    > Flex lines are filled with items and placed into the container starting on the cross-start side of the flex container and going toward the cross-end side.

    包含伸缩元素的伸缩行从容器的交叉轴起点开始放置，直到交叉轴终点。

  - cross size(交叉轴尺寸)cross size property(交叉轴尺寸属性)

    > The width or height of a flex item, whichever is in the cross dimension, is the item’s cross size. The cross size property is whichever of width or height that is in the cross dimension.

    伸缩项目在交叉轴方向上的长或者宽是它的交叉轴尺寸。交叉轴尺寸属性则是在交叉轴方向上的长或者宽属性。

一般来说，Flex 容器以及其子元素决定其布局与尺寸主要经过以下三步：

- 将元素切割到不同的行。首先会根据预测的元素尺寸将元素切分到不同的行。这主要是依赖 flex-basis 属性。
- 在每行中进行元素的缩放：对于每一行计算 flex 元素的最终尺寸
- 排列行与元素

具体而言，会有以下步骤：

- 首先根据每个元素的 flex-basis 属性计算每个元素的可能的尺寸
- 基于 flex-wrap 属性分析应该将元素分配到几行中
- 根据 flex-grow 与 flex-shrink 属性计算元素的最终尺寸
- 根据 justify-content 属性计算元素在主轴上的排布
- 根据 align-items、align-content、align-self 属性计算元素在交叉轴上的排布

Flex 的浏览器支持情况如下：

| Chrome             | Safari               | Firefox             | Opera       | IE                    | Android              | iOS                  |
| ------------------ | -------------------- | ------------------- | ----------- | --------------------- | -------------------- | -------------------- |
| 20- (old)21+ (new) | 3.1+ (old)6.1+ (new) | 2-21 (old)22+ (new) | 12.1+ (new) | 10 (tweener)11+ (new) | 2.1+ (old)4.4+ (new) | 3.2+ (old)7.1+ (new) |

## Polyfill

如果要在 Internet Explorer 8 & 9 上使用 Flex, 直接下载 [flexibility.js](https://github.com/10up/flexibility/blob/master/dist/flexibility.js) 脚本然后引入页面中。

```
<script src="flexibility.js"></script>
```

然后添加 `-js-display: flex` 在 `display: flex` 声明之前,或者使用 [PostCSS Flexibility](https://github.com/7rulnik/postcss-flexibility)来在构建时候动态添加该前缀。

```
.container {
    -js-display: flex;
    display: flex;
}
```

经过上文对于 Box 与 Flex 的介绍，大家肯定已经发现了 Flex 的魅力所在，同时 ReactNative 中标准的布局也是采用的 Flex 的规则，它可以视作用来代替`float`与`position`的属性。不过，在移动端的实践中，很多的老版本浏览器，其中以微信内置的某自研浏览器为典型代表，还有一些即将退出历史舞台的 IE 浏览器。

作为一个懒人，笔者希望能通过类似于 Polyfill 的方式只要用最新的语法也能在各种浏览器内都达到同样的效果。不过要兼容 Flexbox 的本质就是采用 Box 布局中的类似的属性的组合，因此，也可以选择直接写兼容性的 CSS。如果打算直接写 CSS 的话，那就在每个需要操作的 DOM 上加上对应属性。不过笔者推荐使用 SCSS 的 mixin 功能，毕竟 CSS 的事情就在 CSS 的域内解决吧。

[autoprefixer](https://github.com/postcss/autoprefixer)已经提供了面对部分老浏览器的 Flexbox 的 Polyfill，它在官方文档中提及的会产生如下的编译方式：

```
a {
    display: flex;
}
```

会编译成:

```
a {
    display: -webkit-box;
    display: -webkit-flex;
    display: -ms-flexbox;
    display: flex
}
```

笔者所使用的 Webpack 的配置文件为：

```js
var path = require('path');
var autoprefixer = require('autoprefixer');

module.exports = {
  entry: path.resolve(__dirname, 'demo.js'),
  output: {
    path: path.resolve(__dirname, ''),
    publicPath: '',
    filename: 'demo.dist.js'
  },
  module: {
    loaders: [
      {
        test: /\.jsx$/,
        exclude: /(libs|node_modules)/,
        loader: 'babel?stage=0'
      },
      {
        test: /\.js$/,
        exclude: /(libs|node_modules)/,
        loader: 'babel?stage=0'
      },
      {
        test: /\.(png|jpg|ttf|woff|svg|eot)$/,
        loader: 'url-loader?limit=8192'
      }, // inline base64 URLs for <=8k images, direct URLs for the rest
      {
        test: /\.css$/,
        loader: 'style-loader!css-loader!postcss-loader'
      },
      {
        test: /\.(scss|sass)$/,
        loader: 'style-loader!css-loader!postcss-loader!sass?sourceMap'
      }
    ]
  },
  postcss: [autoprefixer({ browsers: ['last 10 versions', '> 1%'] })],
  externals: {
    jquery: 'jQuery',
    pageResponse: 'pageResponse'
  },
  resolve: {
    alias: {
      libs: path.resolve(__dirname, 'libs'),
      nm: path.resolve(__dirname, 'node_modules')
    }
  }
};
```

笔者在这里对几个常用的功能做了测试，确定了 autoprefixer 还是可以很好地帮我们自动完成 Polyfill 的，大家可以放心使用。另外，对于老版本的 IE 浏览器，推荐[flexibility](https://github.com/10up/flexibility)，

```
.container {
    -js-display: flex;
    display: flex;
    align-contents: stretch;
}
```

[Flexibility](https://github.com/10up/flexibility) 主要用来实现 [Flexible Box Layout Module Level 1](http://www.w3.org/TR/css3-flexbox/).

# Flexbox 基本语法

## 容器属性

### display:属性定义

![](https://cdn.css-tricks.com/wp-content/uploads/2014/05/flex-container.svg)

```
.container {
  display: flex; /* or inline-flex */
}
```

该 display 属性会定义一个 flex 的容器，行内或者块属性取决于给定的值，它会为直系子元素启动 flex 容器。

### flex-direction:子元素方向

![](https://cdn.css-tricks.com/wp-content/uploads/2014/05/flex-direction1.svg)

```css
.container {
  flex-direction: row | row-reverse | column | column-reverse;
}
```

该属性用于定义主轴，即定义了子元素会以什么方向被放置到容器中。

### flex-wrap:行分割

![](https://cdn.css-tricks.com/wp-content/uploads/2014/05/flex-wrap.svg)

```css
.container {
  flex-wrap: nowrap | wrap | wrap-reverse;
}
```

一个 flex 容器默认情况下是单行排布子元素的，即使会发生溢出的情况。而通过修改 flex-wrap 属性可以是一个 flex 容器变成多行，即把子元素分割到多行显示。类似于文本被分割到多行显示，一个子元素会尽可能的扩展来适应新的行。当一个新的行被创建之后，它会被对方到 flex 容器的交叉轴上。每个行容器应该至少包含一个 flex 子元素，除非 flex 容器本身就是完全为空的。而如果 flex-direction 为 column，则各个属性效果如下所示：

![](http://7u2q25.com1.z0.glb.clouddn.com/H[`%25B8W~TFJRRRJUE45%25EU.jpg)

### flex-flow:混合了 flex-direction 与 flex-wrap

flex-flow 是对于 flex-direction 与 flex-wrap 的缩写，默认值是`row nowrap`

```css
flex-flow: <‘flex-direction’> || <‘flex-wrap’>;
```

### justify-content:元素的主轴排列

![](https://cdn.css-tricks.com/wp-content/uploads/2013/04/justify-content.svg)

该属性定义了元素在主轴上排列的方式，该属性会辅助分配余下的空白空间，在 flex 元素不可放大或者已经达到了最大值之后。

```css
.container {
  justify-content: flex-start | flex-end | center | space-between | space-around;
}
```

- `flex-start` (default): 元素被放置在行首
- `flex-end`: 元素向行尾聚集
- `center`:元素被放置在行中间
- `space-between`: 元素被均衡分布，第一个元素被放置在行首，最后一个元素被放置在行尾。
- `space-around`: 元素被均匀放置在行中，所有的空白空间被均衡分配，注意有些元素两边的空白不对等，那是因为左右两个元素的边空白叠加了。

### align-items:元素的交叉轴排列

![](https://cdn.css-tricks.com/wp-content/uploads/2014/05/align-items.svg)

```css
.container {
  align-items: flex-start | flex-end | center | baseline | stretch;
}
```

- `flex-start`: 元素被放置在交叉轴的首
- `flex-end`: 元素向交叉轴尾聚集
- `center`: 水平放置在交叉轴上
- `baseline`: 基线对齐
- `stretch` (default): 扩展以填充整个空间

## 元素属性

### flex:混合属性

flex 是 flex-grow、flex-shrink 以及 flex-basis 的组合缩写，第二和第三个参数(flex-shrink、flex-basis)可以省略，默认值为`0 1 auto`。

```css
.item {
  flex: none | [ < 'flex-grow' > < 'flex-shrink' >? || < 'flex-basis' > ];
}
```

官方是推荐这种方式，毕竟它可以设置默认值。

### flex-basis(基准)

上文中已经提及，某个 flex 元素的尺寸主要有以下三个约束：

- 由 width、flex-basis 决定的基础尺寸
- 由 flex-grow、flex-shrink 决定的不同容器尺寸情况下的缩放尺寸
- 由 max-\*、min-\*决定的尺寸的上限与下限

flex basis 是每个 flex 元素的初始尺寸，即在空白空间被分配到每个元素之前的尺寸。一般来说，flex-basis 的取值有 auto、content 以及某个具体的值。我们以一个具体的例子来说明不同的 flex-basis 的取值的效果：

- `flex-basis: 0` with `width: 45px` on each flex item results in the items having a `0px` width.
- `flex-basis: 10px` with `width: 45px` on each flex item results in the items having a `10px` width.
- `flex-basis: auto` with `width: 45px` on each flex item results in the items having a `45px` width, and the items wrap because the sum of flex basis sizes exceeds the flex container's width.
- `flex-basis: content` with `width: 45px` on each flex item should result in the flex items being sized exactly to their content, but this value is not supported as of the time I'm writing this.

![](http://7u2q25.com1.z0.glb.clouddn.com/5E78931D-2066-4353-973C-77690DD5FBE0.png)

### flex-grow(放大) & flex-shrink(收缩)

flex-grow 与 flex-shrink 都是用于控制 flex 元素的缩放，这两个属性都会接受一个单位的非负值，如果设置为 0 的话就意味着不让 flex 元素在所在的行上发生缩放行为。同样的，我们以两个例子来说明 flex-grow 与 flex-shrink 的计算过程。

1. flex-grow 的计算

首先我们做如下假设：

```css
.flex-parent {
  display: flex;
  flex-direction: row;
  flex-wrap: nowrap;
  flex-basis: auto;
  width: 100px;
  height: 50px;
}
.one {
  flex-grow: 1;
  width: 10px;
  border: none; /* simplify calculations */
}
.two {
  flex-grow: 2;
  width: 20px;
  border: none;
}
<div class="flex-parent blue">
  <div class="one green">1</div><div class="two orange">2</div></div>
</div>
```

- flex 父容器的排布为 `flex-direction: row` ,并且其尺寸为`100px`
- 然后有两个子元素:
  - Item #1:
    - 基础尺寸为 `10px` (e.g. `flex-basis: 10px`或者 `flex-basis: auto` 加上 `width: 10px`)
    - `flex-grow` 属性值为 `1`
  - Item #2:
    - 基础尺寸为 `20px`
    - `flex-grow` 属性值为 `2`

那么，根据算法，计算过程为：

- 首先，计算该行的空白距离 `100px` - `10px` -`20px` = `70px`
- 确定每个元素的缩放比率，单元素的缩放比例为其 flex-grow 的值/总的 flex-grow 值:
  - Item #1: `1/3`
  - Item #2: `2/3`
- 将空白距离按比例分配给各个子元素.
  - Item #1 新的尺寸: `10px + 1/3 * 70px = 33.3333px`
  - Item #2 新的尺寸: `20px + 2/3 * 70px = 66.6666px`

最终效果如下所示：

![](http://7u2q25.com1.z0.glb.clouddn.com/EE625FDC-0F1B-4E9F-9738-80E13FEECDA8.png)

2.**flex-grow 的计算**

同样的，我们先做如下假设：

```css
.flex-parent {
  display: flex;
  flex-direction: row;
  flex-wrap: nowrap;
  width: 100px;
  height: 50px;
}
.one {
  flex-shrink: 1;
  width: 100px;
  border: none; /* simplify calculations */
}
.two {
  flex-shrink: 2;
  width: 100px;
  border: none;
}
<div class="flex-parent blue">
  <div class="one green">1</div><div class="two orange">2</div></div>
</div>
```

- flex 父容器的排布为 `flex-direction: row` ,并且其尺寸为`100px`
- 然后有两个子元素:
  - Item #1:
    - 基础尺寸为 `100px` (e.g. `flex-basis: 100px`或者 `flex-basis: auto` 加上 `width: 100px`)
    - `flex-shrink` 属性值为 `1`
  - Item #2:
    - 基础尺寸为 `100px`
    - `flex-shrink` 属性值为 `2`

那么，根据算法，计算过程为：

- 首先，计算该行的空白距离 `100px` - `100px` -`100px` = `-100px`
- 确定每个元素的缩放比率，单元素的缩放比例为其 flex-shrink 的值/总的 flex-shrink 值:
  - Item #1: `1/3`
  - Item #2: `2/3`
- 将空白距离按比例分配给各个子元素.
  - Item #1 新的尺寸: `100px - 1/3 * 100px = 66.6666px`
  - Item #2 新的尺寸: `100px - 2/3 * 100px = 33.3333px`

![](http://7u2q25.com1.z0.glb.clouddn.com/2E1FA322-037C-4A2D-BF4E-E3747C72F9C4.png)

### align-self

![](https://cdn.css-tricks.com/wp-content/uploads/2014/05/align-self.svg)

用于为每个元素设置单独的交叉轴排布方式：

```css
.item {
  align-self: auto | flex-start | flex-end | center | baseline | stretch;
}
```

注意，float、clear 以及 vertical-align 对于 flex 元素没有影响。

# Flexbox 常用示例
