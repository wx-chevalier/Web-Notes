[![返回目录](https://i.postimg.cc/JzFTMvjF/image.png)](https://github.com/wx-chevalier/Awesome-CheatSheets)

# Babel CheatSheet

Babel is a toolchain that is mainly used to convert ECMAScript 2015+ code into a backwards compatible version of JavaScript in current and older browsers or environments. Babel 主要通过以下方式来保证代码的运行:

- Transform syntax
- Polyfill features that are missing in your target environment (through @babel/polyfill)

# Babel 7

## Configuration | 基本配置

```sh
$ npm install --save-dev @babel/core @babel/cli @babel/preset-env
$ npm install --save @babel/polyfill
```

然后在根目录添加 babel.config.js 或者 `.babel.rc`:

```js
const presets = [
  [
    '@babel/env',
    {
      targets: {
        edge: '17',
        firefox: '60',
        chrome: '67',
        safari: '11.1'
      },
      useBuiltIns: 'usage'
    }
  ]
];

module.exports = { presets };
```

然后可以使用 Babel 命令行工具来转换文件:

```sh
$ ./node_modules/.bin/babel src --out-dir lib
```

也可以使用编程方式进行转换:

```js
const babel = require('@babel/core');

babel.transform('code', optionsObject);
```

值得一提的是，在 Babel 7 中，env 会根据浏览器的支持情况以及实际的代码使用来选择性的引入 Pollyfill 文件:

```js
// 使用了如下代码
Promise.resolve().finally();

// 会转化为如下形式
require('core-js/modules/es.promise.finally');

Promise.resolve().finally();
```

我们也可以在单个配置文件中，针对不同的环境定制不同的插件方案，Babel 默认按照如下方式加载环境变量:

```js
process.env.BABEL_ENV || process.env.NODE_ENV || 'development';
```

```json
// .babel.rc
{
  "presets": [
    ...
  ],
  "plugins": [
    ...
  ],
  "env": {
    "production": {
      "presets": ["react-optimize"],
      "plugins": [
        ...
      ]
    },
    "test": {
      "presets": [["env"], "react"]
    }
  }
}
```

我们也可以为不同的子目录设置不同的 Babel 配置:

```json
{
  "babelrcRoots": [
    // Keep the root as a root
    ".",

    // Also consider monorepo packages "root" and load their .babelrc files.
    "./packages/*"
  ]
}
```

## Modules

### polyfill

Babel includes a polyfill that includes a custom regenerator runtime and core-js.

This will emulate a full ES2015+ environment (no < Stage 4 proposals) and is intended to be used in an application rather than a library/tool. (this polyfill is automatically loaded when using babel-node).

This means you can use new built-ins like Promise or WeakMap, static methods like Array.from or Object.assign, instance methods like Array.prototype.includes, and generator functions (provided you use the regenerator plugin). The polyfill adds to the global scope as well as native prototypes like String in order to do this.

The polyfill is provided as a convienence but you should use it with @babel/preset-env and the useBuiltIns option so that it doesn't include the whole polyfill which isn't always needed. Otherwise, we would recommend you import the individual polyfills manually.

With webpack and When used alongside @babel/preset-env,, there are multiple ways to include the polyfills:

- If useBuiltIns: 'usage' is specified in .babelrc then do not include @babel/polyfill in either webpack.config.js entry array nor source. Note, @babel/polyfill still needs to be installed.

- If useBuiltIns: 'entry' is specified in .babelrc then include @babel/polyfill at the top of the entry point to your application via require or import as discussed above.

- If useBuiltIns key is not specified or it is explicitly set with useBuiltIns: false in your .babelrc, add @babel/polyfill directly to the entry array in your webpack.config.js.

我们也可以手动地载入这些 Polyfills:

```js
require('@babel/polyfill');

import '@babel/polyfill';

// webpack.config.js
module.exports = {
  entry: ['@babel/polyfill', './app/js']
};
```

### transform-runtime

A plugin that enables the re-use of Babel's injected helper code to save on codesize.

```sh
$ npm install --save-dev @babel/plugin-transform-runtime

$ npm install --save @babel/runtime
```

The transformation plugin is typically used only in development, but the runtime itself will be depended on by your deployed code.

```json
// babel.rc
{
  "plugins": [
    [
      "@babel/plugin-transform-runtime",
      {
        "corejs": false,
        "helpers": true,
        "regenerator": true,
        "useESModules": false
      }
    ]
  ]
}
```

Babel uses very small helpers for common functions such as \_extend. By default this will be added to every file that requires it. This duplication is sometimes unnecessary, especially when your application is spread out over multiple files.

This is where the @babel/plugin-transform-runtime plugin comes in: all of the helpers will reference the module @babel/runtime to avoid duplication across your compiled output. The runtime will be compiled into your build.

### register

You can use Babel is through the require hook. The require hook will bind itself to node's require and automatically compile files on the fly.

```sh
npm install @babel/core @babel/register --save-dev
```

```js
// entry.js
require('@babel/register');
```

All subsequent files required by node with the extensions .es6, .es, .jsx, .mjs, and .js will be transformed by Babel.

## Plugins & Presets

### React

```sh
$ npm install --save-dev @babel/preset-react
```

```json
{
  "presets": [
    [
      "@babel/preset-react",
      {
        "pragma": "dom", // default pragma is React.createElement
        "pragmaFrag": "DomFrag", // default is React.Fragment
        "throwIfNamespace": false // defaults to true
      }
    ]
  ]
}
```
