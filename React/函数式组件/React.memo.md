# React.memo

```js
import React from "react";

// Generates random colours any time it's called
const randomColour = () => "#" + ((Math.random() * 0xffffff) << 0).toString(16);

// The type of the props
type ButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement>;

// A memoized button with a random background colour
const Button = React.memo((props: ButtonProps) => (
  <button onClick={props.onClick} style={{ background: randomColour() }}>
    {props.children}
  </button>
));
```

# 链接

- https://dmitripavlutin.com/use-react-memo-wisely/
