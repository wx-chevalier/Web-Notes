# Redux & TypeScript

# 中间件

## Thunk

```ts
import { Action, ActionCreator, Dispatch } from 'redux';
import { ThunkAction } from 'redux-thunk';

// Redux action
const reduxAction: ActionCreator<Action> = (text: string) => {
  return {
    type: SET_TEXT,
    text
  };
};

// Redux-Thunk action
const thunkAction: ActionCreator<ThunkAction<Action, IState, void>> = (
  text: string
) => {
  return (dispatch: Dispatch<IState>): Action => {
    return dispatch({
      type: SET_TEXT,
      text
    });
  };
};

// Async Redux-Thunk action
const asyncThinkAction: ActionCreator<
  ThunkAction<Promise<Action>, IState, void>
> = () => {
  return async (dispatch: Dispatch<IState>): Promise<Action> => {
    try {
      const text = await Api.call();
      return dispatch({
        type: SET_TEXT,
        text
      });
    } catch (e) {}
  };
};
```

# 链接

- https://redux.js.org/recipes/usage-with-typescript
