# 原子 CSS

你可能听说过各种 CSS 方法，如 BEM, OOCSS 等：

```html
<button class="button button--state-danger">Danger button</button>
```

现在，人们真的很喜欢 Tailwind CSS 和它的 实用工具优先（utility-first）的概念。这与 Functional CSS 和 Tachyon 这个库的理念非常接近。

```html
<button
  class="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
>
  Button
</button>
```

用海量的实用工具类（utility classes）组成的样式表，让我们可以在网页里大显身手。原子 CSS 就像是实用工具优先（utility-first）CSS 的一个极端版本: 所有 CSS 类都有一个唯一的 CSS 规则。原子 CSS 最初是由 Thierry Koblentz (Yahoo!)在 2013 年挑战 CSS 最佳实践时使用的。

```css
/* 原子 CSS */
.bw-2x {
  border-width: 2px;
}
.bss {
  border-style: solid;
}
.sans {
  font-style: sans-serif;
}
.p-1x {
  padding: 10px;
}
/* 不是原子 CSS 因为这个类包含了两个规则 */
.p-1x-sans {
  padding: 10px;
  font-style: sans-serif;
}
```

使用实用工具/原子 CSS，我们可以把结构层和表示层结合起来:当我们需要改变按钮颜色时，我们直接修改 HTML，而不是 CSS！这种紧密耦合在现代 CSS-in-JS 的 React 代码库中也得到了承认，但似乎 是 CSS 世界里最先对传统的关注点分离有一些异议。

CSS 权重也不是什么问题，因为我们使用的是最简单的类选择器。我们现在通过 html 标签来添加样式，发现了一些有趣的事儿：

- 我们增加新功能的时候，样式表的增长减缓了。
- 我们可以到处移动 html 标签，并且能确保样式也同样生效。
- 我们可以删除新特性，并且确保样式也同时被删掉了。

可以肯定的缺点是，html 有点臃肿。对于服务器渲染的 web 应用程序来说可能是个缺点，但是类名中的高冗余使得 gzip 可以压缩得很好。同时它可以很好地处理之前重复的 css 规则。一旦你的实用工具/原子 CSS 准备好了，它将不会有太大的变化或增长。可以更有效地缓存它(你可以将它附加到 vendor.css 中，重新部署的时候它也不会失效)。它还具有相当好的可移植性，可以在任意其他应用程序中使用。
