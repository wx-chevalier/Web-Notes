# Npm

# npx

近日发布的 npm 5.2.0 版本中内置了伴生命令：npx，类似于 npm 简化了项目开发中的依赖安装与管理，该工具致力于提升开发者使用包提供的命令行的体验。npx 允许我们使用本地安装的命令行工具而不需要再定义 npm run-script，并且允许我们仅执行一次脚本而不需要再将其实际安装到本地；同时 npx 还允许我们以不同的 node 版本来运行指定命令、允许我们交互式地开发 node 命令行工具以及便捷地安装来自于 gist 的脚本。

在传统的命令执行中，我们需要将工具添加到 package.json 的 `scripts` 配置中，这种方式还需要我们以 `--` 方式传递参数；我们也可以使用 `alias npmx=PATH=$(npm bin):$PATH,` 或者 `./node_modules/.bin/mocha` 方式来执行命令，虽然都能达到目标，但不免繁杂了许多。而 npx 允许我们以 `npx mocha` 这样的方式直接运行本地安装的 mocha 命令。

![](https://coding.net/u/hoteam/p/Cache/git/raw/master/2017/6/1/1-A4HJT1FHQA_1_z3aMBc5mg.gif)

完整的 npx 命令提示如下：

```sh
从 npm 的可执行包执行命令
  npx [选项] <命令>[@版本] [命令的参数]...
  npx [选项] [-p|--package <包>]... <命令> [命令的参数]...
  npx [选项] -c '<命令的字符串>'
  npx --shell-auto-fallback [命令行解释器]

选项：
  --package, -p包安装的路径 [字符串]
  --cachenpm 缓存路径 [字符串]
  --install如果有包缺失，跳过安装[布尔] [默认值: true]
  --userconfig 当前用户的 npmrc 路径[字符串]
  --call, -c 像执行 `npm run-script` 一样执行一个字符串 [字符串]
  --shell, -s执行命令用到的解释器，可选 [字符串] [默认值: false]
  --shell-auto-fallback产生“找不到命令”的错误码
  [字符串] [可选值: "", "bash", "fish", "zsh"]
  --ignore-existing忽略 $PATH 或工程里已有的可执行文件，这会强制使 npx
 临时安装一次，并且使用其最新的版本 [布尔]
  --quiet, -q隐藏 npx 的输出，子命令不会受到影响[布尔]
  --npm为了执行内部操作的 npm 可执行文件 [字符串] [默认值:
 "/Users/apple/.nvm/versions/node/v8.1.3/lib/node_modules/npm/bin/npm-cli.js"]
  --version, -v显示版本号 [布尔]
  --help, -h 显示帮助信息 [布尔]
```

npx 还允许我们单次执行命令而不需要安装；在某些场景下有可能我们安装了某个全局命令行工具之后一直忘了更新，导致以后使用的时候误用了老版本。而使用 `npx create-react-app my-cool-new-app` 来执行 create-react-app 命令时，它会正常地帮我们创建 React 应用而不会实际安装 create-react-app 命令行。
我们还可以使用类似于 `$ npx -p node-bin@6 npm it` 的格式来指定 Node 版本，或者使用 `npx https://gist.github.com/zkat/4bc19503fe9e9309e2bfaa2c58074d32` 方式直接运行来自于 Gist 的脚本。

# 运行小技巧

## 多个任务并发执行

我们可以利用 concurrently 库来并发执行多个任务：

```sh
$ npm i concurrently --save-dev
```

然后在 Npm 脚本中使用 concurrent 来运行多个命令：

```json
{
  "dev": "concurrently --kill-others \"npm run start-watch\" \"npm run wp-server\""
}
```
