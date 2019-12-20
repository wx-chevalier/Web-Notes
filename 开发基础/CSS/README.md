[![返回目录](https://i.postimg.cc/50XLzC7C/image.png)](https://github.com/wx-chevalier/Web-Series)

# CSS 语法基础与实践

随着 Internet 的迅猛发展，HTML 被广泛应用，上网的人们当然希望网页做得漂亮些，因此 HTML 排版和界面效果的局限性日益暴露出来。为了解决这个问题，人们也走了不少弯路，用了一些不好的方法，比如给 HTML 增加很多的属性结果将代码变得很臃肿，将文本变成图片，过多利用 Table 来排版，用空白的图片表示白色的空间等。直到 CSS 出现。

CSS 可算是网页设计的一个突破，它解决了网页界面排版的难题。可以这么说，HTML 的 Tag 主要是定义网页的内容(Content)，而 CSS 决定这些网页内容如何显示(Layout)。CSS 的英文是 Cascading Style Sheets，中文可以翻译成串联式样式表。

CSS 的学习是一个典型的低门槛，高瓶颈的过程，第一次接触 CSS 的时候觉得一切是如此简单，直到后面越学越发现自己一无所知，建议看看张鑫旭老师的[说说 CSS 学习中的瓶颈](http://www.zhangxinxu.com/wordpress/2012/07/bottleneck-css-study/)

CSS 第一个字母，是 Cascading，意为串联。它是指不同来源的样式(Styles)可以合在一起，形成一种样式。Cascading 的顺序是：

- 浏览器缺省(browser default)(优先级最低)
- 外部样式表(Extenal Style Sheet)
- 内部样式表(Internal Style Sheet)
- 内嵌样式表(Inline Style)(优先级最高)

我们可以用内嵌样式(Inline Style)、内部样式表(Internal StyleSheet)、外部样式表(External Style Sheet)这三种方式定义 CSS 样式。

Inline Style 是写在 Tag 里面的。内嵌样式只对所在的 Tag 有效。

```html
<p style="font-size:20pt; color:red">这个Style定义<p>
</p>里面的文字是20pt字体，字体颜色是红色。</p>
```

内部样式表是写在 HTML 的<head></head>里面的。内部样式表只对所在的网页有效。

```html
<html>
  <head>
    <style type="text/css">
      h1.mylayout {
        border-width: 1;
        border: solid;
        text-align: center;
        color: red;
      }
    </style>
  </head>
  <body>
    <h1 class="mylayout">这个标题使用了Style。</h1>
    <h1>这个标题没有使用Style。</h1>
  </body>
</html>
```

内部样式表(Internal Sytle Sheet)要用到 Style 这个 Tag，写法如下：

```html
<style type="text/css">
  ......;
</style>
```

将样式(Styles)写在一个以.css 为后缀的 CSS 文件里，然后在每个需要用到这些样式(Styles)的网页里引用这个 CSS 文件。同时可以使用@import 将其余的 CSS 引入到一个里面。

```html
p { background-color:green; } @import url(import/one.css); @import
url(import/two.css);
<html>
  <head>
    <link href="linkd.css" rel="stylesheet" type="text/css" />
  </head>
  <body>
    <h1>这个标题使用了Style。</h1>
  </body>
</html>
```

使用外部(Extenal)样式表，相对于内嵌(Inline)和内部式(Internal)的，有以下优点：样式代码可以复用。一个外部 CSS 文件，可以被很多网页共用。便于修改。如果要修改样式，只需要修改 CSS 文件，而不需要修改每个网页。提高网页显示的速度。如果样式写在网页里，会降低网页显示的速度，如果网页引用一个 CSS 文件，这个 CSS 文件多半已经在缓存区(其它网页早已经引用过它)，网页显示的速度就比较快。
