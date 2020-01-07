# Nest

近些年来，随着 Node.js 的发展，JavaScript 日渐成为 Web 开发中前后端皆可用的最流行语言，也为 Angular、React、Vue.js 这些优秀的前端项目的崛起提供了基石。而 Next.js 则致力于提供开箱即用的应用架构，允许开发者快速构建高可测试、可扩展、松耦合、易维护的 Node.js Web 应用。

[Nest.js](https://docs.nestjs.com/) 基于 TypeScript 构建，其和 TypeScript 无缝衔接，同时允许开发者使用现代 JavaScript 进行开发。Nest.js 融合了面向对象编程 OOP、函数式编程 FP、函数响应式编程 FRP 的优秀思想,为开发者提供了完善的功能特性与使用体验；其底层使用了 Express，也方便了开发者集成 Express 生态圈相关的第三方插件。Next.js 的主要特性包括：依赖注入、WebSockets、模块化、响应式微服务、异常处理层、用于校验的 Pipe、用于角色化权限控制的 Guards、Interceptors、单元测试与集成测试等。

> 注：本系列是对于官网文档和示例，以及笔者自身实践过程中的代码总结。

# 快速开始

本部分主要介绍 Nest.js 项目的基本搭建与请求处理相关内容，建议是直接下载官方的 TypeScript 模板作为项目初始化模板：

```sh
$ git clone https://github.com/nestjs/typescript-starter.git project
$ cd project
$ npm install
$ npm run start
```

典型的 Nest 项目会包含如下的模块：

```s
src
├── app.controller.spec.ts
├── app.controller.ts
├── app.module.ts
├── app.service.ts
└── main.ts
```

```ts
import { NestFactory } from "@nestjs/core";

import { ApplicationModule } from "./modules/ApplicationModule";

async function bootstrap() {
  const app = await NestFactory.create(ApplicationModule);

  await app.listen(3000);
}

bootstrap();
```

## 控制器

```ts
// ApplicationModule.ts

import { Module } from "@nestjs/common";

import { HelloController } from "../controller/HelloController";

@Module({
  modules: [],

  controllers: [HelloController]
})
export class ApplicationModule {}
```

```ts
// HelloController.ts

import { Controller, Get } from "@nestjs/common";

@Controller("/")
export class HelloController {
  @Get()
  hello() {
    return "Next.js Boilerplate @ 王下邀月熊";
  }
}
```

```ts
import { Controller, Get, Post } from "@nestjs/common";

@Controller("cats")
export class CatsController {
  @Post()
  create() {
    // TODO: Add some logic here
  }

  @Get()
  findAll() {
    return [];
  }
}
```

## 平台

Nest 的目标是一个平台无关的框架。这个意思就是说 Nest 本身并不造某个细分领域的轮子，他只构建一套构架体系，然后把一些好用的库或者平台融合进来。所以 Nest 可以衔接任何 HTTP 框架，默认支持 express 和 fastify 两个 web 框架。

- platform-express: Express 是一个 Node web 框架，有很多社区成熟的资源。@nestjs/platform-express 默认会被引入，大家都很熟悉了，用起来会容易上手

- platform-fastify: Fastify 是一个高能低耗的框架，致力于最大化效率与速度

无论使用哪个平台，都要暴露自己的应用接口。上面两个平台暴露了对应的两个变量 NestExpressApplication and NestFastifyApplication。如下的代码会创建一个 app 对象，并且指定了使用 NestExpressApplication 平台：

```ts
const app = await NestFactory.create<NestExpressApplication>(ApplicationModule);
```

不过一般情况下不需要指定这个类型。

# 链接

- https://keelii.com/2019/07/03/nestjs-framework-tutorial-3/
