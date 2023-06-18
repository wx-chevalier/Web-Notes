# 数据存储

| 存储方式       | 存储类型                         | 访问限制                      | 存储时长                        | 适用场景                  |
| -------------- | -------------------------------- | ----------------------------- | ------------------------------- | ------------------------- |
| Cookie         | 格式化字符串                     | 同源，可自定义访问域          | 自定义时长，默认为 Session 级别 | 用户认证信息              |
| sessionStorage | K-V, 仅可存放字符串              | 同一个 Tab 下的同域名         | 除了本 Tab 刷新，其他全部重置   | 当前页面音 / 视频播放进度 |
| localStorage   | K-V, 仅可存放字符串，存储限制 4M | 同域名，不同的 Tab 也可以访问 | 默认永久性存储                  | 本地缓存数据              |
| IndexedDB      | 文档型数据库，没有大小限制       | 同域名                        | 默认永久性存储                  | 大量本地缓存数据          |
| Love field     | 关系型数据库                     |                               |                                 |                           |
| LokiJS         | 内存数据库                       |                               |                                 |                           |

网络平台为开发者提供了许多存储选项，每一种都是在考虑到特定的使用情况下建立的。

- 其中一些选项显然与本建议不重叠，因为它们只允许存储极少量的数据，如[cookies](https://developer.mozilla.org/en-US/docs/Web/HTTP/Cookies)，或由 "sessionStorage "和 "localStorage "机制组成的[Web Storage API](https://developer.mozilla.org/en-US/docs/Web/API/Web_Storage_API)。
- 其他选项由于各种原因已经被废弃，如[文件和目录条目 API](https://developer.mozilla.org/en-US/docs/Web/API/File_and_Directory_Entries_API/Introduction)或[WebSQL](https://www.w3.org/TR/webdatabase/)。
- 文件系统访问 API](https://web.dev/file-system-access/)有一个类似的API表面，但它的用途是与客户的文件系统对接，并提供对可能不属于原点甚至是浏览器所有权的数据的访问。这种不同的重点伴随着更严格的安全考虑和更高的性能成本。
- [IndexedDB API](https://developer.mozilla.org/en-US/docs/Web/API/IndexedDB_API)可以作为 Storage Foundation API 的一些用例的后端。例如，Emscripten 包括[IDBFS](https://emscripten.org/docs/api_reference/Filesystem-API.html)，一个基于 IndexedDB 的持久化文件系统。然而，由于 IndexedDB 从根本上说是一个键值存储，它有很大的性能限制。此外，在 IndexedDB 下，直接访问一个文件的子部分甚至更加困难和缓慢。
- 最后，[CacheStorage 接口](https://developer.mozilla.org/en-US/docs/Web/API/CacheStorage)被广泛支持，并被调整为存储大尺寸数据，如网络应用程序资源，但其值是不可变的。

# Links

- https://segmentfault.com/a/1190000019982238
