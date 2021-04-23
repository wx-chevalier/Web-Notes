<template>
  <div>
    <!-- end main-->
    <div ref="second">
      <master :someprop="123" />
    </div>
  </div>
</template>
<script lang="ts">
//CSS It's recommended to combine it with the css-loader: require("style!css!./file.css").
//import 'bootstrap'

import master from './Views/master.vue';

import './../node_modules/markdown-it-editor/lib/css/iconfont.b300b13.woff';

import { Component, Inject, Model, Prop, Vue, Watch } from 'vue-property-decorator';

@Component({ components: { master } }) //,separatets, about , Bootstrap
export default class App extends Vue {
  name = 'App';
  viewactive = 'main'; //second

  mounted() {
    //here you show the alert
  }
}
</script>
<style lang="less" >
@import url('./../node_modules/bootstrap/dist/css/bootstrap.min.css');
@import url('./../node_modules/font-awesome/css/font-awesome.min.css');
@import url('./../node_modules/vue-multiselect/dist/vue-multiselect.min.css');
/* @import  url("./../node_modules/highlightjs/styles/github.css");*/

@import url('./../node_modules/markdown-it-editor/lib/index.css');
@import url('./../node_modules/markdown-it-editor/lib/preview.css');

/*@import url("./../node_modules/bootstrap-vue/dist/bootstrap-vue.css");*/
pre code {
  color: white !important;
  overflow: auto;
}
/* Improve readability of pre-formatted text in all browsers */
/* pre { white-space: pre;  overflow: auto;   word-wrap: nowrap; }  */
</style>