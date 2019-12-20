[![](https://i.postimg.cc/WzXsh0MX/image.png)](https://github.com/wx-chevalier/Backend-Series)

# 简单 HTTP 服务器

# createServer

```js
const http = require('http');
const url = require('url');
const path = require('path');
const fs = require('fs');
const port = process.argv[2] || 8033;

const server = http
  .createServer(function(request, response) {
    const uri = url.parse(request.url).pathname;
    let filename = path.join(process.cwd(), uri);

    fs.exists(filename, function(exists) {
      if (!exists) {
        response.writeHead(404, { 'Content-Type': 'text/plain' });
        console.log('node.js: 404 Not Found');
        response.write('404 Not Found\n');
        response.end();
        return;
      }

      if (fs.statSync(filename).isDirectory()) filename += '/index.html';

      fs.readFile(filename, 'binary', function(err, file) {
        if (err) {
          response.writeHead(500, { 'Content-Type': 'text/plain' });
          response.write(err + '\n');
          response.end();
          return;
        }

        response.writeHead(200);
        response.write(file, 'binary');
        response.end();
      });
    });
  })
  .listen(parseInt(port, 10));

console.log(
  'Static file server running at\n  => http://localhost:' + port + '/'
);
```

# 在 Chrome 中调试 NodeJS 应用

NodeJS 在 6.3.0 版本之后允许使用 Chrome 来调试 NodeJS 应用，从而方便了开发者进行断点调试与单步运行，以及对堆栈信息进行查看。安装好 node 之后我们可以使用`--inspect`选项来运行应用：

```
node --inspect index.js
```

我们也可以选择直接从第一行代码开始进行断点调试：

```
node --inspect --debug-brk index.js
```

运行上述命令之后，控制台中会返回该应用对应的 Chrome 开发工具链接，譬如：

```
chrome-devtools://devtools/bundled/inspector.html?experiments=true&v8only=true&ws=127.0.0.1:9229/69beb5d3-2b1c-4513-aa4b-78d1eb1865ea
```

在 Chrome 中直接打开该链接，即可开始调试: ![](https://coding.net/u/hoteam/p/Cache/git/raw/master/2017/1/3/QQ20170125-0123.png)
