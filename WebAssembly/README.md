# WebAssembly

WebAssembly 无疑是近年来让人最为兴奋的新技术之一，它虽始于浏览器但已经开始不断地被各个语言及平台所集成。在实际的工业化落地中，区块链、边缘计算、游戏及图像视频等多个领域都依靠 WebAssembly 创造了让人称赞的产品。WebAssembly 技术本身具有非常多优点，其中最为被人所熟知的三点有：

- 二进制格式
- Low-Level 的编译目标
- 接近 Native 的执行效率

WebAssembly（wasm）就是一个可移植、体积小、加载快并且兼容 Web 的全新格式。实际上，WebAssembly 是一种新的字节码格式，旨在成为高级语言的编译目标，目前可以使用 C、C++、Rust、Go、Java、C# 等编译器（未来还有更多）来创建 wasm 模块（见下图）。该模块以二进制的格式发送到浏览器，并在专有虚拟机上执行，与 JavaScript 虚拟机共享内存和线程等资源。

![C 代码到 WASM](https://s3.ax1x.com/2020/11/21/D3eVsI.png)

wasm 模块总是与 JavaScript “胶水”代码一起使用，在必要的时候可以执行一些有用的操作。WebAssembly 可以看做是对 JavaScript 的加强，弥补 JavaScript 在执行效率上的缺陷。

# Links
