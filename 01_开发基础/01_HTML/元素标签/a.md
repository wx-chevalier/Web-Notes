# a

# 打开新页面

用 `target="_blank"` 打开的页面允许新的页面访问原来的 window.opener。这可能会产生安全和性能问题。包括 rel="noopener "或 rel="noreferrer" 来防止这种情况。

```html
<a href="https://markodenic.com/" target="_blank" rel="noopener">
  Marko's website
</a>
```

如果你想在一个新的标签页中打开文档中的所有链接，你可以使用 `<base>` 元素。

![Base 元素](https://z3.ax1x.com/2021/05/06/glAJc6.md.png)

# 邮件、SMS 等

```html
<a href="mailto:{email}?subject={subject}&body={content}"> Send us an email </a>

<a href="tel:{phone}"> Call us </a>

<a href="sms:{phone}?body={content}"> Send us a message </a>
```

# download

你可以在你的链接中使用下载属性来下载文件，而不是导航到它。

```html
<a href="path/to/file" download> Download </a>
```
