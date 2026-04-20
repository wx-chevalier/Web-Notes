# iframe

# 元素操作

在 web 开发中，经常会用到 iframe，难免会碰到需要在父窗口中使用 iframe 中的元素、或者在 iframe 框架中使用父窗口的元素。

- 在父窗口中获取 iframe 中的元素

```js
window.frames["iframe的name值"].document
  .getElementById("iframe中控件的ID")
  .click();
window.frames["ifm"].document.getElementById("btnOk").click();
```

```js
var obj = document.getElementById("iframe的name").contentWindow;
var ifmObj = obj.document.getElementById("iframe中控件的ID");
ifmObj.click();

var obj = document.getElementById("ifm").contentWindow;
var ifmObj = obj.document.getElementById("btnOk");
ifmObj.click();
```

在 iframe 中获取父窗口的元素：

```js
window.parent.document.getElementById("父窗口的元素 ID").click();
window.parent.document.getElementById("btnOk").click();
```
