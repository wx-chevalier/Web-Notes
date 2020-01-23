# Clean Architecture

![](http://luboganev.github.io/images/2015-07-23-clean-architecture-pt2/CleanArchitecture.jpg)

Uncle Bob 提出 Clean Architecture 最早并不是专门面向于 GUI 应用程序，而是描述了一种用于构建可扩展、可测试软件系统的概要原则。Clean Architecture 可能运用于构建网站、Web 应用、桌面应用以及移动应用等不同领域场景的软件开发中。其定义的基本原则保证了关注点分离以及整个软件项目的模块性与可组织性，也就是我们在上文提及的 GUI 应用程序架构中所需要考量的点。Clean Architecture 中最基础的理论当属所谓的依赖原则(Dependency Rule)，在依赖洋葱图中的任一内层模块不应该了解或依赖于任何外层模块。换言之，我们定义在外层模块中的代码不应该被内层模块所引入，包括变量、函数、类等等任何的软件实体。

除此之外，Clean Architecture 还强制规定了所有邻接圈层之间的交互与通信应当以抽象方式定义，譬如在 Android 中应该利用 Java 提供的 POJOs 以及 Interfaces，而 iOS 中应该使用 Protocols 或者标准类。这种强制定义也就保证了不同层之间的组件完全解耦合，并且能够很方便地更改或者 Mock 测试，而不会影响到其他层的代码。Clean Architecture 是非常理想化的架构定义模式，也仅是提出了一些基本的原则，其在 iOS 的具体实践也就是所谓的 VIPER 架构。

## iOS Viper Architecture

Viper 架构中职责分割地更为细致，大概分为了五层:
![](https://coding.net/u/hoteam/p/Cache/git/raw/master/2016/7/2/1-0pN3BNTXfwKbf08lhwutag.png)

- Interactor:包含了与数据以及网络相关的业务逻辑，譬如从服务端获取数据并构造出实体对象。很多时候我们会使用所谓的 Services 或者 Managers 来负责此方面的工作
- 包含 UI 相关的一些业务逻辑，调用 Interactor 中的方法
- Entities:单纯的数据对象而不是数据访问层
- Router:在 VIPER 模块间完成路由

一般来说，一个 VIPER 模块可以是单独的某个页面或者整个应用程序，经常会按照权限来划分。

```swift
import UIKit

struct Person { // Entity (usually more complex e.g. NSManagedObject)
    let firstName: String
    let lastName: String
}

struct GreetingData { // Transport data structure (not Entity)
    let greeting: String
    let subject: String
}

protocol GreetingProvider {
    func provideGreetingData()
}

protocol GreetingOutput: class {
    func receiveGreetingData(greetingData: GreetingData)
}

class GreetingInteractor : GreetingProvider {
    weak var output: GreetingOutput!

    func provideGreetingData() {
        let person = Person(firstName: "David", lastName: "Blaine") // usually comes from data access layer
        let subject = person.firstName + " " + person.lastName
        let greeting = GreetingData(greeting: "Hello", subject: subject)
        self.output.receiveGreetingData(greeting)
    }
}


protocol GreetingViewEventHandler {
    func didTapShowGreetingButton()
}

protocol GreetingView: class {
    func setGreeting(greeting: String)
}

class GreetingPresenter : GreetingOutput, GreetingViewEventHandler {
    weak var view: GreetingView!
    var greetingProvider: GreetingProvider!

    func didTapShowGreetingButton() {
        self.greetingProvider.provideGreetingData()
    }

    func receiveGreetingData(greetingData: GreetingData) {
        let greeting = greetingData.greeting + " " + greetingData.subject
        self.view.setGreeting(greeting)
    }
}

class GreetingViewController : UIViewController, GreetingView {
    var eventHandler: GreetingViewEventHandler!
    let showGreetingButton = UIButton()
    let greetingLabel = UILabel()


    override func viewDidLoad() {
        super.viewDidLoad()
        self.showGreetingButton.addTarget(self, action: "didTapButton:", forControlEvents: .TouchUpInside)
    }

    func didTapButton(button: UIButton) {
        self.eventHandler.didTapShowGreetingButton()
    }

    func setGreeting(greeting: String) {
        self.greetingLabel.text = greeting
    }

    // layout code goes here
}
// Assembling of VIPER module, without Router
let view = GreetingViewController()
let presenter = GreetingPresenter()
let interactor = GreetingInteractor()
view.eventHandler = presenter
presenter.view = view
presenter.greetingProvider = interactor
interactor.output = presenter
```

- Distribution: 毫无疑问，VIPER 中职责分割的最为细致

- Testability: 测试性肯定也是最好的

- 易用性: 代码最多
