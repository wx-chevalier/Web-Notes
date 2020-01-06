# Query Builder

QueryBuilder 是 TypeORM 最强大的功能之一，它允许你使用优雅便捷的语法构建 SQL 查询，执行并获得自动转换的实体。QueryBuilder 的简单示例:

```ts
const firstUser = await connection
  .getRepository(User)
  .createQueryBuilder("user")
  .where("user.id = :id", { id: 1 })
  .getOne();
```

它将生成以下 SQL 查询：

```sql
SELECT
    user.id as userId,
    user.firstName as userFirstName,
    user.lastName as userLastName
FROM users user
WHERE user.id = 1
```

然后返回一个 `User` 实例:

```s
User {
    id: 1,
    firstName: "Timber",
    lastName: "Saw"
}
```

# 创建与操作

## 创建 QueryBuilder

有几种方法可以创建 `Query Builder`：

- 使用 connection:

```typescript
import { getConnection } from "typeorm";

const user = await getConnection()
  .createQueryBuilder()
  .select("user")
  .from(User, "user")
  .where("user.id = :id", { id: 1 })
  .getOne();
```

- 使用 entity manager:

```typescript
import { getManager } from "typeorm";

const user = await getManager()
  .createQueryBuilder(User, "user")
  .where("user.id = :id", { id: 1 })
  .getOne();
```

- 使用 repository:

```typescript
import { getRepository } from "typeorm";

const user = await getRepository(User)
  .createQueryBuilder("user")
  .where("user.id = :id", { id: 1 })
  .getOne();
```

有 5 种不同的`QueryBuilder`类型可用：

- `SelectQueryBuilder` - 用于构建和执行`SELECT`查询。 例如：

```typescript
import { getConnection } from "typeorm";

const user = await getConnection()
  .createQueryBuilder()
  .select("user")
  .from(User, "user")
  .where("user.id = :id", { id: 1 })
  .getOne();
```

- `InsertQueryBuilder` - 用于构建和执行 `INSERT` 查询。 例如：

```typescript
import { getConnection } from "typeorm";

await getConnection()
  .createQueryBuilder()
  .insert()
  .into(User)
  .values([
    { firstName: "Timber", lastName: "Saw" },
    { firstName: "Phantom", lastName: "Lancer" }
  ])
  .execute();
```

- `UpdateQueryBuilder` - 用于构建和执行 `UPDATE` 查询。 例如：

```typescript
import { getConnection } from "typeorm";

await getConnection()
  .createQueryBuilder()
  .update(User)
  .set({ firstName: "Timber", lastName: "Saw" })
  .where("id = :id", { id: 1 })
  .execute();
```

- `DeleteQueryBuilder` - 用于构建和执行`DELETE`查询。 例如：

```typescript
import { getConnection } from "typeorm";

await getConnection()
  .createQueryBuilder()
  .delete()
  .from(User)
  .where("id = :id", { id: 1 })
  .execute();
```

- `RelationQueryBuilder` - 用于构建和执行特定于关系的操作[TBD]。

你可以在其中切换任何不同类型的查询构建器，一旦执行，则将获得一个新的查询构建器实例（与所有其他方法不同）。

## 插入

你可以使用`QueryBuilder`创建`INSERT`查询。 例如：

```typescript
import { getConnection } from "typeorm";

await getConnection()
  .createQueryBuilder()
  .insert()
  .into(User)
  .values([
    { firstName: "Timber", lastName: "Saw" },
    { firstName: "Phantom", lastName: "Lancer" }
  ])
  .execute();
```

就性能而言，这是向数据库中插入实体的最有效方法。 你也可以通过这种方式执行批量插入。在某些情况下需要执行函数 SQL 查询时：

```typescript
import { getConnection } from "typeorm";

await getConnection()
  .createQueryBuilder()
  .insert()
  .into(User)
  .values({
    firstName: "Timber",
    lastName: () => "CONCAT('S', 'A', 'W')"
  })
  .execute();
```

此语法不会对值进行转义，你需要自己处理转义。

## 更新

你可以使用 `QueryBuilder` 创建 `UPDATE` 查询。 例如：

```typescript
import { getConnection } from "typeorm";

await getConnection()
  .createQueryBuilder()
  .update(User)
  .set({ firstName: "Timber", lastName: "Saw" })
  .where("id = :id", { id: 1 })
  .execute();
```

就性能而言，这是更新数据库中的实体的最有效方法。在某些情况下需要执行函数 SQL 查询时：

```
typescript import {getConnection} from "typeorm"; await getConnection() .createQueryBuilder() .update(User) .set({ firstName: "Timber", lastName: "Saw", age: () => "'age' + 1" }) .where("id = :id", { id: 1 }) .execute();
```

此语法不会对值进行转义，你需要自己处理转义。

## 删除

你可以使用 `QueryBuilder` 创建 `DELETE` 查询。 例如：

```typescript
import { getConnection } from "typeorm";

await getConnection()
  .createQueryBuilder()
  .delete()
  .from(User)
  .where("id = :id", { id: 1 })
  .execute();
```

就性能而言，这是删除数据库中的实体的最有效方法。
