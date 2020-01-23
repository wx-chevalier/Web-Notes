# MVC: 巨石型控制器

相信每一个程序猿都会宣称自己掌握 MVC，这个概念浅显易懂，并且贯穿了从 GUI 应用到服务端应用程序。MVC 的概念源自 Gamma, Helm, Johnson 以及 Vlissidis 这四人帮在讨论设计模式中的 Observer 模式时的想法，不过在那本经典的设计模式中并没有显式地提出这个概念。我们通常认为的 MVC 名词的正式提出是在 1979 年 5 月 Trygve Reenskaug 发表的 Thing-Model-View-Editor 这篇论文，这篇论文虽然并没有提及 Controller，但是 Editor 已经是一个很接近的概念。大概 7 个月之后，Trygve Reenskaug 在他的文章 Models-Views-Controllers 中正式提出了 MVC 这个三元组。

上面两篇论文中对于 Model 的定义都非常清晰，Model 代表着 `an abstraction in the form of data in a computing system.`，即为计算系统中数据的抽象表述，而 View 代表着 `capable of showing one or more pictorial representations of the Model on screen and on hardcopy.`，即能够将模型中的数据以某种方式表现在屏幕上的组件。而 Editor 被定义为某个用户与多个 View 之间的交互接口，在后一篇文章中 Controller 则被定义为了 `a special controller ... that permits the user to modify the information that is presented by the view.`，即主要负责对模型进行修改并且最终呈现在界面上。

从我的个人理解来看，Controller 负责控制整个界面，而 Editor 只负责界面中的某个部分。Controller 协调菜单、面板以及像鼠标点击、移动、手势等等很多的不同功能的模块，而 Editor 更多的只是负责某个特定的任务。后来，Martin Fowler 在 2003 开始编写的著作 Patterns of Enterprise Application Architecture 中重申了 MVC 的意义：`Model View Controller (MVC) is one of the most quoted (and most misquoted) patterns around.`，将 Controller 的功能正式定义为：响应用户操作，控制模型进行相应更新，并且操作页面进行合适的重渲染。这是非常经典、狭义的 MVC 定义，后来在 iOS 以及其他很多领域实际上运用的 MVC 都已经被扩展或者赋予了新的功能，不过笔者为了区分架构演化之间的区别，在本文中仅会以这种最朴素的定义方式来描述 MVC。

根据上述定义，我们可以看到 MVC 模式中典型的用户场景为：

- 用户交互输入了某些内容
- Controller 将用户输入转化为 Model 所需要进行的更改
- Model 中的更改结束之后，Controller 通知 View 进行更新以表现出当前 Model 的状态

