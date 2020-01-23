# MVP: 将视图与模型解耦

维基百科将 [MVP](http://en.wikipedia.org/wiki/Model%E2%80%93view%E2%80%93presenter) 称为 MVC 的一个推导扩展，观其渊源而知其所以然。对于 MVP 概念的定义，Microsoft 较为明晰，而 Martin Fowler 的定义最为广泛接受。MVP 模式在 WinForm 系列以 Visual-XXX 命名的编程语言与 Java Swing 等系列应用中最早流传开来，不过后来 ASP.NET 以及 JFaces 也广泛地使用了该模式。

在 MVP 中用户不再与 Presenter 进行直接交互，而是由 View 完全接管了用户交互，譬如窗口上的每个控件都知道如何响应用户输入并且合适地渲染来自于 Model 的数据。而所有的事件会被传输给 Presenter，Presenter 在这里就是 View 与 Model 之间的中间人，负责控制 Model 进行修改以及将最新的 Model 状态传递给 View。这里描述的就是典型的所谓 Passive View 版本的 MVP，其典型的用户场景为：

-  用户交互输入了某些内容

- View 将用户输入转化为发送给 Presenter
- Presenter 控制 Model 接收需要改变的点
- Model 将更新之后的值返回给 Presenter
- Presenter 将更新之后的模型返回给 View

![](https://coding.net/u/hoteam/p/Cache/git/raw/master/2016/7/2/28983226-1BC6-4AD2-900B-E7D254266D4F.png)

根据上述流程，我们可知 Passive View 版本的 MVP 模式的特性为：

- View、Presenter、Model 中皆有 ViewLogic 的部分实现
- Presenter 负责连接 View 与 Model，需要了解 View 与 Model 的细节。
- View 需要了解 Presenter 的细节，将用户输入转化为事件传递给 Presenter
- Model 需要了解 Presenter 的细节，在完成更新之后将最新的模型传递给 Presenter
- View 与 Model 之间相互解耦合

### Supervising Controller MVP

简化 Presenter 的部分功能，使得 Presenter 只起到需要复杂控制或者调解的操作，而简单的 Model 展示转化直接由 View 与 Model 进行交互：

![](https://coding.net/u/hoteam/p/Cache/git/raw/master/2016/7/2/EB81D8B6-227A-4E94-8107-C6DCC7920574.png)

# iOS MVP

![](https://coding.net/u/hoteam/p/Cache/git/raw/master/2016/7/2/1-hKUCPEHg6TDz6gtOlnFYwQ.png)
Cocoa 中 MVP 模式是将 ViewController 当做纯粹的 View 进行处理，而将很多的 ViewLogic 与模型操作移动到 Presenter 中进行，代码如下:

```swift
import UIKit

struct Person { // Model
 let firstName: String
 let lastName: String
}

protocol GreetingView: class {
 func setGreeting(greeting: String)
}

protocol GreetingViewPresenter {
 init(view: GreetingView, person: Person)
 func showGreeting()
}

class GreetingPresenter : GreetingViewPresenter {
 unowned let view: GreetingView
 let person: Person
 required init(view: GreetingView, person: Person) {
  self.view = view
  self.person = person
 }
 func showGreeting() {
  let greeting = "Hello" + " " + self.person.firstName + " " + self.person.lastName
  self.view.setGreeting(greeting)
 }
}

class GreetingViewController : UIViewController, GreetingView {
 var presenter: GreetingViewPresenter!
 let showGreetingButton = UIButton()
 let greetingLabel = UILabel()
    
 override func viewDidLoad() {
  super.viewDidLoad()
  self.showGreetingButton.addTarget(self, action: "didTapButton:", forControlEvents: .TouchUpInside)
 }
    
 func didTapButton(button: UIButton) {
  self.presenter.showGreeting()
 }
    
 func setGreeting(greeting: String) {
  self.greetingLabel.text = greeting
 }
    
 // layout code goes here
}
// Assembling of MVP
let model = Person(firstName: "David", lastName: "Blaine")
let view = GreetingViewController()
let presenter = GreetingPresenter(view: view, person: model)
view.presenter = presenter
```

- Distribution:主要的业务逻辑分割在了 Presenter 与 Model 中，View 相对呆板一点
- Testability:较为方便地测试
- 易用性:代码职责分割的更为明显，不过不像 MVC 那样直观易懂了

# Android

- 将 Presenter 与 View 绑定，并且将用户响应事件绑定到 Presenter 中

```java
  //Set up presenter
  presenter = new MainPresenter();
  presenter.attachView(this);
  // ...
  // Set up search button
  searchButton = (ImageButton) findViewById(R.id.button_search);
  searchButton.setOnClickListener(new View.OnClickListener  () {
       @Override
       public void onClick(View v) {
        presenter.loadRepositories(editTextUsername.getText().toString());
       }
});
```

- Presenter 中调用 Model 更新数据，并且调用 View 中进行重新渲染

```java
 public void loadRepositories(String usernameEntered) {
  String username = usernameEntered.trim();
  if (username.isEmpty()) return;

  mainMvpView.showProgressIndicator();
  if (subscription != null) subscription.unsubscribe();
  ArchiApplication application = ArchiApplication.get(mainMvpView.getContext());
  GithubService githubService = application.getGithubService();
  subscription = githubService.publicRepositories(username)
    .observeOn(AndroidSchedulers.mainThread())
    .subscribeOn(application.defaultSubscribeScheduler())
    .subscribe(new Subscriber<List<Repository>>() {
     @Override
     public void onCompleted() {
      Log.i(TAG, "Repos loaded " + repositories);
      if (!repositories.isEmpty()) {
       mainMvpView.showRepositories(repositories);
      } else {
       mainMvpView.showMessage(R.string.text_empty_repos);
      }
     }

     @Override
     public void onError(Throwable error) {
      Log.e(TAG, "Error loading GitHub repos ", error);
      if (isHttp404(error)) {
       mainMvpView.showMessage(R.string.error_username_not_found);
      } else {
       mainMvpView.showMessage(R.string.error_loading_repos);
      }
     }


     @Override
     public void onNext(List<Repository> repositories) {
      MainPresenter.this.repositories = repositories;
     }
    });
        }
```
