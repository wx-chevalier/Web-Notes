[![返回目录](https://i.postimg.cc/WzXsh0MX/image.png)](https://parg.co/UdT)

# GraphQL SDL

SDL（Schema Definition Language） 是标准的 GraphQL Schema 的表示方式，在编程中我们往往会将其转化为 GraphQL.js 的 GraphQLSchema 对象，或者其他语言中的等效描述对象。

![](https://cdn-images-1.medium.com/max/1600/1*CzVPl58sR5he8UEGpYg2Zw.png)

Schema 中定义了我们可以查询或者操作的数据属性与类型以及它们之间的关系，为开发者提供了清晰的接口数据格式定义；这种强类型定义也赋能了像 GraphiQL 这样能够自动补全的工具，并且促进了其他的譬如 IDE 集成插件、查询验证、代码生成、自动 Mock 等工具的出现。最常见的 GraphQL Schema 的表示方式就是 Schema Definition Language, SDL，即 [GraphQL specification](http://facebook.github.io/graphql/) 中提及的字符串模式，有点类似于传统的 IDL(Interface Definition Language) 或者 SDL(Schema Definition Language)。在 GraphQL 中，对于数据模型的抽象是通过 Type 来描述的，对于接口获取数据的逻辑是通过 Schema 来描述的。GraphQL 中每一个 Type 有若干 Field 组成，每个 Field 又分别指向某个 Type；Type 又可以分为 Scalar Type(标量类型) 与 Object Type(对象类型)。

# Node 中的 Schema 对象

## GraphQLSchema 对象

SDL 是标准的 GraphQL Schema 的表示方式，在编程中我们往往会将其转化为 GraphQL.js 的 GraphQLSchema 对象，或者其他语言中的等效描述对象。

```js
const { graphql, buildSchema } = require('graphql');

// 使用 GraphQL schema language 定义 Schema
const schema = buildSchema(`
  type Query {
    hello: String
  }
`);

// 为每个 API 端点提供解析函数
const root = {
  hello: () => {
    return 'Hello world!';
  }
};

// 执行查询请求，并且获取结果
graphql(schema, '{ hello }', root).then(response => {
  console.log(response);
});
```

另一种常见的 Schema 的表示方式即是 GraphQL.js 的 GraphQLSchema 对象，该类型对象才能够被服务端或者客户端的解析代码所使用：

```js
const {
  GraphQLObjectType,
  GraphQLSchema,
  GraphQLNonNull,
  GraphQLInt
} = require('graphql');

const queryType = new GraphQLObjectType({
  name: 'Query',
  fields: {
    posts: {
      type: postType
    },
    author: {
      name: 'author',
      type: authorType,
      arguments: { id: { type: new GraphQLNonNull(GraphQLInt) } }
    }
  }
});

// ... postType and authorType defined similarly

const schema = new GraphQLSchema({
  query: queryType
});
```

## Apollo GraphQL

Apollo GraphQL 为我们提供了全栈式的 GraphQL 开发工具与良好的体验，也可以看做 GraphQL 标准的一种实现方式。[graphql-tag](https://github.com/apollographql/graphql-tag) 提供了 GraphQL 的查询辅助工具，能够将某个查询转化为 GraphQL 的 AST 表示：

```js
import gql from 'graphql-tag';

const query = gql`
  {
    user(id: 5) {
      firstName
      lastName
    }
  }
`;

// query is now a GraphQL syntax tree object
console.log(query);

// {
//   "kind": "Document",
//   "definitions": [
//     {
//       "kind": "OperationDefinition",
//       "operation": "query",
//       "name": null,
```

[graphql-tools](https://github.com/apollographql/graphql-tools) 则提供了完整的 Schema 生成与合并工具，支持 Resolver, Interface, Union, Scalar:

```js
import { buildSchema, printSchema, makeExecutableSchema } from 'graphql-tools';

const sdlSchema = `...`;

// 仅仅生成 Schema 对象
const graphqlSchemaObj = buildSchema(sdlSchema);

// 生成可用于服务端的 Schema 对象
const graphqlSchemaObj = makeExecutableSchema({
  typeDefs: sdlSchema,
  resolvers: {
    Query: {
      author: () => ({ firstName: 'Ada', lastName: 'Lovelace' })
    }
  }
});

// 转化为 SDL
console.log(printSchema(graphqlSchemaObj));
```

# 类型基础

## 类型声明

GraphQL 中使用 `type` 关键字来指定类型名，类型还可以继承一到多个接口：

```gql
type Post implements Item {
  # ...
}
```

某个属性域包含了名称与类型，该类型可以是内建或自定义的标量类型，也可以是 Schema 中自定义的类型；对于非空的属性域可以使用 `!` 来标记：

```gql
age: Int!
```

较为全面的类型定义范例如下：

```gql
type Post {
  id: String!
  title: String!
  publishedAt: DateTime!
  likes: Int! @default(value: 0)
  blog: Blog @relation(name: "Posts")
}

type Blog {
  id: String!
  name: String!
  description: String
  posts: [Post!]! @relation(name: "Posts")
}
```

## 内省查询结果

GraphQL 的 API 是被要求自我注释的，每个 GraphQL API 应可以返回其结构，这就是所谓的内省(Introspection)，往往是 `__schema` 端口的返回结果：

```json
{
  __schema {
    types {
      kind
      name
      possibleTypes {
        name
      }
    }
  }
}
```

我们可以利用 graphql 库提供的 introspectionQuery 查询来进行获取：

```js
const { introspectionQuery } = require('graphql');
// ...
fetch('https://1jzxrj179.lp.gql.zone/graphql', {
  // ...
  body: JSON.stringify({ query: introspectionQuery })
});
// ...
```

同样的，我们可以将内省的查询结果转化为 GraphQL Schema 对象：

```js
const { buildClientSchema } = require('graphql');
const fs = require('fs');

const introspectionSchemaResult = JSON.parse(fs.readFileSync('result.json'));
const graphqlSchemaObj = buildClientSchema(introspectionSchemaResult);
```

# Scalar Type | 标量类型

GraphQL 内建提供了以下标量类型：

- Int
- Float
- String
- Boolean
- ID

Enum 是较为特殊的标量类型，其包含了可能的值：

```gql
enum Category {
  PROGRAMMING_LANGUAGES
  API_DESIGN
}
```

## 自定义标量类型

```js
import { makeExecutableSchema } from 'graphql-tools';
import GraphQLJSON from 'graphql-type-json';

const schemaString = `
scalar JSON

type Foo {
  aField: JSON
}

type Query {
  foo: Foo
}
`;

const resolveFunctions = {
  JSON: GraphQLJSON
};

const jsSchema = makeExecutableSchema({
  typeDefs: schemaString,
  resolvers: resolveFunctions
});
```

# Object Type | 对象类型

数组则是用大括号表示：

```gql
names: [String!]
```

## Type Modifier | 类型修饰

## Interface | 接口

在 GraphQL 中，`interface` 是一系列属性域的集合。

# Directive | 指令

我们可以通过指令来为任意的 Schema 定义添加额外的信息，指令并没有其固有的含义，每个 GraphQL 标准的实现都可以定义其独有功能。

```gql
name: String! @defaultValue(value: "new blogpost")
```

GraphQL 标准中规范了指令的定义与使用的方式：

```gql
directive @deprecated(
  reason: String = "No longer supported"
) on FIELD_DEFINITION | ENUM_VALUE

type ExampleType {
  newField: String
  oldField: String @deprecated(reason: "Use `newField`.")
}
```

在实际开发中，我们可以使用 graphql-tools 提供的 SchemaDirectiveVisitor 来快速开发自定义指令，譬如我们需要某个提示属性域被废弃的 @deprecated 指令：

```js
import { SchemaDirectiveVisitor } from "graphql-tools";

class DeprecatedDirective extends SchemaDirectiveVisitor {
  public visitFieldDefinition(field: GraphQLField<any, any>) {
    field.isDeprecated = true;
    field.deprecationReason = this.args.reason;
  }

  public visitEnumValue(value: GraphQLEnumValue) {
    value.isDeprecated = true;
    value.deprecationReason = this.args.reason;
  }
}
```

然后在声明 Schema

# Fragments

Fragments 类似于组件，帮助我们解决代码中请求内容的重复问题，即可将某个元数据声明复用到不同的查询或者修改中。

```json
recentPost {
	title
	description
	author {
		...authorInfo
	}
}

fragment authorInfo as Author {
	id
	name
}
```

# Query & Mutation | 查询与更改

Query 与 Mutation 是 GraphQL 的默认入口之一，GraphQL Schema 中内置的 ROOT 包含了以下几种：

```gql
type Query {}
type Mutation {}
type Subscription {}

schema {
  query: Query
  mutation: Mutation
  subscription: Subscription
}
```

## Arguments | 参数

## Mutation

GraphQL 为我们提供了 Mutation 类型，以进行数据操作。
