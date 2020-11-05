# Taro

Taro 是由 京东·凹凸实验室 倾力打造的多端开发解决方案。现如今市面上端的形态多种多样，Web、ReactNative、微信小程序等各种端大行其道，当业务要求同时在不同的端都要求有所表现的时候，针对不同的端去编写多套代码的成本显然非常高，这时候只编写一套代码就能够适配到多端的能力就显得极为需要。使用 Taro，我们可以只书写一套代码，再通过 Taro 的编译工具，将源代码分别编译出可以在不同端（微信小程序、H5、RN 等）运行的代码。

Taro 遵循 React 语法规范，它采用与 React 一致的组件化思想，组件生命周期与 React 保持一致，同时支持使用 JSX 语法，让代码具有更丰富的表现力，使用 Taro 进行开发可以获得和 React 一致的开发体验。

```jsx
import Taro, { Component } from "@tarojs/taro";
import { View, Button } from "@tarojs/components";

export default class Index extends Component {
  constructor() {
    super(...arguments);
    this.state = {
      title: "首页",
      list: [1, 2, 3]
    };
  }

  componentWillMount() {}

  componentDidMount() {}

  componentWillUpdate(nextProps, nextState) {}

  componentDidUpdate(prevProps, prevState) {}

  shouldComponentUpdate(nextProps, nextState) {
    return true;
  }

  add = e => {
    // dosth
  };

  render() {
    return (
      <View className="index">
        <View className="title">{this.state.title}</View>
        <View className="content">
          {this.state.list.map(item => {
            return <View className="item">{item}</View>;
          })}
          <Button className="add" onClick={this.add}>
            添加
          </Button>
        </View>
      </View>
    );
  }
}
```
