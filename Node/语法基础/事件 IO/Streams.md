[![](https://i.postimg.cc/WzXsh0MX/image.png)](https://github.com/wx-chevalier/Backend-Series)

# Node.js Streams

Stream 是 Node.js 中的基础概念，类似于 EventEmitter，专注于 IO 管道中事件驱动的数据处理方式；类比于数组或者映射，Stream 也是数据的集合，只不过其代表了不一定正在内存中的数据。。Node.js 的 Stream 分为以下类型：

- Readable Stream: 可读流，数据的产生者，譬如 process.stdin
- Writable Stream: 可写流，数据的消费者，譬如 process.stdout 或者 process.stderr
- Duplex Stream: 双向流，即可读也可写
- Transform Stream: 转化流，数据的转化者

Stream 本身提供了一套接口规范，很多 Node.js 中的内建模块都遵循了该规范，譬如著名的 `fs` 模块，即是使用 Stream 接口来进行文件读写；同样的，每个 HTTP 请求是可读流，而 HTTP 响应则是可写流。

![](https://cdn-images-1.medium.com/max/1160/1*4Xv-enWqwdy_AlMYYl4JVg.png)

# Readable Stream

```js
const stream = require('stream');
const fs = require('fs');

const readableStream = fs.createReadStream(process.argv[2], {
  encoding: 'utf8'
});

// 手动设置流数据编码
// readableStream.setEncoding('utf8');

let wordCount = 0;

readableStream.on('data', function(data) {
  wordCount += data.split(/\s{1,}/).length;
});

readableStream.on('end', function() {
  // Don't count the end of the file.
  console.log('%d %s', --wordCount, process.argv[2]);
});
```

当我们创建某个可读流时，其还并未开始进行数据流动；添加了 data 的事件监听器，它才会变成流动态的。在这之后，它就会读取一小块数据，然后传到我们的回调函数里面。`data` 事件的触发频次同样是由实现者决定，譬如在进行文件读取时，可能每行都会触发一次；而在 HTTP 请求处理时，可能数 KB 的数据才会触发一次。可以参考 [nodejs/readable-stream/\_stream_readable](https://github.com/nodejs/readable-stream/blob/master/lib/_stream_readable.js) 中的相关实现，发现 on 函数会触发 resume 方法，该方法又会调用 flow 函数进行流读取：

```js
// function on
if (ev === 'data') {
  // Start flowing on next tick if stream isn't explicitly paused
  if (this._readableState.flowing !== false) this.resume();
}
...
// function flow
while (state.flowing && stream.read() !== null) {}
```

我们还可以监听 `readable` 事件，然后手动地进行数据读取：

```js
let data = '';
let chunk;
readableStream.on('readable', function() {
  while ((chunk = readableStream.read()) != null) {
    data += chunk;
  }
});
readableStream.on('end', function() {
  console.log(data);
});
```

Readable Stream 还包括如下常用的方法：

- Readable.pause(): 这个方法会暂停流的流动。换句话说就是它不会再触发 data 事件。
- Readable.resume(): 这个方法和上面的相反，会让暂停流恢复流动。
- Readable.unpipe(): 这个方法会把目的地移除。如果有参数传入，它会让可读流停止流向某个特定的目的地，否则，它会移除所有目的地。

在日常开发中，我们可以用 [stream-wormhole](https://github.com/node-modules/stream-wormhole) 来模拟消耗可读流：

```js
sendToWormhole(readStream, true);
```

# Writable Stream

```js
readableStream.on('data', function(chunk) {
  writableStream.write(chunk);
});

writableStream.end();
```

当 `end()` 被调用时，所有数据会被写入，然后流会触发一个 `finish` 事件。注意在调用 `end()` 之后，你就不能再往可写流中写入数据了。

```js
const { Writable } = require('stream');

const outStream = new Writable({
  write(chunk, encoding, callback) {
    console.log(chunk.toString());
    callback();
  }
});

process.stdin.pipe(outStream);
```

Writable Stream 中同样包含一些与 Readable Stream 相关的重要事件：

- error: 在写入或链接发生错误时触发
- pipe: 当可读流链接到可写流时，这个事件会触发
- unpipe: 在可读流调用 unpipe 时会触发

# Pipe | 管道

```js
const fs = require('fs');

const inputFile = fs.createReadStream('REALLY_BIG_FILE.x');
const outputFile = fs.createWriteStream('REALLY_BIG_FILE_DEST.x');

// 当建立管道时，才发生了流的流动
inputFile.pipe(outputFile);
```

多个管道顺序调用，即是构建了链接(Chaining):

```js
const fs = require('fs');
const zlib = require('zlib');
fs.createReadStream('input.txt.gz')
  .pipe(zlib.createGunzip())
  .pipe(fs.createWriteStream('output.txt'));
```

管道也常用于 Web 服务器中的文件处理，以 Egg.js 中的应用为例，我们可以从 Context 中获取到文件流并将其传入到可写文件流中：

> 📎 完整代码参考 [Backend Boilerplate/egg](https://parg.co/A24)

```js
const awaitWriteStream = require('await-stream-ready').write;
const sendToWormhole = require('stream-wormhole');
...
const stream = await ctx.getFileStream();

const filename =
  md5(stream.filename) + path.extname(stream.filename).toLocaleLowerCase();
//文件生成绝对路径

const target = path.join(this.config.baseDir, 'app/public/uploads', filename);

//生成一个文件写入文件流
const writeStream = fs.createWriteStream(target);
try {
  //异步把文件流写入
  await awaitWriteStream(stream.pipe(writeStream));
} catch (err) {
  //如果出现错误，关闭管道
  await sendToWormhole(stream);
  throw err;
}
...
```

参照[分布式系统导论](https://parg.co/Uxo)，可知在典型的流处理场景中，我们不可以避免地要处理所谓的背压(Backpressure)问题。无论是 Writable Stream 还是 Readable Stream，实际上都是将数据存储在内部的 Buffer 中，可以通过 `writable.writableBuffer` 或者 `readable.readableBuffer` 来读取。当要处理的数据存储超过了 `highWaterMark` 或者当前写入流处于繁忙状态时，write 函数都会返回 `false`。`pipe` 函数即会自动地帮我们启用背压机制：

![image](https://user-images.githubusercontent.com/5803001/45255876-99c94f80-b3c0-11e8-93f2-3ae0474426fa.png)

当 Node.js 的流机制监测到 write 函数返回了 `false`，背压系统会自动介入；其会暂停当前 Readable Stream 的数据传递操作，直到消费者准备完毕。

```
+===============+
|   Your_Data   |
+=======+=======+
        |
+-------v-----------+          +-------------------+         +=================+
|  Readable Stream  |          |  Writable Stream  +--------->  .write(chunk)  |
+-------+-----------+          +---------^---------+         +=======+=========+
        |                                |                           |
        |     +======================+   |        +------------------v---------+
        +----->  .pipe(destination)  >---+        |    Is this chunk too big?  |
              +==^=======^========^==+            |    Is the queue busy?      |
                 ^       ^        ^               +----------+-------------+---+
                 |       |        |                          |             |
                 |       |        |  > if (!chunk)           |             |
                 ^       |        |      emit .end();        |             |
                 ^       ^        |  > else                  |             |
                 |       ^        |      emit .write();  +---v---+     +---v---+
                 |       |        ^----^-----------------<  No   |     |  Yes  |
                 ^       |                               +-------+     +---v---+
                 ^       |                                                 |
                 |       ^   emit .pause();        +=================+     |
                 |       ^---^---------------------+  return false;  <-----+---+
                 |                                 +=================+         |
                 |                                                             |
                 ^   when queue is empty   +============+                      |
                 ^---^-----------------^---<  Buffering |                      |
                     |                     |============|                      |
                     +> emit .drain();     |  <Buffer>  |                      |
                     +> emit .resume();    +------------+                      |
                                           |  <Buffer>  |                      |
                                           +------------+  add chunk to queue  |
                                           |            <--^-------------------<
                                           +============+
```

# Duplex Stream

Duplex Stream 可以看做读写流的聚合体，其包含了相互独立、拥有独立内部缓存的两个读写流，读取与写入操作也可以异步进行：

```
                             Duplex Stream
                          ------------------|
                    Read  <-----               External Source
            You           ------------------|
                    Write ----->               External Sink
                          ------------------|
```

我们可以使用 Duplex 模拟简单的套接字操作：

```js
const { Duplex } = require('stream');

class Duplexer extends Duplex {
  constructor(props) {
    super(props);
    this.data = [];
  }

  _read(size) {
    const chunk = this.data.shift();
    if (chunk == 'stop') {
      this.push(null);
    } else {
      if (chunk) {
        this.push(chunk);
      }
    }
  }

  _write(chunk, encoding, cb) {
    this.data.push(chunk);
    cb();
  }
}

const d = new Duplexer({ allowHalfOpen: true });
d.on('data', function(chunk) {
  console.log('read: ', chunk.toString());
});
d.on('readable', function() {
  console.log('readable');
});
d.on('end', function() {
  console.log('Message Complete');
});
d.write('....');
```

在开发中我们也经常需要直接将某个可读流输出到可写流中，此时也可以在其中引入 PassThrough，以方便进行额外地监听：

```js
const { PassThrough } = require('stream');
const fs = require('fs');

const duplexStream = new PassThrough();

// can be piped from reaable stream
fs.createReadStream('tmp.md').pipe(duplexStream);

// can pipe to writable stream
duplexStream.pipe(process.stdout);

// 监听数据，这里直接输出的是 Buffer<Buffer 60 60  ... >
duplexStream.on('data', console.log);
```

# Transform Stream

Transform Stream 则是实现了 `_transform` 方法的 Duplex Stream，其在兼具读写功能的同时，还可以对流进行转换:

```
                                 Transform Stream
                           --------------|--------------
            You     Write  ---->                   ---->  Read  You
                           --------------|--------------
```

这里我们实现简单的 Base64 编码器:

```js
const util = require('util');
const Transform = require('stream').Transform;

function Base64Encoder(options) {
  Transform.call(this, options);
}

util.inherits(Base64Encoder, Transform);

Base64Encoder.prototype._transform = function(data, encoding, callback) {
  callback(null, data.toString('base64'));
};

process.stdin.pipe(new Base64Encoder()).pipe(process.stdout);
```
