import { Component, Vue } from "vue-property-decorator"
import { RouterOptions, Location, RouteConfig, Route } from 'vue-router'
import  VueRouter from 'vue-router'
//import './vendor' //bootstrap
//require('./main.scss'); //global css

/*
  For components that will be used in html (such as navbar),
  all you need to do is import the file somewhere in your code,
  they are automatically registered when the file is loaded.
  However, if you import the class (ex: import { Navbar } from './navbar'),
  you will have to call new Navbar() somewhere as well. You would want
  to do that if you are defining a components{} object in the @Component
  options parameter. 
*/
declare var require: any
//var separatets = require( '../Views/separatets.vue').default
import separatets from  '../Views/separatets.vue'
import about from '../Views/about.vue'
import home from '../Views/home.vue'
var test = home 


const router = new VueRouter({
  mode: 'history', base:'', //subdomain
  routes: [

    { path: '/',component: home },  
    //test guys
    { path: '/ts', component: separatets },
    { path: '/about', component: about },
    { path: '/test/:tstparam', component: test },
    { path: '/test', component: test },
 
    //test guys

    {
      path: '/auth/callback',
      component: {
        template: '<div class="auth-component"></div>'
      }
    },

   // { path: '/module/:compname' },
    { path: '*', redirect: '/' },

  ]
});
export default router
