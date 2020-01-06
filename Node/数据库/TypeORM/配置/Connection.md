# Connection

只有在建立连接后才能与数据库进行交互。TypeORM 的 Connection 不会像看起来那样设置单个数据库连接，而是设置连接池。QueryRunner 的每个实例都是一个独立的数据库连接。一旦调用 Connection 的 connect 方法，就建立连接池设置。如果使用 createConnection 函数设置连接，则会自动调用 connect 方法。调用 close 时会断开连接（关闭池中的所有连接）。通常情况下，你只能在应用程序启动时创建一次连接，并在完全使用数据库后关闭它。实际上，如果要为站点构建后端，并且后端服务器始终保持运行,则不需要关闭连接。

# 连接创建

## 手动操作

有多种方法可以创建连接。但是最简单和最常用的方法是使用 createConnection 和 createConnections 函数。createConnection 创建单个连接：

```ts
import { createConnection, Connection } from "typeorm";

const connection = await createConnection({
  type: "mysql",
  host: "localhost",
  port: 3306,
  username: "test",
  password: "test",
  database: "test"
});

// 只使用 url 和 type 也可以进行连接。

createConnection({
  type: "postgres",
  url: "postgres://test:test@localhost/test"
});
```

createConnections 创建多个连接:

```ts
import { createConnections, Connection } from "typeorm";

const connections = await createConnections([
  {
    name: "default",
    type: "mysql",
    host: "localhost",
    port: 3306,
    username: "test",
    password: "test",
    database: "test"
  },
  {
    name: "test2-connection",
    type: "mysql",
    host: "localhost",
    port: 3306,
    username: "test",
    password: "test",
    database: "test2"
  }
]);
```

创建连接后，你可以使用 getConnection 函数从应用程序中的任何位置使用它：

```ts
import { getConnection } from "typeorm";

// 可以在调用 createConnection 后使用并解析
const connection = getConnection();

// 如果你有多个连接，则可以按名称获取连接
const secondConnection = getConnection("test2-connection");
```

应避免额外创建 classes/services 来存储和管理连接。此功能已嵌入到 TypeORM 中，无需过度工程并创建无用的抽象。

## ormconfig.json

大多数情况下，我们希望将连接选项存储在单独的配置文件中，因为此方式使管理变得更方便和容易。 TypeORM 支持多个配置源。你只需要在应用程序的根目录（package.json 附近）中创建一个 `ormconfig.[format]` 文件存放连接配置，并在应用程序中调用 createConnection()，而不传递任何参数配置：

```ts
import { createConnection } from "typeorm";

// createConnection方法会自动读取来自ormconfig文件或环境变量中的连接选项
const connection = await createConnection();
```

支持的 ormconfig 文件格式有：.json, .js, .env, .yml 和 .xml。在项目根目录（package.json 附近）中创建 ormconfig.json，并包含以下内容：

```json
{
  "type": "mysql",
  "host": "localhost",
  "port": 3306,
  "username": "test",
  "password": "test",
  "database": "test"
}
```

如果要创建多个连接，则只需在数组中添加多个连接：

```json
[
  {
    "name": "default",
    "type": "mysql",
    "host": "localhost",
    "port": 3306,
    "username": "test",
    "password": "test",
    "database": "test"
  },
  {
    "name": "second-connection",
    "type": "mysql",
    "host": "localhost",
    "port": 3306,
    "username": "test",
    "password": "test",
    "database": "test"
  }
]
```

有时你希望覆盖 ormconfig 文件中定义的值，或者可能会在配置中附加一些 TypeScript/JavaScript 逻辑。 在这种情况下，你可以从 ormconfig 加载选项并构建 ConnectionOptions，然后在将它们传递给 createConnection 函数之前，使用这些选项执行任何操作：

```ts
// 从ormconfig文件（或ENV变量）读取连接选项
const connectionOptions = await getConnectionOptions();

// 使用connectionOptions做一些事情，
// 例如，附加自定义命名策略或自定义记录器
Object.assign(connectionOptions, { namingStrategy: new MyNamingStrategy() });

// 使用覆盖后的连接选项创建连接
const connection = await createConnection(connectionOptions);
```

# Connection 使用

## 多个 Connection

使用多个数据库的最简单方法是创建不同的连接：

```ts
import { createConnections } from "typeorm";

const connections = await createConnections([
  {
    name: "db1Connection",
    type: "mysql",
    host: "localhost",
    port: 3306,
    username: "root",
    password: "admin",
    database: "db1",
    entities: [__dirname + "/entity/*{.js,.ts}"],
    synchronize: true
  },
  {
    name: "db2Connection",
    type: "mysql",
    host: "localhost",
    port: 3306,
    username: "root",
    password: "admin",
    database: "db2",
    entities: [__dirname + "/entity/*{.js,.ts}"],
    synchronize: true
  }
]);
```

此方法允许你连接到已拥有的任意数量的数据库，每个数据库都有自己的配置，自己的实体和整体 ORM 范围和设置。对于每个连接，将创建一个新的 Connection 实例。 你必须为创建的每个连接指定唯一的名称。
也可以从 ormconfig 文件加载所有连接选项：

```typescript
import { createConnections } from "typeorm";

const connections = await createConnections();
```

指定要按名称创建的连接：

```typescript
import { createConnection } from "typeorm";

const connection = await createConnection("db2Connection");
```

使用连接时，必须指定连接名称以获取特定连接：

```typescript
import { getConnection } from "typeorm";

const db1Connection = getConnection("db1Connection");
// 现在可以使用"db1"数据库...

const db2Connection = getConnection("db2Connection");
// 现在可以使用"db2"数据库...
```

使用此方法的好处是你可以使用不同的登录凭据，主机，端口甚至数据库类型来配置多个连接。但是缺点可能是需要管理和使用多个连接实例。
