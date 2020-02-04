# Gulp

Gulp 是一个构建系统，开发者可以使用它在网站开发过程中自动执行常见任务。Gulp 是基于 Node.js 构建的，因此 Gulp 源文件和你用来定义任务的 Gulp 文件都被写进了 JavaScript(或者 CoffeeScript)里。前端开发工程师还可以用自己熟悉的语言来编写任务去 lint JavaScript 和 CSS、解析模板以及在文件变动时编译 LESS 文件(当然这些只是一小部分例子)。

Gulp 本身虽然不能完成很多任务，但它有大量插件可用，开发者可以访问插件页面或者在 npm 搜索 gulpplugin 就能看到。例如，有些插件可以用来执行 JSHint、编译 CoffeeScript，执行 Mocha 测试，甚至更新版本号。

对比其他构建工具，比如 Grunt，以及最近流行的 Broccoli，我相信 Gulp 会更胜一筹(请看后面的”Why Gulp?”部分)，同时我汇总了一个使用 Javascript 编写的构建工具清单，可供大家参考。

## Quick Start

### Install
安装 Gulp 的过程十分简单。首先，需要在全局安装 Gulp 包：

```
npm install -g gulp
```

然后，在项目里面安装 Gulp：

```
npm install --save-dev gulp
```

### Using
现在我们创建一个 Gulp 任务来压缩 JavaScript 文件。首先创建一个名为 gulpfile.js 的文件，这是定义 Gulp 任务的地方，它可以通过 gulp 命令来运行，接着把下面的代码放到 gulpfile.js 文件里面。

```
var gulp = require('gulp'),
   uglify = require('gulp-uglify');

gulp.task('minify', function () {
   gulp.src('js/app.js')
      .pipe(uglify())
      .pipe(gulp.dest('build'))
});
```

然后在 npm 里面运行 npm install -–save-dev gulp-uglify 来安装 gulp-uglify，最后通过运行 gulp minify 来执行任务。假设 js 目录下有个 app.js 文件，那么一个新的 app.js 将被创建在编译目录下，它包含了 js/app.js 的压缩内容。

往往为了方便起见，可以设置默认的任务与自动化任务：

```
// 监视文件的变化
gulp.task('watch', function () {
    gulp.watch('src/*.js', ['jshint', 'minify']);
});

// 注册缺省任务
gulp.task('default', ['jshint', 'minify', 'watch']);
```

# Plugins

## gulp-concat

```
var concat = require('gulp-concat');
 
gulp.task('scripts', function() {
  return gulp.src('./lib/*.js','src/**/*.js')
    .pipe(concat('all.js'))
    .pipe(gulp.dest('./dist/'));
});
```

可以使用 gulp task_name 的方式来执行这个任务

```
gulp scripts
```

# Reference

- [Gulp 开发教程翻译][1]

[1]: http://www.w3ctech.com/topic/134
