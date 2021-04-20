# Redux Toolkit

Redux Toolkit 包旨在成为编写 Redux 逻辑的标准方法。它最初的创建是为了帮助解决关于 Redux 的三个常见的担忧。

- "配置一个 Redux Store 太复杂了"
- "我必须添加很多包才能让 Redux 做任何有用的事情"
- "Redux 需要太多的模板代码"

我们不可能解决所有的用例，但是本着 create-react-app 和 apollo-boost 的精神，我们可以尝试提供一些工具，对设置过程进行抽象，并处理最常见的用例，同时包含一些有用的实用工具，让用户简化他们的应用代码。正因为如此，这个软件包的范围被刻意限制。它没有涉及 "可重用封装的 Redux 模块"、数据缓存、文件夹或文件结构、管理存储中的实体关系等概念。尽管如此，这些工具应该对所有 Redux 用户有益。无论你是一个全新的 Redux 用户建立你的第一个项目，还是一个有经验的用户想要简化现有的应用程序，Redux Toolkit 都可以帮助你让你的 Redux 代码变得更好。

Redux Toolkit 包含这些 API。

- configureStore(): 包装 createStore，提供简化的配置选项和良好的默认值。它可以自动组合你的分片还原器，添加你提供的任何 Redux 中间件，默认包含 redux-thunk，并能使用 Redux DevTools 扩展。
- createReducer(): 可以让你为 case reducer 函数提供一个动作类型的查找表，而不是编写 switch 语句。此外，它还自动使用 immer 库，让你用正常的 Mutation 代码编写更简单的不可变更新，比如 state.todos[3].completed = true。
- createAction(): 为给定的动作类型字符串生成一个动作创建函数。函数本身定义了 toString()，所以可以用它来代替类型常量。
- createSlice(): 接受一个减速函数对象、一个片名和一个初始状态值，并自动生成一个具有相应 actionCreator 和动作类型的片减速函数。
- createAsyncThunk: 接受一个动作类型字符串和一个返回承诺的函数，并根据该承诺生成一个 thunk，调度待定/已完成/已拒绝的动作类型。
- createEntityAdapter: 生成一组可重用的还原器和选择器，以管理存储中的标准化数据。
- createSelector: Reselect 库中的 createSelector 实用程序，为了方便使用，重新导出。

# 典型使用

## 以评论为例

典型的库使用方式如下：

```ts
// store.ts
import { configureStore } from "@reduxjs/toolkit";

import rootReducer from "./rootReducer";

const store = configureStore({
  reducer: rootReducer,
});

if (process.env.NODE_ENV === "development" && module.hot) {
  module.hot.accept("./rootReducer", () => {
    const newRootReducer = require("./rootReducer").default;
    store.replaceReducer(newRootReducer);
  });
}

export type AppDispatch = typeof store.dispatch;

export default store;

// commentsSlice
import { createSlice, PayloadAction } from "@reduxjs/toolkit";

import { Comment, getComments, Issue } from "api/githubAPI";
import { AppThunk } from "app/store";

interface CommentsState {
  commentsByIssue: Record<number, Comment[] | undefined>;
  loading: boolean;
  error: string | null;
}

interface CommentLoaded {
  issueId: number;
  comments: Comment[];
}

const initialState: CommentsState = {
  commentsByIssue: {},
  loading: false,
  error: null,
};

const comments = createSlice({
  name: "comments",
  initialState,
  reducers: {
    getCommentsStart(state) {
      state.loading = true;
      state.error = null;
    },
    getCommentsSuccess(state, action: PayloadAction<CommentLoaded>) {
      const { comments, issueId } = action.payload;
      state.commentsByIssue[issueId] = comments;
      state.loading = false;
      state.error = null;
    },
    getCommentsFailure(state, action: PayloadAction<string>) {
      state.loading = false;
      state.error = action.payload;
    },
  },
});

export const {
  getCommentsStart,
  getCommentsSuccess,
  getCommentsFailure,
} = comments.actions;
export default comments.reducer;

export const fetchComments = (issue: Issue): AppThunk => async (dispatch) => {
  try {
    dispatch(getCommentsStart());
    const comments = await getComments(issue.comments_url);
    dispatch(getCommentsSuccess({ issueId: issue.number, comments }));
  } catch (err) {
    dispatch(getCommentsFailure(err));
  }
};
```

