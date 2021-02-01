# API 简化

# Store Setup

标准的 Redux Store 的构建方式如下：

```js
import { applyMiddleware, createStore } from "redux";
import { composeWithDevTools } from "redux-devtools-extension";
import thunkMiddleware from "redux-thunk";

import monitorReducersEnhancer from "./enhancers/monitorReducers";
import loggerMiddleware from "./middleware/logger";
import rootReducer from "./reducers";

export default function configureStore(preloadedState) {
  const middlewares = [loggerMiddleware, thunkMiddleware];
  const middlewareEnhancer = applyMiddleware(...middlewares);

  const enhancers = [middlewareEnhancer, monitorReducersEnhancer];
  const composedEnhancers = composeWithDevTools(...enhancers);

  const store = createStore(rootReducer, preloadedState, composedEnhancers);

  if (process.env.NODE_ENV !== "production" && module.hot) {
    module.hot.accept("./reducers", () => store.replaceReducer(rootReducer));
  }

  return store;
}
```

configureStore 通过以下方式帮助解决这些问题。

- 拥有一个带有 "命名 "参数的选项对象，它可以更容易读取。
- 让你提供你想添加到 Store 的中间件和增强器的数组，并自动为你调用 applyMiddleware 和 compose。
- 自动启用 Redux DevTools 扩展。

此外，configureStore 还默认添加了一些中间件，每个中间件都有特定的目标。

- redux-thunk 是最常用的中间件，用于处理组件之外的同步和异步逻辑。
- 在开发中，检查常见错误的中间件，如 Mutation 状态或使用不可序列化的值。

这意味着 Store 设置代码本身更短一些，更容易阅读，也意味着你可以在开箱即获得良好的默认行为。使用 configureStore 后最简单的构建方式就变成了：

```js
import { configureStore } from "@reduxjs/toolkit";
import rootReducer from "./reducers";

const store = configureStore({
  reducer: rootReducer,
});

export default store;
```

如果你需要自定义 Store 的设置，你可以通过额外的选项。下面是使用 Redux Toolkit 的热重装示例的样子。

```js
import { configureStore, getDefaultMiddleware } from "@reduxjs/toolkit";

import monitorReducersEnhancer from "./enhancers/monitorReducers";
import loggerMiddleware from "./middleware/logger";
import rootReducer from "./reducers";

export default function configureAppStore(preloadedState) {
  const store = configureStore({
    reducer: rootReducer,
    middleware: [loggerMiddleware, ...getDefaultMiddleware()],
    preloadedState,
    enhancers: [monitorReducersEnhancer],
  });

  if (process.env.NODE_ENV !== "production" && module.hot) {
    module.hot.accept("./reducers", () => store.replaceReducer(rootReducer));
  }

  return store;
}
```

如果你提供了中间件参数，configureStore 将只使用你列出的任何中间件。如果你想让一些自定义的中间件和默认的都在一起，你可以调用 getDefaultMiddleware，并将结果包含在你提供的中间件数组中。

# Writing Reducers

由于 lookup table 的方法很流行，Redux Toolkit 包含了一个类似 Redux 文档中的 createReducer 函数。然而，我们的 createReducer 实用程序有一些特殊的 "魔力"，使其更加出色。它在内部使用了 Immer 库，让你可以编写 "Mutation "一些数据的代码，但实际上是不可改变地应用更新。这使得在 reducer 中不可能意外地 Mutation 状态。一般来说，任何使用 switch 语句的 Redux Reducer 都可以直接转换为使用 createReducer。switch 中的每个 case 都会成为传递给 createReducer 的对象中的一个 key。不可变的更新逻辑，比如扩散对象或复制数组，大概可以直接转换为 "Mutation"。也可以把不可变的更新保持原样，然后返回更新后的副本，也是可以的。

```js
function todosReducer(state = [], action) {
  switch (action.type) {
    case "ADD_TODO": {
      return state.concat(action.payload);
    }
    case "TOGGLE_TODO": {
      const { index } = action.payload;
      return state.map((todo, i) => {
        if (i !== index) return todo;

        return {
          ...todo,
          completed: !todo.completed,
        };
      });
    }
    case "REMOVE_TODO": {
      return state.filter((todo, i) => i !== action.payload.index);
    }
    default:
      return state;
  }
}
```

通过 createReducer，我们可以大大缩短这个例子。

```js
const todosReducer = createReducer([], {
  ADD_TODO: (state, action) => {
    // "mutate" the array by calling push()
    state.push(action.payload);
  },
  TOGGLE_TODO: (state, action) => {
    const todo = state[action.payload.index];
    // "mutate" the object by overwriting a field
    todo.completed = !todo.completed;
  },
  REMOVE_TODO: (state, action) => {
    // Can still return an immutably-updated value if we want to
    return state.filter((todo, i) => i !== action.payload.index);
  },
});
```

