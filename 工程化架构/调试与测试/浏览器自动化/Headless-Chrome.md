# Headless Chrome 实战：动态渲染、页面抓取与端到端测试

笔者往往是使用 PhantomJS 或者 Selenium 执行动态页面渲染，而在 Chrome 59 之后 Chrome 提供了 Headless 模式，其允许在命令行中使用 Chromium 以及 Blink 渲染引擎提供的完整的现代 Web 平台特性。需要注意的是，Headless Chrome 仍然存在一定的局限，相较于 Nightmare 或 Phantom 这样的工具，Chrome 的远程接口仍然无法提供较好的开发者体验。我们在下文介绍的代码示例中也会发现，目前我们仍需要大量的模板代码进行控制。

# 环境配置

在 Chrome 安装完毕后我们可以利用其包体内自带的命令行工具启动：

```
$ chrome --headless --remote-debugging-port=9222 https://chromium.org
```

笔者为了部署方便，使用[ Docker 镜像](https://hub.docker.com/r/justinribeiro/chrome-headless/)来进行快速部署，如果你本地存在 Docker 环境，可以使用如下命令快速启动：

```
docker run -d -p 9222:9222 justinribeiro/chrome-headless
```

如果是在 Mac 下本地使用的话我们还可以创建命令别名：

```
alias chrome="/Applications/Google\ Chrome.app/Contents/MacOS/Google\ Chrome"
alias chrome-canary="/Applications/Google\ Chrome\ Canary.app/Contents/MacOS/Google\ Chrome\ Canary"
alias chromium="/Applications/Chromium.app/Contents/MacOS/Chromium"
```

如果是在 Ubuntu 环境下我们可以使用 deb 进行安装：

```
# Install Google Chrome
# https://askubuntu.com/questions/79280/how-to-install-chrome-browser-properly-via-command-line
sudo apt-get install libxss1 libappindicator1 libindicator7
wget https://dl.google.com/linux/direct/google-chrome-stable_current_amd64.deb
sudo dpkg -i google-chrome*.deb# Might show "errors", fixed by next line
sudo apt-get install -f
```

chrome 命令行也支持丰富的命令行参数，`--dump-dom` 参数可以将 `document.body.innerHTML` 打印到标准输出中：

```
chrome --headless --disable-gpu --dump-dom https://www.chromestatus.com/
```

而 `--print-to-pdf` 标识则会将网页输出位 PDF：

```
chrome --headless --disable-gpu --print-to-pdf https://www.chromestatus.com/
```

初次之外，我们也可以使用 `--screenshot` 参数来获取页面截图：

```
chrome --headless --disable-gpu --screenshot https://www.chromestatus.com/


# Size of a standard letterhead.
chrome --headless --disable-gpu --screenshot --window-size=1280,1696 https://www.chromestatus.com/


# Nexus 5x
chrome --headless --disable-gpu --screenshot --window-size=412,732 https://www.chromestatus.com/
```

如果我们需要更复杂的截图策略，譬如进行完整页面截图则需要利用代码进行远程控制。
