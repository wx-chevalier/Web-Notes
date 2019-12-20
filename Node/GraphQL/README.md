[![返回目录](https://i.postimg.cc/WzXsh0MX/image.png)](https://parg.co/UdT)

# GraphQL

> GraphQL is Facebook’s new query language for fetching application data in a uniform way.

GraphQL 是由 Facebook 开源的查询语言标准，其并非具体的后端编程框架，而是一个包含了数据格式、数据关联、查询方式定义与实现等等一揽子东西的数据抽象层。GraphQL 也并不是一个具体的后端编程框架，如果将 REST 看做适合于简单逻辑的查询标准，那么 GraphQL 可以做一个独立的抽象层，通过对于多个 REST 风格的简单的接口的排列组合提供更多复杂多变的查询方式。与 REST 相比，GraphQL 定义了更严格、可扩展、可维护的数据查询方式。

![default](https://user-images.githubusercontent.com/5803001/39741543-ef8d4c50-52cc-11e8-9d16-c3f71329290a.jpg)

GraphQL 并不能消融业务内在的复杂度，而是通过引入灵活的数据抽象层，尽量解耦前后端之间的直接关联或者阻塞；在满足日益增长不断变化的 Web/Mobile 端复杂的数据需求的同时，尽可能避免服务端内部逻辑复杂度的无序增加。GraphQL 能够用于实践 [BFF](https://www.thoughtworks.com/radar/techniques/bff-backend-for-frontends) 理念，其允许将部分数据组装/聚合地逻辑交于前端完成，即给予了前端灵活变更、快速迭代的空间，也能保证后端的相对中立性，不会疲于应付不同端或者不同界面设计的差异化数据格式要求。

![](https://coding.net/u/hoteam/p/Cache/git/raw/master/2017/1/1/fdasfasdfdasfsd.gif)

# GraphQL 与 REST

![](https://coding.net/u/hoteam/p/Cache/git/raw/master/2016/10/2/1-LidfuCRZipAKpVeRqh1Wjg.png)

经典的 REST 架构模式立足资源，规范了基础的增删改查操作，却未能很好地处理资源之间的关联，及其衍生的一系列接口命名、代码分层等问题。接口名是对于某个逻辑的抽象描述，其往往会关联到某个特定的服务以及特定的多表查询语句，这就导致了接口、服务、SQL 语句与某个逻辑的强耦合性，而无法动态地应对业务逻辑的快速变化。笔者在早年间提出的 [RARF](https://parg.co/AvR) 架构模式中也探讨过，将请求再资源间响应式地流动与转换，单个资源仅需要关心与其他邻接资源的转换而不需要耦合于某个接口的返回，这也是典型的图模式。

GraphQL 与之前 Netflix 出品的 Falcor，都是致力于解决相同的问题：如何有效处理日益增长不断变化的 Web/Mobile 端复杂的数据需求。与 REST 相比，GraphQL 为我们提供了声明式(Declarative)、分层可组合的(Hiearchial)、强类型控制(Static Type)的接口声明与交互方式；即保证了单一的查询端点，也提供了更严格、可扩展、可维护的数据查询方式(详见下文-数据模型层)。单一的查询端点能够让开发者免于考虑大量复杂的接口命名，直接使用图查询语言，也能更好地描述资源之间的关系；同时像 GraphiQL 这样的工具也能够帮我们快速生成交互式地接口文档。

GraphQL 本质上是面向消费者的，客户端驱动的开发模式；它允许请求方(即客户端)而非响应方(即服务器端)决定查询的结果格式，从而返回可预测(Predictable)的结果类型，省去了客户端很多的异常情况处理与向后兼容的操作(Backwards Compatible)，提升了产品整体的健壮性。这样确实使得整个请求需要很多额外的数据参数与编码工作，但是它就将消费者与服务端解耦，并且强迫服务端遵守 Postel 法则(对自己严格，对他人宽容)。

不过 GraphQL 并非银弹，其并未缓解业务逻辑本身的复杂度，反而图查询方式在弱化各模块间的耦合的同时带来多次查询的性能损耗，在代码规范、模块划分不当的情况下可能导致渐进式地微服务切分割离也变得麻烦。于前端，直接用 Apollo Graphql React 这样的框架替代原有的状态管理，将组件直接绑定于接口，就是在破坏前端应用的自治性，与 SOLID 背道而驰，将独立的前端应用强耦合于后端；单一的端点在网络调试时也是不甚方便。Graphql 作为前端编写，维护的数据聚合层是非常好的选择，但是小型项目也可以在前端完成自聚合；将服务端的计算查询压力，传导给分布式的，性能日渐强大的客户端，也不失一个选择。REST 与 GraphQL 并非取舍关系，而是渐进融合，REST 项目在自身迭代衍化的过程中也可以不断地借鉴 GraphQL 中的一些思想或者理念，来解决譬如模型分层与界定等问题。

还是需要强调一点，引入 GraphQL 并不意味着要像之前从 Struts 迁移到 SpringBoot 一样需要去修改你的真实的后端代码，因此 GraphQL 可以看做一个业务逻辑层灵活有效地辅助工具。这一点也是 GraphQL 与原来的 REST API 最大的差别，举例而言：

```gql
{
  latestPost {
    _id
    title
    content
    author {
      name
    }
    comments {
      content
      author {
        name
      }
    }
  }
}
```

这是一个很典型的 GraphQL 查询，在查询中指明了需要返回某个 Blog 的评论与作者信息，一个典型的返回结果譬如：

```json
{
  "data": {
    "latestPost": {
      "_id": "03390abb5570ce03ae524397d215713b",
      "title": "New Feature: Tracking Error Status with Kadira",
      "content": "Here is a common feedback we received from our users ...",
      "author": {
        "name": "Pahan Sarathchandra"
      },
      "comments": [
        {
          "content": "This is a very good blog post",
          "author": {
            "name": "Arunoda Susiripala"
          }
        },
        {
          "content": "Keep up the good work",
          "author": {
            "name": "Kasun Indi"
          }
        }
      ]
    }
  }
}
```

而如果采用 REST API 方式，要么需要前端查询多次，要么需要去添加一个新的接口，专门针对前端这种较为特殊的请求进行响应，而这样又不可避免地导致后端代码的冗余，毕竟很有可能这个特殊的请求与返回哪天就被废了。

```json
{
  user(id:1) {
    name
    title
    avatarUrl
    timezone
    locale
    lastSeenOnline
    email
    phone
    location

    accountOwner {
      name
      avatarUrl
    }

    tags {
      edges {
        node {
          label
          color
        }
      }
    }

    accountUsers(first:10) {
      edges {
        node {
          id
          avatarUrl
        }
      }
      pageInfo {
        totalAccountUsers
      }
    }

    recentConversations(first:10) {
      edges {
        node {
          lastMessage
          updatedAt
          status
        }
        pageInfo {
          totalConversationCount
        }
      }
    }
  }
}
```

# 快速开始

值得一提的是，[Github Explorer](https://developer.github.com/v4/explorer/) 是非常不错的在 Github GraphQL API 中实践 GraphQL 的在线练习场，也可以在 [Backend-Boilerplate/graphql](https://github.com/wx-chevalier/Backend-Boilerplate/blob/master/node/graphql) 中了解笔者的 GraphQL 相关模板。

```gql
query {
  user(login: "wx-chevalier") {
    starredRepositories {
      totalCount
    }
    followers {
      totalCount
    }
    repositories(first: 35) {
      nodes {
        id
        name
        descriptionHTML
        forkCount
        stargazers {
          totalCount
        }
      }
    }
  }
}
```

# Todos

- 典型案例，参考 [howtographql](https://www.howtographql.com/basics/3-big-picture/) 中的介绍，

- https://github.com/sogko/graphql-schema-language-cheat-sheet

- https://gist.github.com/jbritton/1f60ef440686b51ee37b708e6376b26e

- https://medium.com/graphql-mastery/graphql-quick-tip-how-to-pass-variables-into-a-mutation-in-graphiql-23ecff4add57

- https://mp.weixin.qq.com/s/YjLuf3Oebmw0Zo6Xx-0qKg

- https://mp.weixin.qq.com/s/8FgP1LeO6eDd8xuIMGzIIA