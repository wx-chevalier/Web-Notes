# 使用 Vue-cli

首先，我们可以使用 NPM 安装 Vue-cli。你必须要检查下系统中是否已经安装好了 NodeJS 并且 npm 命令行工具可以正常使用，然后使用如下命令在本地系统进行全局安装：

```
$ npm install -g vue-cli
```

安装完毕之后，我们可以使用如下方式来初始化新的项目:

```
$ vue init webpack vueapp01
```

这里我们让 Vue-cli 以 Webpack 模板创建新的项目，并且个新项目取名为 vueapp01，运行该命令之后它会向你咨询基本的项目信息，截图如下：

到这里项目的模板文件被添加到了 vueapp01 目录下，进入该目录即可以启动开发服务器：

```
$ npm run dev
```

该命令会启动一个监听 8080 端口的开发服务器，在浏览器中打开该端口可以看到如下界面：

如果你希望将项目打包出开发版本，可以使用 build 命令，它会将项目打包编译之后的文件放置在 dist 目录下：

```
$ npm run build
```

# 项目结构

该部分的代码参考[vue-boilerplate](https://github.com/wx-chevalier/Web-Frontend-Introduction-And-Engineering-Practices/tree/master/OpenSource/vue-boilerplate)。首先我们来看下 Vue-cli 构建的项目目录结构：

进入项目根目录之后我们使用`npm intsall`命令安装所有依赖，所有的依赖被声明在`package.json`文件中。文件`index.html`中包含了如下 HTML 代码：

```html
<!DOCTYPE html>
<html>
  <head>
    <meta charset="utf-8" />
    <title>vueapp01</title>
  </head>
  <body>
    <style>
      .sidebar {
        margin-top: 48px;
      }

      #nav {
        position: fixed;
        z-index: 9;
        padding: 0 8px;
        display: flex;
        justify-content: space-evenly;
        align-items: center;
        width: 300px;
        top: 0;
        height: 60px;
      }
    </style>
    <div id="nav">
      <h3><a href="https://ng-tech.icu/books-gallery">Books</a></h3>
      <span style="margin:0 8px;display:inline-block">|</span>
      <h3><a href="https://github.com/FE-Kits">FE-Kits</a></h3>
      <span style="margin:0 8px;display:inline-block">|</span>
      <h3><a href="https://github.com/BE-Kits">BE-Kits</a></h3>
      <span style="margin:0 8px;display:inline-block">|</span>
      <h3><a href="https://github.com/AI-Kits">AI-Kits</a></h3>
    </div>
    <div id="app"></div>
    <!-- built files will be auto injected -->
  </body>
</html>
```

该文件是整个应用的入口点，注意，无论你把`<div>`元素放在哪，只要保证其`id`属性为`app`即可，该元素是整个由 Vue.js 生成文件的插入点。然后我们看下 src 文件夹中的 main.js 文件，该文件是 Vue 应用初始化的地方：

```js
new Vue({
  el: "#app",
  template: "<App/>",
  components: { App },
});
```

文件首部我们发现两个引入语句：

- `import Vue from 'vue'`：Vue 是整个框架的主类
- `import App from './App'`：App 是整个应用的根元素

使用`new`关键字能够创建 Vue 的实例，构造函数会接收包含三个属性的配置对象：

- el:设定 Vue 应用的 DOM 挂载点
- template:包含 HTML 代码的模板
- components:用于模板中的 Vue.js 组件

该模板仅包含一个元素：`<App />`，当然这并不是 HTML 标准元素，整个 App 组件的的定义在`App.vue`文件中：

```vue
<template>
   
  <div id="app">  <img src="./assets/logo.png" />   <hello></hello>  </div>
</template>

<script>
import Hello from "./components/Hello";
export default {
  name: "app",
  components: {
    Hello,
  },
};
</script>

<style>
#app {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}
</style>
```

对于每个 Vue.js 2 单文件组件，其会包含三部分：

- `<template></template>`: Component's template code
- `<script></script>`: Component's script code
- `<style></style>`: Component' CSS code

我们先看看`template`与`script`这两块。`script`块导出了某个声明为`app`的组件，该组件中的属性声明了对于`Hello`组件的引用。`Hello`组件则是被定义在`hello.vue`文件中，为了使用其他组件我们同样需要在`script`首部引入该组件。整个 Hello 组件的定义如下：

```html
<template>
  <div class="hello">
    <h1>{{ msg }}</h1>
    <h2>Essential Links</h2>
    <ul>
      <li><a href="https://vuejs.org" target="_blank">Core Docs</a></li>
      <li><a href="https://forum.vuejs.org" target="_blank">Forum</a></li>
      <li>
        <a href="https://gitter.im/vuejs/vue" target="_blank">Gitter Chat</a>
      </li>
      <li><a href="https://twitter.com/vuejs" target="_blank">Twitter</a></li>
      <br />
      <li>
        <a href="http://vuejs-templates.github.io/webpack/" target="_blank"
          >Docs for This Template</a
        >
      </li>
    </ul>
    <h2>Ecosystem</h2>
    <ul>
      <li><a href="http://router.vuejs.org/" target="_blank">vue-router</a></li>
      <li><a href="http://vuex.vuejs.org/" target="_blank">vuex</a></li>
      <li>
        <a href="http://vue-loader.vuejs.org/" target="_blank">vue-loader</a>
      </li>
      <li>
        <a href="https://github.com/vuejs/awesome-vue" target="_blank"
          >awesome-vue</a
        >
      </li>
    </ul>
  </div>
</template>
<script>
  export default {
    name: "hello",
    data() {
      return {
        msg: "Welcome to Your Vue.js App",
      };
    },
  };
</script>
<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
  h1,
  h2 {
    font-weight: normal;
  }
  ul {
    list-style-type: none;
    padding: 0;
  }
  li {
    display: inline-block;
    margin: 0 10px;
  }
  a {
    color: #42b983;
  }
</style>
```
