> 本文翻译自 [case-study-boosting-front-end-performance](https://css-tricks.com/case-study-boosting-front-end-performance/)。

在 [De Voorhoede](https://www.voorhoede.nl/en/)工作的日子里，我们一直在追寻为用户构建高性能的前端解决方案。不过并不是每个客户会乐于遵循我们的性能指南，以至于我们必须一遍又一遍地跟他们解释那些保证他们能够战胜竞争对手的性能策略的重要性。最近我们也重构了自己的官方主页，使其能够拥有更快地响应速度与更好地性能表
现。

![img](https://cdn.css-tricks.com/wp-content/uploads/2016/08/screenshot-of-site.png)

# 性能调优始于设计

在前端项目中，我们常常与产品经理以及 UI 设计讨论如何在美感与性能之间达到平衡，我们坚信更快地内容呈现是好的用户体验的不可分割的一部分。在我们自己的网站中，我们是以性能优于美感。好的内容、布局、图片与交互都是构成你网站吸引力的不可或缺的部分，不过这些复杂的元素的使用往往也意味着页面加载速度的增加。设计的核心即在于决定我们网站需要呈现哪些内容，往往这里的内容会指图片、字体这样的偏静态的部分，我们首先也从对于静态内容的优化开始。

## Static Site Generator

为了演示与测试方便，我们基于 NodeJS 搭建了一个混合使用 MarkDown 与 JSON 作为配置的静态网站生成器，其中一个简单的博客类型的网站的配置信息如下:

```json
{
  "keywords": ["performance", "critical rendering path", "static site", "..."],
  "publishDate": "2016-08-12",
  "authors": ["Declan"]
}
```

而其内容为:

```md
# A case study on boosting front-end performance

At [De Voorhoede](https://www.voorhoede.nl/en/) we try to boost front-end performance...

## Design for performance

In our projects we have daily discussions...
```

下面，我们就这个静态网站，进行一些讨论。

## Image Delivery

图片是网站的不可或缺的部分，其能够大大提升网站的表现力与视觉效果，而目前[平均大小为 2406KB 的网页中就有 1535KB 是图片资源](http://httparchive.org/interesting.php?a=All&l=Jul%2015%202016)，可见图片占据了静态资源多么大的一个比重，这也是我们需要重点优化的部分。

![img](https://cdn.css-tricks.com/wp-content/uploads/2016/08/average-bytes-per-page-chart.jpg)

### WebP

[WebP](https://developers.google.com/speed/webp/) 是面向现代网页的高压缩低损失的图片格式，通常会比 JPEG 小 25%左右。然后 WebP 目前被很多人忽视，也不常使用。截止到本文撰写的时候，WebP 目前只能够在[Chrome, Opera and Android](http://caniuse.com/#feat=webp) (大概占用户数的 50%)这些浏览器中使用，不过我们还是有办法以 JPG/PNG 来弥补部分浏览器中不支持 WebP 的缺憾。

### `picture` 标签

使用 picture 标签可以方便的对于 WebP 格式不支持的情况下完成替换:

```html
<picture>
  <source type="image/webp" srcset="image-l.webp" media="(min-width: 640px)" />
  <source type="image/webp" srcset="image-m.webp" media="(min-width: 320px)" />
  <source type="image/webp" srcset="image-s.webp" />
  <source srcset="image-l.jpg" media="(min-width: 640px)" />
  <source srcset="image-m.jpg" media="(min-width: 320px)" />
  <source srcset="image-s.jpg" />
  <img alt="Description of the image" src="image-l.jpg" />
</picture>
```

这里我们使用了 [picturefill by Scott Jehl](https://github.com/scottjehl/picturefill) 作为 Polyfill 库来保证低版本的浏览器中能够支持 picture 标签，并且保证跨浏览器的功能一致性。并且我们还使用了 img 标签来保证那些不支持 picture 的浏览器能够正常工作。

### 图片多格式生成

现在我们已经可以通过设置不同的图片尺寸、格式来保证图片的分发优化，不过我们总不希望每次要用一张图片的时候就去生成 6 个不同的尺寸/实例。我们希望有一种抽象的方法可以帮我们自动完成这一步，为我们自动生成不同的格式/尺寸，然后自动插入合适的 picture 元素，在我们的静态网站生成器中是这么做的：

- 首先是要[gulp responsive](https://github.com/mahnunchik/gulp-responsive)来生成不同尺寸的图片，该插件同样会输出 WebP 格式的图片
- 压缩生成好的图片
- 用户只需要在 MarkDown 中编写`![Description of the image](image.jpg)`即可
- 我们自定义的 MarkDown 渲染引擎会在处理过程中自动使用 picture 元素替换这些 img 标签

## SVG Animation

我们的网站中也存在着很多的 Icon 以及动画性质图片，这里我们是选择 SVG 作为 Icon 与 Animation 的格式，主要考虑有下:

- SVG 是矢量表示，往往比位图文件更小

- SVG 自带响应式功效，能够根据容器大小进行自动缩放，因此我们不需要再为了 picture 元素生成不同尺寸的图片

- 最重要的一点是我们可以使用 CSS 去改变其样式或者添加动画效果，关于这一点可以参考[CodePen 上的这个演示](https://codepen.io/voorhoede/pen/qNgWod/)。

## Custom Web Fonts

我们首先回顾下浏览器是如何使用自定义字体的，当浏览器识别到用户在 CSS 中基于`@font-size`定义的字体时，会尝试下载该字体文件。而在下载的过程中，浏览器是不会展示该字体所属的文本内容，最终导致了所谓的`Flash of Invisible Text`现象。现在很多的网站都存在这个问题，这也是导致用户体验差的一个重要原因，即会影响用户最主要的内容浏览这一操作。而我们的优化点即在于首先将字体设置为默认字体，而后在自定义的 Web Font 下载完毕之后对标准字体再进行替换操作，并且重新渲染整个文本块。而如果自定义的字体下载失败，整个内容还是能保证基本的可读性，不会对用户体验造成毁灭性的打击。
![](https://cdn.css-tricks.com/wp-content/uploads/2016/08/voorhoede-fonts.jpg)

首先，我们会为需要使用到的 Web Fonts 创建最小子集，即只将那些需要使用的字体提取出来，而并不需要让用户下载整个字体集，这里推荐使用[Font squirrel webfont generator](https://www.fontsquirrel.com/tools/webfont-generator)。另外，我们还需要为字体的下载设置监视器，即保证能够在字体下载完毕之后自动回调，这里我们使用的是[fontfaceobserver](https://github.com/bramstein/fontfaceobserver)，它会为页面自动创建一个监视器，在侦测到所有的自定义 Web Fonts 下载完毕后，会为整个页面添加默认的类名:

```css
html {
  font-family: Georgia, serif;
}
html.fonts-loaded {
  font-family: Noto, Georgia, serif;
}
```

不过现在 CSS 的`font-display`属性也原生提供了我们这种替换功能，更多详情可见[font-display](https://developers.google.com/web/updates/2016/02/font-display)属性。

# JS 与 CSS 的懒加载

总的来说我们希望所有的资源能够尽可能快地加载完毕，不过往往为了保证首页加载的速度，我们会考虑将部分非首屏需要的 JS/CSS 文件进行延迟加载，或者对于重复的视图使用浏览器本地缓存。

## Lazy Load JS

目前来说，我们的网站都是偏向于静态，并不需要太多的 JavaScript 介入，不过考虑到日后的扩展空间，我们还是构建了一套完整的 JS 的工作流。众所周知，如果将 JS 直接放置到 head 标签中，其会阻塞整个页面的渲染。对于该点，最简单的方式就是将会阻塞渲染的 JS 脚本移动到页面的尾部，在整个首屏渲染完毕之后再进行加载。另一个常用的手段就是依然保持 JS 文件位于 head 标签中，不过为其添加一个`defer`的属性，这保证了浏览器只会先将该脚本下载下来，然后等到整个页面加载完毕再执行该脚本。另一个需要注意的是，因为我们并不使用类似于 jQuery 这样的第三方依赖库，而更多的依赖于浏览器原生的特性，因此我们希望在合适的浏览器内加载合适版本的 JS 代码，其效果大概如下:

```html
<script>
  // Mustard Cutting
  if ("querySelector" in document && "addEventListener" in window) {
    document.write('<script src="index.js" defer><\/script>');
  }
</script>
```

## Lazy Load CSS

正如上文所述，我们的网站偏向于静态展示，因此首屏的最大问题就是 CSS 文件的加载问题。浏览器会在 head 标签中声明的所有 CSS 文件下载完毕之前一直处于阻塞状态，这种机制很是明智的，不然的话浏览器在加载多个 CSS 文件的时候会进行重复的布局与渲染，这更是对于性能的浪费。为了避免非首屏的 CSS 文件阻塞页面渲染，我们使用[loadCSS](https://github.com/filamentgroup/loadCSS)这个小的工具库来进行异步的 CSS 文件加载，它会在 CSS 文件加载完毕后执行回调。不过，异步加载 CSS 也会带来一个新的问题，如果我们将所有的 CSS 全部设置为了异步加载，那么用户会首先看到单纯的 HTML 页面，这也会给用户不好的体验。那么我们就需要在异步加载与首屏渲染之间找到一个平衡点，即首先加载那些必要的 CSS 文件。我们一般将首屏渲染中必要的 CSS 文件成为 Critical CSS，即关键的 CSS 文件，代指在保证页面的可读性的前提下需要加载的最少的 CSS 文件数目。Critical CSS 的选定会是一个非常耗时的过程，特别是我们网站本身的 CSS 样式设置也在不停变更，我们不可能完全依赖于人工去提取出关键的 CSS 文件，这里推荐[Critical](https://github.com/addyosmani/critical)这个辅助工具能够帮你自动提取压缩 Critical CSS。下图的一个对比即是仅加载 Critical CSS 与加载全部 CSS 的区别:

![](https://cdn.css-tricks.com/wp-content/uploads/2016/08/voorhoede-fold.jpg)

上图中红色的线，即是所谓的折叠分割点。

# 服务端与缓存

高性能的前端离不开服务端的支持，在我们的实践中也发现不同的服务端配置同样会影响到前端的性能。目前我们主要使用 Apache Web Server 作为中间件，并且通过 HTTPS 来安全地传递内容。

## Configuration

我们首先对于合适的服务端配置做了些调研，这里推荐是使用[H5BP Boilerplate Apache Configuration](https://github.com/h5bp/server-configs-apache)作为配置模板，它是个不错的兼顾了性能与安全性的配置建议。同样地它也提供了面向其他服务端环境的配置。我们对于大部分的 HTML、CSS 以及 JavaScript 都开启了 GZip 压缩选项，并且对于大部分的资源都设置了缓存策略，详见下文的 File Level Caching 章节。

## HTTPS

使用 HTTPS 可以保证站点的安全性，但是也会影响到你网站的性能表现，性能损耗主要发生在建立 SSL 握手协议的时候，这会导致很多的延迟，不过我们同样可以通过某些设置来进行优化。

- 设置 HTTP Strict Transport Security 请求头可以让服务端告诉浏览器其只允许通过 HTTPS 进行交互，这就避免了浏览器从 HTTP 再重定向到 HTTPS 的时间消耗。

- 设置 TLS false start 允许客户端在第一轮 TLS 中就能够立刻传递加密数据。握手协议余下的操作，譬如确认没有人进行中间人监听可以同步进行，这一点也能节约部分时间。

- 设置 TLS Session Resumption，当浏览器与服务端曾经通过 TLS 进行过通信，那么浏览器会自动记录下 Session Identifier，当下次需要重新建立连接的时候，其可以复用该 Identifier，从而解决了一轮的时间。

这里推荐扩展阅读下 [Mythbusting HTTPS: Squashing security’s urban legends by Emily Stark](https://www.youtube.com/watch?v=YMfW1bfyGSY)。

## Cookies

我们并没有使用某个服务端框架，而是直接使用了静态的 Apache Web Server，不过 Apache Web Server 也是能够读取 Cookie 并且进行些简单的操作。譬如在下面这个例子中我们将 CSS 缓存信息存放在了 Cookie 中，然后交付 Apache 进行判断是否需要重复加载 CSS 文件:

```html
<!-- #if expr="($HTTP_COOKIE!=/css-loaded/) || ($HTTP_COOKIE=/.*css-loaded=([^;]+);?.*/ && ${1} != '0d82f.css' )"-->

<noscript><link rel="stylesheet" href="0d82f.css" /></noscript>
<script>
  (function() {
    function loadCSS(url) {...}
    function onloadCSS(stylesheet, callback) {...}
    function setCookie(name, value, expInDays) {...}

    var stylesheet = loadCSS('0d82f.css');
    onloadCSS(stylesheet, function() {
      setCookie('css-loaded', '0d82f', 100);
    });
  }());
</script>

<style>
  /* Critical CSS here */
</style>

<!-- #else -->
<link rel="stylesheet" href="0d82f.css" />
<!-- #endif -->
```

这里 Apache Server 中的逻辑控制代码就是有点类似于注释形式的 `<!-- #`，其主要包含以下步骤:

- `$HTTP_COOKIE!=/css-loaded/` 检测是否有设置过 CSS 缓存相关的 Cookie

- `$HTTP_COOKIE=/.*css-loaded=([^;]+);?.*/ && ${1} != '0d82f.css'` 检测缓存的 CSS 版本是否为当前版本

- If `<!-- #if expr="..." -->` 值为 `true` 我们便能假设该用户是第一次访问该站点

- 如果用户是首次浏览，我们添加了一个 `<noscript>` 标签，里面还包含了一个阻塞型的 `<link rel="stylesheet">` 标签。添加该标签的意义在于我们在下面是使用 JavaScript 来异步加载 CSS 文件，而在用户禁止 JavaScript 的情况下也能保证可以通过该标签来正常加载 CSS 文件。

- `<!-- #else -->` 表达式在用户二次访问该页面时，我们可以认为 CSS 文件已经被加载过了，因此可以直接从本地缓存中加载而不需要重复请求。

上述策略同样可以应用于 Web Fonts 的加载，最终的 Cookie 如下所示:

![](https://cdn.css-tricks.com/wp-content/uploads/2016/08/voorhoede-cookies.jpg)

## File Level Caching

在上文可以发现，我们严重依赖于浏览器缓存来处理用户重复访问时资源加载的问题，理想情况下我们肯定希望能够永久地缓存 CSS、JS、Fonts 以及图片文件，然后在某个文件发生变化的时候将缓存设置为失效。这里我们设置了以 `https://www.voorhoede.nl/assets/css/main.css?v=1.0.4` 形式，即在请求路径上加上版本号的方式进行缓存。不过这种方式的缺陷在于如果我们更换了资源文件的存放地址，那么所有的缓存也就自然失效了。这里我们使用了 [gulp-rev](https://github.com/sindresorhus/gulp-rev) 以及 [gulp-rev-replace](https://github.com/jamesknelson/gulp-rev-replace) 来为文件添加 Hash 值，从而保证了仅当文件内容发生变化的时候文件请求路径才会发生改变，即将每个文件的缓存验证独立开来。

# Result

上面我们介绍了很多的优化手段，这里我们以实验的形式来对优化的结果与效果进行分析。我们可以用类似于 [PageSpeed Insights](https://developers.google.com/speed/pagespeed/insights/) 或者 [WebPagetest](http://www.webpagetest.org/) 来进行性能测试或者网络分析。我觉得最好的测试你站点渲染性能的方式就是在限流的情况下观察页面的呈现效果，Google Chrome 内置了限流的功能：

![](https://cdn.css-tricks.com/wp-content/uploads/2016/08/voorhoede-network-analysis.jpg)

这里我们将我们的网络环境设置为了 50KB/S 的 GPRS 网络环境，我们总共花费了 2.27 秒完成了首屏渲染。上图中黄线左侧的时间即指明了从 HTML 文件开始下载到下载完成所耗费的时间，该 HTML 文件中已经包含了关键的 CSS 代码，因此整个页面已经保证了基本的可用性与可交互型。而剩下的比较大的资源都会进行延时加载，这正是我们想要达到的目标。我们也可以使用 PageSpeed 来测试下网站的性能，可以看出我们得分很不错:

![](https://cdn.css-tricks.com/wp-content/uploads/2016/08/pagespeed-insights-voorhoede.jpg)

而在 WebPagetest 中，我们看出了如下的结果:

![](https://cdn.css-tricks.com/wp-content/uploads/2016/08/webpagetest-voorhoede.jpg)

## Roadmap

优化之路漫漫，永无止境，我们在未来也会关注以下几个方面：

- HTTP/2:我们目前已经开始尝试使用 HTTP/2，而本篇文章中提到的很多的优化的要点都是面向 HTTP/1.1 的。简言之，HTTP/1.1 诞生之初还是处于 Table 布局与行内样式流行的时代，它并没有考虑到现在所面对的 2.6MB 大小，包含 200 多个网络请求的页面。为了弥合这老的协议的缺陷，我们不得不连接 JS 与 CSS 文件、使用行内样式、对于小图片使用 Data URL 等等。这些操作都是为了节约请求次数，而 HTTP/2 中允许在同一个 TCP 请求中进行多个并发的请求，这样就会允许我们不需要再去进行大量的文件合并操作。

- Service Workers:这是现代浏览器提供的后台工作线程，可以允许我们为网站添加譬如离线支持、推送消息、后台同步等等很多复杂的操作。

- CDN:目前我们是自己维护网站，而在真实的应用场景下可以考虑使用 CDN 服务来减少服务端与客户端之间的物理距离，从而减少传输时延。
