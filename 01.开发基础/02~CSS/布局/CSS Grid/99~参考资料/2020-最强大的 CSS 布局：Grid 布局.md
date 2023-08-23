> [原文地址](https://juejin.cn/post/6854573220306255880)

## Grid 布局是什么？

`Grid` 布局即网格布局，是一种新的 `CSS` 布局模型，比较擅长将一个页面划分为几个主要区域，以及定义这些区域的大小、位置、层次等关系。号称是最强大的的 `CSS` 布局方案，是目前唯一一种 `CSS` 二维布局。利用 `Grid` 布局，我们可以轻松实现类似下图布局：

> [演示地址](https://link.juejin.cn/?target=https%3A%2F%2Fcodepen.io%2Fgpingfeng%2Fpen%2FqBbveKB%3Feditors%3D1100)

![img](https://assets.ng-tech.icu/item/17389591885783dd~tplv-t2oaga2asx-zoom-in-crop-mark:3024:0:0:0.png)

```html
<div class="wrapper">
  <div class="one item">One</div>
  <div class="two item">Two</div>
  <div class="three item">Three</div>
  <div class="four item">Four</div>
  <div class="five item">Five</div>
  <div class="six item">Six</div>
</div>
<style>
  .wrapper {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    grid-gap: 20px;
    grid-auto-rows: minmax(100px, auto);
  }
  .one {
    grid-column: 1 / 2;
    grid-row: 1;
    background: #19caad;
  }
  .two {
    grid-column: 2 / 4;
    grid-row: 1 / 3;
    background: #8cc7b5;
  }
  .three {
    grid-row: 2 / 5;
    grid-column: 1;
    background: #d1ba74;
  }
  .four {
    grid-column: 3;
    grid-row: 3;
    background: #bee7e9;
  }
  .five {
    grid-column: 2;
    grid-row: 3/5;
    background: #e6ceac;
  }
  .six {
    grid-column: 3;
    grid-row: 4;
    background: #ecad9e;
  }
  .item {
    text-align: center;
    font-size: 200%;
    color: #fff;
  }
</style>
```

## Grid 布局和 flex 布局

讲到布局，我们就会想到 `flex` 布局，甚至有人认为竟然有 `flex` 布局了，似乎没有必要去了解 `Grid` 布局。但 `flex` 布局和 `Grid` 布局有实质的区别，那就是 **`flex` 布局是一维布局，`Grid` 布局是二维布局**。`flex` 布局一次只能处理一个维度上的元素布局，一行或者一列。`Grid` 布局是将容器划分成了“行”和“列”，产生了一个个的网格，我们可以将网格元素放在与这些行和列相关的位置上，从而达到我们布局的目的。

**`Grid` 布局远比 `flex` 布局强大！**

flex 布局示例:

![img](https://assets.ng-tech.icu/item/173945aadff842d1~tplv-t2oaga2asx-zoom-in-crop-mark:3024:0:0:0.png)

Grid 布局示例：

![Grid 布局](https://assets.ng-tech.icu/item/173895918bcb5190~tplv-t2oaga2asx-zoom-in-crop-mark:3024:0:0:0.png)

## Grid 的一些基础概念

我们使用 Grid 实现一个小例子，演示 Grid 的一些基础概念：

> [演示地址](https://link.juejin.cn/?target=https%3A%2F%2Fcodepen.io%2Fgpingfeng%2Fpen%2FQWyoexm%3Feditors%3D1100)

```html
<div class="wrapper">
  <div class="one item">One</div>
  <div class="two item">Two</div>
  <div class="three item">Three</div>
  <div class="four item">Four</div>
  <div class="five item">Five</div>
  <div class="six item">Six</div>
</div>
<style>
  .wrapper {
    margin: 60px;
    /* 声明一个容器 */
    display: grid;
    /*  声明列的宽度  */
    grid-template-columns: repeat(3, 200px);
    /*  声明行间距和列间距  */
    grid-gap: 20px;
    /*  声明行的高度  */
    grid-template-rows: 100px 200px;
  }
  .one {
    background: #19caad;
  }
  .two {
    background: #8cc7b5;
  }
  .three {
    background: #d1ba74;
  }
  .four {
    background: #bee7e9;
  }
  .five {
    background: #e6ceac;
  }
  .six {
    background: #ecad9e;
  }
  .item {
    text-align: center;
    font-size: 200%;
    color: #fff;
  }
</style>
```

![img](https://assets.ng-tech.icu/item/173895918bfd94e9~tplv-t2oaga2asx-zoom-in-crop-mark:3024:0:0:0.png)

容器和项目：我们通过在元素上声明 `display：grid` 或 `display：inline-grid` 来创建一个网格容器。一旦我们这样做，这个元素的所有直系子元素将成为网格项目。比如上面 `.wrapper` 所在的元素为一个网格容器，其直系子元素将成为网格项目。

网格轨道：`grid-template-columns` 和 `grid-template-rows` 属性来定义网格中的行和列。容器内部的水平区域称为行，垂直区域称为列。上图中 `One`、`Two`、`Three` 组成了一行，`One`、`Four` 则是一列

![行和列](https://assets.ng-tech.icu/item/173895918ee0ecb6~tplv-t2oaga2asx-zoom-in-crop-mark:3024:0:0:0.png)

网格单元：一个网格单元是在一个网格元素中最小的单位，从概念上来讲其实它和表格的一个单元格很像。上图中 `One`、`Two`、`Three`、`Four`...都是一个个的网格单元

网格线：划分网格的线，称为"网格线"。应该注意的是，当我们定义网格时，我们定义的是网格轨道，而不是网格线。Grid 会为我们创建编号的网格线来让我们来定位每一个网格元素。m 列有 m + 1 根垂直的网格线，n 行有 n + 1 跟水平网格线。比如上图示例中就有 4 根垂直网格线。一般而言，是从左到右，从上到下，1，2，3 进行编号排序。当然也可以从右到左，从下到上，按照 -1，-2，-3...顺序进行编号排序

![网格线](https://assets.ng-tech.icu/item/17389591934e1560~tplv-t2oaga2asx-zoom-in-crop-mark:3024:0:0:0.png)

## 容器属性介绍

`Grid` 布局相关的属性以及值众多，需要记忆的不少，建议可以跟 `demo` 一起结合起来，边敲代码边理解，再利用一些空闲时间记忆一下。笔者会在介绍每个属性的时候，做个小 `demo` 演示，建议大家可以自己修改看看效果加深记忆

`Grid` 布局属性可以分为两大类，一类是容器属性，一类是项目属性。我们先来看容器属性

### display 属性

[display 属性演示](https://link.juejin.cn/?target=https%3A%2F%2Fcodepen.io%2Fgpingfeng%2Fpen%2FwvMZwqY)

我们通过在元素上声明 `display：grid` 或 `display：inline-grid` 来创建一个网格容器。声明 `display：grid` 则该容器是一个块级元素，设置成 `display: inline-grid` 则容器元素为行内元素

```css
.wrapper {
  display: grid;
}
```

![块级元素](https://assets.ng-tech.icu/item/17389591baa442ef~tplv-t2oaga2asx-zoom-in-crop-mark:3024:0:0:0.png)

```css
.wrapper-1 {
  display: inline-grid;
}
```

![行内属性](https://assets.ng-tech.icu/item/17389591c03b6883~tplv-t2oaga2asx-zoom-in-crop-mark:3024:0:0:0.png)

### grid-template-columns 属性和 grid-template-rows 属性

`grid-template-columns` 属性设置列宽，`grid-template-rows` 属性设置行高，这两个属性在 `Grid` 布局中尤为重要，它们的值是有多种多样的，而且它们的设置是比较相似的，下面针对 `grid-template-columns` 属性进行讲解

**固定的列宽和行高**

```css
.wrapper {
  display: grid;
  /*  声明了三列，宽度分别为 200px 100px 200px */
  grid-template-columns: 200px 100px 200px;
  grid-gap: 5px;
  /*  声明了两行，行高分别为 50px 50px  */
  grid-template-rows: 50px 50px;
}
```

以上表示固定列宽为 200px 100px 200px，行高为 50px 50px

![固定行高和列宽](https://assets.ng-tech.icu/item/17389591c0fc1214~tplv-t2oaga2asx-zoom-in-crop-mark:3024:0:0:0.png)

**repeat() 函数**：可以简化重复的值。该函数接受两个参数，第一个参数是重复的次数，第二个参数是所要重复的值。比如上面行高都是一样的，我们可以这么去实现，实际效果是一模一样的

```css
.wrapper-1 {
  display: grid;
  grid-template-columns: 200px 100px 200px;
  grid-gap: 5px;
  /*  2行，而且行高都为 50px  */
  grid-template-rows: repeat(2, 50px);
}
```

**auto-fill 关键字**：表示自动填充，让一行（或者一列）中尽可能的容纳更多的单元格。`grid-template-columns: repeat(auto-fill, 200px)` 表示列宽是 200 px，但列的数量是不固定的，只要浏览器能够容纳得下，就可以放置元素，代码以及效果如下图所示：

```css
.wrapper-2 {
  display: grid;
  grid-template-columns: repeat(auto-fill, 200px);
  grid-gap: 5px;
  grid-auto-rows: 50px;
}
```

![image](https://assets.ng-tech.icu/item/17389591c300e81a~tplv-t2oaga2asx-zoom-in-crop-mark:3024:0:0:0.png)

**fr 关键字**：`Grid` 布局还引入了一个另外的长度单位来帮助我们创建灵活的网格轨道。`fr` 单位代表网格容器中可用空间的一等份。`grid-template-columns: 200px 1fr 2fr` 表示第一个列宽设置为 200px，后面剩余的宽度分为两部分，宽度分别为剩余宽度的 1/3 和 2/3。代码以及效果如下图所示：

```css
.wrapper-3 {
  display: grid;
  grid-template-columns: 200px 1fr 2fr;
  grid-gap: 5px;
  grid-auto-rows: 50px;
}
```

![image](https://assets.ng-tech.icu/item/17389591ccc256d1~tplv-t2oaga2asx-zoom-in-crop-mark:3024:0:0:0.png)

**minmax() 函数**：我们有时候想给网格元素一个最小和最大的尺寸，`minmax()` 函数产生一个长度范围，表示长度就在这个范围之中都可以应用到网格项目中。它接受两个参数，分别为最小值和最大值。`grid-template-columns: 1fr 1fr minmax(300px, 2fr)` 的意思是，第三个列宽最少也是要 300px，但是最大不能大于第一第二列宽的两倍。代码以及效果如下：

```css
.wrapper-4 {
  display: grid;
  grid-template-columns: 1fr 1fr minmax(300px, 2fr);
  grid-gap: 5px;
  grid-auto-rows: 50px;
}
```

![image](https://assets.ng-tech.icu/item/17389591dc05edac~tplv-t2oaga2asx-zoom-in-crop-mark:3024:0:0:0.png)

**auto 关键字**：由浏览器决定长度。通过 `auto` 关键字，我们可以轻易实现三列或者两列布局。`grid-template-columns: 100px auto 100px` 表示第一第三列为 100px，中间由浏览器决定长度，代码以及效果如下：

```css
.wrapper-5 {
  display: grid;
  grid-template-columns: 100px auto 100px;
  grid-gap: 5px;
  grid-auto-rows: 50px;
}
```

![image](https://assets.ng-tech.icu/item/17389591f2146e1d~tplv-t2oaga2asx-zoom-in-crop-mark:3024:0:0:0.png)

### grid-row-gap 属性、grid-column-gap 属性以及 grid-gap 属性

> [grid-row-gap 属性、grid-column-gap 属性以及 grid-gap 属性演示地址](https://link.juejin.cn/?target=https%3A%2F%2Fcodepen.io%2Fgpingfeng%2Fpen%2FjOWRNeg)

`grid-row-gap` 属性、`grid-column-gap` 属性分别设置行间距和列间距。`grid-gap` 属性是两者的简写形式。

`grid-row-gap: 10px` 表示行间距是 10px，`grid-column-gap: 20px` 表示列间距是 20px。`grid-gap: 10px 20px` 实现的效果是一样的

```css
.wrapper {
  display: grid;
  grid-template-columns: 200px 100px 100px;
  grid-gap: 10px 20px;
  grid-auto-rows: 50px;
}
pgsql .wrapper-1 {
  display: grid;
  grid-template-columns: 200px 100px 100px;
  grid-auto-rows: 50px;
  grid-row-gap: 10px;
  grid-column-gap: 20px;
}
```

以上两种写法效果是一样的。

![img](https://assets.ng-tech.icu/item/17389591f78de6f2~tplv-t2oaga2asx-zoom-in-crop-mark:3024:0:0:0.png)

### grid-template-areas 属性

> [grid-area 以及 grid-template-areas 演示地址](https://link.juejin.cn/?target=https%3A%2F%2Fcodepen.io%2Fgpingfeng%2Fpen%2FRwrObEJ%3Feditors%3D1100)

`grid-template-areas` 属性用于定义区域，一个区域由一个或者多个单元格组成

一般这个属性跟网格元素的 `grid-area` 一起使用，我们在这里一起介绍。`grid-area` 属性指定项目放在哪一个区域

```css
css .wrapper {
  display: grid;
  grid-gap: 10px;
  grid-template-columns: 120px 120px 120px;
  grid-template-areas:
    ". header  header"
    "sidebar content content";
  background-color: #fff;
  color: #444;
}
```

上面代码表示划分出 6 个单元格，其中值得注意的是 `.` 符号代表空的单元格，也就是没有用到该单元格。

```css
.sidebar {
  grid-area: sidebar;
}

.content {
  grid-area: content;
}

.header {
  grid-area: header;
}
```

以上代码表示将类 `.sidebar` `.content` `.header`所在的元素放在上面 `grid-template-areas` 中定义的 `sidebar` `content` `header` 区域中

![img](https://assets.ng-tech.icu/item/173895920bbe824a~tplv-t2oaga2asx-zoom-in-crop-mark:3024:0:0:0.png)

### grid-auto-flow 属性

> [grid-auto-flow 属性演示地址](https://link.juejin.cn/?target=https%3A%2F%2Fcodepen.io%2Fgpingfeng%2Fpen%2FMWKRWKj%3Feditors%3D1100)

`grid-auto-flow` 属性控制着自动布局算法怎样运作，精确指定在网格中被自动布局的元素怎样排列。默认的放置顺序是"先行后列"，即先填满第一行，再开始放入第二行，即下图英文数字的顺序 `one`,`two`,`three`...。这个顺序由 `grid-auto-flow` 属性决定，默认值是 `row`。

```css
.wrapper {
  display: grid;
  grid-template-columns: 100px 200px 100px;
  grid-auto-flow: row;
  grid-gap: 5px;
  grid-auto-rows: 50px;
}
```

![img](https://assets.ng-tech.icu/item/173895921548265c~tplv-t2oaga2asx-zoom-in-crop-mark:3024:0:0:0.png)

细心的同学可能发现了一个问题，就是第五个项目和第六个项目之间有个空白（如下图所示），这个是由于第六块的长度大于了空白处的长度，被挤到了下一行导致的。在实际应用中，我们可能想让下面长度合适的填满这个空白，这个时候可以设置 `grid-auto-flow: row dense`，表示尽可能填满表格。代码以及效果如下所示：

![image](https://assets.ng-tech.icu/item/17389592211e1d6b~tplv-t2oaga2asx-zoom-in-crop-mark:3024:0:0:0.png)

```css
.wrapper-2 {
  display: grid;
  grid-template-columns: 100px 200px 100px;
  grid-auto-flow: row dense;
  grid-gap: 5px;
  grid-auto-rows: 50px;
}
```

![image](https://assets.ng-tech.icu/item/173895923612a19b~tplv-t2oaga2asx-zoom-in-crop-mark:3024:0:0:0.png)

可以设置 `grid-auto-flow: column`，表示先列后行，代码以及效果如下图所示：

```css
.wrapper-1 {
  display: grid;
  grid-auto-columns: 100px;
  grid-auto-flow: column;
  grid-gap: 5px;
  grid-template-rows: 50px 50px;
}
```

![image](https://assets.ng-tech.icu/item/173895923f11dd83~tplv-t2oaga2asx-zoom-in-crop-mark:3024:0:0:0.png)

### justify-items 属性、align-items 属性以及 place-items 属性

> [justify-items 属性、align-items 属性演示地址](https://link.juejin.cn/?target=https%3A%2F%2Fcodepen.io%2Fgpingfeng%2Fpen%2FzYrXYrz%3Feditors%3D1100)

`justify-items` 属性设置单元格内容的水平位置（左中右），`align-items` 属性设置单元格的垂直位置（上中下）

下面以 justify-items 属性为例进行讲解，align-items 属性同理，只是方向为垂直方向。它们都有如下属性：

```css
.container {
  justify-items: start | end | center | stretch;
  align-items: start | end | center | stretch;
}
```

其代码实现以及效果如下：

```css
.wrapper,
.wrapper-1,
.wrapper-2,
.wrapper-3 {
  display: grid;
  grid-template-columns: 100px 200px 100px;
  grid-gap: 5px;
  grid-auto-rows: 50px;
  justify-items: start;
}
.wrapper-1 {
  justify-items: end;
}
.wrapper-2 {
  justify-items: center;
}
.wrapper-3 {
  justify-items: stretch;
}
```

- start：对齐单元格的起始边缘

![image](https://assets.ng-tech.icu/item/1738959244947d96~tplv-t2oaga2asx-zoom-in-crop-mark:3024:0:0:0.png)

- end：对齐单元格的结束边缘

![image](https://assets.ng-tech.icu/item/17389592560e3fc2~tplv-t2oaga2asx-zoom-in-crop-mark:3024:0:0:0.png)

- center：单元格内部居中

![image](https://assets.ng-tech.icu/item/173895925bd879fa~tplv-t2oaga2asx-zoom-in-crop-mark:3024:0:0:0.png)

- stretch：拉伸，占满单元格的整个宽度（默认值）

![image](https://assets.ng-tech.icu/item/1738959270057d0c~tplv-t2oaga2asx-zoom-in-crop-mark:3024:0:0:0.png)

### justify-content 属性、align-content 属性以及 place-content 属性

> [justify-content 属性、align-content 属性演示地址](https://link.juejin.cn/?target=https%3A%2F%2Fcodepen.io%2Fgpingfeng%2Fpen%2FqBbwBZx%3Feditors%3D1100)

`justify-content` 属性是整个内容区域在容器里面的水平位置（左中右），`align-content` 属性是整个内容区域的垂直位置（上中下）。它们都有如下的属性值。

```css
.container {
  justify-content: start | end | center | stretch | space-around | space-between
    | space-evenly;
  align-content: start | end | center | stretch | space-around | space-between |
    space-evenly;
}
```

下面以 `justify-content` 属性为例进行讲解，`align-content` 属性同理，只是方向为垂直方向

- start - 对齐容器的起始边框
- end - 对齐容器的结束边框
- center - 容器内部居中

```css
.wrapper,
.wrapper-1,
.wrapper-2,
.wrapper-3,
.wrapper-4,
.wrapper-5,
.wrapper-6 {
  display: grid;
  grid-template-columns: 100px 200px 100px;
  grid-gap: 5px;
  grid-auto-rows: 50px;
  justify-content: start;
}
.wrapper-1 {
  justify-content: end;
}
.wrapper-2 {
  justify-content: center;
}
```

![image](https://assets.ng-tech.icu/item/173895926d20f5d6~tplv-t2oaga2asx-zoom-in-crop-mark:3024:0:0:0.png)

- space-around - 每个项目两侧的间隔相等。所以，项目之间的间隔比项目与容器边框的间隔大一倍
- space-between - 项目与项目的间隔相等，项目与容器边框之间没有间隔
- space-evenly - 项目与项目的间隔相等，项目与容器边框之间也是同样长度的间隔
- stretch - 项目大小没有指定时，拉伸占据整个网格容器

```css
.wrapper-3 {
  justify-content: space-around;
}
.wrapper-4 {
  justify-content: space-between;
}
.wrapper-5 {
  justify-content: space-evenly;
}
.wrapper-6 {
  justify-content: stretch;
}
```

![image](https://assets.ng-tech.icu/item/173895927ba770c4~tplv-t2oaga2asx-zoom-in-crop-mark:3024:0:0:0.png)

### grid-auto-columns 属性和 grid-auto-rows 属性

> [grid-auto-columns 属性和 grid-auto-rows 属性演示地址](https://link.juejin.cn/?target=https%3A%2F%2Fcodepen.io%2Fgpingfeng%2Fpen%2FzYrXvYZ%3Feditors%3D1100)

在讲 `grid-auto-columns` 属性和 `grid-auto-rows` 属性之前，先来看看隐式和显式网格的概念

**隐式和显式网格**：显式网格包含了你在 `grid-template-columns` 和 `grid-template-rows` 属性中定义的行和列。如果你在网格定义之外又放了一些东西，或者因为内容的数量而需要的更多网格轨道的时候，网格将会在隐式网格中创建行和列

假如有多余的网格（也就是上面提到的隐式网格），那么它的行高和列宽可以根据 `grid-auto-columns` 属性和 `grid-auto-rows` 属性设置。它们的写法和`grid-template-columns` 和 `grid-template-rows` 完全相同。如果不指定这两个属性，浏览器完全根据单元格内容的大小，决定新增网格的列宽和行高

```css
.wrapper {
  display: grid;
  grid-template-columns: 200px 100px;
  /*  只设置了两行，但实际的数量会超出两行，超出的行高会以 grid-auto-rows 算 */
  grid-template-rows: 100px 100px;
  grid-gap: 10px 20px;
  grid-auto-rows: 50px;
}
```

`grid-template-columns` 属性和 `grid-template-rows` 属性只是指定了两行两列，但实际有九个元素，就会产生隐式网格。通过 `grid-auto-rows` 可以指定隐式网格的行高为 50px

![img](https://assets.ng-tech.icu/item/173895927d99af1c~tplv-t2oaga2asx-zoom-in-crop-mark:3024:0:0:0.png)

## 项目属性介绍

### grid-column-start 属性、grid-column-end 属性、grid-row-start 属性以及 grid-row-end 属性

> [演示地址](https://link.juejin.cn/?target=https%3A%2F%2Fcodepen.io%2Fgpingfeng%2Fpen%2FPoZgopr)

可以指定网格项目所在的四个边框，分别定位在哪根网格线，从而指定项目的位置

- grid-column-start 属性：左边框所在的垂直网格线
- grid-column-end 属性：右边框所在的垂直网格线
- grid-row-start 属性：上边框所在的水平网格线
- grid-row-end 属性：下边框所在的水平网格线

```css
css .wrapper {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  grid-gap: 20px;
  grid-auto-rows: minmax(100px, auto);
}
.one {
  grid-column-start: 1;
  grid-column-end: 2;
  background: #19caad;
}
.two {
  grid-column-start: 2;
  grid-column-end: 4;
  grid-row-start: 1;
  grid-row-end: 2;
  /*   如果有重叠，就使用 z-index */
  z-index: 1;
  background: #8cc7b5;
}
.three {
  grid-column-start: 3;
  grid-column-end: 4;
  grid-row-start: 1;
  grid-row-end: 4;
  background: #d1ba74;
}
.four {
  grid-column-start: 1;
  grid-column-end: 2;
  grid-row-start: 2;
  grid-row-end: 5;
  background: #bee7e9;
}
.five {
  grid-column-start: 2;
  grid-column-end: 2;
  grid-row-start: 2;
  grid-row-end: 5;
  background: #e6ceac;
}
.six {
  grid-column: 3;
  grid-row: 4;
  background: #ecad9e;
}
```

上面代码中，类 `.two` 所在的网格项目，垂直网格线是从 2 到 4，水平网格线是从 1 到 2。其中它跟 `.three` （垂直网格线是从 3 到 4，水平网格线是从 1 到 4） 是有冲突的。可以设置 `z-index` 去决定它们的层级关系

![img](https://assets.ng-tech.icu/item/173895928bc7e88e~tplv-t2oaga2asx-zoom-in-crop-mark:3024:0:0:0.png)

### grid-area 属性

`grid-area` 属性指定项目放在哪一个区域，在上面介绍 `grid-template-areas` 的时候有提到过，这里不再具体展开，具体的使用可以参考演示地址：

> [grid-area 以及 grid-template-areas 属性演示地址](https://link.juejin.cn/?target=https%3A%2F%2Fcodepen.io%2Fgpingfeng%2Fpen%2FRwrObEJ)

### justify-self 属性、align-self 属性以及 place-self 属性

[justify-self 属性/ align-self 属性/ place-self 属性演示地址](https://link.juejin.cn/?target=https%3A%2F%2Fcodepen.io%2Fgpingfeng%2Fpen%2FZEQZEJK%3Feditors%3D1100)

`justify-self` 属性设置单元格内容的水平位置（左中右），跟 `justify-items` 属性的用法完全一致，但只作用于单个项目

`align-self` 属性设置单元格内容的垂直位置（上中下），跟 align-items 属性的用法完全一致，也是只作用于单个项目

两者很相像，这里只拿 `justify-self` 属性演示，`align-self` 属性同理，只是作用于垂直方向。`place-self` 是设置 `align-self` 和 `justify-self` 的简写形式，这里也不重复介绍。

```css
.item {
  justify-self: start | end | center | stretch;
  align-self: start | end | center | stretch;
}

.item {
  justify-self: start;
}
.item-1 {
  justify-self: end;
}
.item-2 {
  justify-self: center;
}
.item-3 {
  justify-self: stretch;
}
```

- start：对齐单元格的起始边缘

![image](https://assets.ng-tech.icu/item/1738959292160e78~tplv-t2oaga2asx-zoom-in-crop-mark:3024:0:0:0.png)

- end：对齐单元格的结束边缘

![image](https://assets.ng-tech.icu/item/17389592a0d5a3c0~tplv-t2oaga2asx-zoom-in-crop-mark:3024:0:0:0.png)

- center：单元格内部居中

  ![image](https://assets.ng-tech.icu/item/17389592b1378c8d~tplv-t2oaga2asx-zoom-in-crop-mark:3024:0:0:0.png)

- stretch：拉伸，占满单元格的整个宽度（默认值）

  ![image](https://assets.ng-tech.icu/item/17389592b895f0ed~tplv-t2oaga2asx-zoom-in-crop-mark:3024:0:0:0.png)

## Grid 实战——实现响应式布局

经过上面的介绍，相信大家都可以看出，Grid 是非常强大的。一些常见的 CSS 布局，如居中，两列布局，三列布局等等是很容易实现的。我们接下来看看 Grid 布局是如何实现响应式布局的

### fr 实现等分响应式

> [fr 实现等分响应式](https://link.juejin.cn/?target=https%3A%2F%2Fcodepen.io%2Fgpingfeng%2Fpen%2FwvMZKpB%3Feditors%3D1100)

`fr` 等分单位，可以将容器的可用空间分成想要的多个等分空间。利用这个特性，我们能够轻易实现一个等分响应式。`grid-template-columns: 1fr 1fr 1fr` 表示容器分为三等分

```css
.wrapper {
  margin: 50px;
  display: grid;
  grid-template-columns: 1fr 1fr 1fr;
  grid-gap: 10px 20px;
  grid-auto-rows: 50px;
}
```

![image](https://assets.ng-tech.icu/item/17389592bf7e44dd~tplv-t2oaga2asx-zoom-in-crop-mark:3024:0:0:0.png)

### repeat + auto-fit——固定列宽，改变列数量

等分布局并不只有 `Grid` 布局才有，像 `flex` 布局也能轻松实现，接下来看看更高级的响应式

上面例子的始终都是三列的，但是需求往往希望我们的网格能够固定列宽，并根据容器的宽度来改变列的数量。这个时候，我们可以用到上面提到 `repeat()` 函数以及 `auto-fit` 关键字。`grid-template-columns: repeat(auto-fit, 200px)` 表示固定列宽为 200px，数量是自适应的，只要容纳得下，就会往上排列，代码以及效果实现如下：

> [演示地址](https://link.juejin.cn/?target=https%3A%2F%2Fcodepen.io%2Fgpingfeng%2Fpen%2FeYJopVE%3Feditors%3D1100)

```css
.wrapper {
  margin: 50px;
  display: grid;
  grid-template-columns: repeat(auto-fit, 200px);
  grid-gap: 10px 20px;
  grid-auto-rows: 50px;
}
```

![image](https://assets.ng-tech.icu/item/17389592c297495a~tplv-t2oaga2asx-zoom-in-crop-mark:3024:0:0:0.png)

### repeat+auto-fit+minmax 去掉右侧空白

上面看到的效果中，右侧通常会留下空白，这是我们不希望看到的。如果列的宽度也能在某个范围内自适应就好了。`minmax()` 函数就帮助我们做到了这点。将 `grid-template-columns: repeat(auto-fit, 200px)` 改成 `grid-template-columns: repeat(auto-fit, minmax(200px, 1fr))` 表示列宽至少 200px，如果还有空余则一起等分。代码以及效果如下所示：

> [演示地址](https://link.juejin.cn/?target=https%3A%2F%2Fcodepen.io%2Fgpingfeng%2Fpen%2FdyGLYdQ)

```css
.wrapper {
  margin: 50px;
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  grid-gap: 10px 20px;
  grid-auto-rows: 50px;
}
```

![auto-auto-minmax.gif](https://assets.ng-tech.icu/item/17389592cc3c2bf9~tplv-t2oaga2asx-zoom-in-crop-mark:3024:0:0:0.png)

### repeat+ auto-fit + minmax-span-dense 解决空缺问题

似乎一切进行得很顺利，但是某天 UI 来说，每个网格元素的长度可能不相同，这也简单，通过 `span` 关键字进行设置网格项目的跨度，`grid-column-start: span 3`，表示这个网格项目跨度为 3。具体的代码与效果如下所示：

```css
css .item-3 {
  grid-column-start: span 3;
}
```

> [演示地址](https://link.juejin.cn/?target=https%3A%2F%2Fcodepen.io%2Fgpingfeng%2Fpen%2FBajEoxy%3Feditors%3D1100)

![image](https://assets.ng-tech.icu/item/17389592f9da3763~tplv-t2oaga2asx-zoom-in-crop-mark:3024:0:0:0.png)

不对，怎么右侧又有空白了？原来是有一些长度太长了，放不下，这个时候就到我们的 `dense` 关键字出场了。`grid-auto-flow: row dense` 表示尽可能填充，而不留空白，代码以及效果如下所示：

```css
.wrapper,
.wrapper-1 {
  margin: 50px;
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  grid-gap: 10px 20px;
  grid-auto-rows: 50px;
}

.wrapper-1 {
  grid-auto-flow: row dense;
}
```

![image](https://assets.ng-tech.icu/item/17389593009f7fe7~tplv-t2oaga2asx-zoom-in-crop-mark:3024:0:0:0.png)

## Grid 布局兼容性

最后，聊聊 `Grid` 布局兼容性问题，在 [caniuse](https://link.juejin.cn/?target=https%3A%2F%2Fcaniuse.com%2F%23search%3Dgrid) 中，我们可以看到的结果如下，总体兼容性还不错，但在 IE 10 以下不支持。个人建议在公司的内部系统运用起来是没有问题的，但 TOC 的话，可能目前还是不太合适

![image](https://assets.ng-tech.icu/item/17389592fa541366~tplv-t2oaga2asx-zoom-in-crop-mark:3024:0:0:0.png)
