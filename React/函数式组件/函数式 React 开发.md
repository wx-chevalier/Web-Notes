# 函数式 React 开发

# 函数式 setState

参考 React 官方文档中的描述，`setState` 并不是立刻改变 `this.state` 的值，而是创建挂起的状态事务；如果直接在 `setState` 之后访问状态对象只会获得之前的值。譬如下述的代码就会存在某些错误或者预判差异：

```
updateState({target}) {
 this.setState({user: {...this.state.user, [target.name]: target.value}});
 doSomething(this.state.user) // Uh oh, setState merely schedules a state change, so this.state.user may still have old value
}
```

如果我们希望去在某个状态实际更新完毕之后，执行某些操作，那么可以以如下方式使用自定义的新状态：

```js
updateState({target}) {
 this.setState(prevState => {
 const updatedUser = {...prevState.user, [target.name]: target.value}; // use previous value in state to build new state...
 doSomething(updatedUser); // Now I can safely utilize the new state I've created to call other funcs...
 return { user: updatedUser }; // And what I return here will be set as the new state
 });
 }
```

# 高阶函数