## Todos

```js
import {
  createSlice,
  createSelector,
  createAsyncThunk,
  createEntityAdapter,
} from "@reduxjs/toolkit";
import { client } from "../../api/client";
import { StatusFilters } from "../filters/filtersSlice";

const todosAdapter = createEntityAdapter();

const initialState = todosAdapter.getInitialState({
  status: "idle",
});

// Thunk functions
export const fetchTodos = createAsyncThunk("todos/fetchTodos", async () => {
  const response = await client.get("/fakeApi/todos");
  return response.todos;
});

export const saveNewTodo = createAsyncThunk(
  "todos/saveNewTodo",
  async (text) => {
    const initialTodo = { text };
    const response = await client.post("/fakeApi/todos", { todo: initialTodo });
    return response.todo;
  }
);

const todosSlice = createSlice({
  name: "todos",
  initialState,
  reducers: {
    todoToggled(state, action) {
      const todoId = action.payload;
      const todo = state.entities[todoId];
      todo.completed = !todo.completed;
    },
    todoColorSelected: {
      reducer(state, action) {
        const { color, todoId } = action.payload;
        state.entities[todoId].color = color;
      },
      prepare(todoId, color) {
        return {
          payload: { todoId, color },
        };
      },
    },
    todoDeleted: todosAdapter.removeOne,
    allTodosCompleted(state, action) {
      Object.values(state.entities).forEach((todo) => {
        todo.completed = true;
      });
    },
    completedTodosCleared(state, action) {
      const completedIds = Object.values(state.entities)
        .filter((todo) => todo.completed)
        .map((todo) => todo.id);
      todosAdapter.removeMany(state, completedIds);
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchTodos.pending, (state, action) => {
        state.status = "loading";
      })
      .addCase(fetchTodos.fulfilled, (state, action) => {
        todosAdapter.setAll(state, action.payload);
        state.status = "idle";
      })
      .addCase(saveNewTodo.fulfilled, todosAdapter.addOne);
  },
});

export const {
  allTodosCompleted,
  completedTodosCleared,
  todoAdded,
  todoColorSelected,
  todoDeleted,
  todoToggled,
} = todosSlice.actions;

export default todosSlice.reducer;

export const {
  selectAll: selectTodos,
  selectById: selectTodoById,
} = todosAdapter.getSelectors((state) => state.todos);

export const selectTodoIds = createSelector(
  // First, pass one or more "input selector" functions:
  selectTodos,
  // Then, an "output selector" that receives all the input results as arguments
  // and returns a final result value
  (todos) => todos.map((todo) => todo.id)
);

export const selectFilteredTodos = createSelector(
  // First input selector: all todos
  selectTodos,
  // Second input selector: all filter values
  (state) => state.filters,
  // Output selector: receives both values
  (todos, filters) => {
    const { status, colors } = filters;
    const showAllCompletions = status === StatusFilters.All;
    if (showAllCompletions && colors.length === 0) {
      return todos;
    }

    const completedStatus = status === StatusFilters.Completed;
    // Return either active or completed todos based on filter
    return todos.filter((todo) => {
      const statusMatches =
        showAllCompletions || todo.completed === completedStatus;
      const colorMatches = colors.length === 0 || colors.includes(todo.color);
      return statusMatches && colorMatches;
    });
  }
);

export const selectFilteredTodoIds = createSelector(
  // Pass our other memoized selector as an input
  selectFilteredTodos,
  // And derive data in the output selector
  (filteredTodos) => filteredTodos.map((todo) => todo.id)
);
```
