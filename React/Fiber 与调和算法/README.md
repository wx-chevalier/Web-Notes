# Fiber

将整个更新划分为多个原子性的任务，这就保证了原本完整的组件的更新流程可以被中断与恢复。在浏览器的空闲期执行这些任务并且区别高优先级与低优先级的任务

In React 15, if A is replaced by B, we unmount A, and then create and mount B:

A.componentWillUnmount
B.constructor
B.componentWillMount
B.componentDidMount
In Fiber, we create B first, and only later unmount A and mount B:

B.constructor
B.componentWillMount
A.componentWillUnmount
B.componentDidMount

Cooperative Scheduling

Stack Reconciler

Work-in-Progress Tree

将当前界面树上的指针指向 Work-in-Progress 树中的对应节点，从而通过简单的键值复制来实现对象复用；这种技术也就是所谓的 Double Buffering，其能够在内存分配与垃圾回收等多个方面进行性能优化。

- Synchronous
- Task
- Animation

* High Priority: 动画与用户交互
* Low Priority: 网络请求
* OffScreen: 任何的隐藏对象

在 Fiber 的设计中，另一个需要考虑的情形就是所谓的饥饿(Starvation)，如果我们持续性地存在大量的高优先级的更新请求，那么是否低优先级的更新请求就一直无法执行？

React 另一个存在的问题就是初次渲染缓慢，目前 React 在渲染之前需要抓取到完整的代码文件(不考虑异步加载的情形)，而利用 Streaming Rendering 技术，React 允许

# 链接

- https://medium.com/@chang_yan/get-started-with-react-fiber-ea30e597aad0
- https://medium.com/react-in-depth/inside-fiber-in-depth-overview-of-the-new-reconciliation-algorithm-in-react-e1c04700ef6e
- https://medium.com/react-in-depth/the-how-and-why-on-reacts-usage-of-linked-list-in-fiber-67f1014d0eb7
- https://medium.com/edge-coders/react-16-features-and-fiber-explanation-e779544bb1b7
- https://segmentfault.com/a/1190000019592928
