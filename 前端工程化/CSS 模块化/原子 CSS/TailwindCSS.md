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
- text-white 代表属性颜色：#fff;
- font-bold 代表属性 font-weight：700;
- py-2，即 padding-y 或 padding-vertical 表示属性 padding-top：0.5rem;底部填充：0.5rem；
- px-4 表示 padding-x 或 padding-horizo​​ntal 表示属性 padding-left：1rem; andpadding-right：1rem；
- 四舍五入代表边界半径：.25rem；

看起来很复杂吧？但是，像这样，即使您使用相同的框架，您与其他人创建的 UI 也会有所不同。与使用 UI 套件的情况不同，创建的 UI 趋于相同，因为在 UI 套件中可以使用预先设计的组件，尽管可以覆盖样式，但是结果可能不会有太大差别。无法将 TailwindCSS 与 UI 工具包框架（例如 Bootstrap，Bulma 或 Spectre）相提并论，因为它们基本上具有不同的概念。如果在 UI 工具包框架中需要创建一些自定义类来自定义所使用的预先设计的组件，而在 TailwindCSS 中则可以减少自定义类的使用。因为，要制造组件，您需要通过编译实用程序类从头开始。

# Links

- [2021-Why I Don't Like Tailwind CSS](https://www.aleksandrhovhannisyan.com/blog/why-i-dont-like-tailwind-css/): On paper, utility CSS actually sounds like it may be useful. In practice, though, Tailwind CSS (and utility CSS in general) suffers from the same issues that it attempts to solve and is, in my honest opinion, not worth your time.
