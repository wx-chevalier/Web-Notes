# ESLint

# 环境配置

## TypeScript 中使用 ESLint

首先来安装依赖：

```sh
$ yarn add --dev eslint
$ yarn add --dev @typescript-eslint/eslint-plugin
$ yarn add --dev @typescript-eslint/parser
```

然后来对 ESLint 进行配置，在目录下创建 .eslintrc.js 文件：

```js
module.exports = {
  parser: "@typescript-eslint/parser",
  plugins: ["@typescript-eslint"],
  extends: ["plugin:@typescript-eslint/recommended"],
};
```

最后，我们还需要在 VSCode 中设置对于 TS 与 TSX 使用 ESLint：

```json
"eslint.validate": [
  "javascript",
  "javascriptreact",
  "typescript",
  "typescriptreact"
]
```

## 技巧

在大型项目中，ESLint 往往运行缓慢，我们可以使用 `TIMING` 变量来查看单个规则的耗时：

```sh
$ TIMING=1 eslint lib
Rule                         | Time (ms) | Relative
:----------------------------|----------:|--------:
valid-jsdoc                  |   203.798 |     6.7%
camelcase                    |   142.146 |     4.6%
no-unmodified-loop-condition |   136.811 |     4.5%
indent                       |   127.138 |     4.2%
no-undefined                 |   124.525 |     4.1%
keyword-spacing              |    85.397 |     2.8%
space-in-parens              |    76.179 |     2.5%
no-this-before-super         |    72.317 |     2.4%
no-implied-eval              |    69.945 |     2.3%
space-infix-ops              |    57.128 |     1.9%
```

# Links

- https://mp.weixin.qq.com/s/X2gShxrCw0ukZigjE_45kA
- https://mp.weixin.qq.com/s/jb8yozm-p-b6MBAb46SP7A ESLint 在中大型团队的应用实践
