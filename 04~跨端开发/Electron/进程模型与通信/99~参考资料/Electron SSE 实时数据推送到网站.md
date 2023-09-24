# Electron SSE 实时数据推送到网站

SSE 使用数据流传输数据，这是一种服务器向网页单向持续传输数据的机制；当网页向服务器发送一个请求时,服务器返回的是一个数据流，这个流会让会话一直保持连接。
这常见于文件下载、视频传输等场景。因此我们可以创建一个自定流，然后随时随地的往里面写各种数据。

```js
//Electron端
import STREAM from "stream";
const { app, BrowserWindow, protocol, ProtocolResponse } = require("electron");

const MY_CUSTOM_PROTOCOL_SCHEMA = "myapp-sse"; //命名需要遵循URL PROTOCOL协议

//#第一步:注册自定义协议,必须在app ready之前完成,且只能调用一次
protocol.registerSchemesAsPrivileged([{ scheme: MY_CUSTOM_PROTOCOL_SCHEMA }]);

app.on("ready", () => {
  //#第二步:注册一个流自定义协议
  protocol.registerStreamProtocol(MY_CUSTOM_PROTOCOL_SCHEMA, (req, res) => {
    const stream = new STREAM.PassThrough();
    stream.on("close", () => {
      /*网页关闭或链接中断时触发*/ stop();
    });
    stream.on("error", (err) => {
      /*异常时触发*/ stop();
    });

    //#第三步:构造HTTP流协议响应数据并响应请求
    res({
      statusCode: 200,
      mimeType: "text/event-stream",
      headers: {
        "Cache-Control": "no-cache",
        Connection: "keep-alive",
        "Access-Control-Allow-Origin": "*",
      },
      data: stream, // PassThrough 也是一个 ReadableStream,可以设置给data
    });

    //#第四步:持续向流中写入数据
    const timer = setInterval(() => {
      send("传递的数据", "message");
    }, 1000); // 每秒发送一次数据

    //封装一些方法
    let msgID = 0; //消息ID,每次发送新数据时自增1
    let _timeout = 3000; //链接超时,如果超过这个时间没有数据传输,浏览器则会自动断开链接,所以我们需要定时发送一个数据来保持链接
    function stop() {
      clearInterval(timer);
    } //当网页关闭或链接中断时停止发送数据
    function send(data, event, id = undefined) {
      //构造SSE响应数据
      //它有一个标准的格式,每一行都是以\n结尾,每一行的格式为: key: value\n
      if (id == undefined) msgID++;
      let ret = `data: ${data}\n`; //传递的数据,可以是任意类型,但是必须是字符串,如果是对象,则需要JSON.stringify()转换为字符串
      ret += `event: ${event}\n`; //事件类型:默认为message,可以自定义
      ret += `id: ${id || msgID}\n`; //消息ID:每次发送新数据都应该自增,用于浏览器判断是否有新数据和数据重发
      ret += `retry: ${_timeout}\n`; //重试时间
      ret += `\n`; //数据的结尾必须是两个\n
      stream.push(ret); //将数据写入流,随后浏览器就会收到数据
    }
  });
});
```

```js
//网页端部分代码
//Electron环境判断
const isElectron = /electron/i.test(navigator.userAgent);

//有了环境判断以后我们就可以避免在浏览器中执行SSE请求了
if (isElectron && typeof EventSource !== "undefined") {
  //构造请求地址
  const MY_CUSTOM_PROTOCOL_SCHEMA = "myapp-sse";
  const type = "aa";
  const parm = { dd: "ff" };
  const event = "ccc";
  const url = `${MY_CUSTOM_PROTOCOL_SCHEMA}://${type}/?event=${event}&parm=${btoa(
    JSON.stringify(parm)
  )}`;

  //构造EventSource(浏览器SSE请求)
  const evtSource = new EventSource(url, { withCredentials: true }); // 后端接口，要配置允许跨域属性
  // 与事件源的连接刚打开时触发
  evtSource.onopen = function (e) {
    console.log("sse onopen", e);
  };
  // 当从事件源接收到数据时触发
  evtSource.onmessage = function (e) {
    console.log("sse onmessage", e);
  };
  // 与事件源的连接无法打开时触发
  evtSource.onerror = (e: Event) => {
    console.log("sse onerror", e);
    evtSource.close(); // 关闭连接
  };
  //Electron代码中send函数内自定义的Event
  evtSource.on("自定义Event", (e: Event) => {
    console.log("sse custom event", e);
  });
} else {
  console.log(
    "sse not support",
    "当前浏览器不支持使用EventSource接收服务器推送事件!"
  );
}
```
