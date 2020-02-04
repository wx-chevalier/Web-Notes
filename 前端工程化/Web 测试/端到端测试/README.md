# 端到端测试

早期的端到端测试与爬虫的瓶颈点，都在于在于动态页面的处理，即如何执行页面中的 JavaScript 脚本，触发真实数据请求，从而获得实际有效的界面内容。不过随着 Selenium 这样的 Browser Automation 工具、PhantomJS/Puppeter 这样的 Headless Browser 工具的出现，该问题已是很容易解决。另一方面，测试用例中的步骤录制，即将用户行为转化为多个 DSL 描述的步骤，更关注于关键点的记录，而非全量（录屏工具的结果与操作应该是确定的、可预期的，而测试工具的结果应该是推导出的、不可预期的）；同时录制的时候需要将逻辑与数据相剥离，允许传入不同的测试数据。

目前的关键瓶颈仍然在于测试用例本身与全流程闭环的工具链提供。从宏观层面看，端到端测试已然是一片红海，但是至今未有真正彻底满意的通用工具出现；不同的行业、领域、产品，还是对测试有不同的定制化需求。

# 端到端测试目标

单元/组件测试、集成测试、端到端测试(E2ETest)共同构成了测试的三级金字塔，其中端到端测试是收益比较低，且最为复杂的一层。端到端测试更多的是一种范式，本节即按照端到端测试的目标将其细分为不同的模块，进行阐述。

## 渲染测试

所谓的渲染测试，即是保证界面能够准确加载资源、完成基础的界面渲染、在多执行机/多节点部署场景下比较不同执行机的渲染结果。

