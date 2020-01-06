# Repository

Repository 就像 EntityManager 一样，但其操作仅限于具体实体。你可以通过 getRepository(Entity)，Connection＃getRepository 或 EntityManager＃getRepository 访问存储库。

```ts
import { getRepository } from "typeorm";
import { User } from "./entity/User";

const userRepository = getRepository(User); // 你也可以通过getConnection().getRepository()或getManager().getRepository() 获取
const user = await userRepository.findOne(1);
user.name = "Umed";
await userRepository.save(user);
```

有三种类型的存储库：

- `Repository` - 任何实体的常规存储库。
- `TreeRepository` - 用于树实体的`Repository`的扩展存储库（比如标有`@ Tree`装饰器的实体）。有特殊的方法来处理树结构。
- `MongoRepository` - 具有特殊功能的存储库，仅用于 MongoDB。

# Find

## 基础选项

所有存储库和管理器 find 方法都接受可用于查询所需数据的特殊选项，而无需使用 QueryBuilder：

- `select` - 表示必须选择对象的哪些属性

```typescript
userRepository.find({ select: ["firstName", "lastName"] });
```

- `relations` - 关系需要加载主体。也可以加载子关系（join 和 leftJoinAndSelect 的简写）

```typescript
userRepository.find({ relations: ["profile", "photos", "videos"] });
userRepository.find({
  relations: ["profile", "photos", "videos", "videos.video_attributes"]
});
```

- `join` - 需要为实体执行联接，扩展版对的"relations"。

```typescript
userRepository.find({
  join: {
    alias: "user",
    leftJoinAndSelect: {
      profile: "user.profile",
      photo: "user.photos",
      video: "user.videos"
    }
  }
});
```

- `where` -查询实体的简单条件。

```typescript
userRepository.find({ where: { firstName: "Timber", lastName: "Saw" } });
```

查询嵌入实体列应该根据定义它的层次结构来完成。例：

```typescript
userRepository.find({ where: { name: { first: "Timber", last: "Saw" } } });
```

使用 OR 运算符查询：

```typescript
userRepository.find({
  where: [
    { firstName: "Timber", lastName: "Saw" },
    { firstName: "Stan", lastName: "Lee" }
  ]
});
```

将执行以下查询：

```sql
SELECT * FROM "user" WHERE ("firstName" = 'Timber' AND "lastName" = 'Saw') OR ("firstName" = 'Stan' AND "lastName" = 'Lee')
```

- `order` - 选择排序

```typescript
userRepository.find({
  order: {
    name: "ASC",
    id: "DESC"
  }
});
```

返回多个实体的`find`方法（`find`，`findAndCount`，`findByIds`），同时也接受以下选项：

- `skip` - 偏移（分页）

```typescript
userRepository.find({
  skip: 5
});
```

- `take` - limit (分页) - 得到的最大实体数。

```typescript
userRepository.find({
  take: 10
});
```

如果你正在使用带有 MSSQL 的 typeorm，并且想要使用`take`或`limit`，你必须正确使用 order，否则将会收到以下错误：`'FETCH语句中NEXT选项的使用无效。'`

```typescript
userRepository.find({
  order: {
    columnName: "ASC"
  },
  skip: 0,
  take: 10
});
```

