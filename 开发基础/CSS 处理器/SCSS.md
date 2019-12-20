[![返回目录](https://i.postimg.cc/50XLzC7C/image.png)](https://github.com/wx-chevalier/Web-Series)

# SCSS 语法介绍与实践技巧

Sass 有两种语法规则(syntaxes),目前新的语法规则(从 Sass 3 开始)被称为 “SCSS”( 时髦的 css(Sassy CSS)),它是 css3 语法的的拓展级，就是说每一个语法正确的 CSS3 文件也是合法的 SCSS 文件，SCSS 文件使用.scss 作为拓展名。第二种语法别成为缩进语法(或者 Sass)，它受到了 Haml 的简洁精炼的启发，它是为了人们可以用和 css 相近的但是更精简的方式来书写 css 而诞生的。它没有括号，分号，它使用 行缩进 的方式来指定 css 块，虽然 sass 不是最原始的语法，但是缩进语法将继续被支持，在缩进语法的文件以 .sass 为拓展名。

## 注释

有三种形式：

(1)//comment：该注释只是在.scss 源文件中有，编译后的 css 文件中没有。

(2)/_! _/：重要注释，任何 style 的 css 文件中都会有，一般放置 css 文件版权说明等信息。

(3)/\* \*/：该注释在 compressed 的 style 的 css 中没有，其他 style 的 css 文件都会含有。

## Quick Start

### Installation

### Build

**1.切换到.scss 文件所在目录**

命令行下切换到代码文件夹目录(如 Z:\)，假设有文件 test.scss 文件，里面内容如下：(SASS 完全支持 css 语法)

```css
h1 {
  font-size: 17px;
}
h2 {
  font-size: 18px;
}
```

**2.编译 scss 文件为 css 文件**

运行命令：sass --style compressed test.scss test.css，即可生成压缩版的 css 文件，并且命名为 test.css。几点说明：

(1)--style 后面可以有四个参数可选，分别为 expanded、nested、compact、compressed，分别选用不同参数的效果可以自己尝试体验。

(2)test.scss 和 test.css 文件目录可以自定义，例如把 Z 盘 sass 目录下的 test.scss 文件编译为压缩版的文件，并放置在 Z 盘 css 目录下，那么命令即：sass --style compressed z:\sass\test.scss z:\css\test.css

(3)开发过程中，只需要修改 scss 文件，然后编译；前端页面只需要引用相应的 css 文件即可。

**3.侦听文件和文件夹**

如果希望某一个 scss 文件或者相应的文件夹下面文件修改后，自动进行编译，那么可以使用侦听命令。

(1)侦听文件：

sass --watch --style compressed test.scss:test.css

当 test.scss 文件有修改后，会自动编译为 test.css，并且是 compressed 的。

(2)侦听文件夹：

sass --watch --style compressed sass:css

当 sass 文件夹下.scss 文件有修改的时候，会自动编译为与 sass 中文件同名的 css 文件。

**备注：**

(1)注意源文件和目标文件之间是**冒号**，与编译命令中为空格不同。

(2)生成的 map 文件可以查找 source map 文件的作用。

### Webpack

Webpack 中也内置了 sass-loader，通过简单的配置既可以使用。不过需要注意的是，Webpack 的 sass-loader 还是依赖于 node-sass 以及 sass(gem)，所以如果安装 sass-loader 报错可以先尝试安装 sass。

# 变量与选择器

## 变量

### 定义

变量的定义一般以\$开头，某个变量的作用域仅限于他们定义的层级以及子层级。如果变量是定义在所有嵌套选择器之外的，那么他们可以在各处被调用。

```scss
$color1: #aeaeae;
.div1 {
  background-color: $color1;
}
```

编译后：

```scss
.div1 {
  background-color: #aeaeae;
}
/*# sourceMappingURL=test.css.map */
```

如果希望某个在子选择器中定义的变量能够成为全局变量，可以使用!global 关键字：

```
#main {
  $width: 5em !global;
  width: $width;
}

#sidebar {
  width: $width;
}
```

### 嵌套引用

嵌套引用在其他编程语言中即是字符串插值，需要用#{}进行包裹：

```scss
$left: left;
.div1 {
  border-#{$left}-width: 5px;
}
```

### 变量计算

Sass 中也是支持对于变量进行简单的计算：

```scss
$left: 20px;
.div1 {
  margin-left: $left + 12px;
}
```

变量可以支持计算的类型，还是比较多的：

```scss
p {
  font: 10px/8px; // Plain CSS, no division
  $width: 1000px;
  width: $width/2; // Uses a variable, does division
  width: round(1.5) / 2; // Uses a function, does division
  height: (500px/2); // Uses parentheses, does division
  margin-left: 5px + 8px/2px; // Uses +, does division
  font: (italic bold 10px/8px); // In a list, parentheses don't count
}
```

## 选择器

### 嵌套

```scss
.div1 {
  .span1 {
    height: 12px;
  }
  .div2 {
    width: 16px;
  }
}
```

属性也可以嵌套，比如 border-color 属性，可以写成：

```scss
p {
  border: {
    color: red;
  }
}
```

注意，border 后面必须加上冒号。

### 父元素引用

在嵌套的子层级中，允许使用&引用父元素：

```scss
.div1 {
  &:hover {
    cursor: hand;
  }
}
```

# 代码重用

## 继承

SASS 允许一个选择器，继承另一个选择器。比如，现有 class1：

```scss
.class1 {
  font-size: 19px;
}
.class2 {
  @extend .class1;
  color: black;
}
```

**注意：如果在 class2 后面有设置了 class1 的属性，那么也会影响 class2，如下：**

```scss
.class1 {
  font-size: 19px;
}
.class2 {
  @extend .class1;
  color: black;
}
.class1 {
  font-weight: bold;
}
```

由此可以看出 Scss 也是递归编译的。

## **引用外部 css 文件(Partials)**

有时网页的不同部分会分成多个文件来写样式，或者引用通用的一些样式，那么可以使用@import。

```scss
@import '_test1.scss';
@import '_test2.scss';
@import '_test3.scss';
```

## Mixin&Include

Mixin 有点像 C 语言的宏(macro)，是可以重用的代码块。

使用@mixin 命令，定义一个代码块。

```scss
@mixin left {
  float: left;
  margin-left: 10px;
}
```

使用@include 命令，调用这个 mixin。

```scss
div {
  @include left;
}
```

### 参数与缺省值

- 边距设置

```scss
@mixin common($value1, $value2, $defaultValue: 12px) {
  display: block;
  margin-left: $value1;
  margin-right: $value2;
  padding: $defaultValue;
}
.class1 {
  font-size: 16px;
  @include common(12px, 13px, 15px);
}
.class2 {
  font-size: 16px;
  @include common(12px, 13px);
}
```

- 浏览器前缀设置设置

下面是一个 mixin 的实例，用来生成浏览器前缀。

```scss
@mixin rounded($vert, $horz, $radius: 10px) {
  border-#{$vert}-#{$horz}-radius: $radius;
  -moz-border-radius-#{$vert}#{$horz}: $radius;
  -webkit-border-#{$vert}-#{$horz}-radius: $radius;
}
```

使用的时候，可以像下面这样调用：

```scss
#navbar li {
  @include rounded(top, left);
}
#footer {
  @include rounded(top, left, 5px);
}
```

### Mixins Collection:一些常见的 Mixins 搜集

#### [family.scss](http://lukyvj.github.io/family.scss/):使 nth-child 更易用

![](http://7xkt0f.com1.z0.glb.clouddn.com/49E92992-98AC-42FF-93EE-EFA222B735BE.png)

# 编程式方法

## 流程控制

### 条件语句

@if 可以用来判断：

```scss
p {
  @if 1 + 1 == 2 {
    border: 1px solid;
  }
  @if 5 < 3 {
    border: 2px dotted;
  }
}
```

配套的还有@else 命令：

```scss
@if lightness($color) > 30% {
  background-color: #000;
} @else {
  background-color: #fff;
}
```

### 循环语句

SASS 支持 for 循环：

```
 @for $i from 1 to 10 {
  .border-#{$i} {
   border: #{$i}px solid blue;
  }
 }
```

也支持 while 循环：

```scss
$i: 6;
@while $i > 0 {
  .item-#{$i} {
    width: 2em * $i;
  }
  $i: $i - 2;
}
```

each 命令，作用与 for 类似：

```scss
@each $member in a, b, c, d {
  .#{$member} {
    background-image: url('/image/#{$member}.jpg');
  }
}
```

## 函数

Sass 允许用户自定义函数，原型如下所示：

```scss
@function double($n) {
  @return $n * 2;
}

#sidebar {
  width: double(5px);
}
```

### 颜色函数

SASS 提供了一些内置的颜色函数，以便生成系列颜色。

```scss
 lighten(#cc3, 10%)  // #d6d65c
 darken(#cc3, 10%)  //  #a3a329
 grayscale(#cc3) // #808080
 complement(#cc3) // #33c
```

# 模块化

目前我们组织样式的方式为:

```scss
.test-comtainer {
  width: 10px;

  .sub1 {
    width: 10px;

    .ssub2 {
      width: 10px;
    }
  }
}
```

编译成的代码为：

```css
.test-comtainer {
  width: 10px;
}

.test-comtainer .sub1 {
  width: 10px;
}

.test-comtainer .sub1 .ssub2 {
  width: 10px;
}
```

可以看出，使用这种方式组织样式采用了后代选择器，如果组件比较复杂，嵌套层次过深。编译出的 CSS 中会出现多级后代选择器，不仅会影响性能，而且如果在子组件中使用到了重复的类名，还会 出现样式冲突。

因此，在参考了多个组件库的实现后，考虑使用一种更为扁平化的方式组织样式：

```scss
$prefix: .test;

$prefix {
  width: 10px;

  &-sub1 {
    width: 10px;
  }

  &-sub2 {
    width: 10px;

    &-ssub {
      width: 10px;
    }
  }
}
```

编译后的 CSS：

```css
.test {
  width: 10px;
}

.test-sub1 {
  width: 10px;
}

.test-sub2 {
  width: 10px;
}

.test-sub2-ssub {
  width: 10px;
}
```

可以看出，使用这种方式组织的 CSS 代码不存在多级选择器，性能更加优秀。同时因为使用了精确的类名，组件之间也不会互相干扰。唯一的问题就是在 JSX 写类名更加繁琐，会频繁引用到父元素类名。

```
// 之前的写法，比较方便
<div className="test-container">
  <div className="sub1"/>
</div>

// 现在的写法，需要拼接长类名
<div className="test">
  <div className="test-sub1"/>
</div>
```

为了解决 JSX 类名繁琐的问题, 可以使用 `ts-classname-plugin`，此插件是 ts compiler 的自定义 transformer，可以对 AST 进行操作，从而达到简单模拟 scss 中 `&` 的作用。在 scss 中，`&` 是嵌套结构中外层选择器的缩写，而在 JSX 中，我们只需对 `className` 属性进行处理。
