# Web 文件下载

前端的文件下载主要是通过 <a> ，再加上 download 属性,有了它们让我们的下载变得简单。download 此属性指示浏览器下载 URL 而不是导航到它，因此将提示用户将其保存为本地文件。如果属性有一个值，那么此值将在下载保存过程中作为预填充的文件名（如果用户需要，仍然可以更改文件名）。此属性对允许的值没有限制，但是 / 和 \ 会被转换为下划线。大多数文件系统限制了文件名中的标点符号，故此，浏览器将相应地调整建议的文件名。

# 服务端返回文件流

我们只需要直接将后端返回的文件流以新的窗口打开，即可直接下载了。

```js
// 前端代码
<button id="oBtnDownload">点击下载</button>
<script>
  oBtnDownload.onclick = function() {
    window.open(
      "http://localhost:8888/api/download?filename=1597375650384.jpg",
      "_blank"
    );
  };
</script>

// 后端代码
router.get("/api/download", async (ctx) => {
  const { filename } = ctx.query;
  const fStats = fs.statSync(path.join(__dirname, "./static/", filename));
  ctx.set({
    "Content-Type": "application/octet-stream",
    "Content-Disposition": `attachment; filename=${filename}`,
    "Content-Length": fStats.size,
  });
  ctx.body = fs.readFileSync(path.join(__dirname, "./static/", filename));
});
```

## 浏览器文件自动下载

能够让浏览器自动下载文件，主要有两种情况: Content-Disposition 与无法识别。

### Content-Disposition

在常规的 HTTP 应答中，Content-Disposition 响应头指示回复的内容该以何种形式展示，是以内联的形式（即网页或者页面的一部分），还是以附件的形式下载并保存到本地。再来看看它的语法：

```s
Content-Disposition: inline
Content-Disposition: attachment
Content-Disposition: attachment; filename="filename.jpg"
```

### 浏览器无法识别

例如输入 http://localhost:8888/static/demo.sh，浏览器无法识别该类型，就会自动下载。不知道小伙伴们有没有遇到过这样的一个情况，我们输入一个正确的静态 js 地址，没有配置 Content-Disposition，但是却会被意外的下载。这很可能是由于你的 `nginx` 少了这一行配置.

```text
include mime.types;
```

导致默认走了 `application/octet-stream`，浏览器无法识别就下载了文件。

## 后端返回静态站点地址

通过静态站点下载，这里要分为两种情况，一种为可能该服务自带静态目录，即为同源情况，第二种情况为适用了第三方静态存储平台，例如阿里云、腾讯云之类的进行托管，即非同源（当然也有些平台直接会返回）。

### 同源

同源情况下是非常简单，先上代码，直接调用一下函数就能轻松实现下载。

```js
import { downloadDirect } from "../js/utils.js";
axios.get("http://localhost:8888/api/downloadUrl").then((res) => {
  if (res.data.code === 0) {
    downloadDirect(res.data.data.url);
  }
});
```

### 非同源

我们也可以从 MDN 上看到，虽然 download 限制了非同源的情况，但是可以使用 blob: URL (opens new window)和 data: URL (opens new window)，因此我们只要将文件内容进行下载转化成 blob 就可以了。整个过程如下：

![文件下载](https://ngte-superbed.oss-cn-beijing.aliyuncs.com/item/20221225154923.png)

```js
<button id="oBtnDownload">点击下载</button>
<script type="module">
  import { downloadByBlob } from "../js/utils.js";
  function download(url) {
    axios({
      method: "get",
      url,
      responseType: "blob",
    }).then((res) => {
      downloadByBlob(res.data, url.split("/").pop());
    });
  }
  oBtnDownload.onclick = function() {
    axios.get("http://localhost:8888/api/downloadUrl").then((res) => {
      if (res.data.code === 0) {
        download(res.data.data.url);
      }
    });
  };
</script>
```

## 后端返回字符串（base64）

```js
// node 端
router.get("/api/base64", async (ctx) => {
  const { filename } = ctx.query;
  const content = fs.readFileSync(path.join(__dirname, "./static/", filename));
  const fStats = fs.statSync(path.join(__dirname, "./static/", filename));
  console.log(fStats);
  ctx.body = {
    code: 0,
    data: {
      base64: content.toString("base64"),
      filename,
      type: mime.getType(filename),
    },
  };
});
```

```html
// 前端
<button id="oBtnDownload">点击下载</button>
<script type="module">
  function base64ToBlob(base64, type) {
    const byteCharacters = atob(base64);
    const byteNumbers = new Array(byteCharacters.length);
    for (let i = 0; i < byteCharacters.length; i++) {
      byteNumbers[i] = byteCharacters.charCodeAt(i);
    }
    const buffer = Uint8Array.from(byteNumbers);
    const blob = new Blob([buffer], { type });
    return blob;
  }

  function download({ base64, filename, type }) {
    const blob = base64ToBlob(blob, type);
    downloadByBlob(blob, filename);
  }

  oBtnDownload.onclick = function () {
    axios
      .get("http://localhost:8888/api/base64?filename=1597375650384.jpg")
      .then((res) => {
        if (res.data.code === 0) {
          download(res.data.data);
        }
      });
  };
</script>
```

思路其实还是利用了我们上面说的 <a> 标签。但是在这个步骤前，多了一个步骤就是，需要将我们的 base64 字符串转化为二进制流，这个东西，在我的前一篇文件上传中也常常提到，毕竟文件就是以二进制流的形式存在。不过也很简单，js 拥有内置函数 atob。极大地提高了我们转换的效率。
