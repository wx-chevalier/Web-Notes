# Mock Service Worker

通过拦截网络层面的请求来进行 Mock。在测试、开发和调试中无缝重用相同的 mock 定义。

```js
import { setupWorker, rest } from "msw";
const worker = setupWorker(
  rest.post("/login", (req, res, ctx) => {
    const { username } = req.body;
    return res(
      ctx.json({
        username,
        firstName: "John",
      })
    );
  })
);
worker.start();
```
