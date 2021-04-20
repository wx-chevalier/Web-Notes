# Mocha

Mocha(发音"摩卡")诞生于 2011 年，是现在最流行的 JavaScript 测试框架之一，在浏览器和 Node 环境都可以使用。所谓"测试框架"，就是运行测试的工具。通过它，可以为 JavaScript 应用添加测试，从而保证代码的质量。Mocha 侧重于提供 TDD/BDD 上下文与报告，而 Karma 侧重于在浏览器中运行测试脚本。

# 搭建测试环境

可以使用 npm 命令直接安装 Mocha:

```
npm install --global mocha //全局安装
npm install --save mocha //局部安装
```

如果测试脚本是用 ES6 写的，那么运行测试之前，需要先用 Babel 转码。笔者本身就是一个忠实的 ES6 的支持者，如果你的项目里面已经安装了 Babel，那可以忽略这一部分。

```
npm install babel-core --save-dev
```

除了 Babel 提供的标准模块之外，你可以安装其他的解释器：

```
# For ES6/ES2015 support 
npm install babel-preset-es2015 --save-dev
# If you want to use JSX 
npm install babel-preset-react --save-dev
# If you *must* use experimental ES7 features 
npm install babel-preset-stage-0 --save-dev
```

然后，在项目目录下面，新建一个[`.babelrc`]配置文件。

```
{
   "presets": [ "es2015" ]
 }

```

最后，使用`--compilers`参数指定测试脚本的转码器。

```
$ ../node_modules/mocha/bin/mocha --compilers js:babel-core/register
```

上面代码中，`--compilers`参数后面紧跟一个用冒号分隔的字符串，冒号左边是文件的后缀名，右边是用来处理这一类文件的模块名。上面代码表示，运行测试之前，先用`babel-core/register`模块，处理一下`.js`文件。由于这里的转码器安装在项目内，所以要使用项目内安装的 Mocha；如果转码器安装在全局，就可以使用全局的 Mocha。

> 注意在 Babel 6.0 之前的写法是：--compilers js:babel/register，部分教程里面这么写然后会报错。如果你用的是 Babel 6.0 请注意修正。

考虑到避免每次都要重新输入这么一大串脚本，可以直接在 package.json 中添加 npm 脚本:

```
"mocha": "./node_modules/mocha/bin/mocha -t 10000 --compilers js:babel-core/register",
"mocha-all": "./node_modules/mocha/bin/mocha --compilers js:babel-core/register --recursive src/**/*.test.js"
```

运行时可以直接使用：

```
npm run mocha src/app/database.test.js
```

注意，因为这里 mocha 默认会从根目录进行扫描，所以即使你命令行已经 cd 到了测试文件所在目录下，也要在测试文件上加上全部的目录名。注意，Babel 默认不会对 Iterator、Generator、Promise、Map、Set 等全局对象，以及一些全局对象的方法(比如 Object.assign)转码。如果你想要对这些对象转码，就要安装 babel-polyfill。

```
$ npm install babel-polyfill --save
```

然后，在你的脚本头部加上一行。

```
import 'babel-polyfill'
```

#  使用 Chai 作为断言库

```js
var expect = require("chai").expect;

expect(4 + 5).to.be.equal(9);
expect(4 + 5).to.be.not.equal(10);
expect(foo).to.be.deep.equal({ bar: "baz" });

// 布尔值为true
expect("everthing").to.be.ok;
expect(false).to.not.be.ok;

// typeof
expect("test").to.be.a("string");
expect({ foo: "bar" }).to.be.an("object");
expect(foo).to.be.an.instanceof(Foo);

// include
expect([1, 2, 3]).to.include(2);
expect("foobar").to.contain("foo");
expect({ foo: "bar", hello: "universe" }).to.include.keys("foo");

// empty
expect([]).to.be.empty;
expect("").to.be.empty;
expect({}).to.be.empty;

// match
expect("foobar").to.match(/^foo/);
```

## Assert

The assert style is exposed through assert interface. This provides the classic assert-dot notation, similar to that packaged with node.js. This assert module, however, provides several additional tests and is browser compatible。

```js
var assert = require("chai").assert,
  foo = "bar",
  beverages = { tea: ["chai", "matcha", "oolong"] };
assert.typeOf(foo, "string"); // without optional message
assert.typeOf(foo, "string", "foo is a string"); // with optional message
assert.equal(foo, "bar", "foo equal `bar`");
assert.lengthOf(foo, 3, "foo`s value has a length of 3");
assert.lengthOf(beverages.tea, 3, "beverages has 3 types of tea");
```

## Expect
The BDD style is exposed through expect or should interfaces. In both scenarios, you chain together natural language assertions.

```js
var expect = require("chai").expect,
  foo = "bar",
  beverages = { tea: ["chai", "matcha", "oolong"] };
expect(foo).to.be.a("string");
expect(foo).to.equal("bar");
expect(foo).to.have.length(3);
expect(beverages).to.have.property("tea").with.length(3);
```

Expect also allows you to include arbitrary messages to prepend to any failed assertions that might occur.

```js
var answer = 43;

// AssertionError: expected 43 to equal 42.
expect(answer).to.equal(42);

// AssertionError: topic [answer]: expected 43 to equal 42.
expect(answer, "topic [answer]").to.equal(42);
```

## Should

The `should` style allows for the same chainable assertions as the `expect` interface, however it extends each object with a `should` property to start your chain. This style has some issues when used with Internet Explorer, so be aware of browser compatibility.

```js
var should = require("chai").should(), //actually call the function
  foo = "bar",
  beverages = { tea: ["chai", "matcha", "oolong"] };

