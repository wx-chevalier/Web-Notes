import Vue from "vue";
import { StorageService } from "./localstorage";
import Vuex from "vuex";
import { MutationTree, ActionTree, GetterTree } from "vuex";
Vue.use(Vuex);

interface Oauth {
  data: object;
  provider: string;
}
export interface storeData {
  count: number;
  isAuth: boolean;
  lang: string;
  mandantid: number;
  location: string;
  token: string;  //your domain security token
  servurl: string; //backend url.. 
  dateformat: string;
  oauth: Oauth; //extern authenticated result which you want to store
}
//you may need to store backend url somewhere
var host =
  window.document.location.port == "8080"
    ? "http://localhost:5000"
    : window.location.origin;
//will be in local storage
const varsval: storeData = {
  count: 0,
  isAuth: false,
  token: "",
  lang: "de",
  mandantid: 0,
  location: "AT",
  servurl: host,
  dateformat: "DD.MM.YYYY",
  oauth: null
};
const storage = new StorageService();
//save store in localstorage initialy if doesnt exist yet
storage.setItemInit(storage.C_ENV_KEY, varsval);
const storeData: storeData = JSON.parse(storage.getItem(storage.C_ENV_KEY));

//interface for more variables in state
export interface State {
  vars: storeData;
}

// you can have multiple slots in state, some types you have outside existing store
const state: State = {
  vars: storeData //this variable is picked up from  localstorage, you may not want every variable there
};

const mutations: MutationTree<State> = {
  setvars: (state, s: storeData) => (state.vars = s),
  increment: state => state.vars.count++,
  decrement: state => {
    state.vars.count--; //in case of longer method
  }
};
//put actions here when needed
const actions: ActionTree<State, any> = {};
//if your store gets big ofcourse you can separate it into several files - modules
const store = new Vuex.Store<State>({
  state,
  mutations,
  actions
});

store.subscribe((mutate, state) => {
  storage.setItem(storage.C_ENV_KEY, state.vars);//save changes to local storage
  if (mutate.type == "setvars") {
    console.log("subscribed muttate");
  }
});

//END COMpound store
export default store;
