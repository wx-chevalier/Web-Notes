[![返回目录](https://i.postimg.cc/50XLzC7C/image.png)](https://github.com/wx-chevalier/Web-Series)
![](https://cdn-images-1.medium.com/max/1600/1*phV0oLsKV_qVjFVv5lY1vw.png)

- [Create the perfect website layout system](http://www.tuicool.com/articles/meiAziQ)

# LayoutManagement

## [golden-layout](https://github.com/deepstreamIO/golden-layout):The ultimate Javascript layout manager

![](https://cloud.githubusercontent.com/assets/512416/4584449/e6c154a0-4ffa-11e4-81a8-a7e5f8689dc5.PNG)
The usual import declaration does not work out of the box if we use NPM + React + Webpack because React is not a peer dependency of Golden Layout.

```
import GoldenLayout  from 'golden-layout'
```

Instead, we need to first shim the module by adding React and ReactDOM as global variable. One way to do it is to use imports loader.

```
const GoldenLayout = require('imports?React=react&ReactDOM=react-dom!golden-layout')
```
