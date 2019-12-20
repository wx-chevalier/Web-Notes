[![返回目录](https://i.postimg.cc/50XLzC7C/image.png)](https://github.com/wx-chevalier/Web-Series/)

# [Yarn](https://github.com/yarnpkg/yarn)

Yarn 是一个新的快速安全可信赖的可以替代 NPM 的依赖管理工具，笔者在自己过去无论是本机还是 CI 中经常会碰到 NPM 安装依赖失败的情形，防不胜防啊。Yarn 正式发布没几天已经迅速达到了数万赞，就可以知道大家苦 NPM 久已。笔者最早是在 [Facebook 的这篇吐槽文](https://code.facebook.com/posts/1840075619545360/yarn-a-new-package-manager-for-javascript/)中了解到 Yarn。Facebook 使用 NPM 与 npm.js 存放管理大量的依赖项目，不过随着依赖项数目与复杂度的增加，NPM 本身在一致性、安全性以及性能方面的弊端逐渐暴露。因此忍无可忍的 Facebook 重构了 Yarn 这个新型的可替换 NPM 客户端的依赖管理工具。Yarn 仍然基于 NPM Registry 作为主要的仓库，不过其提供了更快的安装速度与不同环境下的一致性保证。
![](https://coding.net/u/hoteam/p/Cache/git/raw/master/2016/10/2/1-6b1tRgneuFkZol6ZQqo-lQ.png)

## Features

- **Consistency:** Yarn 允许使用某个 lockfile 来保证团队中的所有人使用相同版本的 npm 依赖包，这一点会大大减少因为某个人系统本身问题而导致的 Bug。
- **Versatile Archives:** Yarn 还允许用户将 npm 包以*tar.gz*形式打包上传到版本控制系统中，这一点能够利用 NPM 包本身已经对不同版本的 Node 或者操作系统做了容错这一特性。
- **Offline:** Yarn 允许离线安装某些依赖，这点对于 CI 系统特别适用。CI 系统就不需要保证有稳定的网络连接，特别是在有墙的地方。
- **Speed:** Yarn 采用了新的算法来保证速度， [比 NPM 快到 2~7 倍](https://yarnpkg.com/en/compare)， 同时也允许使用离线包的方式本地安装依赖。

## Reference

- [yarn-a-new-package-manager-for-javascript](https://code.facebook.com/posts/1840075619545360/yarn-a-new-package-manager-for-javascript/)

- [yarn-a-new-program-for-installing-javascript-dependencies](https://blog.getexponent.com/yarn-a-new-program-for-installing-javascript-dependencies-44961956e728#.qf8fmeg4g)

- [npm-vs-yarn-cheat-sheet](https://shift.infinite.red/npm-vs-yarn-cheat-sheet-8755b092e5cc#.dcd5qeolm)

- [Yarn 能帮你解决的五件事](http://www.tuicool.com/articles/Yn2iU3Q)

# Quick Start

直接使用`npm i yarn -g`全局安装即可，这是笔者本机的运行结果图，速度与稳定性确实都快了不少：
![](https://coding.net/u/hoteam/p/Cache/git/raw/master/2016/10/2/9A18FA64-6871-4A55-B77D-7DAE78371DE5.png)

## Cheat

| NPM                        | YARN                      | 说明                                     |
| -------------------------- | ------------------------- | ---------------------------------------- |
| npm init                   | yarn init                 | 初始化某个项目                           |
| npm install/link           | yarn install/link         | 默认的安装依赖操作                       |
| npm install taco —save     | yarn add taco             | 安装某个依赖，并且默认保存到 package.    |
| npm uninstall taco —save   | yarn remove taco          | 移除某个依赖项目                         |
| npm install taco —save-dev | yarn add taco —dev        | 安装某个开发时依赖项目                   |
| npm update taco —save      | yarn upgrade taco         | 更新某个依赖项目                         |
| npm install taco --global  | yarn global add taco      | 安装某个全局依赖项目                     |
| npm publish/login/logout   | yarn publish/login/logout | 发布/登录/登出，一系列 NPM Registry 操作 |
| npm run/test               | yarn run/test             | 运行某个命令                             |

# Yarn Workspaces

工作区是设置你的软件包体系结构的一种新方式，默认情况下从 Yarn 1.0 开始使用。它允许你可以使用这种方式安装多个软件包，就是只需要运行一次 `yarn install` 便可将所有依赖包全部安装。

- 你的依赖包可以链接在一起，这意味着你的工作区可以相互依赖，同时始终使用最新的可用代码。这也是一个比 `yarn link` 更好的机制，因为它只影响你工作区的依赖树，而不会影响整个系统。

- 所有的项目依赖将被安装在一起，这样可以让 Yarn 来更好地优化它们。

- Yarn 将使用一个单一的 lock 文件，而不是每个项目多有一个，这意味着更少的冲突和更容易进行代码检查。

Workspaces 的使用方式也非常简单，在 package.json 文件中添加以下内容，从现在开始，我们将此目录称为 “工作区根目录”：

```json
{
  "private": true,
  "workspaces": ["workspace-a", "workspace-b"]
}
```

请注意，`private: true` 是必需的！工作区本身不应当被发布出去，所以我们添加了这个安全措施以确保它不会被意外暴露。创建这个文件后，再创建两个名为 `workspace-a` 和 `workspace-b` 的子文件夹。在每个文件夹里面，创建一个具有以下内容的 `package. json` 文件：

- workspace-a/package.json:

```json
{
  "name": "workspace-a",
  "version": "1.0.0",

  "dependencies": {
    "cross-env": "5.0.5"
  }
}
```

- workspace-b/package.json:

```json
{
  "name": "workspace-b",
  "version": "1.0.0",

  "dependencies": {
    "cross-env": "5.0.5",
    "workspace-a": "1.0.0"
  }
}
```

最后，在某个地方运行 `yarn install` ，当然最好是在工作区根目录里面。如果一切正常，你现在应该有一个类似这样的文件层次结构：

```
/package.json
/yarn.lock

/node_modules
/node_modules/cross-env
/node_modules/workspace-a -> /workspace-a

/workspace-a/package.json
/workspace-b/package.json
```

Yarn 的工作区是诸如 Lerna 这样的工具可以（并且正在）利用的底层机制。它们将永远不会试图提供像 Lerna 那么高级的功能，但通过实现该解决方案的核心逻辑和 Yarn 内部的连接步骤，我们希望能够提供新的用法并提高性能。

```sh
# 为某个子模块添加本地依赖
$ yarn workspace x add y@^1.0.0

# 在所有子项目下运行 Build 命令
$ yarn workspaces run build
```