foo.should.be.a("string");
foo.should.equal("bar");
foo.should.have.length(3);
beverages.should.have.property("tea").with.length(3);
```

#  异步代码与模拟对象

```js
/*global fetch*/
"use strict";

require("es6-promise").polyfill();
require("../fetch-npm-node");
var expect = require("chai").expect;
var nock = require("nock");
var good = "hello world. 你好世界。";
var bad = "good bye cruel world. 再见残酷的世界。";

function responseToText(response) {
  if (response.status >= 400) throw new Error("Bad server response");
  return response.text();
}

describe("fetch", function () {
  before(function () {
    nock("https://mattandre.ws").get("/succeed.txt").reply(200, good);
    nock("https://mattandre.ws").get("/fail.txt").reply(404, bad);
  });

  it("should be defined", function () {
    expect(fetch).to.be.a("function");
  });

  it("should facilitate the making of requests", function (done) {
    fetch("//mattandre.ws/succeed.txt")
      .then(responseToText)
      .then(function (data) {
        expect(data).to.equal(good);
        done();
      })
      .catch(done);
  });

  it("should do the right thing with bad requests", function (done) {
    fetch("//mattandre.ws/fail.txt")
      .then(responseToText)
      .catch(function (err) {
        expect(err.toString()).to.equal("Error: Bad server response");
        done();
      })
      .catch(done);
  });
});
```

在真实的测试环境中，我们往往需要对相同的测试流程输入不同的测试参数来验证其鲁棒性，也就是所谓的参数化测试(Parameterized Test)。参数化测试能够保证我们的函数可以处理不同类型的输入，特别是那些边界异常值的情况。传统的多参数测试用例可能如下，我们需要为每个参数编写单独而重复的测试流程：

```js
describe("测试表单校验", () => {
  it("用户名中不可以包含数字", () => {
    let valid = validateName("Adam5");
    expect(valid).to.be.false;
  });

  it("用户名中不可以包含 @", () => {
    let valid = validateName("Ad@am");
    expect(valid).to.be.false;
  });

  it("用户名中不可以包含 -", () => {
    let valid = validateName("Ad-am");
    expect(valid).to.be.false;
  });
});
```

这种编写测试用例的方式毫无疑问会增加代码的冗余度，并且将原本同目标的测试用例变得支离破碎。在 Mocha 中我们可以使用 `mocha-param` 库中提供的 `itParam` 方法，其允许将多个测试参数形成数组输入到测试用例中：

```js
const itParam = require("mocha-param").itParam;

describe("测试表单校验", () => {
  const data = ["Adam5", "Ad@am", "Ad-am"];
  itParam("拒绝非法输入", data, (name) => {
    let valid = validateName(name);
    expect(valid).to.be.false;
  });
});
```

#  在浏览器中运行测试用例

Mocha  的一大特性就是支持在浏览器中运行测试用例，我们首先需要构建一个简单的 HTML  页面作为测试驱动页。该页面会加载 Mocha  测试库与目标测试文件。我们只需要在浏览器中打开该页面即可运行测试。

```html
<!DOCTYPE html>
<html>
  <head>
    <title>Mocha Tests</title>
    <link rel="stylesheet" href="node_modules/mocha/mocha.css" />
  </head>
  <body>
    <div id="mocha"></div>
    <script src="node_modules/mocha/mocha.js"></script>
    <script src="node_modules/chai/chai.js"></script>
    <script>
      mocha.setup("bdd");
    </script>

    <!-- load code you want to test here -->

    <!-- load your test files here -->

    <script>
      mocha.run();
    </script>
  </body>
</html>
```

在上述 HTML  代码中我们加载了 Mocha  的 CSS  样式代码来优化测试结果的显示，创建了 ID  为`mocha`  的元素插入测试结果。然后利用脚本从`node_modules`  的子目录下加载 Mocha  与 Chai  的代码，通过调用`mocha.setup`  可以向全局插入 Mocha  的测试环境，然后加载我们的待测试代码与测试代码，最后调用`mocha.run`  运行所有测试。这里我们测试某个将 CSS  样式类添加到元素的函数，该函数位于 js/className.js  文件中：

```js
function addClass(el, newClass) {
  if (el.className.indexOf(newClass) === -1) {
    el.className += newClass;
  }
}
```

该函数的功能非常简单，就是为某个元素添加不重复的元素名，即测试要点在于如果当前元素的`className`  属性中尚不包含要添加的类名，则添加；否则不添加。我们的测试用例编写如下：

```js
describe("addClass", function () {
  it("should add class to element", function () {
    var element = { className: "" };

    addClass(element, "test-class");

    assert.equal(element.className, "test-class");
  });

  it("should not add a class which already exists");
});

it("should not add a class which already exists", function () {
  var element = { className: "exists" };

  addClass(element, "exists");

  var numClasses = element.className.split(" ").length;
  assert.equal(numClasses, 1);
});
```

在浏览器中运行测试代码，会得到 Mocha  的如下提示：

我们在上文中介绍的都是如何在 Node.js  中运行测试用例，如果我们希望将上述代码转化为在 Node.js  中可以运行的代码，需要将其转化为标准的 CommonJS  模块：

```js
// className.js

module.exports = {
  addClass: function (el, newClass) {
    // ...
  },
};

// classNameTest.js
var chai = require("chai");
var assert = chai.assert;

var className = require("../js/className.js");
var addClass = className.addClass;

// The rest of the file remains the same
describe("addClass", function () {
  // ...
});
```
