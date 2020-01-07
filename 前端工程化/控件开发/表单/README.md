# 表单

表单主要承载了信息的收集和对所收集信息进行的初步校验，是一个将人机交互行为转换为数据后提交给服务器的可视化前端应用。通常情况下完成一个表单相关的需求需要前端创建承载页面、定义表单字段、添加校验逻辑等过程。

```html
<!-- https://developer.mozilla.org/zh-CN/docs/Learn/HTML/Forms/Your_first_HTML_form -->
<form action="/my-handling-form-page" method="post">
  <div>
    <label for="name">Name:</label>
    <input type="text" id="name" />
  </div>
  <div>
    <label for="mail">E-mail:</label>
    <input type="email" id="mail" />
  </div>
  <div>
    <label for="msg">Message:</label>
    <textarea id="msg"></textarea>
  </div>
  <div class="button">
    <button type="submit">Send your message</button>
  </div>
</form>
```

从上可见，基础的表单包含了提交地址、提交方法、提示信息、输入框、提交按钮等部分。在有了 Jquery、React、Vue 等等之后，网络和社区上有了更为丰富的表单组件，比如日期选择、时间选择器、图片裁剪上传等等。

```js
const { TimePicker } = antd;

function onChange(time, timeString) {
  console.log(time, timeString);
}

ReactDOM.render(
  <TimePicker
    onChange={onChange}
    defaultOpenValue={moment('00:00:00', 'HH:mm:ss')}
  />,
  mountNode
);
```
