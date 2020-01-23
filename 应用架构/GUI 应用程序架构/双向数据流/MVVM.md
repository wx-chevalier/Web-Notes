## MVVM: 数据绑定与无状态的视图

Model View View-Model 模型是 `MV*`家族中最年轻的一位，也是由 Microsoft 提出，并经由 Martin Fowler 布道传播。MVVM 源于 Martin Fowler 的 Presentation Model，Presentation Model 的核心在于接管了 View 所有的行为响应，View 的所有响应与状态都定义在了 Presentation Model 中。也就是说，View 不会包含任意的状态。举个典型的使用场景，当用户点击某个按钮之后，状态信息是从 Presentation Model 传递给 Model，而不是从 View 传递给 Presentation Model。任何控制组件间的逻辑操作，即上文所述的 ViewLogic，都应该放置在 Presentation Model 中进行处理，而不是在 View 层，这一点也是 MVP 模式与 Presentation Model 最大的区别。

MVVM 模式进一步深化了 Presentation Model 的思想，利用 Data Binding 等技术保证了 View 中不会存储任何的状态或者逻辑操作。在 WPF 中，UI 主要是利用 XAML 或者 XML 创建，而这些标记类型的语言是无法存储任何状态的，就像 HTML 一样(因此 JSX 语法其实是将 View 又有状态化了)，只是允许 UI 与某个 ViewModel 中的类建立映射关系。渲染引擎根据 XAML 中的声明以及来自于 ViewModel 的数据最终生成呈现的页面。因为数据绑定的特性，有时候 MVVM 也会被称作 MVB:Model View Binder。总结一下，MVVM 利用数据绑定彻底完成了从命令式编程到声明式编程的转化，使得 View 逐步无状态化。一个典型的 MVVM 的使用场景为：

- 用户交互输入
- View 将数据直接传送给 ViewModel，ViewModel 保存这些状态数据
- 在有需要的情况下，ViewModel 会将数据传送给 Model
- Model 在更新完成之后通知 ViewModel
- ViewModel 从 Model 中获取最新的模型，并且更新自己的数据状态
- View 根据最新的 ViewModel 的数据进行重新渲染

![](https://coding.net/u/hoteam/p/Cache/git/raw/master/2016/7/2/BB708F10-1F39-4FFE-A66C-319293AAC71F.png)

根据上述流程，我们可知 MVVM 模式的特性为：

- ViewModel、Model 中存在 ViewLogic 实现，View 则不保存任何状态信息
- View 不需要了解 ViewModel 的实现细节，但是会声明自己所需要的数据类型，并且能够知道如何重新渲染
- ViewModel 不需要了解 View 的实现细节(非命令式编程)，但是需要根据 View 声明的数据类型传入对应的数据。ViewModel 需要了解 Model 的实现细节。
- Model 不需要了解 View 的实现细节，需要了解 ViewModel 的实现细节

# iOS

![](https://coding.net/u/hoteam/p/Cache/git/raw/master/2016/7/2/1-uhPpTHYzTmHGrAZy8hiM7w.png)

```swift
import UIKit

struct Person { // Model
    let firstName: String
    let lastName: String
}

protocol GreetingViewModelProtocol: class {
    var greeting: String? { get }
    var greetingDidChange: ((GreetingViewModelProtocol) -> ())? { get set } // function to call when greeting did change
    init(person: Person)
    func showGreeting()
}

class GreetingViewModel : GreetingViewModelProtocol {
    let person: Person
    var greeting: String? {
didSet {
    self.greetingDidChange?(self)
}
    }
    var greetingDidChange: ((GreetingViewModelProtocol) -> ())?
    required init(person: Person) {
self.person = person
    }
    func showGreeting() {
self.greeting = "Hello" + " " + self.person.firstName + " " + self.person.lastName
    }
}

class GreetingViewController : UIViewController {
    var viewModel: GreetingViewModelProtocol! {
didSet {
    self.viewModel.greetingDidChange = { [unowned self] viewModel in
self.greetingLabel.text = viewModel.greeting
    }
}
    }
    let showGreetingButton = UIButton()
    let greetingLabel = UILabel()
    
    override func viewDidLoad() {
super.viewDidLoad()
self.showGreetingButton.addTarget(self.viewModel, action: "showGreeting", forControlEvents: .TouchUpInside)
    }
    // layout code goes here
}
// Assembling of MVVM
let model = Person(firstName: "David", lastName: "Blaine")
let viewModel = GreetingViewModel(person: model)
let view = GreetingViewController()
view.viewModel = viewModel
```

- Distribution:在 Cocoa MVVM 中，View 相对于 MVP 中的 View 担负了更多的功能，譬如需要构建数据绑定等等
- Testability:ViewModel 拥有 View 中的所有数据结构，因此很容易就可以进行测试
- 易用性:相对而言有很多的冗余代码

# Android

- XML 中声明数据绑定

```xml
<data>
<variable
    name="viewModel"
    type="uk.ivanc.archimvvm.viewmodel.MainViewModel"/>
</data>
...

    <EditText
android:id="@+id/edit_text_username"
android:layout_width="match_parent"
android:layout_height="wrap_content"
android:layout_toLeftOf="@id/button_search"
android:hint="@string/hit_username"
android:imeOptions="actionSearch"
android:inputType="text"
android:onEditorAction="@{viewModel.onSearchAction}"
android:textColor="@color/white"
android:theme="@style/LightEditText"
                app:addTextChangedListener="@{viewModel.usernameEditTextWatcher}"/>



```

- View 中绑定 ViewModel

```java
super.onCreate(savedInstanceState);
binding = DataBindingUtil.setContentView(this, R.layout.main_activity);
mainViewModel = new MainViewModel(this, this);
binding.setViewModel(mainViewModel);
setSupportActionBar(binding.toolbar);
        setupRecyclerView(binding.reposRecyclerView);
```

- ViewModel 中进行数据操作

```java
public boolean onSearchAction(TextView view, int actionId, KeyEvent event) {
if (actionId == EditorInfo.IME_ACTION_SEARCH) {
    String username = view.getText().toString();
    if (username.length() > 0) loadGithubRepos(username);
    return true;
        }
        return false;
}


    public void onClickSearch(View view) {
loadGithubRepos(editTextUsernameValue);
    }


    public TextWatcher getUsernameEditTextWatcher() {
return new TextWatcher() {
    @Override
    public void beforeTextChanged(CharSequence charSequence, int start, int count, int after) {


    }


    @Override
    public void onTextChanged(CharSequence charSequence, int start, int before, int count) {
editTextUsernameValue = charSequence.toString();
searchButtonVisibility.set(charSequence.length() > 0 ? View.VISIBLE : View.GONE);
    }


    @Override
    public void afterTextChanged(Editable editable) {


    }
};
}
```
