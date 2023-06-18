# Range 并发下载

在《[Network-Notes](https://github.com/wx-chevalier/Network-Notes?q=)》中我们讨论了 Range 的定义，这里我们讨论下在前端的实践。多线程的话，会比较麻烦一些，需要按片去下载，下载好后，需要进行合并再进行下载。服务端需要在 Node 中进行兼容处理：

```js
router.get("/api/rangeFile", async (ctx) => {
  const { filename } = ctx.query;
  const { size } = fs.statSync(path.join(__dirname, "./static/", filename));
  const range = ctx.headers["range"];
  if (!range) {
    ctx.set("Accept-Ranges", "bytes");
    ctx.body = fs.readFileSync(path.join(__dirname, "./static/", filename));
    return;
  }
  const { start, end } = getRange(range);
  if (start >= size || end >= size) {
    ctx.response.status = 416;
    ctx.body = "";
    return;
  }
  ctx.response.status = 206;
  ctx.set("Accept-Ranges", "bytes");
  ctx.set("Content-Range", `bytes ${start}-${end ? end : size - 1}/${size}`);
  ctx.body = fs.createReadStream(path.join(__dirname, "./static/", filename), {
    start,
    end,
  });
});
```

如果是单线程下载代码，直接去请求以 blob 方式获取，然后用 blobURL 的方式下载：

```js
download1.onclick = () => {
  console.time("直接下载");
  function download(url) {
    const req = new XMLHttpRequest();
    req.open("GET", url, true);
    req.responseType = "blob";
    req.onload = function (oEvent) {
      const content = req.response;
      const aTag = document.createElement("a");
      aTag.download = "360_0388.jpg";
      const blob = new Blob([content]);
      const blobUrl = URL.createObjectURL(blob);
      aTag.href = blobUrl;
      aTag.click();
      URL.revokeObjectURL(blob);
      console.timeEnd("直接下载");
    };
    req.send();
  }
  download(url);
};
```

如果是多线程部分，首先发送一个 head 请求，来获取文件的大小，然后根据 length 以及设置的分片大小，来计算每个分片是滑动距离。通过 Promise.all 的回调中，用 concatenate 函数对分片 buffer 进行一个合并成一个 blob，然后用 blobURL 的方式下载。

```js
// script
function downloadRange(url, start, end, i) {
  return new Promise((resolve, reject) => {
    const req = new XMLHttpRequest();
    req.open("GET", url, true);
    req.setRequestHeader("range", `bytes=${start}-${end}`);
    req.responseType = "blob";
    req.onload = function (oEvent) {
      req.response.arrayBuffer().then((res) => {
        resolve({
          i,
          buffer: res,
        });
      });
    };
    req.send();
  });
}
// 合并buffer
function concatenate(resultConstructor, arrays) {
  let totalLength = 0;
  for (let arr of arrays) {
    totalLength += arr.length;
  }
  let result = new resultConstructor(totalLength);
  let offset = 0;
  for (let arr of arrays) {
    result.set(arr, offset);
    offset += arr.length;
  }
  return result;
}
download2.onclick = () => {
  axios({
    url,
    method: "head",
  }).then((res) => {
    // 获取长度来进行分割块
    console.time("并发下载");
    const size = Number(res.headers["content-length"]);
    const length = parseInt(size / m);
    const arr = [];
    for (let i = 0; i < length; i++) {
      let start = i * m;
      let end = i == length - 1 ? size - 1 : (i + 1) * m - 1;
      arr.push(downloadRange(url, start, end, i));
    }
    Promise.all(arr).then((res) => {
      const arrBufferList = res
        .sort((item) => item.i - item.i)
        .map((item) => new Uint8Array(item.buffer));
      const allBuffer = concatenate(Uint8Array, arrBufferList);
      const blob = new Blob([allBuffer], { type: "image/jpeg" });
      const blobUrl = URL.createObjectURL(blob);
      const aTag = document.createElement("a");
      aTag.download = "360_0388.jpg";
      aTag.href = blobUrl;
      aTag.click();
      URL.revokeObjectURL(blob);
      console.timeEnd("并发下载");
    });
  });
};
```
