# FormatJS 国际化

## React Intl

[react-intl](https://github.com/formatjs/react-intl) 是 FormatJS 的 React 绑定版，它能够自动地帮我们进行时间日期、数字、金钱等国际化操作：

```ts
import React, { Component } from "react";
import ReactDOM from "react-dom";
import { IntlProvider, FormattedMessage } from "react-intl";

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      name: "Eric",
      unreadCount: 1000
    };
  }

  render() {
    const { name, unreadCount } = this.state;

    return (
      <p>
        <FormattedMessage
          id="welcome"
          defaultMessage={`Hello {name}, you have {unreadCount, number} {unreadCount, plural,
                      one {message}
                      other {messages}
                    }`}
          values={{ name: <b>{name}</b>, unreadCount }}
        />
      </p>
    );
  }
}

ReactDOM.render(
  <IntlProvider locale="en">
    <App />
  </IntlProvider>,
  document.getElementById("container")
);
```

更详细的工程化集成请参考 [react-snippets/react-antd-intl](https://github.com/wx-chevalier/react-snippets)。
