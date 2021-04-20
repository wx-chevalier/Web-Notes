# 状态管理

记得上次面试的时候，有人问我怎么看待全栈开发这个概念，笔者一直觉得，对于小团队与较简单的业务逻辑，全栈可以极大地提高产品开发效率。但是所谓磨刀不误砍柴工，随着对性能、清晰可维护的代码架构的需求日渐提升，类似于 Meteor 这样所谓的 Isomorphic 全栈架构反而成了一种阻碍，大大增加整个产品架构的复杂度。其中一个核心的 Issue 就是在于当你将前后端的状态无差别的处理，而不进行任何分割的时候，你来自于 Domain/DataBase/Server/UI 的状态迅猛增长，最终将你的代码变成一团乱麻。而作为全栈开发者，应该如何应对这种复杂性的陡升呢？还是需要在所谓的客户端与服务端之间划分一个明确的状态界限，并且以 API Provider 与 Consumer 的方式将客户端与服务端进行解耦，这也符合 SOLID 原则，每个系统内部应该尽量少的了解外部系统的细节。

# What is State? | 何谓状态

一言以蔽之，状态就是你应用中流动的数据。在工程师们提出了 `State` 这个概念之后，每个人都对它有自己独特的理解，特别是随着 JavaScript 富客户端应用的爆炸式增长该词也被赋予了各式各样的含义，让人们无所适从。State 是对于你应用当前的属性、配置或者一些定量特征的总结。具体而言，譬如用户的提示语言，游戏中的计时器或者某个组件的可见性。另一方面，状态也代表着服务端的缓存、或者不同用户存放于数据库中的数据，这也是一种状态。

实际上，任何应用中都不会只存在某种单一的状态，状态以不同的形式出现在应用的不同层级，我们首先要做的就是搞清楚应该如何区分这些状态，并且应该如何因地制宜地处理这些状态。

很多的开发者初期会多使用本地状态，即把数据存放在组件本身，那么在业务逻辑演化地过程中，不可避免地会导致应用的复杂度增加。以评论组件为例，如果我们需要将数据从 App 组件移至 CommentItem 组件，则必须在 CommentItem 之前先发送至 CommentList。从 CommentItem 引发要由 App 组件处理的事件时，这更加麻烦。当您尝试将另一个孩子添加到 CommentItem 时，情况会变得更糟。可能是 CommentButton 组件。这意味着当单击按钮时，您必须告诉 CommentItem，它将告诉 CommentList，最后是 App。试图说明这一点已经让我头疼，然后考虑何时必须在实际项目中实现它。您可能会想方设法保留可能起作用的每个组件的本地状态。问题是，您将轻易地了解存在的内容以及在给定时间发生特定事件的原因。松散数据同步很容易，最终使您陷入混乱。

![Component Hierarchy](https://cdn.scotch.io/10/1hbdfyVuQqKWpDYEMXi2_Screen%20Shot%202017-05-08%20at%205.28.21%20PM.png)

# Domain State | 服务端状态

Domain State 即是你应用服务端的状态，也就是你应用面向的某个特定领域的状态。譬如我们正在为 Grocery Store 开发的 Web 应用，可以预见的，我们会在应用中发现如下通用状态：认证、校验、错误处理等等，统一的我们也会发现很多与超级市场这一产业相关的状态。这就是所谓的领域特定业务逻辑(Domain Specific Business Logic)，这些状态会应用于行业相关的业务逻辑代码。Domain State 来自于服务端，并且需要根据用户的 Session 进行持久化存储，以便于更好地与客户端进行交互。这里以 GraphQL 为例展示一个简单的 Domain State 查询(如果你还不了解 GraphQL，可以参考 [GraphQL 初探:从 REST 到 GraphQL，更完善的数据查询定义](https://segmentfault.com/a/1190000005766732))：

```gql
// Lets say we want to know the state of our friends list at any given time
// Lets make aGraphQL query to represent this:

user(id: "1") {
  name
  friends {
  name
  }
}
```

在 GraphQL 中我们编写所谓的`queries`来获取 Domain State，如上面的请求中我们会返回编号为 1 的用户的姓名与朋友信息，返回结果如下所示：

```json
{
  "data": {
    "user": {
      "name": "Abhi Aiyer",
      "friends": [
        {
          "name": "Ben Strahan"
        },
        {
          "name": "Sashko Stubailo"
        }
      ]
    }
  }
}
```

如果我们需要获取更多的领域信息：

```gql
jobs(id: "32hkrv32ZKjd3jlwzhk") {
  description,
  position,
  wage {
  max
  },
  managers {
  name,
  email
  },
  status,
  published
}
```

这里我们从 job 表中希望获取更多关联信息，返回结果大概如下：

```json
{
  "data": {
    "jobs": {
      "description": "Write cool blog posts",
      "position": "Programmer",
      "wage": {
        "max": 24
      },
      "managers": [
        {
          "name": "Larry",
          "email": "larry@stooges.com"
        },
        {
          "name": "Moe",
          "email": "moe@stooges.com"
        }
      ],
      "status": "PUBLISHED",
      "publishedAt": 1460294879
    }
  }
}
```

# UI State

Domain State 大概包含了你需要管理的核心状态中的差不多一半部分，Browser 代表着另一半，并且有它自己的职责与能力。尽管现在 UI 开发中无状态组件的概念很流行，Browser 主要负责存放用户刚刚输入的或者配置的状态信息。除此之外，Browsers 还会缓存页面、设置 Cookie、在 LocalStorage 中设置 Token、载入 CSS 等等。除了 Web Browsers 之外，我们的客户端应用还有专门的状态管理工具。如果你是使用 React 进行界面开发并且选用了单向数据流架构，你大概会选用 Flux 库或者某个变种。Flux 系列框架能够帮助前端开发人员管理客户端的状态，譬如某个组件的可见性控制、用户输入的获取或者响应，或者根据不同的用户尺寸展示不同的尺寸等等。这里以 Redux 的 reducers 为例：

```js
function visibilityOfButton(state = false, action = {}) {
  switch (action.type) {
    case "TOGGLE_VISIBILITY": // return opposite of the current state
      return !state;
    default:
      return state;
  }
}

function inputFromUser(state = {}, action) {
  switch (action.type) {
    case "UPDATE_DATA": // return a new object that has data from the action
      return { ...state, ...action.data };
    default:
      return state;
  }
}
```

在 Redux 中，reducers 阐述了 UI 状态的变化之路，你可以看到当前的状态以及根据不同的 Action 会进行怎样的状态变化。譬如根据上面的 reducers，我们的状态树大概是这个样子的：

```js
{
  visibilityOfButton: false,
  inputFromUser: {}
}
```

当用户点击按钮之后，产生的 Action 以及对应的 State 变更如下所示：

```js
// Redux utilizes a command like pattern.
// Our Store represents the receiver here
// the dispatch represents the executor
// the object passed to the dispathcer is the command
Store.dispatch({
  type: "TOGGLE_VISIBILITY",
});

("REVIOUS STATE: { visibilityOfButton: false, inputFromUser: {} }");
('ACTION -> type: "TOGGLE_VISIBILITY"');
("NEXT STATE: { visibilityOfButton: true, inputFromUser: {} }");
```
