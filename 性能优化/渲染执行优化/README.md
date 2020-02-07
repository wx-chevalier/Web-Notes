# 渲染与执行优化

自 Chrome 60 以来，V8 中的原始 JavaScript 解析速度提高了 2 倍。与此同时，原始解析（和编译）成本变得不那么明显/重要，因为 Chrome 中的其他优化工作将其并行化。

V8 通过对工作人员进行解析和编译，将主线程上的解析和编译工作量平均减少了 40％（例如 Facebook 上为 46％，Pinterest 为 62％），最高改进率为 81％（YouTube）线。这是现有的离线主流线程解析/编译的补充。

- SSR: Server-Side Rendering - rendering a client-side or universal app to HTML on the server.

- CSR: Client-Side Rendering - rendering an app in a browser, generally using the DOM.

- Rehydration: “booting up” JavaScript views on the client such that they reuse the server-rendered HTML’s DOM tree and data.

- Prerendering: running a client-side application at build time to capture its initial state as static HTML.
