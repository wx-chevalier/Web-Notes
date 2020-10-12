import { Component, Inject, Model, Prop, Watch } from "vue-property-decorator";
export { Component, Inject, Model, Prop, Watch } from "vue-property-decorator";
//import Vue from 'vue'
import store, { storeData, State } from "./System/store";
declare var require: any;
import VueRouter from "vue-router";
import {Store} from "vuex";
//import axio, { AxiosRequestConfig, AxiosPromise } from "axios";
//import moment from moment

import * as b from "vue-property-decorator";
b.Vue.use(VueRouter);

//extending default vue instance with some more stuff
export class Vue extends b.Vue {
  $v: any;
 //you either do this, ts will know what type of store there is, or you make extra computed property
 // $store = store;
  get vars(): storeData {
    return this.$storets.state.vars;
  }
  //creating extra property with typed store
  get $storets()
  {
    return this.$store as Store<State>;
  }

  public log(val: String) {
    console.log(val);
  }
  public logErr(val: String) {
    console.log(val);
  }
}
//}
//extending vue instance with interface
// declare module 'vue/types/vue' {
//   // 3. Declare augmentation for Vue
//   interface Vue {
//     $prope: string
//   }
// }
//var v = new Vue();
//EXAMPLE OF DATETIME formatting - FILTER
// b.Vue.filter('dtformat', function (val) {

//   if(val!=null && val!='')
//     return  moment(val).format(v.vars.dateformat);
// return '';
// })

// declare module "vue/types/options" {
//   interface ComponentOptions<V extends b.Vue> {
//     validations?: {}; //; validations () {};
//   }
// }
