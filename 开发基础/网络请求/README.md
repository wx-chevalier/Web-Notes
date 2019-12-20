# DOM 网络请求

Ajax 的官方定义为 Asynchronous JavaScript and XML，即是依赖于现有的 XML/CSS/HTML/JavaScript 来提供可交互性更好的网页应用的技术方案。Ajax 并不是新的技术规范，其中最核心的依赖可以认为就是 XMLHTTPRequest 对象，这个对象使得浏览器可以发出 HTTP 请求与接收 HTTP 响应。

# 路径与参数

```js
function getParameterByName(name, url) {
  if (!url) url = window.location.href;
  name = name.replace(/[\[\]]/g, '\\$&');
  var regex = new RegExp('[?&]' + name + '(=([^&#]*)|&|#|$)'),
    results = regex.exec(url);
  if (!results) return null;
  if (!results[2]) return '';
  return decodeURIComponent(results[2].replace(/\+/g, ' '));
}

// 使用方式如下
// query string: ?foo=lorem&bar=&baz
var foo = getParameterByName('foo'); // "lorem"
var bar = getParameterByName('bar'); // "" (present with empty value)
var baz = getParameterByName('baz'); // "" (present with no value)
var qux = getParameterByName('qux'); // null (absent)
```
