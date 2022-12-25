# Blob

Blob（Binary Large Object）表示二进制类型的大对象。在数据库管理系统中，将二进制数据存储为一个单一个体的集合。Blob 通常是影像、声音或多媒体文件。在 JavaScript 中 Blob 类型的对象表示不可变的类似文件对象的原始数据。 为了更直观的感受 Blob 对象，我们先来使用 Blob 构造函数，创建一个 myBlob 对象，具体如下图所示：

![Blob 对象示意](https://ngte-superbed.oss-cn-beijing.aliyuncs.com/item/20221225161317.png)

如你所见，myBlob 对象含有两个属性：size 和 type。其中 size 属性用于表示数据的大小（以字节为单位），type 是 MIME 类型的字符串。Blob 表示的不一定是 JavaScript 原生格式的数据。比如 File 接口基于 Blob，继承了 blob 的功能并将其扩展使其支持用户系统上的文件。

# Blob API 简介

Blob 由一个可选的字符串 type（通常是 MIME 类型）和 blobParts 组成：

![Blob 结构](https://ngte-superbed.oss-cn-beijing.aliyuncs.com/item/20221225161426.png)

MIME（Multipurpose Internet Mail Extensions）多用途互联网邮件扩展类型，是设定某种扩展名的文件用一种应用程序来打开的方式类型，当该扩展名文件被访问的时候，浏览器会自动使用指定应用程序来打开。多用于指定一些客户端自定义的文件名，以及一些媒体文件打开方式。常见的 MIME 类型有：超文本标记语言文本 .html text/html、PNG 图像 .png image/png、普通文本 .txt text/plain 等。

## 构造函数

Blob 构造函数的语法为：

```js
var aBlob = new Blob(blobParts, options);
```

相关的参数说明如下：

- blobParts：它是一个由 ArrayBuffer，ArrayBufferView，Blob，DOMString 等对象构成的数组。DOMStrings 会被编码为 UTF-8。
- options：一个可选的对象，包含以下两个属性：

  - type —— 默认值为 `""`，它代表了将会被放入到 blob 中的数组内容的 MIME 类型。
  - endings —— 默认值为 `"transparent"`，用于指定包含行结束符 `\n` 的字符串如何被写入。它是以下两个值中的一个：`"native"`，代表行结束符会被更改为适合宿主操作系统文件系统的换行符，或者 `"transparent"`，代表会保持 blob 中保存的结束符不变。

- **示例一：从字符串创建 Blob**

```js
let myBlobParts = ["<html><h2>Hello Semlinker</h2></html>"]; // an array consisting of a single DOMString
let myBlob = new Blob(myBlobParts, {
  type: "text/html",
  endings: "transparent",
}); // the blob

console.log(myBlob.size + " bytes size");
// Output: 37 bytes size
console.log(myBlob.type + " is the type");
// Output: text/html is the type
```

- **示例二：从类型化数组和字符串创建 Blob**

```js
let hello = new Uint8Array([72, 101, 108, 108, 111]); // 二进制格式的 "hello"
let blob = new Blob([hello, " ", "semlinker"], { type: "text/plain" });
```

## Blob 类的属性和方法

![Blob 属性与方法](https://ngte-superbed.oss-cn-beijing.aliyuncs.com/item/20221225161637.png)

前面我们已经知道 Blob 对象包含两个属性：

- size（只读）：表示 `Blob` 对象中所包含数据的大小（以字节为单位）。
- type（只读）：一个字符串，表明该 `Blob` 对象所包含数据的 MIME 类型。如果类型未知，则该值为空字符串。

方法包含：

- slice([start[, end[, contentType]]])：返回一个新的 Blob 对象，包含了源 Blob 对象中指定范围内的数据。
- stream()：返回一个能读取 blob 内容的 `ReadableStream`。
- text()：返回一个 Promise 对象且包含 blob 所有内容的 UTF-8 格式的 `USVString`。
- arrayBuffer()：返回一个 Promise 对象且包含 blob 所有内容的二进制格式的 `ArrayBuffer`。

这里我们需要注意的是，**`Blob` 对象是不可改变的**。我们不能直接在一个 Blob 中更改数据，但是我们可以对一个 Blob 进行分割，从其中创建新的 Blob 对象，将它们混合到一个新的 Blob 中。这种行为类似于 JavaScript 字符串：我们无法更改字符串中的字符，但可以创建新的更正后的字符串。

# Blob 使用场景

## 分片上传

File 对象是特殊类型的 Blob，且可以用在任意的 Blob 类型的上下文中。所以针对大文件传输的场景，我们可以使用 slice 方法对大文件进行切割，然后分片进行上传，具体示例如下：

```js
const file = new File(["a".repeat(1000000)], "test.txt");

const chunkSize = 40000;
const url = "https://httpbin.org/post";

async function chunkedUpload() {
  for (let start = 0; start < file.size; start += chunkSize) {
    const chunk = file.slice(start, start + chunkSize + 1);
    const fd = new FormData();
    fd.append("data", chunk);

    await fetch(url, { method: "post", body: fd }).then((res) => res.text());
  }
}
```

## 从互联网下载数据

# Links

- https://mp.weixin.qq.com/s/MPTTMUXLRK0boeMDYzmaLA
