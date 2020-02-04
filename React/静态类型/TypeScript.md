# React & TypeScript

如果对 TypeScript 尚不了解的同学可以参考 [TypeScript CheatSheet]()。

# 组件基础

React 的 TypeScript 类型声明可以参考 [types/react](https://github.com/DefinitelyTyped/DefinitelyTyped/tree/master/types/react)，[antd](https://github.com/ant-design/ant-design) 也是非常不错的使用 TypeScript 开发的大型 React 项目。

```ts
import * as React from "react";
import formatPrice from "../utils/formatPrice";

export interface IPriceProps {
  num: number;
  symbol: "$" | "€" | "£";
}

const Price: React.SFC<IPriceProps> = ({ num, symbol }: IPriceProps) => (
  <div>
    <h3>{formatPrice(num, symbol)}</h3>
  </div>
);
```

```ts
export function positionStyle<T>(
  Component: React.ComponentType
): React.StatelessComponent<T & { left: number; top: number }> {
  return (props: any) => {
    const { top, left, ...rest } = props;
    return (
      <div style={{ position: "absolute", top, left }}>
        <Component {...rest} />
      </div>
    );
  };
}
```

## 事件处理

# 设计模式

## 高阶组件

譬如在 [types/react-redux](https://parg.co/o47) 中，connect 函数的类型声明可以 interface 来声明多个重载：

```ts
export interface Connect {
  ...
    <TStateProps = {}, TDispatchProps = {}, TOwnProps = {}, State = {}>(
      mapStateToProps: MapStateToPropsParam<TStateProps, TOwnProps, State>,
      mapDispatchToProps: MapDispatchToPropsParam<TDispatchProps, TOwnProps>
  ): InferableComponentEnhancerWithProps<TStateProps & TDispatchProps, TOwnProps>;
  ...
}

export declare const connect: Connect;
```

# 状态管理

# 链接

- https://medium.com/@rossbulat/how-to-use-typescript-with-react-and-redux-a118b1e02b76
