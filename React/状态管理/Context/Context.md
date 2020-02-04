# Context 用于状态管理

如前文所述，React 单组件中允许使用 setState 进行状态管理，而对于组件树，我们可以使用 Props 逐层传递状态值与回调函数。不过这种方式无形会导致多层组件间的强耦合，并且会导致大量的冗余代码。像 Redux, MobX 这样的状态管理框架，它们的作用之一就是将状态代码独立于组件，并未多层组件提供直接的数据流通通道；实际上我们也可以利用 Context API 进行跨层组件间的数据传递，来构建简单的状态管理工具。[Unstated](https://github.com/jamiebuilds/unstated) 就是对于 Context API 进行简要封装形成的状态管理库，它并不需要开发者学习额外的 API 或者库用法，而只需要使用普通的 React 组件中的 setState 方法操作 state，并利用 Context 将其传递到子组件中。Unstated 中主要包含了 Container，Subscribe 以及 Provider 三个组件，其中 Provider 负责存放所有的内部状态实例，类似于 Redux 或者 Apollo 中的 Provider：

```js
const App = () => (
  <Provider>
    <Main />
  </Provider>
);
```

Unstated 会在内部创建 Context 对象，并在 Provider 中包裹 Context.Provider 对象：

```js
const StateContext = createReactContext(null);

...

export function Provider(props: ProviderProps) {
  return (
    // 集成父组件中的 Provider
    <StateContext.Consumer>
      {
        ...
        return (
          <StateContext.Provider value={childMap}>
            {props.children}
          </StateContext.Provider>
        );
      }}
    </StateContext.Consumer>
  );
}
```

Container 是朴素的拥有 setState 方法的 JavaScript 类，其仅负责进行状态操作，其用法如下：

```js
// BookContainer.js
import { Container } from "unstated";
class BookContainer extends Container {
  state = {
    books: [],
    booksVisible: false
  };
  addBook = book => {
    const books = [...this.state.books];
    books.push(book);
    this.setState({ books });
  };
  toggleVisibility = () => {
    this.setState({
      booksVisible: !this.state.booksVisible
    });
  };
}
export { BookContainer };
```

参考 Container 的源代码，可以发现其主要是对 setState 进行了复写：

```js
// ...
setState(state: $Shape<State>) {
  this.state = Object.assign({}, this.state, state);
  this._listeners.forEach(fn => fn());
}
// ...
```

Subscribe 组件则提供了将 Container 实例传递给自定义组件的媒介，当状态变化时，组件会进行自动渲染：

```js
<Subscribe to={[BookContainer, CounterContainer]}>
  {(bookStore, counterStore) => {
      const { state: { books, booksVisible } } = bookStore
      {
        booksVisible && books.map((book, index) => (
          <div>
            <p>{book.name}</p>
            <p>{book.author}</p>
          </div>
        )
      }
  }}
</Subscribe>
```

Subscribe 在组件内提供了 Context.Consumer 包裹，并且自动创建 Container/Store 实例：

```js
instance = new Container();
safeMap.set(Container, instance);

...

render() {
  return (
    <StateContext.Consumer>
      {map =>
        this.props.children.apply(
          null,
          this._createInstances(map, this.props.to)
        )
      }
    </StateContext.Consumer>
  );
}
```
