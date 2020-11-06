# Cordova

- [iOS Plugin Development Guide](https://cordova.apache.org/docs/en/latest/guide/platforms/ios/plugin.html)

在 iOS 的 WebView 开发中，经常会把 Cordova 作为增强版的 WebView 使用。关于本部分的实例可以参考笔者的[iOSBoilerplate](https://github.com/wx-chevalier/iOS-Boilerplate/tree/master/UI-Components/Widgets/WebView/Cordova)，可以在 REAME.md 中查看使用说明，也可以`git clone`之后直接运行，按照指导进入相关页面。

## Installation

引入 Cordova 主要包含三个步骤(怎么感觉有点像把大象塞到冰箱)：(1)在 Podfile 中加入依赖项可以使用`pod search Cordova`命令来搜索可用的 Cordova 版本，笔者是使用的 4.0.1 版本：

```
pod 'Cordova', '~> 4.0.1' # 支持Cordova WebView容器
```

添加完毕然后使用`pod install`命令下载即可。(2)添加 config.xml config.xml 即是主要的配置文件，在 iOS 中其需要放置到`/AppName/config.xml`这种样式。笔者的 config.xml 文件的示范为：

```
<?xml version='1.0' encoding='utf-8'?>
<widget id="io.cordova.hellocordova" version="0.0.1" xmlns="http://www.w3.org/ns/widgets" xmlns:cdv="http://cordova.apache.org/ns/1.0">
    <name>iOSBoilerplate</name>
    <description>
        Cordova Demo in iOS Boilerplate
    </description>
    <author email="dev@cordova.apache.org" href="http://cordova.io">
        Chevalier
    </author>
    <content src="index.html" />
    <preference name="BackupWebStorage" value="local"/>
    <plugin name="cordova-plugin-whitelist" version="1" />
    <access origin="*" />
    <access origin="*.baidu.*" />
    <allow-intent href="http://*/*" />
    <allow-intent href="https://*/*" />
    <allow-intent href="tel:*" />
    <allow-intent href="sms:*" />
    <allow-intent href="mailto:*" />
    <allow-intent href="geo:*" />
    <platform name="android">
        <allow-intent href="market:*" />
    </platform>
    <platform name="ios">
        <allow-intent href="itms:*" />
        <allow-intent href="itms-apps:*" />
    </platform>

    <!--Cordova插件声明-->
    <feature name="CordovaPluginsBridge">
        <param name="ios-package" value="CordovaPluginsBridge" />
        <param name="onload" value="false" />
    </feature>
</widget>
```

(3)添加 www 文件夹一般来说会把静态资源文件放置到 www 目录下，这边有一个小点需要注意下(不知道是不是笔者搞错了)，就是将 www 文件夹引入到 XCode 中的时候，注意不要选择 Copy 而是 File Reference，即最终的文件夹应该是如下图所示的蓝色而不是黄色。![](http://7xkt0f.com1.z0.glb.clouddn.com/861EEF1C-ADAE-40D3-AB56-EBD0AB4A13DB.png)

### Network Configuration

> - [cordova-5-ios-9-security-policy-changes](http://moduscreate.com/cordova-5-ios-9-security-policy-changes/)

有时候在 iOS 中进行配置的时候会发现部分网络请求被 Ban，可以根据以下几个步骤进行排查。(1)判断 config.xml 中是否设置了网络请求的白名单，老实说现在 cordova-plugin-whitelist 这个插件都没有了 iOS 端，不确定这个是不是需要的。

```
<!-- Allow images, xhrs, etc. to google.com --> <access origin="http://google.com" /> <access origin="https://google.com" /> <!-- Access to the subdomain maps.google.com --> <access origin="http://maps.google.com" /> <!-- Access to all the subdomains on google.com --> <access origin="http://*.google.com" /> <!-- Enable requests to content: URLs --> <access origin="content:///*" /> <!-- Don't block any requests --> <access origin="*" />
```

(2)在 iOS 9 之后默认是不允许非 HTTPs 的请求发出，所以要修改下配置允许发起 HTTP 请求。![](http://i.stack.imgur.com/nGw3j.png)

```
<key>NSAppTransportSecurity</key> <dict>    <key>NSAllowsArbitraryLoads</key>    <true/> </dict>
```

(3)检查下 Content Security Policy Content Security Policy 一般用于对于网页内容的控制，不过这东西如果禁止了你访问网络，那么在浏览器内也是看得出来的。

```
<!-- Good default declaration:    * gap: is required only on iOS (when using UIWebView) and is needed for JS->native communication    * https://ssl.gstatic.com is required only on Android and is needed for TalkBack to function properly    * Disables use of eval() and inline scripts in order to mitigate risk of XSS vulnerabilities. To change this:        * Enable inline JS: add 'unsafe-inline' to default-src        * Enable eval(): add 'unsafe-eval' to default-src --> <meta http-equiv="Content-Security-Policy" content="default-src 'self' data: gap: https://ssl.gstatic.com; style-src 'self' 'unsafe-inline'; media-src *"> <!-- Allow everything but only from the same origin and foo.com --> <meta http-equiv="Content-Security-Policy" content="default-src 'self' foo.com"> <!-- This policy allows everything (eg CSS, AJAX, object, frame, media, etc) except that    * CSS only from the same origin and inline styles,    * scripts only from the same origin and inline styles, and eval() --> <meta http-equiv="Content-Security-Policy" content="default-src *; style-src 'self' 'unsafe-inline'; script-src 'self' 'unsafe-inline' 'unsafe-eval'"> <!-- Allows XHRs only over HTTPS on the same domain. --> <meta http-equiv="Content-Security-Policy" content="default-src 'self' https:"> <!-- Allow iframe to https://cordova.apache.org/ --> <meta http-equiv="Content-Security-Policy" content="default-src 'self'; frame-src 'self' https://cordova.apache.org">
```

## Plugins

### Config

任何一个插件首先需要在 config.xml 中进行注册：

```
   <feature name="CordovaPluginsBridge">        <param name="ios-package" value="Echo" />        <param name="onload" value="true" />    </feature>
```

有沒有指定插件的初始值設定項。相反，應使用插件 pluginInitialize 為其啟動邏輯方法。插件需要長時間運行的請求，如媒體重播、聽眾，保持內部狀態應執行的背景活動 onReset 方法來清理這些活動。在方法運行時 UIWebView 定位到新的一頁或刷新，重新載入 JavaScript。

### JS Modules

关于 JS 部分的详细配置可以参考官方的 JS Modules 部分，这里不做赘述，仅展示下基本的用法：

```js
window.echo = function (str, callback) {
  cordova.exec(
    callback,
    function (err) {
      callback("Nothing to echo.");
    },
    "CordovaPluginsBridge",
    "echo",
    [str]
  );
};
```

调用：

```js
window.echo("echome", function (echoValue) {
  alert(echoValue == "echome"); // should alert true.
});
```

要注意，一般对于 Cordova 的调用要放到 jQuery 的`$(document).ready()`中。

### iOS 本地方法

JavaScript 調用觸發插件請求到本機的一邊，和相應的 iOS 目標 C 插件映射正確地在 config.xml 檔中，但最後 iOS 目標 C 插件類看起來像什麼？ 無論派往與 JavaScript 的插件 exec 函數傳遞到相應的插件類的 action 方法。插件的方法有此簽名：

```
   - (void)myMethod:(CDVInvokedUrlCommand*)command    {        CDVPluginResult* pluginResult = nil;        NSString* myarg = [command.arguments objectAtIndex:0];        if (myarg != nil) {            pluginResult = [CDVPluginResult resultWithStatus:CDVCommandStatus_OK];        } else {            pluginResult = [CDVPluginResult resultWithStatus:CDVCommandStatus_ERROR messageAsString:@"Arg was null"];        }        [self.commandDelegate sendPluginResult:pluginResult callbackId:command.callbackId];    }
```

#### iOS CDVPluginResult 訊息類型

您可以使用 `CDVPluginResult` 來返回結果的多種類型回 JavaScript 回呼函數，使用類的方法，它們遵循這種模式：

```
    + (CDVPluginResult*)resultWithStatus:(CDVCommandStatus)statusOrdinal messageAs...
```

您可以創建 `String`，`Int`，`Double`，`Bool`，`Array`，`Dictionary`，`ArrayBuffer`，和 `Multipart` 類型。你可以也離開了任何參數來發送狀態，或返回錯誤，或甚至選擇不發送任何外掛程式的結果，在這種情況下既不回撥火。

請注意以下複雜的傳回值為：

- `messageAsArrayBuffer`預計 `NSData*` 並將轉換為 `ArrayBuffer` 在 JavaScript 回檔。同樣，任何 `ArrayBuffer` JavaScript 發送到一個外掛程式都將轉換為`NSData*`.
- `messageAsMultipart`預計，`NSArray*` 包含任何其他支援類型，並將發送整個陣列作為 `arguments` 給您的 JavaScript 回檔。這種方式，所有參數在序列化或反序列化作為必要的所以它是能夠安全返回 `NSData*` 作為多部分，但不是 `Array` /`Dictionary`.
  #### 异步执行
  如果对于部分执行时间较长的代码，可以放在后台进程中执行。

```
    - (void)myPluginMethod:(CDVInvokedUrlCommand*)command
    {
        // Check command.arguments here.
        [self.commandDelegate runInBackground:^{
            NSString* payload = nil;
            // Some blocking logic...
            CDVPluginResult* pluginResult = [CDVPluginResult resultWithStatus:CDVCommandStatus_OK messageAsString:payload];
            // The sendPluginResult method is thread-safe.
            [self.commandDelegate sendPluginResult:pluginResult callbackId:command.callbackId];
        }];
    }
```
