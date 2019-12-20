# 从零实现 Redux

```ts
// 定一个 reducer
function reducer (state, action) {
  /* 初始化 state 和 switch case */
}

// 生成 store
const store = createStore(reducer)

// 监听数据变化重新渲染页面
store.subscribe(() => renderApp(store.getState()))

// 首次渲染页面
renderApp(store.getState())

// 后面可以随意 dispatch 了，页面自动更新
store.dispatch(...)
```

# 避免直接修改状态

# 数据变化监听

# 共享状态的修改

# 链接

- https://blog.bookcell.org/2019/08/04/learn-redux-by-build-a-redux/
- http://huziketang.mangojuice.top/books/react/lesson30
