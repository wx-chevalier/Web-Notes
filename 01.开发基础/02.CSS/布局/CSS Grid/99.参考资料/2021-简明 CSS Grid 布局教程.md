> [原文地址](https://cloud.tencent.com/developer/article/1916434)

# 简明 CSS Grid 布局教程

网格布局是由一系列水平及垂直的线构成的一种布局模式，使用网格，我们能够将设计元素进行排列，帮助我们设计一系列具有固定位置以及宽度的元素的页面，使我们的网站页面更加统一。

一个网格通常具有许多的**「列（column）与行（row）」**，以及行与行、列与列之间的间隙，这个间隙一般被称为**「沟槽（gutter）」**。

![img](https://ask.qcloudimg.com/http-save/yehe-2427692/56403f63a0758c0c090b8e0b31bde540.png?imageView2/2/w/1200.png)

# **一、定义一个网格**

我们可以将 `display` 属性设为 `grid` 来定义一个网格。与弹性盒子一样，将父[容器](https://cloud.tencent.com/product/tke?from=20065&from_column=20065)改为网格布局后，他的直接子项会变为网格项。

```css
.container {
  display: grid;
}
```

## **1.1 设置列（column）与行（row）**

`grid-template-columns` 用于设置列，`grid-template-rows` 用于设置行。

```css
.container {
  display: grid;
  grid-template-columns: 100px 200px;
}
```

这里我们创建了两列，宽度分别为 `100px`和`200px`。当然，这里可以使用任何长度单位以及百分比。

![img](https://ask.qcloudimg.com/http-save/yehe-2427692/d133f4c36ea5d75d694f8a56fdfc28f6.png?imageView2/2/w/1200.png)

`grid-template` 是 `grid-template-rows` 和 `grid-template-columns` 的简写，例如：`grid-template: 50px 50px / 100px;`会创建两个 50px 高的行以及一个 100px 宽的列。

![img](https://ask.qcloudimg.com/http-save/yehe-2427692/8bf6a6d01a1b37e6034e8855f8e01489.png?imageView2/2/w/1200.png)

### **1.1.1 使用 `fr` 单位**

除了长度和百分比，我们也可以用`fr`这个单位来灵活地定义网格的行与列的大小。这个单位表示了可用空间的一个比例，类似 flex 布局的 `flex-grow` / `flex-shrink`。

```css
.container {
  display: grid;
  grid-template-columns: 1fr 1fr;
}
```

上面我们创建了等分的两列。如果希望两列的比例是 1:2，可以这么设置：

```css
.container {
  display: grid;
  grid-template-columns: 1fr 2fr;
}
```

另外，`fr`可以与一般的长度单位混合使用，比如`grid-template-columns: 100px 1fr 2fr`的结果就是第一列宽度是 100px，剩下的两列会根据去掉 100px 后的可用空间按比例 1: 2 来分配。

![img](https://ask.qcloudimg.com/http-save/yehe-2427692/6ded0bc828ead6d9ace182029132343b.png?imageView2/2/w/1200.png)

### **1.1.2 重复设置列 / 行**

我们可以使用`repeat`函数来重复创建具有某些宽度配置的列。如果要创建多个等宽列，可以用这么写：

```css
.container {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
}
```

![img](https://ask.qcloudimg.com/http-save/yehe-2427692/a109f57220e12c6f0d5825fc8236a80e.png?imageView2/2/w/1200.png)

传入`repeat`函数的第一个参数表明了后续列宽配置要重复多少次，而第二个参数表示需要重复的配置，这个配置还可以具有多个长度设定，举个例子：`repeat(2, 100px 200px)`会得到这样的效果：

![img](https://ask.qcloudimg.com/http-save/yehe-2427692/40cf784fbde1375aef933a2edd7cfe5f.png?imageView2/2/w/1200.png)

### **1.1.3 自动填充**

某些情况下，我们需要给网格创建很多列来填满整个容器，而容器的宽度是可变的，也就没办法确定 `repeat` 的次数了，这时可以使用 `repeat` 函数中的关键字`auto-fill`来实现这个效果。

```css
.container {
  display: grid;
  grid-template-columns: repeat(auto-fill, 150px);
}
```

![img](https://ask.qcloudimg.com/http-save/yehe-2427692/4dc3ee82eb405346a9e9f989126f8b54.png?imageView2/2/w/1200.png)

可以看到在 500px 宽度的容器上创建了三个 150px 的列，剩余的 50px 不足以再创建一列，所以第四个元素就被放置到了第二行。

### **1.1.4 `minmax()` 函数**

我们可以使用 `minmax`函数设置一个范围。

```css
.container {
  display: grid;
  grid-template-columns: 100px minmax(100px, 300px) 100px;
}
```

![img](https://assets.ng-tech.icu/item/7a6e56c2eb75ec5d6dc2809ee13f59de.gif)

## **1.2 网格间隙**

使用`column-gap`属性来定义列间隙；使用`row-gap`来定义行间隙；使用`gap`可以同时设定两者。

```css
.container {
  display: grid;
  grid-template-columns: repeat(auto-fill, 150px);
  gap: 10px 20px;
}
```

![img](https://ask.qcloudimg.com/http-save/yehe-2427692/0d6a7841870630ce8399c38875ece8ef.png?imageView2/2/w/1200.png)

`*gap`属性曾经有一个`grid-`前缀，不过后来的标准进行了修改，目的是让他们能够在不同的布局方法中都能起作用。尽管现在这个前缀不会影响语义，但为了代码的健壮性，可以把两个属性都写上。

另外，虽然 `gap` 属性在 grid 布局的兼容性挺好的，但在 `flex` 布局的兼容性目前看起来还不行：

![img](https://ask.qcloudimg.com/http-save/yehe-2427692/f6fa2e5f4c9eba28d88a81de80764080.png?imageView2/2/w/1200.png)

# **二、放置元素**

## **2.1 基于线的放置元素**

我们的网格中有许多的分隔线，我们可以根据这些分割线来放置元素：

- `grid-column-start` 开始的列网格线
- `grid-column-end`结束的列网格线
- `grid-row-start`开始的行网格线
- `grid-row-end`结束的列网格线

我们还可以使用 `grid-column` 、`grid-row`同时指定开始和结束的线。需要注意的是，开始和结束的线的序号要用 `/` 分开。

```css
.container {
  display: grid;
  grid-template-columns: 100px 400px;
  grid-template-rows: 50px 150px 50px;
  gap: 10px;
}

.header {
  grid-column: 1 / 3;
}

.sidebar {
  grid-column: 1 / 2;
}

.content {
  grid-column: 2 / 3;
}

.footer {
  grid-column: 1 / 3;
}
```

![img](https://ask.qcloudimg.com/http-save/yehe-2427692/3b6c7c8f4cdf7fabee768a48fdcc29e3.png?imageView2/2/w/1200.png)

我们还可以使用负数来指定分隔线，`-n`就代表倒数第`n` 条网格线。有时候我们不好确定列数，但又想定位到最后一列，这就可以考虑使用负数网格线了，例如上面的 header 可以这么写：

```css
.header {
  grid-column: 1 / -1;
}
```

### **2.1.1 使用 `span`**

除了使用开始和结束的分隔线来指定位置，我们还可以使用 `span` 来指定元素占的列数 / 行数：

```css
.header {
  grid-column: 1 / span 2;
}

// 这么写也行
.header {
  grid-column: span 2 / -1;
}
```

效果跟上图一样。

### **2.1.2 使用 `grid-area`**

我们还可以使用 `grid-area` 来一次性指定所有的行/列序号：`<grid-row-start> / <grid-column-start> / <grid-row-end> / <grid-column-end>`，也就是先指定开始坐标的行/列序号，再指定结束坐标的行/列序号。

```css
.header {
  grid-area: 1 / 1 / 2 / 3;
}
```

![img](https://ask.qcloudimg.com/http-save/yehe-2427692/f94c8ca38a6d9997c844fae37ac88ebc.png?imageView2/2/w/1200.png)

## **2.2 使用 `grid-tempate-areas` 放置元素**

另一种放置元素的方式是用`grid-template-areas`属性，并且要命名一些元素并在属性中使用这些名字作为一个区域。

`grid-template-areas`属性的使用规则如下：

- 需要填满网格的每个格子
- 对于某个横跨多个格子的元素，重复写上那个元素`grid-area`属性定义的区[域名](https://cloud.tencent.com/act/pro/domain-sales?from=20065&from_column=20065)字
- 所有名字只能出现在一个连续的区域，不能在不同的位置出现
- 一个连续的区域必须是一个矩形
- 使用`.`符号，让一个格子留空

```css
.container {
  display: grid;
  grid-template-columns: 100px 400px;
  grid-template-rows: 50px 150px 50px;
  grid-template-areas:
    "header  header"
    "sidebar content"
    "footer  footer";
  gap: 10px;
}

.header {
  grid-area: header;
}

.sidebar {
  grid-area: sidebar;
}

.content {
  grid-area: content;
}

.footer {
  grid-area: footer;
}
```

![img](https://ask.qcloudimg.com/http-save/yehe-2427692/698453a7e4a8f6f9944948fd9f79739e.png?imageView2/2/w/1200.png)

如果想把 sidebar 延伸到底部，只需要把 `grid-template-areas` 改成这样：

```css
.container {
  // ...
  grid-template-areas:
    "header  header"
    "sidebar content"
    "sidebar  footer";
}
```

效果如下：

![img](https://ask.qcloudimg.com/http-save/yehe-2427692/bfbded18c479aa0aa72df27e34ab02b4.png?imageView2/2/w/1200.png)

通过命名的方式来放置元素是一种非常直观的方式，你在 CSS 中看到的就是实际会出现的排版效果了。

# **三、显式网格与隐式网格**

显式网格是我们用`grid-template-columns`或 `grid-template-rows` 属性创建的，而隐式网格则是当「网格项被放到已定义的网格外」或「网格项的数量多于网格的数量」时才会自动生成。

假设现在我们定义一个 1 行 x 2 列的宽高都为 100px 的网格容器，并在其中放置了 a 和 b 两个网格项：

![img](https://ask.qcloudimg.com/http-save/yehe-2427692/865bbe06e73f0f9e64e1a1e4a0ffcea1.png?imageView2/2/w/1200.png)

如果我们把网格项 a 和 b 放置到已定义的网格之外的话：

```css
.a {
  grid-column: 3;
}

.b {
  grid-row: 2;
}
```

![img](https://ask.qcloudimg.com/http-save/yehe-2427692/431314203eaedbe4eda7ede8ac48b77d.png?imageView2/2/w/1200.png)

可以看到比之前定义的网格多了一些，而这些多出来的的网格就是隐式网格。另外，不仅网格多了，网格线也多了，列网格线 4 以及行网格线 3 都是自动生成的隐式网格线。

## **3.1 给隐式网格设置大小**

上图的 a 和 b 有点区别是，网格 a 宽度自动铺满了容器，而网格 b 的高度则是内容的高度，这是默认行为。我们可以给网格容器设置 `grid-auto-rows` 和 `grid-auto-columns` 属性来指定隐式网格的大小：

```css
.container {
  grid-auto-rows: 100px;
  grid-auto-columns: 100px;
}
```

![img](https://ask.qcloudimg.com/http-save/yehe-2427692/91240bddb1526165c27c27192239df47.png?imageView2/2/w/1200.png)

现在隐式网格的大小也都是 100px \* 100px 了。

## **3.2 自动放置**

上面提过，当网格项的数量多于网格的数量时也会自动生成隐式网格，默认情况下元素会逐行放置，不够空间的话再生成新的行。我们可以通过 `grid-auto-flow` 属性来修改这个行为。

例如现在有 3 x 3 的网格容器，a 、b 都占两列，默认情况下由于 b 在第一行不够空间，最终会放到第二行，然后 c 在 b 后面。

![img](https://ask.qcloudimg.com/http-save/yehe-2427692/fb7a29492dc9c28e915461a68b5bce6d.png?imageView2/2/w/1200.png)

如果修改成`grid-auto-flow: column`，会逐列放置元素，此时 c 会被放在第三行：

![img](https://ask.qcloudimg.com/http-save/yehe-2427692/75563ae687c4d784e78d2e019cae4f8f.png?imageView2/2/w/1200.png)

如果修改成`grid-auto-flow: dense`，则会在 `row` 的基础上填充前面网格留下来的空白：

![img](https://ask.qcloudimg.com/http-save/yehe-2427692/4b34f66fed3319a91cf71700dae50dfa.png?imageView2/2/w/1200.png)

> 还有`column dense`之类的值，具体可以去看 MDN: grid-auto-flow

# **四、调整对齐方式**

下面的例子都基于这个网格容器：

```css
.container {
  display: grid;
  grid-template-columns: repeat(2, 100px);
  grid-template-rows: repeat(2, 50px);
  gap: 10px;
}
```

![img](https://ask.qcloudimg.com/http-save/yehe-2427692/572ff5b3c376a6f611d780da6ba89464.png?imageView2/2/w/1200.png)

## **4.1 `justify-items`**

沿行轴对齐网格项。

- `start`

![img](https://ask.qcloudimg.com/http-save/yehe-2427692/a8901ca48f104c71d8d1e577294e7072.png?imageView2/2/w/1200.png)

- `end`

![img](https://ask.qcloudimg.com/http-save/yehe-2427692/3af1e4e90c19766ae6ec9f78536116b3.png?imageView2/2/w/1200.png)

- `center`

![img](https://ask.qcloudimg.com/http-save/yehe-2427692/296c74cb2f87ce070a802edc571345ba.png?imageView2/2/w/1200.png)

## **4.2 `align-items`**

沿列轴对齐网格项。

- `start`

![img](https://ask.qcloudimg.com/http-save/yehe-2427692/b7cf75de7d4e87965f5e900c406848a8.png?imageView2/2/w/1200.png)

- `end`

![img](https://ask.qcloudimg.com/http-save/yehe-2427692/4a3dcef573e61e8516f2a145d3819f5b.png?imageView2/2/w/1200.png)

- `center`

![img](https://ask.qcloudimg.com/http-save/yehe-2427692/4000d718790fd9bbc2fdee3da0a9d299.png?imageView2/2/w/1200.png)

## **4.3 `justify-content`**

如果网格容器的尺寸比整个网格内容的大，这时候就可以使用 `justify-content` 或 `align-content` 来调整网格内容的对齐了。具体就参考 flex 布局吧。

- `start`

![img](https://ask.qcloudimg.com/http-save/yehe-2427692/35ff4a71eae4b9dabd344c0199b84af1.png?imageView2/2/w/1200.png)

- `end`

![img](https://ask.qcloudimg.com/http-save/yehe-2427692/58aa6250797a098221eb10a626dec8d5.png?imageView2/2/w/1200.png)

- `center`

![img](https://ask.qcloudimg.com/http-save/yehe-2427692/773ca3a549be6da21213e4d10e68d3f0.png?imageView2/2/w/1200.png)

- `space-between`

![img](https://ask.qcloudimg.com/http-save/yehe-2427692/712cc03b6a5eb35b68034e8abf95e451.png?imageView2/2/w/1200.png)

- `space-around`

![img](https://ask.qcloudimg.com/http-save/yehe-2427692/ceff7b617d5c982c2e2b57665c361e74.png?imageView2/2/w/1200.png)

- `space-evenly`

![img](https://ask.qcloudimg.com/http-save/yehe-2427692/8d82a5c57641c312b8c359d5248c80fd.png?imageView2/2/w/1200.png)

## **4.4 `align-content`**

参考上面的吧

# **五、其他**

最近在实现一个两栏布局的时候用了 grid 布局，但效果看起来有点 bug，这里简单分享一下。

首先假设 html 和 css 长这样：

```css
<div class="container">
  <div></div>
  <div>abcdefg</b>
</div>
```

```css
.container {
  display: grid;
  grid-template-columns: 100px 1fr;
  gap: 10px;
  width: 150px;
  border: 2px solid red;
}
```

在宽度 150px 的容器里，我定义了两列：`100px` 固定宽度和 `1fr` 铺满剩余空间。其中第二列里的内容是一串连续字符，由于没有特意设置 `work-bread` 属性，所以显然第二列的内容会超出预期的宽度：

![img](https://ask.qcloudimg.com/http-save/yehe-2427692/9cbcc6bd6f0e16814c5ba4136261604a.png?imageView2/2/w/1200.png)

这种问题设置下 `word-break: break-word` 就好，但这是最简单的情景，如果遇上了 pre，情况就会有点迷惑。假设 html 变成了这样里面是 pre：

```html
<div class="container">
  <div></div>
  <div width="100">
    <div overflow>
      <pre>123456789</pre>
    </div>
  </div>
</div>
```

![img](https://ask.qcloudimg.com/http-save/yehe-2427692/425ded76b17a61810aff5beb3e17c964.png?imageView2/2/w/1200.png)

可以看到代码块溢出了。通常我们都是想 pre 代码块过长时可以左右滚动，那给 pre 的父元素加个 `overflow: auto` 是不是能解决问题呢？其实不能...而如果给第二列加一个固定宽度，的确可以解决问题，但这就不是预期的 `1fr` 了。

其实只要给第二列加一个 `min-width: 0` 就能解决问题，在 grid 的配置里的话就是可以把上面的 `1fr` 改成 `minmax(0, 1fr)` ...
