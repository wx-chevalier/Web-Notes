# Mock

在测试中，mock 可以让你更方便的去测试依赖于数据库、网络请求、文件等外部系统的函数。Jest 内置了 mock 机制，提供了多种 mock 方式已应对各种需求。

# Mock 函数

函数的 mock 非常简单，调用 jest.fn() 即可获得一个 mock 函数。Mock 函数有一个特殊的 .mock 属性，保存着函数的调用信息。.mock 属性还会追踪每次调用时的 this。

```js
// mocks/forEach.js
export default (items, callback) => {
  for (let index = 0; index < items.length; index++) {
    callback(items[index]);
  }
};

// test.js
import forEach from "./forEach";

it("test forEach function", () => {
  const mockCallback = jest.fn(x => 42 + x);
  forEach([0, 1], mockCallback);

  // The mock function is called twice
  expect(mockCallback.mock.calls.length).toBe(2);

  // The first argument of the first call to the function was 0
  expect(mockCallback.mock.calls[0][0]).toBe(0);

  // The first argument of the second call to the function was 1
  expect(mockCallback.mock.calls[1][0]).toBe(1);

  // The return value of the first call to the function was 42
  expect(mockCallback.mock.results[0].value).toBe(42);
});
```

除了 .mock 之外，Jest 还未我们提供了一些匹配器用来断言函数的执行，它们本身只是检查 .mock 属性的语法糖：

```js
// The mock function was called at least once
expect(mockFunc).toBeCalled();
```

使用 mockReturnValue 和 mockReturnValueOnce 可以 mock 函数的返回值。当我们需要为 mock 函数增加一些逻辑时，可以使用 jest.fn()、mockImplementation 或者 mockImplementationOnce mock 函数的实现。还可以使用 mockName 还给 mock 函数命名，如果没有命名，输出的日志默认就会打印 jest.fn()。

# Mock 定时器

Jest 可以 Mock 定时器以使我们在测试代码中控制“时间”。调用 jest.useFakeTimers() 函数可以伪造定时器函数，定时器中的回调函数不会被执行，使用 setTimeout.mock 等可以断言定时器执行情况。当在测试中有多个定时器时，执行 jest.useFakeTimers() 可以重置内部的计数器。

- 执行 jest.runAllTimers(); 可以“快进”直到所有的定时器被执行；

- 执行 jest.runOnlyPendingTimers() 可以使当前正在等待的定时器被执行，用来处理定时器中设置定时器的场景，如果使用 runAllTimers 会导致死循环；

- 执行 jest.advanceTimersByTime(msToRun:number)，可以“快进”执行的毫秒数。

## 监控 setTimeout 的调用次数

```js
// timerGame.js
"use strict";

function timerGame(callback) {
  console.log("Ready....go!");
  setTimeout(() => {
    console.log("Time's up -- stop!");
    callback && callback();
  }, 1000);
}

module.exports = timerGame;

// __tests__/timerGame-test.js
("use strict");

jest.useFakeTimers();

test("waits 1 second before ending the game", () => {
  const timerGame = require("../timerGame");
  timerGame();

  expect(setTimeout).toHaveBeenCalledTimes(1);
  expect(setTimeout).toHaveBeenLastCalledWith(expect.any(Function), 1000);
});
```

## 运行所有的计时器

```js
test("calls the callback after 1 second", () => {
  const timerGame = require("../timerGame");
  const callback = jest.fn();

  timerGame(callback);

  // At this point in time, the callback should not have been called yet
  expect(callback).not.toBeCalled();

  // Fast-forward until all timers have been executed
  jest.runAllTimers();

  // Now our callback should have been called!
  expect(callback).toBeCalled();
  expect(callback).toHaveBeenCalledTimes(1);
});
```

## 递归计时器

在某些情况下，您可能具有递归计时器，这是一个在自己的回调中设置新计时器的计时器。对于这些，运行所有计时器将是一个无休止的循环……因此，不需要诸如 jest.runAllTimers() 之类的东西。对于这些情况，您可以使用 jest.runOnlyPendingTimers()：

