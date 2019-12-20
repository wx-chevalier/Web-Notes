![](https://s2.ax1x.com/2019/09/03/nAtlp6.png)

# 现代 Web 开发--Vue.js 篇

本系列文章从属于 [Vue.js 与前端工程化实践](https://parg.co/bWg)一书，本书的首要目标即是以 Vue.js 为核心的技术体系为主线，为读者构建完整的前端技术知识体系，探讨前端工程化的思想，并且能使不同技术水准的读者都有所得。

Vue is probably the newest kid on the block in terms of popular frameworks, and its profile isn’t as high as any of the others here. That said, Vue is probably the fastest rising new star as well. Vue fits in a similar niche to React. It’s not on its own a full framework, but a binding library, the “View” part of an MVC or MVVM application. Hence the name.

There is a lot to like about Vue. It’s intended to be used as a progressive framework. Pieces of it can be added a bit at a time. Initially it might be just used with the library pulled in from a CDN, and used to make simple components. Over time more functionality can be added, such as a router, state management and http abstraction, and a comprehensive build pipeline implemented to tie it altogether. But none of that needs to be done up front.

This means that Vue’s “buy in” is reasonable and manageable. You don’t need to commit to learning a complex tool to solve simple problems. You can use a simple tool to solve simple problems, then increase to more complex solutions to match those problems. And critically, you can learn that tool a bit at a time, progressively.

Vue is also fast. Very fast. Though React pioneered the virtual DOM pattern, Vue has gone the furthest in optimising that process. It is now (and in many cases by a significant margin) the single fastest of the frameworks listed here.
The success of Vue is in part due to the support of the Laravel framework, which has wisely made Vue a first-class citizen, providing some simple optimisations to make it even easier to get Vue running on a Laravel app. With so much support and an enthusiastic community, Vue is a solid bet for any project, from the simple to the highly advanced. It’s already gone from being a small edge framework to being highly visible and discussed in communities like Reddit.

本篇文章配套示例代码参考 [vue-snippets](https://github.com/wx-chevalier/vue-snippets)。