![](https://coding.net/u/hoteam/p/Cache/git/raw/master/2016/7/2/B24AC2FE-EC59-48AA-B94F-417AC73D9886.png)

根据上述流程，我们可知经典的 MVC 模式的特性为：

- View、Controller、Model 中皆有 ViewLogic 的部分实现
- Controller 负责控制 View 与 Model，需要了解 View 与 Model 的细节。
- View 需要了解 Controller 与 Model 的细节，需要在侦测用户行为之后调用 Controller，并且在收到通知后调用 Model 以获取最新数据
- Model 并不需要了解 Controller 与 View 的细节，相对独立的模块

### Observer Pattern:自带观察者模式的 MVC

上文中也已提及，MVC 滥觞于 Observer 模式，经典的 MVC 模式也可以与 Observer 模式相结合，其典型的用户流程为：
-  用户交互输入了某些内容
- Controller 将用户输入转化为 Model 所需要进行的更改

- View 作为 Observer 会监听 Model 中的任意更新，一旦有更新事件发出，View 会自动触发更新以展示最新的 Model 状态

![](https://coding.net/u/hoteam/p/Cache/git/raw/master/2016/7/2/565313A4-6639-468A-9E27-FE9E126CEFA2.png)

可知其与经典的 MVC 模式区别在于不需要 Controller 通知 View 进行更新，而是由 Model 主动调用 View 进行更新。这种改变提升了整体效率，简化了 Controller 的功能，不过也导致了 View 与 Model 之间的紧耦合。

# iOS

![](https://coding.net/u/hoteam/p/Cache/git/raw/master/2016/7/2/1-PkWjDU0jqGJOB972cMsrnA.png)

Cocoa MVC 中往往会将大量的逻辑代码放入 ViewController 中，这就导致了所谓的 Massive ViewController，而且很多的逻辑操作都嵌入到了 View 的生命周期中，很难剥离开来。或许你可以将一些业务逻辑或者数据转换之类的事情放到 Model 中完成，不过对于 View 而言绝大部分时间仅起到发送 Action 给 Controller 的作用。ViewController 逐渐变成了几乎所有其他组件的 Delegate 与 DataSource，还经常会负责派发或者取消网络请求等等职责。你的代码大概是这样的:

```
var userCell = tableView.dequeueReusableCellWithIdentifier("identifier") as UserCell
userCell.configureWithUser(user)
```

上面这种写法直接将 View 于 Model 关联起来，其实算是打破了 Cocoa MVC 的规范的，不过这样也是能够减少些 Controller 中的中转代码呢。这样一个架构模式在进行单元测试的时候就显得麻烦了，因为你的 ViewController 与 View 紧密关联，使得其很难去进行测试，因为你必须为每一个 View 创建 Mock 对象并且管理其生命周期。另外因为整个代码都混杂在一起，即破坏了职责分离原则，导致了系统的可变性与可维护性也很差。经典的 MVC 的示例程序如下:

```swift
import UIKit

struct Person { // Model
 let firstName: String
 let lastName: String
}


class GreetingViewController : UIViewController { // View + Controller
 var person: Person!
 let showGreetingButton = UIButton()
 let greetingLabel = UILabel()
    
 override func viewDidLoad() {
  super.viewDidLoad()
  self.showGreetingButton.addTarget(self, action: "didTapButton:", forControlEvents: .TouchUpInside)
 }
    
 func didTapButton(button: UIButton) {
  let greeting = "Hello" + " " + self.person.firstName + " " + self.person.lastName
  self.greetingLabel.text = greeting
     
 }
 // layout code goes here
}
// Assembling of MVC
let model = Person(firstName: "David", lastName: "Blaine")
let view = GreetingViewController()
view.person = model;
```

上面这种代码一看就很难测试，我们可以将生成 greeting 的代码移到 GreetingModel 这个单独的类中，从而进行单独的测试。不过我们还是很难去在 GreetingViewController 中测试显示逻辑而不调用 UIView 相关的譬如`viewDidLoad、didTapButton`等等较为费时的操作。再按照我们上文提及的优秀的架构的几个方面来看:

- Distribution:View 与 Model 是分割开来了，不过 View 与 Controller 是紧耦合的
- Testability:因为较差的职责分割导致貌似只有 Model 部分方便测试
- 易用性:因为程序比较直观，可能容易理解。

# Android

此部分完整代码在[这里](https://github.com/ivacf/archi)，笔者在这里节选出部分代码方便对照演示。Android 中的 Activity 的功能很类似于 iOS 中的 UIViewController，都可以看做 MVC 中的 Controller。在 2010 年左右经典的 Android 程序大概是这样的:

```java
TextView mCounterText;
Button mCounterIncrementButton;

int mClicks = 0;

public void onCreate(Bundle b) {
  super.onCreate(b);

  mCounterText = (TextView) findViewById(R.id.tv_clicks);
  mCounterIncrementButton = (Button) findViewById(R.id.btn_increment);

  mCounterIncrementButton.setOnClickListener(new View.OnClickListener() {
 public void onClick(View v) {
   mClicks++;
   mCounterText.setText(""+mClicks);
 }
  });
}
```

后来 2013 年左右出现了[ButterKnife](https://github.com/JakeWharton/butterknife)这样的基于注解的控件绑定框架，此时的代码看上去是这样的:

```

@Bind(R.id.tv_clicks) mCounterText;
@OnClick(R.id.btn_increment)
public void onSubmitClicked(View v) {
	mClicks++;
	mCounterText.setText("" + mClicks);
}
```

后来 Google 官方也推出了数据绑定的框架，从此 MVVM 模式在 Android 中也愈发流行:

```xml
<layout xmlns:android="http://schemas.android.com/apk/res/android">
   <data>
    <variable name="counter" type="com.example.Counter"/>
    <variable name="counter" type="com.example.ClickHandler"/>
   </data>
   <LinearLayout
    android:orientation="vertical"
    android:layout_width="match_parent"
    android:layout_height="match_parent">
    <TextView android:layout_width="wrap_content"
     android:layout_height="wrap_content"
     android:text="@{counter.value}"/>
    <Buttonandroid:layout_width="wrap_content"
     android:layout_height="wrap_content"
     android:text="@{handlers.clickHandle}"/>
   </LinearLayout>
</layout>
```

后来[Anvil](https://github.com/zserge/anvil)这样的受 React 启发的组件式框架以及 Jedux 这样借鉴了 Redux 全局状态管理的框架也将 Unidirectional  架构引入了 Android 开发的世界。

### MVC

- 声明 View 中的组件对象或者 Model 对象

```java
 private Subscription subscription;
 private RecyclerView reposRecycleView;
 private Toolbar toolbar;
 private EditText editTextUsername;
 private ProgressBar progressBar;
 private TextView infoTextView;
 private ImageButton searchButton;
```

- 将组件与 Activity 中对象绑定，并且声明用户响应处理函数

```java
  super.onCreate(savedInstanceState);
  setContentView(R.layout.activity_main);
  progressBar = (ProgressBar) findViewById(R.id.progress);
  infoTextView = (TextView) findViewById(R.id.text_info);
  //Set up ToolBar
  toolbar = (Toolbar) findViewById(R.id.toolbar);
  setSupportActionBar(toolbar);
  //Set up RecyclerView
  reposRecycleView = (RecyclerView) findViewById(R.id.repos_recycler_view);
  setupRecyclerView(reposRecycleView);
  // Set up search button
  searchButton = (ImageButton) findViewById(R.id.button_search);
  searchButton.setOnClickListener(new View.OnClickListener() {
   @Override
   public void onClick(View v) {
    loadGithubRepos(editTextUsername.getText().toString());
   }
  });
  //Set up username EditText
  editTextUsername = (EditText) findViewById(R.id.edit_text_username);
  editTextUsername.addTextChangedListener(mHideShowButtonTextWatcher);
  editTextUsername.setOnEditorActionListener(new TextView.OnEditorActionListener() {
   @Override
   public boolean onEditorAction(TextView v, int actionId, KeyEvent event) {
    if (actionId == EditorInfo.IME_ACTION_SEARCH) {
     String username = editTextUsername.getText().toString();
     if (username.length() > 0) loadGithubRepos(username);
     return true;
    }
    return false;
   }
});
```

- 用户输入之后的更新流程

```java
progressBar.setVisibility(View.VISIBLE);
reposRecycleView.setVisibility(View.GONE);
infoTextView.setVisibility(View.GONE);
ArchiApplication application = ArchiApplication.get(this);
GithubService githubService = application.getGithubService();

subscription = githubService.publicRepositories(username)
    .observeOn(AndroidSchedulers.mainThread())
    .subscribeOn(application.defaultSubscribeScheduler())
    .subscribe(new Subscriber<List<Repository>>() {
     @Override
     public void onCompleted() {
		progressBar.setVisibility(View.GONE);
		if (reposRecycleView.getAdapter().getItemCount() > 0) {
		 reposRecycleView.requestFocus();
		 hideSoftKeyboard();
		 reposRecycleView.setVisibility(View.VISIBLE);
		} else {
		 infoTextView.setText(R.string.text_empty_repos);
		 infoTextView.setVisibility(View.VISIBLE);
		}
     }


     @Override
     public void onError(Throwable error) {
		Log.e(TAG, "Error loading GitHub repos ", error);
		progressBar.setVisibility(View.GONE);
		if (error instanceof HttpException
		  && ((HttpException) error).code() == 404) {
		 infoTextView.setText(R.string.error_username_not_found);
		} else {
		 infoTextView.setText(R.string.error_loading_repos);
		}
		infoTextView.setVisibility(View.VISIBLE);
     }


     @Override
     public void onNext(List<Repository> repositories) {
		Log.i(TAG, "Repos loaded " + repositories);
		RepositoryAdapter adapter =
		  (RepositoryAdapter) reposRecycleView.getAdapter();
		adapter.setRepositories(repositories);
		adapter.notifyDataSetChanged();
     }
});
```