渲染测试往往用于保证产品的基本可用性，同样也常常用于回归测试中保证多节点部署的一致性。渲染测试往往不关注与界面的具体逻辑或者细节，而是整体页面的差异性。典型的工具包括 [Blink-Diff](https://github.com/yahoo/blink-diff), [PhantomCSS](https://github.com/HuddleEng/PhantomCSS), [Gemini](https://github.com/gemini-testing/gemini) 等：

![](https://camo.githubusercontent.com/bd2fd498218cfbb9f7d417b05ef35e92272bde2f/68747470733a2f2f7261772e6769746875622e636f6d2f487564646c652f5068616e746f6d4353532f6d61737465722f726561646d655f6173736574732f696e74726f2d6578616d706c652e706e67)

## 功能/逻辑测试

功能/逻辑测试是端到端测试中最重要、应用最广泛的部分，也是最为困难的部分；在下文的[挑战](#挑战)一节中我们将会进行详细分析。

## 性能测试

端到端测试是性能测试的重要手段之一，最为著名的性能测试工具当属 [LightHouse](https://developers.google.com/web/tools/lighthouse/):

![](https://developers.google.com/web/tools/lighthouse/images/cdt-report.png)

## 跨浏览器/兼容性测试

早期的 IE 等浏览器兼容性、移动互联网时代的碎片化终端设备的兼容性，都是比较棘手的问题，像 [BrowserStack](https://www.browserstack.com/)、[Airtap](https://github.com/airtap/airtap) 这样的工具，都是致力于解决跨浏览器兼容性测试的问题。

## 混沌测试/Monkey Test

顾名思义，混沌测试即是通过混乱无序的操作来检测 Web 应用的鲁棒性，典型的工具譬如 [gremlins.js](https://github.com/marmelab/gremlins.js):

![](https://camo.githubusercontent.com/130e101ee69d4d9b6f065df0a0404c861eb5ce18/687474703a2f2f7374617469632e6d61726d656c61622e636f6d2f746f646f2e676966)

## AI 测试

目前有部分自动化测试工具，宣称能够用人工智能/机器学习算法，来解决下文提及的[挑战](#挑战)。

# 挑战

工具的内建复杂度叠加业务复杂度，反而会使得整体的编写与维护成本呈指数级增长。目前业界主流的套路，还是抽象出基本的公共方法，譬如数据生成模块、服务调用模块、页面基本交互单元、页面的逻辑操作组（譬如注册、登录这样的多点操作组合）等，然后编写脚本去描述用例。

因为端到端测试的粒度较大（依赖于页面整体），其最大的挑战就是用例的可维护性，可能某个布局、属性名的变化，都会导致大量的用例失效。

## 元素定位

在描述某个测试用例的执行逻辑时，我们往往是针对某个 DOM 元素进行操作：譬如点击某个按钮、输入/获取某个文本等，都需要关联到某个具体的元素。在录制时，我们可以通过 MutationObserver 等获取到这个元素的实例，获取到它的 ID、样式类、XPath 等可能的定位索引方式。

但是在现代 Web 开发中，ID 并不常用/并无法保证全局唯一性的时候，当开发人员调整了页面布局、样式之后；可能相对于最终用户而言并未有功能性的改变，但可能导致脚本无法索引到关键元素，从而导致用例异常。

因此，元素定位/锚点选择，是首要的挑战；如果我们选择了合适的锚点，或者定位方式，那么就能保证用例的准确性，即不会因为无关因子的改变而失效。

## 测试结果描述与判断

测试用例的目标就是判断实际结果与预期值是否一致，如何去描述结果，如何去判断结果是否是一致的，也是非常困难的事情。

譬如在渲染测试中，如果我们进行像素级对比，那么势必可能会造成大量的误报；用户感知的界面一致性与像素级一致性还是有较大差异。

如果我们从 DOM 结构的角度进行对比，那么也有可能导致大量的误判；譬如开发者更改了 DOM 结构，可能其最后的渲染结果还是一致的。

而在功能测试中，譬如某个用例是：用户输入关键字，然后可以得到结果，继而可以执行某个操作；我们会难以标注用户的可测量点，用户可能关注某个元素的可见性、可能关注数据条目是否准确、可能会关注某个数据属性是否准确。数据属性是否准确又可能分为范围匹配、精准匹配、模糊匹配等等。

## 测试环境准备与数据隔离

无论在调试，还是测试中，用例的难点之一就是环境复现/准备；这一点与上一条：测试结果描述与判断是相辅相成的。在逻辑测试中，如果我们想精准反复测试某个逻辑，那么就需要保证该逻辑的无副作用/或者外部副作用的可重放；表现在前端往往就是指数据隔离。就像单元测试中常用的 Stub/Mock 一样，[Netflix/Polly.JS](https://github.com/Netflix/pollyjs) 是一个不错的借鉴，其能够记录、重放、替换网络请求，完成适度的数据隔离。

测试数据的生成，同样是极具挑战性的一件事；[Faker.js](https://github.com/marak/Faker.js/) 能够帮助我们根据不同的数据类型/格式，生成大量的随机数据，但是往往边界数据仍然需要根据不同的业务逻辑进行手工构造。

# 端到端测试工具

## 人工测试

自动化测试目前已经成为共识，是 DevOps 与持续集成 CI 的重要基石；但是多年的实践与案例分析表明，自动化测试并不能完全替代手工测试，其投入产出比在很多场景下仍然低于人工测试。人工测试最大的优势在于灵活性与可判断性，能够从最终用户的角度出发，面向不同的业务逻辑迅速判断用例结果是否符合预期。人工测试的缺陷在于不可重复性，无法用于快速回归测试。

## 自动化测试

### 自动化测试-控制脚本

譬如 [SeleniumHQ/WebDriverJs](https://github.com/SeleniumHQ/selenium/wiki/WebDriverJs) 这样的工具，允许开发者将测试用例以代码的方式固化，并进行重复运行：

```js
const { Builder, By, until } = require("selenium-webdriver");
new Builder()
  .forBrowser("firefox")
  .build()
  .then(driver => {
    return driver
      .get("http://www.google.com/ncr")
      .then(_ => driver.findElement(By.name("q")).sendKeys("webdriver"))
      .then(_ => driver.findElement(By.name("btnK")).click())
      .then(_ => driver.wait(until.titleIs("webdriver - Google Search"), 1000))
      .then(_ => driver.quit());
  });
```

### 自动化测试-Acceptance Test

在编写测试用例的时候，我们希望能够让更多地非技术人员/领域专家参与进来，由此催生了所谓的 Acceptance Test 的理念，即使用非技术性的语言来描述系统的组件或者操作逻辑。Acceptance Test 是所谓 Behaviour-Driven Development(BDD) 的重要保障，[Ruby/Cucumber](https://cucumber.io/) 是最为经典的 BDD 框架，其允许我们使用日常的语言来描述场景，然后将其转化为可执行的脚本：

```yaml
Feature: Is it Friday yet?
  Everybody wants to know when it's Friday

  Scenario: Sunday isn't Friday
    Given today is Sunday
    When I ask whether it's Friday yet
    Then I should be told "Nope"
```

[CodeceptJS](https://github.com/codeception/codeceptjs/) 是基于 Node.js 的 Acceptance Test 工具，其同样提供了 DSL 语法：

```js
Feature("CodeceptJS demo");

Scenario("check Welcome page on site", I => {
  I.amOnPage("/");
  I.see("Welcome");
});
```

### 自动化测试-脚本分析

[Selenium IDE](https://www.seleniumhq.org/projects/ide/) 或者 [其 Chrome 插件](https://chrome.google.com/webstore/detail/selenium-ide/mooikfkahbdckldjjndioackbalphokd?hl=en) 都允许以如下形式自动记录用户的行为操作，并且将其转化为可执行的步骤：

![](https://www.seleniumhq.org/projects/ide/selenium-ide.png)

其优势在于能够尽可能地让非技术人员参与进来，缺陷在于灵活性、可控性非常差。

## Selenium/Nightwatch/Nightmare

Selenium 作为老牌的端到端测试框架，本身是 Web 浏览器自动化控制工具。Selenium/Nightwatch/Nightmare 是同一批次的老牌端到端自动化测试的产品，本身提供了通用的浏览器控制 API 以及 Assert 相关的 API。它们都未过多地介入到测试用例编写，无法做到所见即所得，调试与 CI 集成相对都比较麻烦。

```js
module.exports = {
  tags: ["git"],
  "Demo test GitHub": function(client) {
    client
      .url("http://github.com/nightwatchjs/nightwatch")
      .waitForElementVisible("body", 1000)
      .waitForElementVisible(".container h1 strong a")
      .assert.containsText(
        ".container h1 strong a",
        "nightwatch",
        "Checking project title is set to nightwatch"
      );
  },

  after(client) {
    client.end();
  }
};
```

如上文介绍，Selenium/Nightwatch/Nightmare 都提供了录制与脚本自动生成工具，但是非常不好用。

## Cypress/TestCafe

[ThoughtWorks 2018 技术雷达](https://www.thoughtworks.com/radar/tools/cypress)中推荐过 Cypress，其优势在于提供了完善的、全流程闭环、交互友好地测试用例编写与执行环境。

![Cypress 工作台](https://user-images.githubusercontent.com/5803001/41452233-6e4beecc-70a3-11e8-8d2b-fa64e43290a5.png)

参考 [Cypress](https://github.com/cypress-io/cypress) 源代码可以发现，其使用 Electron 封装了自定义的专用测试浏览器。TestCafe 则是借鉴了 Selenium 的方式，提供了友好的 DSL 接口，允许在不同的浏览器中运行。TestCafe 的实现有点类似于 Nightwatch，但是其优化了用例的执行流程，更方便地进行用例调试。

Cypress 与 TestCafe 都没有主打自动录制与用例生成。

## Tesabot/Testim/Applitools

[Tesabot](https://www.tesabot.com/)/[TestIM](https://www.testim.io/)/[Applitools](https://applitools.com/) 都自称为 AI 驱动的，零脚本，全记录形式的**半**自动化测试工具；它们都采取了 Chrome Extension 的形式。

![Tesabot 工作台](https://user-images.githubusercontent.com/5803001/41453031-d3e56382-70a6-11e8-862e-21df88db7a2d.png)

Testim.io 的工作台如下：

![](https://user-images.githubusercontent.com/5803001/41453324-e7c63a38-70a7-11e8-9bd6-d2f697258dad.png)

点击运行测试用例时候，Testim 会打开新的 Chrome Tab，并进行完全控制。
