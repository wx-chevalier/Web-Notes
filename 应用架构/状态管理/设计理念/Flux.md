# Flux

Flux 是用于构建用户交互界面的架构模式，最早由 Facebook 在 f8 大会上提出，自此之后，很多的公司开始尝试这种概念并且貌似这是个很不错的构建前端应用的模式。Flux 经常和 React 一起搭配使用，笔者本身在日常的工作中也是使用 React+Flux 的搭配，给自己带来了很大的遍历。

![](https://camo.githubusercontent.com/9b783850d870f67dffe5d9bc72445eb65049c4bb/687474703a2f2f6b726173696d697274736f6e65762e636f6d2f626c6f672f61727469636c65732f666c7578696e792f666c7578696e795f62617369635f666c75785f6172636869746563747572652e6a7067)

Flux 中最主要的角色为 Dispatcher，它是整个系统中所有的 Events 的中转站。Dispatcher 负责接收我们称之为 Actions 的消息通知并且将其转发给所有的 Stores。每个 Store 实例本身来决定是否对该 Action 感兴趣并且是否相应地改变其内部的状态。当我们将 Flux 与熟知的 MVC 相比较，你就会发现 Store 在某些意义上很类似于 Model，二者都是用于存放状态与状态中的改变。而在系统中，除了 View 层的用户交互可能触发 Actions 之外，其他的类似于 Service 层也可能触发 Actions，譬如在某个 HTTP 请求完成之后，请求模块也会发出相应类型的 Action 来触发 Store 中对于状态的变更。而在 Flux 中有个最大的陷阱就是对于数据流的破坏，我们可以在 Views 中访问 Store 中的数据，但是我们不应该在 Views 中修改任何 Store 的内部状态，所有对于状态的修改都应该通过 Actions 进行。作者在这里介绍了其维护的某个 Flux 变种的项目[fluxiny](https://github.com/krasimir/fluxiny)。

## Dispatcher

![](https://camo.githubusercontent.com/7a8b3c7a3e73c1468c0f95addcd6d7994f085b7b/687474703a2f2f6b726173696d697274736f6e65762e636f6d2f626c6f672f61727469636c65732f666c7578696e792f666c7578696e795f7468655f646973706174636865722e6a7067)

大部分情况下我们在系统中只需要单个的 Dispatcher，它是类似于粘合剂的角色将系统的其他部分有机结合在一起。Dispatcher 一般而言有两个输入:Actions 与 Stores。其中 Actions 需要被直接转发给 Stores，因此我们并不需要记录 Actions 的对象，而 Stores 的引用则需要保存在 Dispatcher 中。基于这个考虑，我们可以编写一个简单的 Dispatcher:

```js
const Dispatcher = function() {
  return {
    _stores: [],
    register: function(store) {
      this._stores.push({ store: store });
    },
    dispatch: function(action) {
      if (this._stores.length > 0) {
        this._stores.forEach(function(entry) {
          entry.store.update(action);
        });
      }
    }
  };
};
```

在上述实现中我们会发现，每个传入的`Store`对象都应该拥有一个`update`方法，因此我们在进行 Store 的注册时也要来检测该方法是否存在:

```js
register: function (store) {
  if (!store || !store.update) {
    throw new Error('You should provide a store that has an `update` method.');
  } else {
    this._stores.push({ store: store });
  }
}
```

在完成了对于 Store 的注册之后，下一步我们就是需要将 View 与 Store 关联起来，从而在 Store 发生改变的时候能够触发 View 的重渲染:

![](https://camo.githubusercontent.com/118f53e607a36aa58aaffc565fc68519555c5f99/687474703a2f2f6b726173696d697274736f6e65762e636f6d2f626c6f672f61727469636c65732f666c7578696e792f666c7578696e795f73746f72655f6368616e67655f766965772e6a7067)

很多 flux 的实现中都会使用如下的辅助函数:

```js
Framework.attachToStore(view, store);
```

不过作者并不是很喜欢这种方式，这样这样会要求 View 中需要调用某个具体的 API，换言之，在 View 中就需要了解到 Store 的实现细节，而使得 View 与 Store 又陷入了紧耦合的境地。当开发者打算切换到其他的 Flux 框架时就不得不修改每个 View 中的相对应的 API，那又会增加项目的复杂度。另一种可选的方式就是使用`React mixins`:

```js
const View = React.createClass({
  mixins: [Framework.attachToStore(store)]
  ...
});
```

使用 `mixin` 是个不错的修改现有的 React 组件而不影响其原有代码的方式，不过这种方式的缺陷在于它不能够以一种 Predictable 的方式去修改组件，用户的可控性较低。还有一种方式就是使用`React context`，这种方式允许我们将值跨层次地传递给 React 组件树中的组件而不需要了解它们处于组件树中的哪个层级。这种方式和 mixins 可能有相同的问题，开发者并不知道该数据从何而来。作者最终选用的方式即是上面提及到的 Higher-Order Components 模式，它建立了一个包裹函数来对现有组件进行重新打包处理:

```js
function attachToStore(Component, store, consumer) {
  const Wrapper = React.createClass({
    getInitialState() {
      return consumer(this.props, store);
    },
    componentDidMount() {
      store.onChangeEvent(this._handleStoreChange);
    },
    componentWillUnmount() {
      store.offChangeEvent(this._handleStoreChange);
    },
    _handleStoreChange() {
      if (this.isMounted()) {
        this.setState(consumer(this.props, store));
      }
    },
    render() {
      return <Component {...this.props} {...this.state} />;
    }
  });
  return Wrapper;
}
```

其中`Component`代指我们需要附着到`Store`中的 View，而`consumer`则是应该被传递给 View 的 Store 中的部分的状态，简单的用法为:

```js
class MyView extends React.Component {
  // ...
}

ProfilePage = connectToStores(MyView, store, (props, store) => ({
  data: store.get("key")
}));
```

这种模式的优势在于其有效地分割了各个模块间的职责，在该模式中 Store 并不需要主动地推送消息给 View，而主需要简单地修改数据然后广播说我的状态已经更新了，然后由 HOC 去主动地抓取数据。那么在作者具体的实现中，就是选用了 HOC 模式:

```js
register: function (store) {
  if (!store || !store.update) {
    throw new Error('You should provide a store that has an `update` method.');
  } else {
    const consumers = [];
    const change = function () {
      consumers.forEach(function (l) {
        l(store);
      });
    };
    const subscribe = function (consumer) {
      consumers.push(consumer);
    };

    this._stores.push({ store: store, change: change });
    return subscribe;
  }
  return false;
},
dispatch: function (action) {
  if (this._stores.length > 0) {
    this._stores.forEach(function (entry) {
      entry.store.update(action, entry.change);
    });
  }
}
```

![](https://camo.githubusercontent.com/d5fed532a51ad739a34e0146a1dd5dd0855849ce/687474703a2f2f6b726173696d697274736f6e65762e636f6d2f626c6f672f61727469636c65732f666c7578696e792f666c7578696e795f73746f72655f766965772e6a7067)

另一个常见的用户场景就是我们需要为界面提供一些默认的状态，换言之当每个`consumer`注册的时候需要提供一些初始化的默认数据:

```const subscribe = function (consumer, noInit) {
  consumers.push(consumer);
  !noInit ? consumer(store) : null;
};
```

综上所述，最终的 Dispatcher 函数如下所示:

```js
const Dispatcher = function() {
  return {
    _stores: [],
    register: function(store) {
      if (!store || !store.update) {
        throw new Error(
          "You should provide a store that has an `update` method."
        );
      } else {
        const consumers = [];
        const change = function() {
          consumers.forEach(function(l) {
            l(store);
          });
        };
        const subscribe = function(consumer, noInit) {
          consumers.push(consumer);
          !noInit ? consumer(store) : null;
        };

        this._stores.push({ store: store, change: change });
        return subscribe;
      }
      return false;
    },
    dispatch: function(action) {
      if (this._stores.length > 0) {
        this._stores.forEach(function(entry) {
          entry.store.update(action, entry.change);
        });
      }
    }
  };
};
```

## Actions

Actions 就是在系统中各个模块之间传递的消息载体，作者觉得应该使用标准的 Flux Action 模式:

```json
{
  "type": "USER_LOGIN_REQUEST",
  "payload": {
    "username": "...",
    "password": "..."
  }
}
```

其中的`type`属性表明该 Action 所代表的操作而`payload`中包含了相关的数据。另外，在某些情况下 Action 中没有带有 Payload,因此可以使用 Partial Application 方式来创建标准的 Action 请求:

```js
const createAction = function(type) {
  if (!type) {
    throw new Error("Please, provide action's type.");
  } else {
    return function(payload) {
      return dispatcher.dispatch({ type: type, payload: payload });
    };
  }
};
```

![](https://camo.githubusercontent.com/4702298796dd4f89c462ee2058e1fcff3ad3a926/687474703a2f2f6b726173696d697274736f6e65762e636f6d2f626c6f672f61727469636c65732f666c7578696e792f666c7578696e795f616374696f6e5f63726561746f722e6a7067)

## Final Code

上文我们已经了解了核心的 Dispatcher 与 Action 的构造过程，那么在这里我们将这二者组合起来:

```js
const createSubscriber = function(store) {
  return dispatcher.register(store);
};
```

并且为了不直接暴露 dispatcher 对象，我们可以允许用户使用`createAction`与`createSubscriber`这两个函数:

```js
const Dispatcher = function() {
  return {
    _stores: [],
    register: function(store) {
      if (!store || !store.update) {
        throw new Error(
          "You should provide a store that has an `update` method."
        );
      } else {
        const consumers = [];
        const change = function() {
          consumers.forEach(function(l) {
            l(store);
          });
        };
        const subscribe = function(consumer, noInit) {
          consumers.push(consumer);
          !noInit ? consumer(store) : null;
        };

        this._stores.push({ store: store, change: change });
        return subscribe;
      }
      return false;
    },
    dispatch: function(action) {
      if (this._stores.length > 0) {
        this._stores.forEach(function(entry) {
          entry.store.update(action, entry.change);
        });
      }
    }
  };
};

module.exports = {
  create: function() {
    const dispatcher = Dispatcher();

    return {
      createAction: function(type) {
        if (!type) {
          throw new Error("Please, provide action's type.");
        } else {
          return function(payload) {
            return dispatcher.dispatch({ type: type, payload: payload });
          };
        }
      },
      createSubscriber: function(store) {
        return dispatcher.register(store);
      }
    };
  }
};
```
