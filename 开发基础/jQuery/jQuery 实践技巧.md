[![返回目录](https://i.postimg.cc/50XLzC7C/image.png)](https://github.com/wx-chevalier/Web-Series)

### 回到顶部的按钮

通过使用 jQuery 中的`animate` 与 `scrollTop` 方法可以创建一个非常简易的带有平滑滚动的回到顶部的按钮：

```js
// Back to top
$('a.top').click(function (e) {
  e.preventDefault();
  $(document.body).animate({scrollTop: 0}, 800);
});
<!-- Create an anchor tag -->
<a class="top" href="#">Back to top</a>
```

通过修改 `scrollTop`的值可以设置滚动最终停止的位置，最终的效果就是在 800 毫秒的时间内文档会被滚动到指定的地方。

### 图片预加载

如果网页中使用了大量的图片并且不一定需要立刻可见，可以把它们放入预加载队列：

```
$.preloadImages = function () {
  for (var i = 0; i < arguments.length; i++) {
    $('img').attr('src', arguments[i]);
  }
};

$.preloadImages('img/hover-on.png', 'img/hover-off.png');
```

###

### 检查图片是否加载完成

有时候需要检查某个图片是否加载完成从而继续下面的操作：

```
$('img').load(function () {
  console.log('image load successful');
});
```

同样的，可以使用 ID 或者类选择器来判断某个特定的图片是否加载完成。

###

### Fix Broken Images Automatically

在页面上如果发生某些图片加载失败是一个非常常见并且恶心的事情，如下的一小段代码可以在某种程度上解决这个问题：

```
$('img').on('error', function () {
  $(this).prop('src', 'img/broken.png');
});
```

即使没有发现任何的坏链的情况，也是建议将这段代码添加到页面中。

### Toggle Classes on Hover

很多时候需要的响应是在用户悬浮在某个元素上时改变其的可见性或者状态，换言之，即是在用户将鼠标悬浮在某个元素上时修改其的类属性，而在用户停止悬浮时移除该类:

```
$('.btn').hover(function () {
  $(this).addClass('hover');
  }, function () {
    $(this).removeClass('hover');
  });
```

当然，更简单的就是利用 `toggleClass` 方法:

```
$('.btn').hover(function () {
  $(this).toggleClass('hover');
});
```

**Note**: CSS 的 hover 伪类可能是更方便的做法，不过知晓这种用法也是值得的。

###

### 禁用输入框

很多情况下我们希望提交按钮能够在部分文本框未填入的情况下处于禁用状态直到用户执行了某个动作，此时我们就需要为这个按钮添加 disabled 属性：

```
$('input[type="submit"]').prop('disabled', true);
```

如果需要回复输入框的状态，那么就要再次使用 `prop`方法, 不过将 `disabled` 的值设置为`false`:

```
$('input[type="submit"]').prop('disabled', false);
```

###

### 阻止链接的加载

有时候你不希望用户在点击了某个链接之后跳转到新的页面或者重载当前页面：

```
$('a.no-link').click(function (e) {
  e.preventDefault();
});
```

###

### 触发渐隐/滑动

滑动与渐隐是 jQuery 种最常见的动画之一，很多时候我们希望能在用户点击某个元素之后将其渐隐渐出或者滑动出现：

```
// Fade
$('.btn').click(function () {
  $('.element').fadeToggle('slow');
});
// Toggle
$('.btn').click(function () {
  $('.element').slideToggle('slow');
});
```

###

### 简单的折叠效果

有时候我们需要能够达成简单的折叠效果：

```
// Close all panels
$('#accordion').find('.content').hide();
// Accordion
$('#accordion').find('.accordion-header').click(function () {
  var next = $(this).next();
  next.slideToggle('fast');
  $('.content').not(next).slideUp('fast');
  return false;
});
```

###

### 将两个 DIV 设置为统一高度

有时候希望无论两个 DIV 种包含怎样的内容都能保持统一高度：

```
$('.div').css('min-height', $('.main-div').height());
```

也可以使用如下更灵活一点的方法：

```
var $columns = $('.column');
var height = 0;
$columns.each(function () {
  if ($(this).height() > height) {
    height = $(this).height();
  }
});
$columns.height(height);
```

如果希望所有的列都保持统一高度：

```
var $rows = $('.same-height-columns');
$rows.each(function () {
  $(this).find('.column').height($(this).height());
});
```

###

### 在新的窗口打开外部链接

有时候需要控制在本页面打开同源链接，在新的页面种打开外部链接：

```
$('a[href^="http"]').attr('target','_blank');
$('a[href^="//"]').attr('target','_blank');
$('a[href^="'+window.location.origin+'"]').attr('target','_self');
```

**Note:** `window.location.origin` 在 IE10 下无法工作. [这个修复](http://tosbourn.com/a-fix-for-window-location-origin-in-internet-explorer/) 专门处理这个问题。

###

### 根据文本选择元素

通过使用 `contains()` 选择器可以根据内容搜索对应的元素，下述代码的作用就是在文本不存在的时候隐藏元素：

```
var search = $('#search').val();
$('div:not(:contains("'+search+'"))').hide();
```

###

### 可见性变化时候的触发

在某个 Tab 获得焦点或者失去焦点的时候：

```
$(document).on('visibilitychange', function(e){
  if (e.target.visibilityState === "visible") {
    console.log('Tab is now in view!');
  } else if (e.target.visibilityState === "hidden") {
    console.log('Tab is now hidden!');
  }
});
```