- `cache` - 启用或禁用查询结果缓存。有关更多信息和选项，请参见[caching](https://typeorm.io/#/caching/)。

```typescript
userRepository.find({
  cache: true
});
```

- `lock` - 启用锁查询。只能在`findOne`方法中使用。`lock`是一个对象，可以定义为：

```ts
{ mode: "optimistic", version: number|Date }
```

或者

```ts
{
  mode: "pessimistic_read" | "pessimistic_write" | "dirty_read";
}
```

例如:

```typescript
userRepository.findOne(1, {
  lock: { mode: "optimistic", version: 1 }
});
```

find 选项的完整示例：

```typescript
userRepository.find({
  select: ["firstName", "lastName"],
  relations: ["profile", "photos", "videos"],
  where: {
    firstName: "Timber",
    lastName: "Saw"
  },
  order: {
    name: "ASC",
    id: "DESC"
  },
  skip: 5,
  take: 10,
  cache: true
});
```

## 进阶选项

TypeORM 提供了许多内置运算符，可用于创建更复杂的查询：

- `Not`

```ts
import { Not } from "typeorm";

const loadedPosts = await connection.getRepository(Post).find({
  title: Not("About #1")
});
```

将执行以下查询：

```sql
SELECT * FROM "post" WHERE "title" != 'About #1'
```

- `LessThan`

```ts
import { LessThan } from "typeorm";

const loadedPosts = await connection.getRepository(Post).find({
  likes: LessThan(10)
});
```

将执行以下查询：

```sql
SELECT * FROM "post" WHERE "likes" < 10
```

- `LessThanOrEqual`

```ts
import { LessThanOrEqual } from "typeorm";
const loadedPosts = await connection.getRepository(Post).find({
  likes: LessThanOrEqual(10)
});
```

将执行以下查询：

```sql
SELECT * FROM "post" WHERE "likes" <= 10
```

- `MoreThan`

```ts
import { MoreThan } from "typeorm";

const loadedPosts = await connection.getRepository(Post).find({
  likes: MoreThan(10)
});
```

将执行以下查询：

```sql
SELECT * FROM "post" WHERE "likes" > 10
```

- `MoreThanOrEqual`

```ts
import { MoreThanOrEqual } from "typeorm";
const loadedPosts = await connection.getRepository(Post).find({
  likes: MoreThanOrEqual(10)
});
```

将执行以下查询：

```sql
SELECT * FROM "post" WHERE "likes" >= 10
```

- `Equal`

```ts
import { Equal } from "typeorm";

const loadedPosts = await connection.getRepository(Post).find({
  title: Equal("About #2")
});
```

将执行以下查询：

```sql
SELECT * FROM "post" WHERE "title" = 'About #2'
```

- `Like`

```ts
import { Like } from "typeorm";

const loadedPosts = await connection.getRepository(Post).find({
  title: Like("%out #%")
});
```

将执行以下查询：

```sql
SELECT * FROM "post" WHERE "title" LIKE '%out #%'
```

- `Between`

```ts
import { Between } from "typeorm";

const loadedPosts = await connection.getRepository(Post).find({
  likes: Between(1, 10)
});
```

将执行以下查询：

```sql
SELECT * FROM "post" WHERE "likes" BETWEEN 1 AND 10
```

- `In`

```ts
import { In } from "typeorm";

const loadedPosts = await connection.getRepository(Post).find({
  title: In(["About #2", "About #3"])
});
```

将执行以下查询：

```sql
SELECT * FROM "post" WHERE "title" IN ('About #2','About #3')
```

- `Any`

```ts
import { Any } from "typeorm";

const loadedPosts = await connection.getRepository(Post).find({
  title: Any(["About #2", "About #3"])
});
```

将执行以下查询： (Postgres notation):

```sql
SELECT * FROM "post" WHERE "title" = ANY(['About #2','About #3'])
```

- `IsNull`

```ts
import { IsNull } from "typeorm";

const loadedPosts = await connection.getRepository(Post).find({
  title: IsNull()
});
```

将执行以下查询：

```sql
SELECT * FROM "post" WHERE "title" IS NULL
```

- `Raw`

```ts
import { Raw } from "typeorm";

const loadedPosts = await connection.getRepository(Post).find({
  likes: Raw("1 + likes = 4")
});
```

将执行以下查询：

```sql
SELECT * FROM "post" WHERE 1 + "likes" = 4
```

> 注意：注意`Raw`操作符。它应该从提供的表达式执行纯 SQL，而不能包含用户输入，否则将导致 SQL 注入。

你还可以将这些运算符与`Not`运算符组合使用：

```ts
import { Not, MoreThan, Equal } from "typeorm";

const loadedPosts = await connection.getRepository(Post).find({
  likes: Not(MoreThan(10)),
  title: Not(Equal("About #2"))
});
```

将执行以下查询：

```sql
SELECT * FROM "post" WHERE NOT("likes" > 10) AND NOT("title" = 'About #2')
```

# 自定义存储库

你可以创建一个自定义存储库，其中应包含使用数据库的方法。通常为单个实体创建自定义存储库，并包含其特定查询。比如，假设我们想要一个名为 findByName（firstName：string，lastName：string）的方法，它将按给定的 first 和 last names 搜索用户。这个方法的最好的地方是在 Repository，所以我们可以这样称呼它 userRepository.findByName（...）。你也可以使用自定义存储库来实现此目的。有几种方法可以创建自定义存储库。

- 扩展了标准存储库的定制存储库
- 扩展了标准 AbstractRepository 的自定义存储库
- 没有扩展的自定义存储库
- 在事务中使用自定义存储库或为什么自定义存储库不能是服务

## 扩展了标准存储库的定制存储库

创建自定义 repository 的第一种方法是扩展`Repository`。 例如：

```typescript
import { EntityRepository, Repository } from "typeorm";
import { User } from "../entity/User";

@EntityRepository(User)
export class UserRepository extends Repository<User> {
  findByName(firstName: string, lastName: string) {
    return this.findOne({ firstName, lastName });
  }
}
```

然后你可以这样使用它：

```typescript
import { getCustomRepository } from "typeorm";
import { UserRepository } from "./repository/UserRepository";

const userRepository = getCustomRepository(UserRepository); // 或connection.getCustomRepository或manager.getCustomRepository（）
const user = userRepository.create(); // 和 const user = new User();一样
user.firstName = "Timber";
user.lastName = "Saw";
await userRepository.save(user);

const timber = await userRepository.findByName("Timber", "Saw");
```

如你所见，你也可以使用`getCustomRepository` 获取 repository， 并且可以访问在其中创建的任何方法以及标准实体 repository 中的任何方法。

## 扩展了标准 AbstractRepository 的自定义存储库

创建自定义 repository 的第二种方法是扩展`AbstractRepository`：

```typescript
import { EntityRepository, AbstractRepository } from "typeorm";
import { User } from "../entity/User";

@EntityRepository(User)
export class UserRepository extends AbstractRepository<User> {
  createAndSave(firstName: string, lastName: string) {
    const user = new User();
    user.firstName = firstName;
    user.lastName = lastName;
    return this.manager.save(user);
  }

  findByName(firstName: string, lastName: string) {
    return this.repository.findOne({ firstName, lastName });
  }
}
```

然后你可以这样使用它：

```typescript
import { getCustomRepository } from "typeorm";
import { UserRepository } from "./repository/UserRepository";

const userRepository = getCustomRepository(UserRepository); // or connection.getCustomRepository or manager.getCustomRepository()
await userRepository.createAndSave("Timber", "Saw");
const timber = await userRepository.findByName("Timber", "Saw");
```

这种类型的存储库与前一个存储库之间的区别在于它没有公开`Repository`所具有的所有方法。 `AbstractRepository`没有任何公共方法，它只有受保护的方法，比如`manager`和`repository`，你可以在自己的公共方法中使用它们。 如果你不希望将标准`Repository`所有方法公开给 public，那么扩展`AbstractRepository`将非常有用。

## 没有扩展的自定义存储库

创建存储库的第三种方法是不扩展任何东西， 但是需要定义一个总是接受实体管理器(entity manager)实例的构造函数：

```typescript
import { EntityRepository, Repository, EntityManager } from "typeorm";
import { User } from "../entity/User";

@EntityRepository()
export class UserRepository {
  constructor(private manager: EntityManager) {}

  createAndSave(firstName: string, lastName: string) {
    const user = new User();
    user.firstName = firstName;
    user.lastName = lastName;
    return this.manager.save(user);
  }

  findByName(firstName: string, lastName: string) {
    return this.manager.findOne(User, { firstName, lastName });
  }
}
```

然后你可以这样使用它：

```typescript
import { getCustomRepository } from "typeorm";
import { UserRepository } from "./repository/UserRepository";

const userRepository = getCustomRepository(UserRepository); // 或者 connection.getCustomRepository 或者 manager.getCustomRepository()
await userRepository.createAndSave("Timber", "Saw");
const timber = await userRepository.findByName("Timber", "Saw");
```

这种类型的存储库不会扩展任何东西，你只需要定义一个必须接受`EntityManager`的构造函数。 然后在存储库方法中的任何位置使用它。 此外，这种类型的存储库不绑定到特定实体，因此你可以使用其中的多个实体进行操作。

## 在事务中使用自定义存储库或为什么自定义存储库不能是服务

自定义存储库不能是服务，因为应用程序中没有自定义存储库的单个实例（就像常规存储库或实体管理器一样）。 除了您的应用程序中可能存在多个连接（实体管理器和存储库不同）之外，存储库和管理器在事务中也是不同的。

例如：

```typescript
await connection.transaction(async manager => {
  // 在事务中你必须使用事务提供的管理器实例而不能使用全局管理器、存储库或自定义存储库，
  // 因为这个管理器是独占的和事务性的，
  // 如果让我们自定义存储库作为服务,它的一个"manager"属性应该 是EntityManager的唯一实例，但没有全局的EntityManager实例，并且也不可能有。
  // 这就是为什么自定义管理器特定于每个EntityManager而不能是服务。
  // 这也提供了在事务中使用自定义存储库而不会出现什么问题：
  const userRepository = manager.getCustomRepository(UserRepository); // 不要在这里使用全局的getCustomRepository！
  await userRepository.createAndSave("Timber", "Saw");
  const timber = await userRepository.findByName("Timber", "Saw");
});
```
