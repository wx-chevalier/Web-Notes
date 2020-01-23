# Flux 单向数据流架构

# 双向数据绑定的不足

This means that one change (a user input or API response) can affect the state of an application in many places in the code — for example, two-way data binding. That can be hard to maintain and debug.

Facebook 强调，双向数据绑定极不利于代码的扩展与维护。从具体的代码实现角度来看，双向数据绑定会导致更改的不可预期性(UnPredictable)，就好像 Angular 利用 Dirty Checking 来进行是否需要重新渲染的检测，这导致了应用的缓慢，简直就是来砸场子的。而在采用了单向数据流之后，整个应用状态会变得可预测(Predictable)，也能很好地了解当状态发生变化时到底会有多少的组件发生变化。另一方面，相对集中地状态管理，也有助于你不同的组件之间进行信息交互或者状态共享，特别是像 Redux 这种强调 Single Store 与 SIngle State Tree 的状态管理模式，能够保证以统一的方式对于应用的状态进行修改，并且 Immutable 的概念引入使得状态变得可回溯。譬如 Facebook 在[Flux Overview](https://facebook.github.io/flux/docs/overview.html)中举的例子，当我们希望在一个界面上同时展示未读信息列表与未读信息的总数目的时候，对于 `MV*`就有点恶心了，特别是当这两个组件不在同一个 ViewModel/Controller 中的时候。一旦我们将某个未读信息标识为已读，会引起控制已读信息、未读信息、未读信息总数目等等一系列模型的更新。特别是很多时候为了方便我们可能在每个 ViewModel/Controller 都会设置一个数据副本，这会导致依赖连锁更新，最终导致不可预测的结果与性能损耗。而在 Flux 中这种依赖是反转的，Store 接收到更新的 Action 请求之后对数据进行统一的更新并且通知各个 View，而不是依赖于各个独立的 ViewModel/Controller 所谓的一致性更新。从职责划分的角度来看，除了 Store 之外的任何模块其实都不知道应该如何处理数据，这就保证了合理的职责分割。这种模式下，当我们创建新项目时，项目复杂度的增长瓶颈也就会更高，不同于传统的 View 与 ViewLogic 之间的绑定，控制流被独立处理，当我们添加新的特性，新的数据，新的界面，新的逻辑处理模块时，并不会导致原有模块的复杂度增加，从而使得整个逻辑更加清晰可控。

这里还需要提及一下，很多人应该是从 React 开始认知到单向数据流这种架构模式的，而当时 Angular 1 的缓慢与性能之差令人发指，但是譬如 Vue 与 Angular 2 的性能就非常优秀。借用 Vue.js 官方的说法，
The virtual-DOM approach provides a functional way to describe your view at any point of time, which is really nice. Because it doesn’t use observables and re-renders the entire app on every update, the view is by definition guaranteed to be in sync with the data. It also opens up possibilities to isomorphic JavaScript applications.
Instead of a Virtual DOM, Vue.js uses the actual DOM as the template and keeps references to actual nodes for data bindings. This limits Vue.js to environments where DOM is present. However, contrary to the common misconception that Virtual-DOM makes React faster than anything else, Vue.js actually out-performs React when it comes to hot updates, and requires almost no hand-tuned optimization. With React, you need to implementshouldComponentUpdate everywhere and use immutable data structures to achieve fully optimized re-renders.

总而言之，笔者认为双向数据流与单向数据流相比，性能上孰优孰劣尚无定论，最大的区别在于单向数据流与双向数据流相比有更好地可控性，这一点在上文提及的函数响应式编程中也有体现。若论快速开发，笔者感觉双向数据绑定略胜一筹，毕竟这种 View 与 ViewModel/ViewLogic 之间的直接绑定直观便捷。而如果是注重于全局的状态管理，希望维护耦合程度较低、可测试性/可扩展性较高的代码，那么还是单向数据流，即 Unidirectional Architecture 较为合适。一家之言，欢迎讨论。

# Flux: 数据流驱动的页面

Flux 不能算是绝对的先行者，但是在 Unidirectional Architecture 中却是最富盛名的一个，也是很多人接触到的第一个 Unidirectional Architecture。Flux 主要由以下几个部分构成：

- Stores:存放业务数据和应用状态，一个 Flux 中可能存在多个 Stores
- View:层次化组合的 React 组件
- Actions:用户输入之后触发 View 发出的事件
- Dispatcher:负责分发 Actions

![](https://coding.net/u/hoteam/p/Cache/git/raw/master/2016/7/2/923C026D-DCF6-49F1-932E-88A632578068.png)
根据上述流程，我们可知 Flux 模式的特性为：

- Dispatcher: Event Bus 中设置有一个单例的 Dispatcher，很多 Flux 的变种都移除了 Dispatcher 依赖。

- 只有 View 使用可组合的组件: 在 Flux 中只有 React 的组件可以进行层次化组合，而 Stores 与 Actions 都不可以进行层次化组合。React 组件与 Flux 一般是松耦合的，因此 Flux 并不是 Fractal，Dispatcher 与 Stores 可以被看做 Orchestrator。

- 用户事件响应在渲染时声明: 在 React 的 `render()`  函数中，即负责响应用户交互，也负责注册用户事件的处理器

下面我们来看一个具体的代码对比，首先是以经典的 Cocoa 风格编写一个简单的计数器按钮:

```ojc
class ModelCounter

    constructor: (@value=1) ->
    increaseValue: (delta) =>
        @value += delta

class ControllerCounter

    constructor: (opts) ->
        @model_counter = opts.model_counter
        @observers = []

    getValue: => @model_counter.value

    increaseValue: (delta) =>
        @model_counter.increaseValue(delta)
        @notifyObservers()

    notifyObservers: =>
        obj.notify(this) for obj in @observers

    registerObserver: (observer) =>
        @observers.push(observer)


class ViewCounterButton

    constructor: (opts) ->
        @controller_counter = opts.controller_counter
        @button_class = opts.button_class or 'button_counter'
        @controller_counter.registerObserver(this)

    render: =>
        elm = $("<button class=\"#{@button_class}\">
                #{@controller_counter.getValue()}</button>")
        elm.click =>
            @controller_counter.increaseValue(1)
        return elm

    notify: =>
        $("button.#{@button_class}").replaceWith(=> @render())
```

上述代码逻辑用上文提及的 MVC 模式图演示就是:

![](https://coding.net/u/hoteam/p/Cache/git/raw/master/2016/7/2/1-wjSds7V7Q2jqC7AqkTK8hg.gif)

而如果用 Flux 模式实现，会是下面这个样子:

```sh
# Store
class CounterStore extends EventEmitter

    constructor: ->
        @count = 0
        @dispatchToken = @registerToDispatcher()

    increaseValue: (delta) ->
        @count += 1


    getCount: ->
        return @count

    registerToDispatcher: ->
        CounterDispatcher.register((payload) =>
            switch payload.type
                when ActionTypes.INCREASE_COUNT
                    @increaseValue(payload.delta)
        )


# Action
class CounterActions

    @increaseCount: (delta) ->
        CounterDispatcher.handleViewAction({
            'type': ActionTypes.INCREASE_COUNT
            'delta': delta
        })

# View
CounterButton = React.createClass(

    getInitialState: ->
        return {'count': 0}

    _onChange: ->
        @setState({
            count: CounterStore.getCount()
        })

    componentDidMount: ->
        CounterStore.addListener('CHANGE', @_onChange)

    componentWillUnmount: ->
        CounterStore.removeListener('CHANGE', @_onChange)

    render: ->
        return React.DOM.button({'className': @prop.class}, @state.value)
)
```

其数据流图为:

![](https://coding.net/u/hoteam/p/Cache/git/raw/master/2016/7/2/1-C1WAATMd5gagQXy73bPEzw.gif)

## Redux: 集中式的状态管理

Redux 是 Flux 的所有变种中最为出色的一个，并且也是当前 Web 领域主流的状态管理工具，其独创的理念与功能深刻影响了 GUI 应用程序架构中的状态管理的思想。Redux 将 Flux 中单例的 Dispatcher 替换为了单例的 Store，即也是其最大的特性，集中式的状态管理。并且 Store 的定义也不是从零开始单独定义，而是基于多个 Reducer 的组合，可以把 Reducer 看做 Store Factory。Redux 的重要组成部分包括:

- Singleton Store:管理应用中的状态，并且提供了一个`dispatch(action)`函数。

- Provider:用于监听 Store 的变化并且连接像 React、Angular 这样的 UI 框架

- Actions:基于用户输入创建的分发给 Reducer 的事件

- Reducers:用于响应 Actions 并且更新全局状态树的纯函数

![](https://coding.net/u/hoteam/p/Cache/git/raw/master/2016/7/2/EE52C4A6-0755-47D9-9A4B-70080E177869.png)
根据上述流程，我们可知 Redux 模式的特性为：

- 以工厂模式组装 Stores: Redux 允许我以`createStore()`函数加上一系列组合好的 Reducer 函数来创建 Store 实例，还有另一个`applyMiddleware()`函数可以允许在`dispatch()`函数执行前后链式调用一系列中间件。

- Providers: Redux 并不特定地需要何种 UI 框架，可以与 Angular、React 等等很多 UI 框架协同工作。Redux 并不是 Fractal，一般来说 Store 被视作 Orchestrator。

- User Event 处理器即可以选择在渲染函数中声明，也可以在其他地方进行声明。

## Model-View-Update

又被称作[Elm Architecture](https://github.com/evancz/elm-architecture-tutorial/)，上面所讲的 Redux 就是受到 Elm 的启发演化而来，因此 MVU 与 Redux 之间有很多的相通之处。MVU 使用函数式编程语言 Elm 作为其底层开发语言，因此该架构可以被看做更纯粹的函数式架构。MVU 中的基本组成部分有:

- Model:定义状态数据结构的类型
- View:纯函数，将状态渲染为界面
- Actions:以 Mailbox 的方式传递用户事件的载体
- Update:用于更新状态的纯函数

![](https://coding.net/u/hoteam/p/Cache/git/raw/master/2016/7/2/mvu-unidir-ui-arch.jpg)
根据上述流程，我们可知 Elm 模式的特性为：

- 到处可见的层次化组合:Redux 只是在 View 层允许将组件进行层次化组合，而 MVU 中在 Model 与 Update 函数中也允许进行层次化组合，甚至 Actions 都可以包含内嵌的子 Action
- Elm 属于 Fractal 架构:因为 Elm 中所有的模块组件都支持层次化组合，即都可以被单独地导出使用

## Model-View-Intent

MVI 是一个基于[RxJS](https://github.com/Reactive-Extensions/RxJS)的响应式单向数据流架构。MVI 也是[Cycle.js](http://cycle.js.org/)的首选架构，主要由 Observable 事件流对象与处理函数组成。其主要的组成部分包括:

- Intent:Observable 提供的将用户事件转化为 Action 的函数

- Model:Observable 提供的将 Action 转化为可观测的 State 的函数

- View:将状态渲染为用户界面的函数

- Custom Element:类似于 React Component 那样的界面组件

![](http://staltz.com/img/mvi-unidir-ui-arch.jpg)

根据上述流程，我们可知 MVI 模式的特性为：

- 重度依赖于 Observables:架构中的每个部分都会被转化为 Observable 事件流

- Intent:不同于 Flux 或者 Redux，MVI 中的 Actions 并没有直接传送给 Dispatcher 或者 Store，而是交于正在监听的 Model

- 彻底的响应式，并且只要所有的组件都遵循 MVI 模式就能保证整体架构的 fractal 特性
