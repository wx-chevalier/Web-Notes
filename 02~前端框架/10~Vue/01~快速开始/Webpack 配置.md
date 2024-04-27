# Webpack 配置

# vue-loader

vue-loader 是针对 Vue 中单文件组件（Single-File Component, SFCs）的 Webpack Loader：

```html
<template>
  <div class="example">{{ msg }}</div>
</template>

<script>
  export default {
    data() {
      return {
        msg: "Hello world!"
      };
    }
  };
</script>

<style>
  .example {
    color: red;
  }
</style>
```

## CSS
