# ref 与 reactive

第一种写法：除了对象都用 ref 来定义

```js
let switchKG = ref(false);
console.log(switchKG.value);

let arr = ref([]);
arr.value = [1, 2, 3, 4, 5];
console.log(arr.value);

let Obj = reactive({
  arr: [],
});
reactive.arr = [1, 2, 3, 4, 5];
```

第二种写法：都用 reactive 来定义，然后用 toRefs 进行导出到页面使用

```vue
<template>
  <div>{{ arr }}</div>
  <div>{{ obj }}</div>
  <div>{{ swithKW }}</div>
</template>
<script setup>
import { reactive, toRefs } from "vue";

let state = reactive({
  swithKW: false,
  arr: [],
  obj: {},
});
console.log(state.arr);
console.log(state.obj);
//导出到页面使用
const { swithKW, arr, obj } = toRefs(state);
</script>
```
