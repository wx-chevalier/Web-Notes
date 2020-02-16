# Observable

redux-observable 是 redux 一个中间件，使用了 RxJs 来驱动 action 副作用。与其目的类似的有大家比较熟悉的 redux-thunk 和 redux-saga。通过集成 redux-observable，我们可以在 Redux 中使用到 RxJS 所提供的函数响应式编程（FRP）的能力，从而更轻松的管理我们的异步副作用。

![redux-observable 示意图](https://s2.ax1x.com/2019/11/02/KOFJRf.png)

Epic 是 redux-observable 的核心概念和基础类型，几乎承载了 redux-observable 的所有。从形式上看，Epic 是一个函数，其接收一个 action stream，输出一个新的 action stream：

```ts
function (action$: Observable<Action>, state$: StateObservable<State>): Observable<Action>
```

在 redux-observable 的视角下，Redux 作为中央状态收集器，当一个 action 被 dispatch，历经某个同步或者异步任务，将 dispatch 一个新的 action，携带着它的负载（payload）到 reducer，如此反复。这么看的话，Epic 定义了 action 因果关系。

同时，FRP 模式的 RxJS 还带来了如下能力：

- 竞态处理能力
- 声明式地任务处理
- 测试友好
- 组件自治（redux-observable 1. 0 开始支持）

# 传统模式下组件的耦合

在传统的模式下，我们需要面对一个现实，对于状态的获取是**主动式（proactive）**的：

```js
const state = store.getState();
```

亦即我们需要主动取用状态，而无法监听状态变化。因此，在这种模式下，我们组件化开发的思路会是：

- 组件挂载，开启轮询
  - 搜索时，结束上次轮询，构建新的请求参数，开始新的轮询
  - 排序变动时，结束上次轮询，构建新的请求参数，开始新的轮询
  - 分页变动时，结束上次轮询，构建新的请求参数，开始新的轮询
- 组件卸载，结束轮询

在这种思路下，我们撰写搜索，排序，分页等容器时，当容器涉及的取值变动时，不仅需要在状态树上更新这些值，还需要去重启一下轮询。

![状态主动取用](https://s2.ax1x.com/2019/11/03/KX7ZJs.png)

假定我们使用 redux-thunk 来处理副作用，代码大致如下：

```ts
let pollingTimer: number = null;

function fetchUsers(): ThunkResult {
  return (dispatch, getState) => {
    const delay = pollingTimer === null ? 0 : 15 * 1000;
    pollingTimer = setTimeout(() => {
      dispatch({
        type: FETCH_START,
        payload: {}
      });
      const { repo }: { repo: IState } = getState();
      const { pagination, sort, query } = repo;
      // 封装参数
      const param: ISearchParam = {
        // ...
      };
      // 进行请求
      // fetch(param)...
    }, delay);
  };
}

export function polling(): ThunkResult {
  return dispatch => {
    dispatch(stopPolling());
    dispatch({
      type: POLLING_START,
      payload: {}
    });
    dispatch(fetchUsers());
  };
}

export function stopPolling(): IAction {
  clearTimeout(pollingTimer);
  pollingTimer = null;
  return {
    type: POLLING_STOP,
    payload: {}
  };
}

export function changePagination(pagination: IPagination): ThunkResult {
  return dispatch => {
    dispatch({
      type: CHANGE_PAGINATION,
      payload: {
        pagination
      }
    });
    dispatch(polling());
  };
}

export function changeQuery(query: string): ThunkResult {
  return dispatch => {
    dispatch({
      type: CHANGE_QUERY,
      payload: {
        query
      }
    });
    dispatch(polling());
  };
}

export function changeSort(sort: string): ThunkResult {
  return dispatch => {
    dispatch({
      type: CHANGE_SORT,
      payload: {
        sort
      }
    });
    dispatch(polling());
  };
}
```

可以看到，涉及到请求参数的几个组件，如筛选项目，分页，搜索等，当它们 dispatch 了一个 action 修改对应的业务状态后，还需要手动 dispatch 一个重启轮询的 action 结束上一次轮询，开启下一次轮询。

或许这个场景的复杂程度你觉得也还能接受，但是假想我们有一个更大的项目，或者现在的项目未来会扩展得很大，那么组件势必会越来越多，参与协作的开发者也会越来越多。协作的开发者就需要时刻关注到自己撰写的组件是否会是其他开发者撰写的组件的影响因子，如果是的话，影响有多大，又该怎么处理？我们归纳下使用传统模式梳理数据流以及副作用面临的问题：

- 过程式编程，代码啰嗦；
- 竞态处理需要人为地通过标志量等进行控制；
- 组件间耦合大，彼此牵连。

# FRP 模式与组件自治

在 FRP 模式下，遵循 passive 模式，state 应当被观察和响应，而不是主动获取。因此，redux-observable 从 1.0 开始，不再推荐使用 store.getState() 进行状态获取，Epic 有了新的函数签名，第二个参数为 `state$`：

```ts
function (action$: Observable<Action>, state$: StateObservable<State>): Observable<Action>
```

`state$` 的引入，让 redux-observable 达到了它的里程碑，现在，我们能在 Redux 中更进一步地实践 FRP。比如下面这个例子（来源自 redux-observable 官方），当 googleDocument 状态变动时，我们就自动存储 google 文档：

```ts
const autoSaveEpic = (action$, state$) =>
  action$.pipe(
    ofType(AUTO_SAVE_ENABLE),
    exhaustMap(() =>
      state$.pipe(
        pluck("googleDocument"),
        distinctUntilChanged(),
        throttleTime(500, { leading: false, trailing: true }),
        concatMap(googleDocument =>
          saveGoogleDoc(googleDocument).pipe(
            map(() => saveGoogleDocFulfilled()),
            catchError(e => of(saveGoogleDocRejected(e)))
          )
        ),
        takeUntil(action$.pipe(ofType(AUTO_SAVE_DISABLE)))
      )
    )
  );
```

回过头来，我们还可以将列表页的需求概括为：

- 间隔一段时间轮询数据列表
- 参数（排序，分页等）变动时，重新发起轮询
- 主动进行搜索时，重新发起轮询
- 组件卸载时结束轮询

在 FRP 模式下，我们定义一个轮询 epic：

```ts
const pollingEpic: Epic = (action$, state$) => {
  const stopPolling$ = action$.ofType(POLLING_STOP);
  const params$: Observable<ISearchParam> = state$.pipe(
    map(({ user }: { user: IState }) => {
      const { pagination, sort, query } = user;
      return {
        q: `${query ? query + " " : ""}language:javascript`,
        language: "javascript",
        page: pagination.page,
        per_page: pagination.pageSize,
        sort,
        order: EOrder.Desc
      };
    }),
    distinctUntilChanged(isEqual)
  );

  return action$.pipe(
    ofType(LISTEN_POLLING_START, SEARCH),
    combineLatest(params$, (action, params) => params),
    switchMap((params: ISearchParam) => {
      const polling$ = merge(
        interval(15 * 1000).pipe(
          takeUntil(stopPolling$),
          startWith(null),
          switchMap(() =>
            from(fetch(params)).pipe(
              map(({ data }: ISearchResp) => ({
                type: FETCH_SUCCESS,
                payload: {
                  total: data.total_count,
                  list: data.items
                }
              })),
              startWith({
                type: FETCH_START,
                payload: {}
              }),
              catchError((error: AxiosError) =>
                of({
                  type: FETCH_ERROR,
                  payload: {
                    error: error.response.statusText
                  }
                })
              )
            )
          ),
          startWith({
            type: POLLING_START,
            payload: {}
          })
        )
      );
      return polling$;
    })
  );
};
```

首先我们声明轮询结束流，当轮询结束流有值产生时，轮询会被终止：

```ts
const stopPolling$ = action$.ofType(POLLING_STOP);
```

参数来源于状态，由于现在状态可观测，我们可以从状态流 `state$` 派发一个下游：参数流：

```ts
const params$: Observable<ISearchParam> = state$.pipe(
  map(({ user }: { user: IState }) => {
    const { pagination, sort, query } = user;
    return {
      // 构造参数
    };
  }),
  distinctUntilChanged(isEqual)
);
```

我们预期参数流都是最新的参数，因此使用了 dinstinctUntilChanged(isEqual) 来判断两次参数的异同。主动进行搜索，或者参数变动时，将创建轮询流（借助到了 combineLatest operator），最终，新的 action 仰仗于数据拉取结果：

```ts
return action$.pipe(
  ofType(LISTEN_POLLING_START, SEARCH),
  combineLatest(params$, (action, params) => params),
  switchMap((params: ISearchParam) => {
    const polling$ = merge(
      interval(15 * 1000).pipe(
        takeUntil(stopPolling$),
        // 自动开始轮询
        startWith(null),
        switchMap(() =>
          from(fetch(params)).pipe(
            map(({ data }: ISearchResp) => {
              // ... 处理响应
            }),
            startWith({
              type: FETCH_START,
              payload: {}
            }),
            catchError((error: AxiosError) => {
              // ...
            })
          )
        ),
        startWith({
          type: POLLING_START,
          payload: {}
        })
      )
    );
    return polling$;
  })
);
```

我们现在只需要在数据表格这个容器组件挂载时 dispatch 一个 LISTEN_POLLING_START 事件，即可开始我们的轮询，在其对应的 Epic 中，它完全知道什么时候去结束轮询，什么时候去重启轮询。我们的分页组件，排序选择组件都不再需要关心重启轮询这个需求。例如分页组件的状态变动的 action 就只需要修改状态即可，而不用再去关注轮询：

```ts
export function changePagination(pagination: IPagination): IAction {
  return {
    type: CHANGE_PAGINATION,
    payload: {
      pagination
    }
  };
}
```

在 FRP 模式下，passive 模型让我们观测了 state，声明了轮询的诱因，让轮询收归到了数据表格组件中，解除了轮询和数据表格与分页，搜索，排序等组件的耦合。实现了数据表格的组件自治。

![自治的组件](https://s2.ax1x.com/2019/11/03/KXbVvq.png)

总结，利用 FRP 进行副作用处理带来了：

- 声明式地描述异步任务，代码简洁；

- 使用 switchMap operator 处理竞态任务；

- 尽可能减少组件耦合，来达到组件自治。利于多人协作的大型工程。
