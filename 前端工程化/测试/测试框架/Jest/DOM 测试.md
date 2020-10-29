# DOM 测试

# DOM 操作

```js
// displayUser.js
"use strict";

const $ = require("jquery");
const fetchCurrentUser = require("./fetchCurrentUser.js");

$("#button").click(() => {
  fetchCurrentUser(user => {
    const loggedText = "Logged " + (user.loggedIn ? "In" : "Out");
    $("#username").text(user.fullName + " - " + loggedText);
  });
});
```

接着，我们在 `__tests__/` 文件夹下创建一个测试文件：

```js
// __tests__/displayUser-test.js
"use strict";

jest.mock("../fetchCurrentUser");

test("displays a user after a click", () => {
  // Set up our document body
  document.body.innerHTML =
    "<div>" +
    '  <span id="username" />' +
    '  <button id="button" />' +
    "</div>";

  // This module has a side-effect
  require("../displayUser");

  const $ = require("jquery");
  const fetchCurrentUser = require("../fetchCurrentUser");

  // Tell the fetchCurrentUser mock function to automatically invoke
  // its callback with some data
  fetchCurrentUser.mockImplementation(cb => {
    cb({
      fullName: "Johnny Cash",
      loggedIn: true
    });
  });

  // Use jquery to emulate a click on our button
  $("#button").click();

  // Assert that the fetchCurrentUser function was called, and that the
  // #username span's inner text was updated as we'd expect it to.
  expect(fetchCurrentUser).toBeCalled();
  expect($("#username").text()).toEqual("Johnny Cash - Logged In");
});
```

# 快照测试

快照测试是 Jest 提供的一个相当棒的 UI 测试功能，它会记录 React 结构树快照或其他可序列化的值，并与当前测试的值进行比较，如果不匹配则给出错误提示。快照应该被当做代码来对待，它需要被提交到版本库并进行 Review。如果组件渲染结果发生变化，测试将会失败。当组件正常调整时，我们可以调用 `jest -u` 更新快照。在监控模式下，我们可以通过交互式的命令更新快照。

下面通过一个简单的 text 组件来测试一下：

```js
// Text.js
import React from "react";

export default ({ className, children }) => {
  return <span className={className}>{children}</span>;
};
```

除了 React 我们还需要安装依赖：`npm i -D babel-preset-react react-test-renderer`，其中 babel-preset-react 预设用来解析 jsx 语法，需要添加到 babel 配置中。

```js
// Text.test.js
import React from "react";
import renderer from "react-test-renderer";

import Text from "./Text";

it("render correctly", () => {
  const tree = renderer
    .create(<Text className="success">Snapshot testing</Text>)
    .toJSON();
  expect(tree).toMatchSnapshot();
});
```

执行测试代码后，会生成如下快照：

```js
// Jest Snapshot v1, https://goo.gl/fbAQLP

exports[`render correctly 1`] = `
<span
  className="success"
>
  Snapshot testing
</span>
`;
```

# 界面对象

对于 `React` 的 `scroll` 事件而言，必须要绑定在某个元素里才能进行模拟，不巧，对于安卓手机来说，大部份 `scroll` 事件都是绑定在 `window` 对象下的。这就非常尴尬了，需要借助到 `jsdom` 的功能。通过 `jest-environment-jsdom`，它能够将 `jsdom` 注入到 `node` 运行环境中，因此你可以在测试文件中直接使用 `window`对象进行模拟。例如下面代码，模拟滚动到最底部：

```js
test("scroll to bottom", done => {
  const wrapper = mount(<Wrapper />);

  window.addEventListener("scroll", function(e) {
    setTimeout(() => {
      try {
        // expect 逻辑
        done();
      } catch (err) {
        done.fail(err);
      }
    }, 100);
    jest.runAllTimers();
  });

  let scrollTop = 768;
  window.document.body.scrollTop = scrollTop; // 指明当前 scrollTop到了哪个位置
  window.dispatchEvent(
    new window.Event("scroll", {
      scrollTop: scrollTop
    })
  );
});
```