```js
// infiniteTimerGame.js
"use strict";

function infiniteTimerGame(callback) {
  console.log("Ready....go!");

  setTimeout(() => {
    console.log("Time's up! 10 seconds before the next game starts...");
    callback && callback();

    // Schedule the next game in 10 seconds
    setTimeout(() => {
      infiniteTimerGame(callback);
    }, 10000);
  }, 1000);
}

module.exports = infiniteTimerGame;
// __tests__/infiniteTimerGame-test.js
("use strict");

jest.useFakeTimers();

describe("infiniteTimerGame", () => {
  test("schedules a 10-second timer after 1 second", () => {
    const infiniteTimerGame = require("../infiniteTimerGame");
    const callback = jest.fn();

    infiniteTimerGame(callback);

    // At this point in time, there should have been a single call to
    // setTimeout to schedule the end of the game in 1 second.
    expect(setTimeout).toHaveBeenCalledTimes(1);
    expect(setTimeout).toHaveBeenLastCalledWith(expect.any(Function), 1000);

    // Fast forward and exhaust only currently pending timers
    // (but not any new timers that get created during that process)
    jest.runOnlyPendingTimers();

    // At this point, our 1-second timer should have fired it's callback
    expect(callback).toBeCalled();

    // And it should have created a new timer to start the game over in
    // 10 seconds
    expect(setTimeout).toHaveBeenCalledTimes(2);
    expect(setTimeout).toHaveBeenLastCalledWith(expect.any(Function), 10000);
  });
});
```

# Mock 模块

模块的 mock 主要有两种方式：

- 使用 jest.mock(moduleName, factory, options) 自动 mock 模块，jest 会自动帮我们 mock 指定模块中的函数。其中，factory 和 options 参数是可选的。factory 是一个模块工厂函数，可以代替 Jest 的自动 mock 功能；options 用来创建一个不存在的需要模块。

- 如果希望自己 mock 模块内部函数，可以在模块平级的目录下创建 **mocks** 目录，然后创建相应模块的 mock 文件。对于用户模块和 Node 核心模块（如：fs、path），我们仍需要在测试文件中显示的调用 jest.mock()，而其他的 Node 模块则不需要。

此外，在 mock 模块时，jest.mock() 会被自动提升到模块导入前调用。对于类的 mock 基本和模块 mock 相同，支持自动 mock、手动 mock 以及调用带模块工厂参数的 jest.mock()，还可以调用 jest.mockImplementation() mock 构造函数。

# ES6 类 Mock

```js
// sound-player.js
export default class SoundPlayer {
  constructor() {
    this.foo = "bar";
  }

  playSoundFile(fileName) {
    console.log("Playing sound file " + fileName);
  }
}

// sound-player-consumer.js
import SoundPlayer from "./sound-player";

export default class SoundPlayerConsumer {
  constructor() {
    this.soundPlayer = new SoundPlayer();
  }

  playSomethingCool() {
    const coolSoundFileName = "song.mp3";
    this.soundPlayer.playSoundFile(coolSoundFileName);
  }
}
```

## Automatic mock

```js
import SoundPlayer from "./sound-player";
import SoundPlayerConsumer from "./sound-player-consumer";

jest.mock("./sound-player"); // SoundPlayer is now a mock constructor

beforeEach(() => {
  // Clear all instances and calls to constructor and all methods:
  SoundPlayer.mockClear();
});

it("We can check if the consumer called the class constructor", () => {
  const soundPlayerConsumer = new SoundPlayerConsumer();
  expect(SoundPlayer).toHaveBeenCalledTimes(1);
});

it("We can check if the consumer called a method on the class instance", () => {
  // Show that mockClear() is working:
  expect(SoundPlayer).not.toHaveBeenCalled();

  const soundPlayerConsumer = new SoundPlayerConsumer();
  // Constructor should have been called again:
  expect(SoundPlayer).toHaveBeenCalledTimes(1);

  const coolSoundFileName = "song.mp3";
  soundPlayerConsumer.playSomethingCool();

  // mock.instances is available with automatic mocks:
  const mockSoundPlayerInstance = SoundPlayer.mock.instances[0];
  const mockPlaySoundFile = mockSoundPlayerInstance.playSoundFile;
  expect(mockPlaySoundFile.mock.calls[0][0]).toEqual(coolSoundFileName);
  // Equivalent to above check:
  expect(mockPlaySoundFile).toHaveBeenCalledWith(coolSoundFileName);
  expect(mockPlaySoundFile).toHaveBeenCalledTimes(1);
});
```
