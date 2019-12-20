# Axios

Axios 是著名的兼容浏览器与 Node 环境的 HTTP 请求库。

```ts
const axios = require('axios');

// Make a request for a user with a given ID
axios
  .get('/user?ID=12345')
  .then(function(response) {
    // handle success
    console.log(response);
  })
  .catch(function(error) {
    // handle error
    console.log(error);
  })
  .finally(function() {
    // always executed
  });

// Optionally the request above could also be done as
axios
  .get('/user', {
    params: {
      ID: 12345
    }
  })
  .then(function(response) {
    console.log(response);
  })
  .catch(function(error) {
    console.log(error);
  })
  .finally(function() {
    // always executed
  });

// Want to use async/await? Add the `async` keyword to your outer function/method.
async function getUser() {
  try {
    const response = await axios.get('/user?ID=12345');
    console.log(response);
  } catch (error) {
    console.error(error);
  }
}
```

# 请求配置

# 请求控制

## 请求中断

```js
const CancelToken = axios.CancelToken;
const source = CancelToken.source();

axios
  .get('/user/12345', {
    cancelToken: source.token
  })
  .catch(function(thrown) {
    if (axios.isCancel(thrown)) {
      console.log('Request canceled', thrown.message);
    } else {
      // handle error
    }
  });

axios.post(
  '/user/12345',
  {
    name: 'new name'
  },
  {
    cancelToken: source.token
  }
);

// cancel the request (the message parameter is optional)
source.cancel('Operation canceled by the user.');
```

# 文件操作

## 自定义上传

借鉴 [rc-upload](https://github.com/react-component/upload) 中对于自定义上传的定义，我们可以通过 axios 来自行上传数据：

```js
customRequest({
    action,
    data,
    file,
    filename,
    headers,
    onError,
    onProgress,
    onSuccess,
    withCredentials,
  }) {
    // EXAMPLE: post form-data with 'axios'
    const formData = new FormData();
    if (data) {
      Object.keys(data).map(key => {
        formData.append(key, data[key]);
      });
    }
    formData.append(filename, file);

    axios
      .post(action, formData, {
        withCredentials,
        headers,
        onUploadProgress: ({ total, loaded }) => {
          onProgress({ percent: Math.round(loaded / total * 100).toFixed(2) }, file);
        },
      })
      .then(({ data: response }) => {
        onSuccess(response, file);
      })
      .catch(onError);

    return {
      abort() {
        console.log('upload progress is aborted.');
      },
    };
  },
};
```

## 文件下载

```ts
axios({
  url: 'http://api.dev/file-download', //your url
  method: 'GET',
  responseType: 'blob' // important
}).then(response => {
  const url = window.URL.createObjectURL(new Blob([response.data]));
  const link = document.createElement('a');
  link.href = url;
  link.setAttribute('download', 'file.pdf'); //or any other extension
  document.body.appendChild(link);
  link.click();
});
```

或者使用 FileSaver，还能够重命名：

```js
// Fetch the dynamically generated excel document from the server.
axios.get(resource, {responseType: 'blob'}).then((response) => {

// Log somewhat to show that the browser actually exposes the custom HTTP header
const fileNameHeader = "x-suggested-filename";
const suggestedFileName = response.headers[fileNameHeader];'
const effectiveFileName = (suggestedFileName === undefined
            ? "allergierOchPreferenser.xls"
            : suggestedFileName);
console.log("Received header [" + fileNameHeader + "]: " + suggestedFileName
            + ", effective fileName: " + effectiveFileName);

// Let the user save the file.  github.com/eligrey/FileSaver.js/#filesaverjs
FileSaver.saveAs(response.data, effectiveFileName);

}).catch((response) => {
    console.error("Could not Download the Excel report from the backend.", response);
});
```
