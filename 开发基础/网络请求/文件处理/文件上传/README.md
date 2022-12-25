# 文件上传

文件上传在 Web 开发中应用很广泛，我们经常发微博、发微信朋友圈都用到了图片上传功能。文件上传是指将本地图片、视频、音频等文件上传到服务器上，可以供其他用户浏览或下载的过程。上传文件时必须做好文件的安全性，除了前端必要的验证，如文件类型、后缀、大小等验证，重要的还是要在后台做安全策略。

这里我列举几个注意点：

- 后台需要进行文件类型、大小、来源等验证
- 定义一个.htaccess 文件，只允许访问指定扩展名的文件。
- 将上传后的文件生成一个随机的文件名，并且加上此前生成的文件扩展名。
- 设置上传目录执行权限，避免不怀好意的人绕过如图片扩展名进行恶意攻击，拒绝脚本执行的可能性。

```js
const input = document.querySelector('input[type="file"]');

const data = new FormData();
data.append("file", input.files[0]);
data.append("user", "hubot");

fetch("/avatars", {
  method: "post",
  body: data,
});
```

# 请求端

## 浏览端

### File

首先我们先写下最简单的一个表单提交方式。

```html
<form action="http://localhost:7787/files" method="POST">
  <input name="file" type="file" id="file" />
  <input type="submit" value="提交" />
</form>
```

这个表单是无法实际进行传输的，其实 FormData 中 file 字段显示的是文件名，并没有将真正的内容进行传输。再看请求头：

![请求头](https://ngte-superbed.oss-cn-beijing.aliyuncs.com/item/20221225160756.png)

发现是请求头和预期不符，也印证了 application/x-www-form-urlencoded 无法进行文件上传。我们加上请求头，再次请求。

```html
<form
  action="http://localhost:7787/files"
  enctype="multipart/form-data"
  method="POST"
>
  <input name="file" type="file" id="file" />
  <input type="submit" value="提交" />
</form>
```

### FormData

```js
<input type="file" id="file" />
<button id="submit">上传</button>
<script src="https://cdn.bootcss.com/axios/0.19.2/axios.min.js"></script>
<script>
  submit.onclick = () => {
    const file = document.getElementById("file").files[0];
    var form = new FormData();
    form.append("file", file);

    // type 1
    axios.post("http://localhost:7787/files", form).then((res) => {
      console.log(res.data);
    });
    // type 2
    fetch("http://localhost:7787/files", {
      method: "POST",
      body: form,
    })
      .then((res) => res.json())
      .tehn((res) => {
        console.log(res);
      });
    // type3
    var xhr = new XMLHttpRequest();
    xhr.open("POST", "http://localhost:7787/files", true);
    xhr.onload = function() {
      console.log(xhr.responseText);
    };
    xhr.send(form);
  };
</script>
```

![文件上传请求体](https://ngte-superbed.oss-cn-beijing.aliyuncs.com/item/20221225161107.png)

### Blob

Blob 对象表示一个不可变、原始数据的类文件对象。Blob 表示的不一定是 JavaScript 原生格式的数据。File (opens new window)接口基于 Blob，继承了 blob 的功能并将其扩展使其支持用户系统上的文件。因此如果我们遇到 Blob 方式的文件上方式不用害怕，可以用以下两种方式:

- 直接使用 blob 上传

```js
const json = { hello: "world" };
const blob = new Blob([JSON.stringify(json, null, 2)], {
  type: "application/json",
});

const form = new FormData();
form.append("file", blob, "1.json");
axios.post("http://localhost:7787/files", form);
```

# Links

- https://segmentfault.com/a/1190000022624799?utm_source=tuicool&utm_medium=referral
