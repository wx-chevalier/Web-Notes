# `MV*`: 碎片化的状态与双向数据流

MVC 模式将有关于渲染、控制与数据存储的概念有机分割，是 GUI 应用架构模式的一个巨大成就。但是，MVC 模式在构建能够长期运行、维护、有效扩展的应用程序时遇到了极大的问题。MVC 模式在一些小型项目或者简单的界面上仍旧有极大的可用性，但是在现代富客户端开发中导致职责分割不明确、功能模块重用性、View 的组合性较差。作为继任者 MVP 模式分割了 View 与 Model 之间的直接关联，MVP 模式中也将更多的 ViewLogic 转移到 Presenter 中进行实现，从而保证了 View 的可测试性。而最年轻的 MVVM 将 ViewLogic 与 View 剥离开来，保证了 View 的无状态性、可重用性、可组合性以及可测试性。总结而言，`MV*` 模型都包含了以下几个方面:

- Models:负责存储领域/业务逻辑相关的数据与构建数据访问层，典型的就是譬如 Person、PersonDataProvider。

- Views:负责将数据渲染展示给用户，并且响应用户输入

- Controller/Presenter/ViewModel:往往作为 Model 与 View 之间的中间人出现，接收 View 传来的用户事件并且传递给 Model，同时利用从 Model 传来的最新模型控制更新 View
