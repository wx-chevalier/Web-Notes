# State 结构设计

接下来我们一起讨论下 State 的结构设计问题，在复杂组件中，我们可能需要在但单组件内维持复杂的具有项目依赖关系的状态数据，譬如在经典的 TODOList 组件中，我们首先需要保存当前全部的待做事项数据：

```js
const initialState = [
  { id: 1, text: "laundry" },
  { id: 2, text: "shopping" }, // ...
];

class List extends React.Component {
  state = {
    todos: initialState,
  };

  render() {
    return (
      <div>
                     
        <ul>
          {this.state.todos.map((todo) => (
            <li key={todo.id}>{todo.text}</li>
          ))}
        </ul>     
      </div>
    );
  }
}
```

当你以为你大功告成的时候，产品经理让你添加一个搜索框，可以根据用户输入的内容动态地过滤列表显示内容。估计很多开发者会根据直觉写出如下代码：

```js
class List extends React.Component {
  state = {
    todos: initialState,
    filteredTodos: null,
  };

  search(searchText) {
    const filteredTodos = this.state.todos.filter(
      (todo) => todo.text.indexOf(searchText) > 0
    );
    this.setState({ filteredTodos: filteredTodos });
  }

  render() {
    // get todos from state
    const { filteredTodos, todos } = this.state; // if there are filtered todos use them

    const list = filteredTodos === null ? todos : filteredTodos;

    return (
      <div>
                        
        <SearchBox onChange={this.search} />
                        
        <ul>
              
          {list.map((todo) => (
            <li key={todo.id}>{todo.text}</li>
          ))}
        </ul>
                    
      </div>
    );
  }
}
```

从功能上来说，这段代码没有问题，但是其将 Todos 数据保存到了两个不同的列表中，这就导致了相同的数据被保存到了两个地方，不仅造成了数据存储的冗余，还会为我们未来的修改造成不便。譬如用户可能需要在过滤之后修改某个 Todo 项目的属性，那么此时便需要同时改变`todos`与`filteredTodos`这两个属性的数据方可。在 State 的结构设计时，我们应该遵循尽可能地保证其最小化原则，在此考虑下我们的组件可以修改为：

```js
class List extends React.Component {
  state = {
    todos: initialState,
    searchText: null,
  };

  search(searchText) {
    this.setState({ searchText: searchText });
  }

  filter(todos) {
    if (!this.state.searchText) {
      return todos;
    }

    return todos.filter((todo) => todo.text.indexOf(this.state.searchText) > 0);
  }

  render() {
    const { todos } = this.state;

    return (
      <div>
                        
        <SearchBox onChange={this.search} />
                        
        <ul>
              
          {this.filter(todos).map((todo) => (
            <li key={todo.id}>{todo.text}</li>
          ))}
        </ul>
                    
      </div>
    );
  }
}
```
