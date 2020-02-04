# Enzyme

Enzyme 是由 Airbnb 开源的一个 React 的 JavaScript 测试工具，允许我们在 DOM 环境中测试 React 组件。使 React 组件的输出更加容易 extrapolate。Enzyme 的 API 和 jQuery 操作 DOM 一样灵活易用，因为它使用的是 cheerio 库来解析虚拟 DOM，而 cheerio 的目标则是做服务器端的 jQuery。Enzyme 兼容大多数断言库和测试框架，如 chai、mocha、jasmine 等。

首先需要在项目中安装 Enzyme：

```
$ npm i enzyme @types/enzyme enzyme-to-json enzyme-adapter-react-16 -D
```

然后在 jest.config.js 文件中添加 snapshotSerializers 与 setupTestFrameworkScriptFile 配置：

```js
module.exports = {
  // OTHER PORTIONS AS MENTIONED BEFORE

  // Setup Enzyme
  snapshotSerializers: ["enzyme-to-json/serializer"],
  setupTestFrameworkScriptFile: "<rootDir>/src/setupEnzyme.ts"
};
```

然后创建初始化文件：

```ts
// src/setupEnzyme.ts
import { configure } from "enzyme";
import * as EnzymeAdapter from "enzyme-adapter-react-16";
configure({ adapter: new EnzymeAdapter() });
```

简单的 React 组件如下：

```tsx
import * as React from "react";

export class CheckboxWithLabel extends React.Component<
  {
    labelOn: string;
    labelOff: string;
  },
  {
    isChecked: boolean;
  }
> {
  constructor(props) {
    super(props);
    this.state = { isChecked: false };
  }

  onChange = () => {
    this.setState({ isChecked: !this.state.isChecked });
  };

  render() {
    return (
      <label>
        <input
          type="checkbox"
          checked={this.state.isChecked}
          onChange={this.onChange}
        />
        {this.state.isChecked ? this.props.labelOn : this.props.labelOff}
      </label>
    );
  }
}
```

其对应的测试文件如下：

```tsx
import * as React from "react";
import { shallow } from "enzyme";

import { CheckboxWithLabel } from "./checkboxWithLabel";

test("CheckboxWithLabel changes the text after click", () => {
  const checkbox = shallow(<CheckboxWithLabel labelOn="On" labelOff="Off" />);

  // Interaction demo
  expect(checkbox.text()).toEqual("Off");
  checkbox.find("input").simulate("change");
  expect(checkbox.text()).toEqual("On");

  // Snapshot demo
  expect(checkbox).toMatchSnapshot();
});
```

# 测试组件的渲染

对于大部分没有交互的组件，下面的测试用例已经足够:

```jsx
test("render a label", () => {
  const wrapper = shallow(<Label>Hello Jest!</Label>);
  expect(wrapper).toMatchSnapshot();
});

test("render a small label", () => {
  const wrapper = shallow(<Label small>Hello Jest!</Label>);
  expect(wrapper).toMatchSnapshot();
});

test("render a grayish label", () => {
  const wrapper = shallow(<Label light>Hello Jest!</Label>);
  expect(wrapper).toMatchSnapshot();
});
```

# Props 测试

有的时候如果你想测试的更精确和看到真实的值。那样的话需要在 Enzyme API 中使用 Jest 的 断言。

```js
test("render a document title", () => {
  const wrapper = shallow(<DocumentTitle title="Events" />);
  expect(wrapper.prop("title")).toEqual("Events");
});

test("render a document title and a parent title", () => {
  const wrapper = shallow(
    <DocumentTitle title="Events" parent="Event Radar" />
  );
  expect(wrapper.prop("title")).toEqual("Events — Event Radar");
});
```

有的时候你不能用快照。比如组件里面有随机 ID 像下面的代码：

```js
test("render a popover with a random ID", () => {
  const wrapper = shallow(<Popover>Hello Jest!</Popover>);
  expect(wrapper.prop("id")).toMatch(/Popover\d+/);
});
```

# 事件测试

我们可以模拟类似 `click` 或者 `change` 这样的事件然后把组件和快照做比较：

```js
test("render Markdown in preview mode", () => {
  const wrapper = shallow(<MarkdownEditor value="*Hello* Jest!" />);
  expect(wrapper).toMatchSnapshot();
  wrapper.find('[name="toggle-preview"]').simulate("click");
  expect(wrapper).toMatchSnapshot();
});
```

有的时候你想要测试一个子组件中一个元素是怎样影响组件的。你需要使用 Enzyme 的 mount 方法来渲染一个真实的 DOM。

```js
test("open a code editor", () => {
  const wrapper = mount(<Playground code={code} />);
  expect(wrapper.find(".ReactCodeMirror")).toHaveLength(0);
  wrapper.find("button").simulate("click");
  expect(wrapper.find(".ReactCodeMirror")).toHaveLength(1);
});
```

# 测试事件处理

类似于在事件测试中，由使用快照测试组件的输出呈现替换为使用 Jest 的 mock 函数来测试事件处理程序本身：

```js
test("pass a selected value to the onChange handler", () => {
  const value = "2";
  const onChange = jest.fn();
  const wrapper = shallow(<Select items={ITEMS} onChange={onChange} />);

  expect(wrapper).toMatchSnapshot();

  wrapper.find("select").simulate("change", {
    target: { value }
  });

  expect(onChange).toBeCalledWith(value);
});
```
