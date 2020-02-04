# React Props

# Component Properties

Function as Prop

```js
const Foo = ({ hello }) => {
  return hello("foo");
};

const hello = name => {
  return <div>`hello from ${name}`</div>;
};

<Foo hello={hello} />;
```

Component Injection

```
class WindowWidth extends React.Component {
  constructor(props) {
  super(props);
  this.state = { width: 0 };
  }


 ...


  render() {


  const { width } = this.state;
    const { Width } = this.props;
  return <Width width={width} />;
 }
}


<WindowWidth Width={DisplayWindowWidthText} />



const DisplayDevice = ({ width }) => {
  let device = null;
  if (width <= 480) {
  device = 'mobile';
  } else if (width <= 768) {
  device = 'tablet';
  } else {
  device = 'desktop';
  }
  return <div>you are using a {device}</div>;
};
```

# Prop Validation

# children

## 渲染回调

渲染回调(Render Callback)即指那些子元素为某个函数的组件，也就是所谓的 Function-as-Child；我们可以利用这种模式复用有状态组件从而共享部分业务逻辑。如果需要定义渲染回调，则需要在 render 函数中返回对于传入的子元素的调用结果：

```js
import { Component } from "react";

class SharedThing extends Component {
  // ...

  render() {
    return this.props.children(thing1, thing2);
  }
}

export default SharedThing;
```

然后在其他组件中我们可以调用该组件并且获得该组件的执行结果：

```js
import React from 'react'

const AnotherComponent = () => (
  <SharedThing>
  {(thing1, thing2) => (
  // use thing1 and thing2
  )}
  </SharedThing>
)

export default AnotherComponent
```

一个比较典型的案例就是共享开关逻辑，某个开关组件 Toggle 会在内部存放用来表示当前开关状态的 `toggled` 变量，我们可以通过渲染回调的模式在将控制开关的逻辑提取出来：

```js
import { Component } from "react";

class Toggle extends Component {
  state = {
    isOpen: false
  };

  handleToggleClick = () => {
    this.setState({
      isOpen: !this.state.isOpen
    });
  };

  render() {
    return this.props.children(this.state.isOpen, this.handleToggleClick);
  }
}

export default Toggle;
```

现在所有使用 Toggle 的组件都能够访问到内部的 `isOpen` 状态并且能够使用 `handleToggleClick` 函数来触发 Toggle 内部状态的变化：

```js
import React from "react";
import Toggle from "./Toggle";

const Accordion = ({ teaser, details }) => (
  <Toggle>
    {(isOpen, handleToggleClick) => (
      <section>
        <a onClick={handleToggleClick}>{`${isOpen ? "-" : "+"} ${teaser}`} </a>
        {isOpen && details}
      </section>
    )}
  </Toggle>
);

export default Accordion;
```

```js
const Thumbnail = ({ src, teaser }) => (
  <Toggle>
    {(isOpen, handleToggleClick) => (
      <div>
        <div>{teaser}</div>
        <img
          src={src}
          alt={teaser}
          onClick={handleToggleClick}
          style={{
            maxWidth: isOpen ? "100%" : 150
          }}
        />
      </div>
    )}
  </Toggle>
);

export default Thumbnail;
```

## cloneElement
