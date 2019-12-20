![](https://i.postimg.cc/BQVn85Yv/image.png)

# CORS: 跨域资源共享

跨域资源共享，Cross-Origin Resource Sharing 是由 W3C 提出的一个用于浏览器以 XMLHttpRequest 方式向其他源的服务器发起请求的规范。不同于 JSONP，CORS 是以 Ajax 方式进行跨域请求，需要服务端与客户端的同时支持。目前 CORS 在绝大部分现代浏览器中都是支持的:

CORS 标准定义了一个规范的 HTTP Headers 来使得浏览器与服务端之间可以进行协商来确定某个资源是否可以由其他域的客户端请求获得。尽管很多的验证与鉴权是由服务端完成，但是本质上大部分的检查和限制还是应该由浏览器完成。一般来说 CORS 会分为 Simple Request，简单请求与 Preflight，需要预检的请求两大类。其基本的流程如下:

![](https://parg.co/UiV)

# 预检请求

当浏览器的请求方式是 HEAD、GET 或者 POST，并且 HTTP 的头信息中不会超出以下字段:

- Accept
- Accept-Language
- Content-Language
- Last-Event-ID
- Content-Type：只限于三个值 application/x-www-form-urlencoded、multipart/form-data、text/plain

浏览器会将该请求定义为简单请求，否则就是预检请求。预检请求会在正式通信之前，增加一次 HTTP 查询请求。浏览器先询问服务器，当前网页所在的域名是否在服务器的许可名单之中，以及可以使用哪些 HTTP 动词和头信息字段。只有得到肯定答复，浏览器才会发出正式的 XMLHttpRequest 请求，否则就报错。“预检”请求用的请求方法是 OPTIONS，表示这个请求是用来询问的。头信息里面，关键字段是 Origin，表示请求来自哪个源。预检请求的发送请求：

```yaml
OPTIONS /cors HTTP/1.1
Origin: http://api.qiutc.me
Access-Control-Request-Method: PUT
Access-Control-Request-Headers: X-Custom-Header
Host: api.qiutc.com
Accept-Language: en-US
Connection: keep-alive
User-Agent: Mozilla/5.0...
```

除了 Origin 字段，”预检”请求包括以下特殊字段:

- Access-Control-Request-Method: 该字段是必须的，用来列出浏览器的 CORS 请求会用到哪些 HTTP 方法，上例是 PUT。

- Access-Control-Request-Headers: 该字段是一个逗号分隔的字符串，指定浏览器 CORS 请求会额外发送的头信息字段，上例是 X-Custom-Header。

预检请求的返回：

```yaml
HTTP/1.1 200 OK
Date: Mon, 01 Dec 2008 01:15:39 GMT
Server: Apache/2.0.61 (Unix)
Access-Control-Allow-Origin: http://api.qiutc.me
Access-Control-Allow-Methods: GET, POST, PUT
Access-Control-Allow-Headers: X-Custom-Header
Content-Type: text/html; charset=utf-8
Content-Encoding: gzip
Content-Length: 0
Keep-Alive: timeout=2, max=100
Connection: Keep-Alive
Content-Type: text/plain
```

上述响应还包含以下特殊字段：

- Access-Control-Allow-Methods: 必需，它的值是逗号分隔的一个字符串，表明服务器支持的所有跨域请求的方法。注意，返回的是所有支持的方法，而不单是浏览器请求的那个方法。这是为了避免多次”预检”请求。

- Access-Control-Allow-Headers: 如果浏览器请求包括 Access-Control-Request-Headers 字段，则 Access-Control-Allow-Headers 字段是必需的。它也是一个逗号分隔的字符串，表明服务器支持的所有头信息字段，不限于浏览器在”预检”中请求的字段。

- Access-Control-Max-Age: 该字段可选，用来指定本次预检请求的有效期，单位为秒。上面结果中，有效期是 20 天(1728000 秒)，即允许缓存该条回应 1728000 秒(即 20 天)，在此期间，不用发出另一条预检请求。

一旦服务器通过了”预检”请求，以后每次浏览器正常的 CORS 请求，就都跟简单请求一样，会有一个 Origin 头信息字段。服务器的回应，也都会有一个 Access-Control-Allow-Origin 头信息字段。

# 简单请求

对于简单的跨域请求或者通过了预检的请求，浏览器会自动在请求的头信息加上 `Origin` 字段，表示本次请求来自哪个源(协议 + 域名 + 端口)，服务端会获取到这个值，然后判断是否同意这次请求并返回。典型的请求头:

```yaml
// 请求
GET /cors HTTP/1.1
Origin: http://api.qiutc.me
Host: api.alice.com
Accept-Language: en-US
Connection: keep-alive
User-Agent: Mozilla/5.0...
```

如果服务端允许，在返回的头信息中会多出几个字段:

```yaml
// 返回
Access-Control-Allow-Origin: http://api.qiutc.me
Access-Control-Allow-Credentials: true
Access-Control-Expose-Headers: Info
Content-Type: text/html; charset=utf-8
```

- Access-Control-Allow-Origin: 必须。它的值是请求时 Origin 字段的值或者 `*`，表示接受任意域名的请求。

- Access-Control-Allow-Credentials: 可选。它的值是一个布尔值，表示是否允许发送 Cookie。默认情况下，Cookie 不包括在 CORS 请求之中。设为 true，即表示服务器明确许可，Cookie 可以包含在请求中，一起发给服务器。

- Access-Control-Expose-Headers: 可选，用于指明 `getResponseHeader()` 方法可以读取的字段。

在需要发送 cookie 的时候还需要注意要在 AJAX 请求中打开 withCredentials 属性：

```js
var xhr = new XMLHttpRequest();
xhr.withCredentials = true;
```

如果要发送 Cookie，Access-Control-Allow-Origin 就不能设为`*`，必须指定明确的、与请求网页一致的域名。同时，Cookie 依然遵循同源政策，只有用服务器域名设置的 Cookie 才会上传，其他域名的 Cookie 并不会上传，且原网页代码中的 `document.cookie` 也无法读取服务器域名下的 Cookie。如果服务端拒绝了调用，即不会带上 `Access-Control-Allow-Origin` 字段，浏览器发现这个跨域请求的返回头信息没有该字段，就会抛出一个错误，会被 `XMLHttpRequest` 的 `onerror` 回调捕获到。这种错误无法通过 HTTP 状态码判断，因为回应的状态码有可能是 200。

CORS 请求时，XMLHttpRequest 对象的 `getResponseHeader()` 方法只能拿到 6 个基本字段：Cache-Control、Content-Language、Content-Type、Expires、Last-Modified、Pragma。如果想拿到其他字段，就必须在 Access-Control-Expose-Headers 里面指定。上面的例子指定，`getResponseHeader('Info')` 可以返回 Info 字段的值。
