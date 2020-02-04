# 使用 MobX 存储应用状态

```js
import { observer } from "mobx-react";
import { now } from "mobx-utils";

const NEW_YEAR = new Date(2018, 0, 1);
const SECOND = 1000;
const MINUTE = 60 * SECOND;
const HOUR = 60 * MINUTE;

const CountDown = observer(() => {
  const timeLeft = NEW_YEAR - now();
  return (
    <h1>
      距离新年还有 &nbsp;
      {Math.floor(timeLeft / HOUR)}:{Math.floor((timeLeft % HOUR) / MINUTE)}:{Math.floor(
        (timeLeft % MINUTE) / SECOND
      )}!
    </h1>
  );
});

React.render(<CountDown />, document.body);
```

# 定义数据存储

# 响应式界面

# 异步事件

# 实践调优
