![](https://i.postimg.cc/wjc6ss1H/image.png)

# Storybook

Storybook 是用户界面开发环境和 UI 组件的游乐场。该工具使开发人员能够独立创建组件，并在隔离的开发环境中以交互方式展示组件。Storybook 在主应用程序之外运行，因此用户可以独立开发 UI 组件，而无需担心应用程序特定的依赖关系和要求。

![Storybook 基础示例](https://i.postimg.cc/wjc6ss1H/image.png)

Storybook 还支持很多插件，并附带灵活的 API，可根据需要自定义 Storybook。还可以构建静态版本的 Storybook 并将其部署到 HTTP 服务器。

# 环境配置

我们可以通过如下方式自动地安装 Storybook 环境：

```sh
$ npx -p @storybook/cli sb init --type react
```

或者也可以进行手动安装：

```sh
$ npm install @storybook/react --save-dev
$ npm install react react-dom --save
$ npm install babel-loader @babel/core --save-dev
```

然后在 package.json 中添加运行脚本：

```json
{
  "scripts": {
    "storybook": "start-storybook"
  }
}
```

接下来在 `.storybook/config.js` 中添加配置文件：

```js
import { configure } from "@storybook/react";

function loadStories() {
  require("../stories/index.js");
  // You can require as many stories as you need.
}

configure(loadStories, module);
```

然后就可以开始编写我们自己的测试用例啦。
