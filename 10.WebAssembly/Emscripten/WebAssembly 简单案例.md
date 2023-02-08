# 简单游戏引擎重构

上文我们讨论了利用 WebAssembly 重构简单的计数器模块，这里我们以简单的游戏为例，交互式的感受 WebAssembly 带来的性能提升，可以直接查看[游戏的在线演示](http://wx-chevalier.github.io/crb/#/wasm)。这里的游戏引擎即是执行部分计算与重新赋值操作，譬如这里的计算下一个位置状态的函数在 C 中实现为：

```c
EMSCRIPTEN_KEEPALIVE
void computeNextState()
{
    loopCurrentState();

    int neighbors = 0;
    int i_m1, i_p1, i_;
    int j_m1, j_p1;
    int height_limit = height - 1;
    int width_limit = width - 1;
    for (int i = 1; i < height_limit; i++)
         
        {
            i_m1 = (i - 1) * width;
            i_p1 = (i + 1) * width;
            i_ = i * width;
            for (int j = 1; j < width_limit; j++)
                 
                {
                    j_m1 = j - 1;
                    j_p1 = j + 1;
                    neighbors = current[i_m1 + j_m1];
                    neighbors += current[i_m1 + j];
                    neighbors += current[i_m1 + j_p1];
                    neighbors += current[i_ + j_m1];
                    neighbors += current[i_ + j_p1];
                    neighbors += current[i_p1 + j_m1];
                    neighbors += current[i_p1 + j];
                    neighbors += current[i_p1 + j_p1];
                    if (neighbors == 3)
                         
                        {
                            next[i_ + j] = 1;
                             
                        }
                    else if (neighbors == 2)
                         
                        {
                            next[i_ + j] = current[i_ + j];
                             
                        }
                    else
                         
                        {
                            next[i_ + j] = 0;
                             
                        }
                     
                }
             
        }
    memcpy(current, next, width * height);
}
```

而对应的 JS 版本引擎的实现为：

```js
computeNextState() {
  let neighbors, iM1, iP1, i_, jM1, jP1;

  this.loopCurrentState();

  for (let i = 1; i < this._height - 1; i++) {
    iM1 = (i - 1) * this._width;
    iP1 = (i + 1) * this._width;
    i_ = i * this._width;
    for (let j = 1; j < this._width - 1; j++) {
      jM1 = j - 1;
      jP1 = j + 1;
      neighbors = this._current[iM1 + jM1];
      neighbors += this._current[iM1 + j];
      neighbors += this._current[iM1 + jP1];
      neighbors += this._current[i_ + jM1];
      neighbors += this._current[i_ + jP1];
      neighbors += this._current[iP1 + jM1];
      neighbors += this._current[iP1 + j];
      neighbors += this._current[iP1 + jP1];
      if (neighbors === 3) {
        this._next[i_ + j] = 1;
      } else if (neighbors === 2) {
        this._next[i_ + j] = this._current[i_ + j];
      } else {
        this._next[i_ + j] = 0;
      }
    }
  }
  this._current.set(this._next);
}
```

本部分的编译依旧是直接将 engine.c 编译为 engine.wasm，不过在导入的时候我们需要动态地向 wasm 中注入外部函数：

```js
this.module = new EngineWASM({
  env: {
    memoryBase: 0,
    tableBase: 0,
    memory: new window.WebAssembly.Memory({ initial: 1024 }),
    table: new window.WebAssembly.Table({ initial: 0, element: "anyfunc" }),
    _malloc: (size) => {
      let buffer = new ArrayBuffer(size);
      return new Uint8Array(buffer);
    },
    _memcpy: (source, target, size) => {
      let sourceEnd = source.byteLength;

      let i, j;

      for (
        i = 0, j = 0, k = new Uint8Array(target), l = new Uint8Array(source);
        i < sourceEnd;
        ++i, ++j
      )
        k[j] = l[i];
    },
  },
});
```

到这里文本告一段落，笔者最后需要声明的是因为这只是随手做的实验，最后的代码包括对于内存的操作可能存在潜在问题，请读者批评指正。
