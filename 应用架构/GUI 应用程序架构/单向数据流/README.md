# Unidirectional User Interface Architecture: 单向数据流

Unidirectional User Interface Architecture 架构的概念源于后端常见的 CQRS/Event Sourcing 模式，其核心思想即是将应用状态被统一存放在一个或多个的 Store 中，并且所有的数据更新都是通过可观测的 Actions 触发，而所有的 View 都是基于 Store 中的状态渲染而来。该架构的最大优势在于整个应用中的数据流以单向流动的方式从而使得有用更好地可预测性与可控性，这样可以保证你的应用各个模块之间的松耦合性。与 MVVM 模式相比，其解决了以下两个问题：

- 避免了数据在多个 ViewModel 中的冗余与不一致问题

- 分割了 ViewModel 的职责，使得 ViewModel 变得更加 Clean
