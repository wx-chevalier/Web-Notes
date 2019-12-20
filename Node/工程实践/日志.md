# Node.js 中日志处理

# winston

```js
const logger = createLogger({
  level: 'debug',
  format: format.combine(
    // Use this function to create a label for additional text to display
    format.label({ label: path.basename(module.parent.filename) }),
    format.colorize(),
    format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
    format.printf(
      // We display the label text between square brackets using ${info.label} on the next line
      info => `${info.timestamp} ${info.level} [${info.label}]: ${info.message}`
    )
  ),
  transports: [new transports.Console()]
});
```
