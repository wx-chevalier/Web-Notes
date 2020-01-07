[![返回目录](https://i.postimg.cc/50XLzC7C/image.png)](https://github.com/wx-chevalier/Web-Series)

# PostCSS

PostCSS 在以惊人的速度发展，而且越来越受人欢迎。越来越多的人开始在了解它，使用它。因为他们意识到，在项目中使用 PostCSS 让他们意识到了眼前一亮。

![PostCSS](http://ww4.sinaimg.cn/mw690/0064cTs2gw1exh62u393hj30go05xmx3.jpg)

PostCSS 是什么？最好的定义来自于 PostCSS 自身项目在[github](https://github.com/postcss)上的描述：

> “PostCSS is a tool for transforming CSS with JS plugins. These plugins can support variables and mixins, transpile future CSS syntax, inline images, and more.

简而言之，PostCSS 是 CSS 变成 JavaScript 的数据，使它变成可操作。PostCSS 是基于 JavaScript 插件，然后执行代码操作。PostCSS 自身并不会改变 CSS，它只是一种插件，为执行任何的转变铺平道路。本质上是没有很制 PostCSS 插件操纵 CSS，也就是说它可以适用于任何 CSS。只要你能想到的，你都可以编写一个 PostCSS 插件，让它来转成 CSS。PostCSS 插件可以像预处理器，它们可以优化和 autoprefix 代码；可以添加未来语法；可以添加变量和逻辑；可以提供完整的网格系统；可以提供编码的快捷方式……还有很多很多。

**PostCSS 不是什么**

- 尽管表面上它看起来是一个预处理器，其实它**不是一个预处理器**
- 尽管表面上它看起来是一个后处理器，其实它**也不是一个后处理器**
- 尽管它可以促进、支持未来的语法，其实它**不是未来语法**
- 尽管它可以提供清理、优化代码这样的功能，其实它**不是清理、优化代码的工具**
- 它不是任何一件事情，这也意味者它潜力无限，你可以根据自己的需要配置你需要的功能

**PostCSS 特别之处**

- 多样化的功能插件，创建了一个生态的插件系统
- 根据你需要的特性进行模块化
- 快速编译
- 创建自己的插件，且具可访问性
- 可以像普通的 CSS 一样使用它
- 不依赖于任何预处理器就具备创建一个库的能力
- 可以与许多流行工具构建无缝部署

### Installation

#### Gulp

To install the PostCSS module in your project, run the following command in your terminal: `npm i gulp-postcss -D`.

In your project’s `Gulpfile.js`, we need to require our installed PostCSS module and then use it within a task. Be sure to update the paths to your development files and the directory where the transformed output will go.

```
var postcss = require('gulp-postcss');

gulp.task('styles', function () {
    return gulp.src('path/to/dev/style.css')
        .pipe(postcss([]))
        .pipe(gulp.dest(path/to/prod))
});
```

To run the task, type `gulp styles` in the command line.

#### Grunt

To install the PostCSS module in your project, run the following command in the terminal: `npm i grunt-postcss -D`.

Once the plugin is installed on your system, enable it within the Gruntfile and create a task, as below. Be sure to update the `cwd` and `dest` values to reflect the structure of your app.

```
module.exports = function(grunt) {
  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),
    styles: {
      options: {
        processors: []
      },
      dist: {
        files: [{
          expand: true,
          cwd: 'dev/',
          src: ['**/*.css'],
          dest: 'prod/'
        }]
      }
    }
  });

  // Load post-css.
  grunt.loadNpmTasks('grunt-postcss');

};
```

To run the task, type `grunt styles` in the command line.

### [cssnext(基于 PostCSS)](https://github.com/cssnext/cssnext)

### [myth(基于 Rework)](http://myth.io/)
