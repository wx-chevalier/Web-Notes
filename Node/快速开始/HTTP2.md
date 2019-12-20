# HTTP/2

In HTTP/1 the client sends a request to the server, which replies with the requested content, usually with an HTML file that contains links to many assets (.js, .css, etc. files). As the browser processes this initial HTML file, it starts to resolve these links and makes separate requests to fetch them. The problem with the current approach is that the user has to wait while the browser parses responses, discovers links and fetches assets. This delays rendering and increases load times. There are workarounds like inlining some assets, but it also makes the initial response bigger and slower.

![](https://blog-assets.risingstack.com/2017/08/http_1-in-nodejs.png)

This is where HTTP/2 Server Push capabilities come into the picture as the server can send assets to the browser before it has even asked for them.

![](https://blog-assets.risingstack.com/2017/08/http2-in-nodejs.png)

```js
const http2 = require('http2');

const server = http2.createSecureServer(
  { cert, key },

  onRequest
);

function push(stream, filePath) {
  const { file, headers } = getFile(filePath);

  const pushHeaders = { [HTTP2_HEADER_PATH]: filePath };

  stream.pushStream(pushHeaders, pushStream => {
    pushStream.respondWithFD(file, headers);
  });
}

function onRequest(req, res) {
  // Push files with index.html

  if (reqPath === '/index.html') {
    push(res.stream, 'bundle1.js');

    push(res.stream, 'bundle2.js');
  } // Serve file

  res.stream.respondWithFD(file.fileDescriptor, file.headers);
}
```

```html
<html>
<body>
  <h1>HTTP2 Push!</h1>
</body>
  <script src="bundle1.js"/></script>
  <script src="bundle2.js"/></script>
</html>
```

[http2-push-example](https://github.com/RisingStack/http2-push-example)
