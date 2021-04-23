declare var require: any;
//require('es6-promise').polyfill();
import 'es6-promise/auto';
import { Component, Vue } from "./ext1";
import { RouterOptions, Location, RouteConfig, Route } from "vue-router";
import VueRouter from "vue-router";
declare var require: any;
import router from "./System/router";
import store, {State,storeData} from "./System/store";
import App from "./app.vue";
import Vuex, { Store } from "vuex";
//Vue.use(Vuex);

Vue.use(VueRouter);
Vue.config.devtools = true; //enable debug for build

let appl = new Vue({
  el: "#app",
  router: router,
  store:  store  ,
  components: { App: App },  
  render: h => h("App"),
  //validations:{},
  methods: {
    //  validations(){}
  }
});

//rt.push('/about');//will navigate to specific route
export default { appl, router }; //app
