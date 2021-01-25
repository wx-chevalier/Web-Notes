# BEM

BEM 的意思就是块（block）、元素（element）、修饰符（modifier）,是由 Yandex 团队提出的一种前端命名方法论。这种巧妙的命名方法让你的 CSS 类对其他开发者来说更加透明而且更有意义。BEM 命名约定更加严格，而且包含更多的信息，它们用于一个团队开发一个耗时的大项目。

命名约定的模式如下：

```css
.block {
}
.block__element {
}
.block--modifier {
}
```

- .block 代表了更高级别的抽象或组件。
- .`block__element` 代表.block 的后代，用于形成一个完整的.block 的整体。
- .block--modifier 代表.block 的不同状态或不同版本。

之所以使用两个连字符和下划线而不是一个，是为了让你自己的块可以用单个连字符来界定，如：

```css
.site-search {
} /* 块 */
.site-search__field {
} /* 元素 */
.site-search--full {
} /* 修饰符 */
```

BEM 的关键是光凭名字就可以告诉其他开发者某个标记是用来干什么的。通过浏览 HTML 代码中的 class 属性，你就能够明白模块之间是如何关联的：有一些仅仅是组件，有一些则是这些组件的子孙或者是元素,还有一些是组件的其他形态或者是修饰符。我们用一个类比/模型来思考一下下面的这些元素是怎么关联的：

```css
.person {
}
.person__hand {
}
.person--female {
}
.person--female__hand {
}
.person__hand--left {
}
```

顶级块是‘person’，它拥有一些元素，如‘hand’。一个人也会有其他形态，比如女性，这种形态进而也会拥有它自己的元素。下面我们把他们写成‘常规’CSS:

```css
.person {
}
.hand {
}
.female {
}
.female-hand {
}
.left-hand {
}
```

这些‘常规’CSS 都是有意义的，但是它们之间却有些脱节。就拿 .female 来说，是指女性人类还是某种雌性的动物？还有.hand，是在说一只钟表的指针？还是一只正在玩纸牌的手？使用 BEM 我们可以获得更多的描述和更加清晰的结构，单单通过我们代码中的命名就能知道元素之间的关联。BEM 真是强大。

```html
<form class="site-search  full">
  <input type="text" class="field" />
  <input type="Submit" value="Search" class="button" />
</form>
```

这些 CSS 类名真是太不精确了，并不能告诉我们足够的信息。尽管我们可以用它们来完成工作，但它们确实非常含糊不清。用 BEM 记号法就会是下面这个样子：

```html
<form class="site-search  site-search--full">
  <input type="text" class="site-search__field" />
  <input type="Submit" value="Search" class="site-search__button" />
</form>
```

我们能清晰地看到有个叫.site-search 的块，他内部是一个叫 `.site-search__field` 的元素。并且.site-search 还有另外一种形态叫.site-search--full。