当试图更新深度嵌套的状态时，"突变 "状态的能力特别有用。这种复杂而痛苦的代码。

```js
case "UPDATE_VALUE":
  return {
    ...state,
    first: {
      ...state.first,
      second: {
        ...state.first.second,
        [action.someId]: {
          ...state.first.second[action.someId],
          fourth: action.someValue
        }
      }
    }
  }
```

可以简化为只：

```js
updateValue(state, action) {
    const {someId, someValue} = action.payload;
    state.first.second[someId].fourth = someValue;
}
```

在现代 JavaScript 中，有几种合法的方式可以在对象中同时定义键和函数（这并不是 Redux 所特有的），你可以混合和匹配不同的键定义和函数定义。例如，这些都是在对象中定义函数的合法方式。

```js
const keyName = "ADD_TODO4";

const reducerObject = {
    // Explicit quotes for the key name, arrow function for the reducer
    "ADD_TODO1" : (state, action) => { }

    // Bare key with no quotes, function keyword
    ADD_TODO2 : function(state, action){  }

    // Object literal function shorthand
    ADD_TODO3(state, action) { }

    // Computed property
    [keyName] : (state, action) => { }
}
```

# Action Creators

```js
const actionCreator = createAction("SOME_ACTION_TYPE");

const reducer = (state = {}, action) => {
  switch (action.type) {
    // ERROR: this won't work correctly!
    case actionCreator: {
      break;
    }
    // CORRECT: this will work as expected
    case actionCreator.toString(): {
      break;
    }
    // CORRECT: this will also work right
    case actionCreator.type: {
      break;
    }
  }
};
```

# createSlice

Redux 状态通常被组织成切片，由传递给 combineReducers 的 reducer 定义。

```js
import { combineReducers } from "redux";
import usersReducer from "./usersReducer";
import postsReducer from "./postsReducer";

const rootReducer = combineReducers({
  users: usersReducer,
  posts: postsReducer,
});
```

常见的方法是在自己的文件中定义片的 reducer 函数，在第二个文件中定义 actionCreator。因为这两个函数需要引用相同的动作类型，所以通常在第三个文件中定义这些函数，并在两个地方导入。

```js
// postsConstants.js
const CREATE_POST = "CREATE_POST";
const UPDATE_POST = "UPDATE_POST";
const DELETE_POST = "DELETE_POST";

// postsActions.js
import { CREATE_POST, UPDATE_POST, DELETE_POST } from "./postConstants";

export function addPost(id, title) {
  return {
    type: CREATE_POST,
    payload: { id, title },
  };
}

// postsReducer.js
import { CREATE_POST, UPDATE_POST, DELETE_POST } from "./postConstants";

const initialState = [];

export default function postsReducer(state = initialState, action) {
  switch (action.type) {
    case CREATE_POST: {
      // omit implementation
    }
    default:
      return state;
  }
}
```

鸭子文件结构建议将给定分片的所有 Redux 相关逻辑放到一个文件中，像这样。

```js
// postsDuck.js
const CREATE_POST = "CREATE_POST";
const UPDATE_POST = "UPDATE_POST";
const DELETE_POST = "DELETE_POST";

export function addPost(id, title) {
  return {
    type: CREATE_POST,
    payload: { id, title },
  };
}

const initialState = [];

export default function postsReducer(state = initialState, action) {
  switch (action.type) {
    case CREATE_POST: {
      // Omit actual code
      break;
    }
    default:
      return state;
  }
}
```

这简化了处理流程，因为我们不需要多个文件，而且我们可以去掉多余的动作类型常量的导入。但是，我们仍然必须手工编写动作类型和 actionCreator。为了简化这个过程，Redux Toolkit 包含了一个 createSlice 函数，它将根据你提供的 reducer 函数的名称，为你自动生成 action 类型和 actionCreator。

```js
const postsSlice = createSlice({
  name: "posts",
  initialState: [],
  reducers: {
    createPost(state, action) {},
    updatePost(state, action) {},
    deletePost(state, action) {},
  },
});

console.log(postsSlice);
/*
{
    name: 'posts',
    actions : {
        createPost,
        updatePost,
        deletePost,
    },
    reducer
}
*/

const { createPost } = postsSlice.actions;

console.log(createPost({ id: 123, title: "Hello World" }));
// {type : "posts/createPost", payload : {id : 123, title : "Hello World"}}
```

大多数情况下，您会希望定义一个切片，并导出它的动作创建者和还原者。推荐的方法是使用 ES6 的解构和导出语法来实现。

```js
const postsSlice = createSlice({
  name: "posts",
  initialState: [],
  reducers: {
    createPost(state, action) {},
    updatePost(state, action) {},
    deletePost(state, action) {},
  },
});

// Extract the action creators object and the reducer
const { actions, reducer } = postsSlice;
// Extract and export each action creator by name
export const { createPost, updatePost, deletePost } = actions;
// Export the reducer, either as a default or named export
export default reducer;
```
