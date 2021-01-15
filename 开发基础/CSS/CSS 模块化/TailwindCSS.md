# TailwindCSS

如果您遇到的通用框架由许多组件预先设计组成，则在此 TailwindCSS 中，您将找不到诸如按钮，卡片，警报，轮播等其他预先设计的组件。因为 TailwindCSS 不是 UI 工具包，而是实用程序优先的框架，用于快速构建自定义界面。简而言之，在 TailwindCSS 中，有许多小类代表 CSS 声明。因此，当您要创建组件时，则需要使用其中的一些小类来创建您要引用的组件。

例如，您要制作一个按钮组件。在 Bootstrap 框架或其他具有预先设计的组件的框架中，您或多或少会这样做：

```html
<button class="btn">Button</button>

<button class="button">Button</button>
```

同时，在 TailwindCSS 中，您需要这样做：

```html
<button class="bg-blue-500 text-white font-bold py-2 px-4 rounded">
  Button
</button>
```

上面的类表示它们自己的属性和值。

- bg-blue-500 代表属性：background-color：＃4299e1;
  text-white 代表属性颜色：#fff;
  font-bold 代表属性 font-weight：700;
  py-2，即 padding-y 或 padding-vertical 表示属性 padding-top：0.5rem;底部填充：0.5rem；
  px-4 表示 padding-x 或 padding-horizo​​ntal 表示属性 padding-left：1rem; andpadding-right：1rem；
  四舍五入代表边界半径：.25rem；
