# Knex.js 教程

Knex.js 教程展示了如何使用 Knex.js 在 JavaScript 中对数据库进行编程。

## Knex.js

Knex.js 是用于关系数据库（包括 PostgreSQL，MySQL，SQLite3 和 Oracle）的 JavaScript 查询生成器。 它可以与回调和 Promise 一起使用。 它支持事务和连接池。

在本教程中，我们使用 MySQL。

## 安装 Knex.js

首先，我们需要安装 Knex.js。

```js
$ nodejs -v
v9.11.2

```

我们使用 Node 版本 9.11.2。

```js
$ npm init

```

我们启动一个新的 Node 应用。

```js
$ npm i knex mysql2

```

我们安装 Knex.js 和 MySQL 驱动程序。 有两个驱动程序可用：`mysql`和`mysql2`; 我们选择了后者。

## Knex.js 的数据库版本

在第一个示例中，我们找出 MySQL 的版本。

`version.js`

```js
const options = {
  client: "mysql2",
  connection: {
    host: "127.0.0.1",
    user: "user12",
    password: "s$cret",
    database: "mydb"
  }
};

const knex = require("knex")(options);

knex
  .raw("SELECT VERSION()")
  .then(version => console.log(version[0][0]))
  .catch(err => {
    console.log(err);
    throw err;
  })
  .finally(() => {
    knex.destroy();
  });
```

该示例返回 MySQL 的版本。

```js
const options = {
  client: "mysql2",
  connection: {
    host: "127.0.0.1",
    user: "user12",
    password: "s$cret",
    database: "mydb"
  }
};
```

这些是 MySQL 的连接选项。

```js
const knex = require("knex")(options);
```

我们加载 Knex.js 并提供连接选项。

```js
knex
  .raw("SELECT VERSION()")
  .then(version => console.log(version[0][0]))
  .catch(err => {
    console.log(err);
    throw err;
  })
  .finally(() => {
    knex.destroy();
  });
```

使用`raw()`函数，我们执行 SQL 语句。 如果语句运行正常，我们将输出输出。 否则，我们记录错误。 最后，我们使用`destroy()`关闭数据库连接。

```js
$ node version.js
TextRow { 'VERSION()': '5.7.22-0ubuntu0.16.04.1' }

```

这是输出。

## Knex.js 创建表

在第二个示例中，我们创建一个新的数据库表。

`create_table.js`

```js
const options = {
  client: "mysql2",
  connection: {
    host: "127.0.0.1",
    user: "user12",
    password: "s$cret",
    database: "mydb"
  }
};

const knex = require("knex")(options);

knex.schema
  .createTable("cars", table => {
    table.increments("id");
    table.string("name");
    table.integer("price");
  })
  .then(() => console.log("table created"))
  .catch(err => {
    console.log(err);
    throw err;
  })
  .finally(() => {
    knex.destroy();
  });
```

使用 Knex.js 模式`createTable()`函数创建一个新表。 我们定义模式以包含三列：id，名称和价格。

## Knex.js 插入数据

接下来，我们将向创建的表中插入一些数据。

`insert_cars.js`

```js
const options = {
  client: "mysql2",
  connection: {
    host: "127.0.0.1",
    user: "user12",
    password: "s$cret",
    database: "mydb"
  }
};

const knex = require("knex")(options);

const cars = [
  { name: "Audi", price: 52642 },
  { name: "Mercedes", price: 57127 },
  { name: "Skoda", price: 9000 },
  { name: "Volvo", price: 29000 },
  { name: "Bentley", price: 350000 },
  { name: "Citroen", price: 21000 },
  { name: "Hummer", price: 41400 },
  { name: "Volkswagen", price: 21600 }
];

knex("cars")
  .insert(cars)
  .then(() => console.log("data inserted"))
  .catch(err => {
    console.log(err);
    throw err;
  })
  .finally(() => {
    knex.destroy();
  });
```

我们用`knex('cars)`选择`cars`表，并用`insert()`方法插入八行。

## Knex.js 选择所有行

在下面的示例中，我们从`cars`表中选择所有行。

`select_cars.js`

```js
const options = {
  client: "mysql2",
  connection: {
    host: "127.0.0.1",
    user: "user12",
    password: "s$cret",
    database: "mydb"
  }
};

const knex = require("knex")(options);

knex
  .from("cars")
  .select("*")
  .then(rows => {
    for (row of rows) {
      console.log(`${row["id"]} ${row["name"]} ${row["price"]}`);
    }
  })
  .catch(err => {
    console.log(err);
    throw err;
  })
  .finally(() => {
    knex.destroy();
  });
```

我们使用`select()`功能选择所有行。 这次我们选择了具有`from()`功能的表格。 然后，我们遍历返回的行数组并打印三个字段。

```js
$ node select_cars.js
1 Audi 52642
2 Mercedes 57127
3 Skoda 9000
4 Volvo 29000
5 Bentley 350000
6 Citroen 21000
7 Hummer 41400
8 Volkswagen 21600

```

这是输出。

## Knex.js 使用`WHERE`限制输出

SQL WHERE 子句用于定义要返回的行要满足的条件。

`select_where.js`

```js
const options = {
  client: "mysql2",
  connection: "mysql://root:andrea@localhost:3306/mydb"
};

const knex = require("knex")(options);

knex
  .from("cars")
  .select("name", "price")
  .where("price", ">", "50000")
  .then(rows => {
    for (row of rows) {
      console.log(`${row["name"]} ${row["price"]}`);
    }
  })
  .catch(err => {
    console.log(err);
    throw err;
  })
  .finally(() => {
    knex.destroy();
  });
```

该示例返回价格高于 50000 的汽车。

```js
const options = {
  client: "mysql2",
  connection: "mysql://user12:s$cret@localhost:3306/mydb"
};
```

这次，我们提供了一个连接 URL。

```js
knex
  .from("cars")
  .select("name", "price")
  .where("price", ">", "50000");
```

我们用`select()`选择了两列，并在`where()`函数中添加了`WHERE`子句。

```js
$ node select_where.js
Audi 52642
Mercedes 57127
Bentley 350000

```

三辆汽车比 5 万辆贵。

## Knex.js 排序行

我们可以使用`orderBy()`功能订购数据。

`order_cars.js`

```js
const options = {
  client: "mysql2",
  connection: {
    host: "127.0.0.1",
    user: "user12",
    password: "s$cret",
    database: "mydb"
  }
};

const knex = require("knex")(options);

knex
  .from("cars")
  .select("name", "price")
  .orderBy("price", "desc")
  .then(rows => {
    for (row of rows) {
      console.log(`${row["name"]} ${row["price"]}`);
    }
  })
  .catch(err => {
    console.log(err);
    throw err;
  })
  .finally(() => {
    knex.destroy();
  });
```

该示例选择所有汽车，然后按价格降序对其进行排序。

```js
$ node order_cars.js
Bentley 350000
Mercedes 57127
Audi 52642
Hummer 41400
Volvo 29000
Volkswagen 21600
Citroen 21000
Skoda 9000

```

这是输出。
