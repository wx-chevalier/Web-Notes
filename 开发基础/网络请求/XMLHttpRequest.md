[![返回目录](https://i.postimg.cc/50XLzC7C/image.png)](https://github.com/wx-chevalier/Web-Series)

# XMLHttpRequest

XMLHTTPRequest 由微软提出，经过 W3C 标准化定义，于 2008 年提出了 [XMLHttpRequest Level 2](http://dev.w3.org/2006/webapi/XMLHttpRequest-2/) 草案。该版本开始支持跨域请求，支持发送和接收二进制对象、formData 对象、进度判断、请求超时与放弃等特性。

# 基础使用

XMLHttpRequest 对象的 HTTP 和 HTTPS 请求必须通过 open 方法初始化。这个方法必须在实际发送请求之前调用，以用来验证请求方法，URL 以及用户信息。这个方法不能确保 URL 存在或者用户信息必须正确。初始化请求可以接受 5 个参数：

```js
open(
     method, // 请求的方式，如 GET/POST/HEADER 等，这个参数不区分大小写
     url // 请求的地址，可以是相对地址或者绝对地址
     [, async = true // 默认值为true，即为异步请求，若async=false，则为同步请求
     [, username = null // Basic 认证的用户名密码
     [, password = null]]]
);
```

值得一提的是，第三个参数 async 用于标识是否为异步请求，如果为同步请求的话则会默认阻塞直至消息返回；并且其还有如下限制：xhr.timeout 必须为 0，xhr.withCredentials 必须为 false，xhr.responseType 必须为""。在现代 Web 应用开发中我们应该避免以同步方式发起请求，以防止页面阻塞而出现停滞。

```js
const xhr = new XMLHttpRequest();
xhr.timeout = 3000;
xhr.ontimeout = function(event) {
  alert('请求超时！');
};
const formData = new FormData();
formData.append('tel', '18217767969');
formData.append('psw', '111111');
xhr.open('POST', 'http://www.test.com:8000/login');
xhr.send(formData);

// 如果是同步请求，则不需要监听事件
xhr.onreadystatechange = function() {
  if (xhr.readyState == 4 && xhr.status == 200) {
    alert(xhr.responseText);
  } else {
    alert(xhr.statusText);
  }
};
```

对于部分老版本浏览器，我们还需要考虑兼容性问题，即判断是否存在 XMLHTTPRequest 对象：

```js
// Just getting XHR is a mess!
if (window.XMLHttpRequest) {
  // Mozilla, Safari, ...
  request = new XMLHttpRequest();
} else if (window.ActiveXObject) {
  // IE
  try {
    request = new ActiveXObject('Msxml2.XMLHTTP');
  } catch (e) {
    try {
      request = new ActiveXObject('Microsoft.XMLHTTP');
    } catch (e) {}
  }
}

// Open, send.
request.open('GET', 'https://davidwalsh.name/ajax-endpoint', true);
request.send(null);
```

下表列举了 XMLHTTPRequest 的关键属性，我们也会在接下来的章节中针对不同的业务场景对属性进行深入解读。

| 属性                 | 类型                         | 描述                                                                                                                                                                                                                                                                                                                                                                                                                                                                    |
| -------------------- | ---------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `onreadystatechange` | `Function?`                  | 一个 JavaScript 函数对象，当 readyState 属性改变时会调用它。回调函数会在 user interface 线程中调用。**警告:** 不能在本地代码中使用. 也不应该在同步模式的请求中使用.                                                                                                                                                                                                                                                                                                     |
| `readyState`         | `unsigned short`             | 请求的五种状态值状态描述` 0``UNSENT `(未打开)`open()`方法还未被调用.` 1``OPENED ` (未发送)`send()`方法还未被调用.` 2``HEADERS_RECEIVED (已获取响应头)``send() `方法已经被调用, 响应头和响应状态已经返回.` 3``LOADING (正在下载响应体) `响应体下载中;`responseText`中已经获取了部分数据.` 4``DONE (请求完成) `整个请求过程已经完毕.                                                                                                                                      |
| `response`           | consties                     | 响应实体的类型由 `responseType 来指定，` 可以是 `ArrayBuffer，` `Blob，` [`Document`](https://developer.mozilla.org/zh-CN/docs/Web/API/Document)， JavaScript 对象 (即 "json")， 或者是字符串。如果请求未完成或失败，则该值为 `null。`                                                                                                                                                                                                                                  |
| `responseText`       | `DOMString`                  | 此次请求的响应为文本，或是当请求未成功或还未发送时为 `null。`**只读。**                                                                                                                                                                                                                                                                                                                                                                                                 |
| `responseType`       | `XMLHttpRequestResponseType` | 设置该值能够改变响应类型。就是告诉服务器你期望的响应格式。ValueData type of `response`property`""` (空字符串)字符串(默认值)`"arraybuffer"`[`ArrayBuffer`](https://developer.mozilla.org/zh-cn/JavaScript_typed_arrays/ArrayBuffer)`"blob"`[`Blob`](https://developer.mozilla.org/zh-CN/docs/Web/API/Blob)`"document"`[`Document`](https://developer.mozilla.org/zh-CN/docs/Web/API/Document)`"json"`JavaScript 对象，解析自服务器传递回来的 JSON 字符串。`"text"`字符串 |
| `responseXML`        | `Document?`                  | 本次请求的响应是一个 `Document` 对象，如果是以下情况则值为 `null：`请求未成功，请求未发送，或响应无法被解析成 XML 或 HTML。当响应为 text/xml 流时会被解析。当 `responseType` 设置为"document"，并且请求为异步的，则响应会被当做 `text/html` 流来解析。**只读\*\***.\***\*注意:** 如果服务器不支持 `text/xml` Content-Type 头，你可以使用 ` overrideMimeType() 强制 ``XMLHttpRequest ` 将响应解析为 XML。                                                               |
| `status`             | `unsigned short`             | 该请求的响应状态码 (例如, `状态码`200 表示一个成功的请求).**只读.**                                                                                                                                                                                                                                                                                                                                                                                                     |
| `statusText`         | `DOMString`                  | 该请求的响应状态信息,包含一个状态码和原因短语 (例如 "`200 OK`"). **只读\*\***.\*\*                                                                                                                                                                                                                                                                                                                                                                                      |
| `upload`             | `XMLHttpRequestUpload`       | 可以在 `upload 上添加一个事件监听来跟踪上传过程。`                                                                                                                                                                                                                                                                                                                                                                                                                      |
| `withCredentials`    | `boolean`                    | 表明在进行跨站(cross-site)的访问控制(Access-Control)请求时，是否使用认证信息(例如 cookie 或授权的 header)。默认为 `false。`**注意:** 这不会影响同站(same-site)请求.                                                                                                                                                                                                                                                                                                    |
